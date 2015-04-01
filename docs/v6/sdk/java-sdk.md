---
layout: docs
title: Java SDK 使用指南
---

# Java SDK 使用指南

此SDK适用于Java 6及以上版本。基于 [七牛云存储官方API](../index.html) 构建。使用此 SDK 构建您的网络应用程序，能让您以非常便捷地方式将数据安全地存储到七牛云存储上。无论您的网络应用是一个网站程序，还是包括从云端（服务端程序）到终端（手持设备应用）的架构的服务或应用，通过七牛云存储及其 SDK，都能让您应用程序的终端用户高速上传和下载，同时也让您的服务端更加轻盈。

SDK下载地址：[github](https://github.com/qiniu/java-sdk)

历史文档： [qiniu-java-sdk-6](http://developer.qiniu.com/docs/v6/sdk/java-sdk-6.html)

目录
----
- [环境准备](#env_preparation)
- [初始化](#setup)
- [上传下载接口](#get-and-put-api)
  - [上传流程](#io-put-flow)
  - [通过上传策略生成上传凭证](#make-uptoken)
  - [上传代码](#upload-code)
  - [断点续上传](#resumable-io-put)
  - [上传策略](#io-put-policy)
  - [公有资源下载](#public-download)
  - [私有资源下载](#private-download)
- [资源管理接口](#rs-api)
  - [空间名列表](#rs-buckets)
  - [列举资源](#rsf-listPrefix)
  - [查看单个文件属性](#rs-stat)
  - [复制单个文件](#rs-copy)
  - [重命名、移动单个文件](#rs-move)
  - [删除单个文件](#rs-delete)
  - [批量操作](#rs-batch)
  - [抓取资源](#rs-fetch)
  - [更新镜像资源](#rs-prefetch)
- [数据处理接口](#pfop-api)
- [贡献代码](#contribution)
- [许可证](#license)

----

<a id="env_preparation"></a>

## 环境准备

####  JDK1.7 及 以上

MAVEN

```
<dependency>
    <groupId>com.qiniu</groupId>
    <artifactId>qiniu-java-sdk</artifactId>
    <version>[7.0.0, 7.0.99]</version>
</dependency>
```

GRADLE

```
compile 'com.qiniu:qiniu-java-sdk:7.0.+'
```

#### JDK 1.6

sdk中依赖 okhttp ，要求 JDK 1.7 及以上。建议升级JDK。若确实需要 JDK 1.6 版本，可在依赖中排除 com.squareup.okhttp:okhttp ,下载 okhttp-jdk1.6 、okio-jdk1.6 加入到classpath中。

#### 相关包：
[qiniu-java-sdk-7](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.qiniu%22%20AND%20a%3A%22qiniu-java-sdk%22)、[Google Gson](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.google.code.gson%22%20AND%20a%3A%22gson%22) 、[okhttp](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.squareup.okhttp%22%20AND%20a%3A%22okhttp%22) 、[okio](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.squareup.okio%22%20AND%20a%3A%22okio%22)、[okhttp-jdk1.6](https://raw.githubusercontent.com/qiniu/java-sdk/master/libs/okhttp-2.3.0-SNAPSHOT.jar) 、[okio-jdk1.6](https://raw.githubusercontent.com/qiniu/java-sdk/master/libs/okio-1.3.0-SNAPSHOT.jar)

<a id="setup"></a>
## 初始化

要接入七牛云存储，您需要拥有一对有效的 Access Key 和 Secret Key 用来进行签名认证。可以通过如下步骤获得：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
1. 登录七牛开发者自助平台，查看 [Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

在获取到 Access Key 和 Secret Key 之后，您可以按照如下方式进行密钥配置：

```
Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
```

<a id="get-and-put-api"></a>

## 上传下载接口

为了尽可能地改善终端用户的上传体验，七牛云存储首创了客户端直传功能。

一般云存储的上传流程是：

    客户端（终端用户） => 业务服务器 => 云存储服务

这样通过用户自己的业务服务器中转上传至云存储服务端。这种方式存在一些不足：

2. 多了一次中转的上传过程，同数据存放在用户的业务服务器中相比，会相对慢一些；
2. 增加了用户业务服务器的负载，消耗了带宽，占用了磁盘，降低了服务能力；
2. 增加了用户的流量消耗，来自终端用户的上传数据进入业务服务器，然后再次上传至云存储服务，净增一倍流量。

因此，七牛云存储引入了客户端直传的模式，将整个上传过程调整为：

    客户端（终端用户） => 七牛 => 业务服务器

客户端（终端用户）直接上传到七牛的服务器。通过DNS智能解析，七牛会选择到离终端用户最近的ISP服务商节点，速度会相比数据存放在用户自己的业务服务器上的方式更快。而且，七牛云存储可以在用户文件上传成功以后，替用户的客户端向用户的业务服务器发送反馈信息，减少用户的客户端同业务服务器之间的交互。详情请参考[上传策略](../api/reference/security/put-policy.html)

**注意**：如果您只是想要将您电脑上，或者是服务器上的文件上传到七牛云存储，可以直接使用七牛提供的 [qrsync](../tools/qrsync.html) 上传工具，而无需额外开发。

文件上传有两种方式：普通方式，即一次性上传整个文件；断点续上传，即将文件分割成若干小块，分别上传，然后在七牛云存储服务端重新合并成一个文件。一般情况下，用户可以采用普通上传。如果文件较大，或者网络条件不佳，那么可以使用断点续上传，提高上传的速度和成功率。


<a id="io-put-flow"></a>

###  上传流程

在七牛云存储中，整个上传流程大体分为这样几步：

1. 业务服务器颁发 [uptoken（上传授权凭证）](#make-uptoken)给客户端（终端用户）
1. 客户端凭借 [uptoken](#make-uptoken) 上传文件到七牛
1. 在七牛获得完整数据后，根据用户请求的设定执行以下操作：

  a. 如果用户设定了[returnUrl](../api/reference/security/put-policy.html)，七牛云存储将反馈一个指向returnUrl的HTTP 303，驱动客户端执行跳转；

  b. 如果用户设定了[callbackUrl](../api/reference/security/put-policy.html)，七牛云存储将向callbackUrl指定的地址发起一个HTTP 请求回调业务服务器，同时向业务服务器发送数据。发送的数据内容由[callbackBody](../api/reference/security/put-policy.html)指定。业务服务器完成回调的处理后，可以在HTTP Response中放入数据，七牛云存储会响应客户端，并将业务服务器反馈的数据发送给客户端；

  c. 如果两者都没有设置，七牛云存储根据[returnBody](../api/reference/security/put-policy.html)的设定向客户端发送反馈信息。

需要注意的是，回调到业务服务器的过程是可选的，它取决于业务服务器颁发的 [uptoken](#make-uptoken)。如果没有回调，七牛会返回一些标准的信息（比如文件的 hash）给客户端。如果上传发生在业务服务器，以上流程可以自然简化为：

1. 业务服务器生成 uptoken（不设置回调，自己回调到自己这里没有意义）
1. 凭借 [uptoken](#make-uptoken) 上传文件到七牛
1. 善后工作，比如保存相关的一些信息


<a id="make-uptoken"></a>

###  通过上传策略生成上传凭证

uptoken是一个字符串，作为http协议Header的一部分（Authorization字段）发送到我们七牛的服务端，表示这个http请求是经过用户授权的。 
上传策略描述上传行为，通过签名生成上传凭证。详细参考[上传策略][uploadTokenHref]。
sdk中，scope通过 bucket、key间接设置(bucket:key)；deadline 通过 expires 间接设置(系统时间+3600秒)。
简单上传可使用默认策略生成上传凭证(getUpToken0)，覆盖上传参考getUpToken1，其它策略--如设置回调、异步处理等--参考getUpToken2、getUpToken3 。

```
Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);


// 简单上传，使用默认策略
private String getUpToken0(){
    return auth.uploadToken("bucket");
}

// 覆盖上传
private String getUpToken1(){
    return auth.uploadToken("bucket", "key");
}

// 设置指定上传策略
private String getUpToken2(){
    return auth.uploadToken("bucket", null, 3600, new StringMap()
         .put("callbackUrl", "call back url").putNotEmpty("callbackHost", "")
         .put("callbackBody", "key=$(key)&hash=$(etag)"));
}

// 去除非限定的策略字段
private String getUpToken3(){
    return auth.uploadToken("bucket", null, 3600, new StringMap()
            .put("endUser", "uid").putNotEmpty("returnBody", ""), true);
}

/**
* 生成上传token
*
* @param bucket  空间名
* @param key     key，可为 null
* @param expires 有效时长，单位秒。默认3600s
* @param policy  上传策略的其它参数，如 new StringMap().put("endUser", "uid").putNotEmpty("returnBody", "")。
*        scope通过 bucket、key间接设置，deadline 通过 expires 间接设置
* @param strict  是否去除非限定的策略字段，默认true
* @return 生成的上传token
*/
public String uploadToken(String bucket, String key, long expires, StringMap policy, boolean strict)
```

<a id="upload-code"></a>

###  上传

上传程序大体步骤如下：

1. 生成UploadToken；
1. 上传byte[] 或 文件；

简单上传代码如下：

```
private UploadManager uploadManager = new UploadManager();
private Auth auth = Auth.create(getAK(), getSK());

//上传内存中数据
public void upload(byte[] data, String UpToken, String key){
  try {
        Response res = uploadManager.put(data, key, UpToken);
        // log.info(res);
        // log.info(res.bodyString());
        if(res.isOK()){
            //success
        }else {
            //
        }
    } catch (QiniuException e) {
        // Response r = e.response;
        // log.info(r);
        // log.info(r.bodyString());
        // e.printStackTrace();
        //dosomething
    }
}

public void uploadFilePath(){
    String key = null;
    try {
        Response res = uploadManager.put(getFilePath(), key, getUpToken());
        // log.info(res);
        // log.info(res.bodyString());
    } catch (QiniuException e) {
        // Response r = e.response;
        // log.info(r);
        // log.info(r.bodyString());
        // e.printStackTrace();
        //dosomething
    }
}

public void uploadFile(){
    try {
        Response res = uploadManager.put(getFile(), getKey(), getUpToken());
        // log.info(res);
        // log.info(res.bodyString());
    } catch (QiniuException e) {
        // Response r = e.response;
        // log.info(r);
        // log.info(r.bodyString());
        // e.printStackTrace();
        //dosomething
    }
}
```

指定mimetype:

```
String mime = "mytype/test";
Response res = uploadManager.put(getDataOrFile(), key, getUpToken(), null, mime, false);
```

指定自定义变量:

```
String mime = "text/plain";
Response res = uploadManager.put(getDataOrFile(), key, getUpToken(), getParams(), mime, false);

private StringMap getParams(){
    return new StringMap().put("x:foo", "foo");
}
```

使用crc32检查文件完整性:

```
Response res = uploadManager.put(getDataOrFile(), key, getUpToken(), null, null, true);
```

<a id="resumable-io-put"></a>

###  断点上传
UploadManager#put方法会根据 Config.PUT_THRESHOLD 参数判断是否使用分片上传，默认分片上传记录保留在内存中，方法终止记录就消失。
下面会将断点记录序列化后记录下来，可反序列化，再次上传时从上次的记录处开始上传。

```
//TODO 保留断点记录功能正在开发中。。。
```

###  文件下载

七牛云存储上的资源下载分为 公有资源下载 和 私有资源下载 。

私有（private）是 Bucket（空间）的一个属性，一个私有 Bucket 中的资源为私有资源，私有资源不可匿名下载。

新创建的空间（Bucket）缺省为私有，也可以将某个 Bucket 设为公有，公有 Bucket 中的资源为公有资源，公有资源可以匿名下载。

<a id="public-download"></a>

###  公开空间资源下载

如果在给bucket绑定了域名的话，可以通过以下地址访问。

```
[GET] http://<domain>/<key>
```

其中`<domain>`是bucket所对应的域名。七牛云存储为每一个bucket提供一个默认域名。默认域名可以到[七牛云存储开发者平台](https://portal.qiniu.com/)中，空间设置的域名设置一节查询。用户也可以将自有的域名绑定到bucket上，通过自有域名访问七牛云存储。
`<key>`可理解为文件名，但可包含文件分隔符等其它字符。可参考[特殊key资源的访问](http://kb.qiniu.com/52slk76w)


**注意： key必须采用utf8编码，如使用非utf8编码访问七牛云存储将反馈错误**

<a id="private-download"></a>

###  私有资源下载

私有资源必须通过临时下载授权凭证(downloadToken)下载，如下：

```
[GET] http://<domain>/<key>?e=<deadline>token=<downloadToken>
```

注意，尖括号不是必需，代表替换项。  

`deadline` 由服务器时间加上 指定秒数 表示过期时间点。默认 3600 秒，服务器时间需校准，不要于标准时间相差太大。
`downloadToken` 可以使用 SDK 提供的如下方法生成：

```
private Auth auth = Auth.create(getAK(), getSK());

String url = "http://abc.resdet.com/dfe/hg.jpg";
String url2 = "http://abd.resdet.com/dfe/hg.jpg?imageView2/1/w/100";
//默认有效时长：3600秒
String urlSigned = auth.privateDownloadUrl(url2);
//指定时长
String urlSigned2 = auth.privateDownloadUrl(url, 3600 * 24);
```

<a id="rs-api"></a>

##  资源管理接口

文件管理包括对存储在七牛云存储上的文件进行查看、复制、移动和删除处理。  

<a id="rs-buckets"></a>

###  获取空间名列表

```
private Auth dummyAuth = Auth.create(AK, SK);
private BucketManager bucketManager = new BucketManager(auth);
String[] buckets = bucketManager.buckets();
```

### 根据前缀获得空间文件列表

<a id="rsf-listPrefix"></a>

批量获取文件列表

```
/**
* 根据前缀获取文件列表的迭代器
*
* @param bucket    空间名
* @param prefix    文件名前缀
* @param limit     每次迭代的长度限制，最大1000，推荐值 100
* @param delimiter 指定目录分隔符，列出所有公共前缀（模拟列出目录效果）。缺省值为空字符串
* @return FileInfo迭代器
*/

//BucketManager.FileListIterator it = bucketManager.createFileListIterator(bucket, prefix)

BucketManager.FileListIterator it = bucketManager.createFileListIterator(bucket, prefix, 100, null);

while (it.hasNext()) {
    FileInfo[] items = it.next();
    if (items.length > 1) {
        assertNotNull(items[0]);
    }
}
```

<a id="rs-stat"></a>

###  查看单个文件属性信息

```
FileInfo info = bucketManager.stat(bucket, key);
```


<a id="rs-copy"></a>

###  复制单个文件

```
bucketManager.copy(bucket, key, targetBucket, targetKey);
```

<a id="rs-move"></a>

###  重命名、移动单个文件

```
bucketManager.rename(bucket, key, key2);
bucketManager.move(bucket, key, targetBucket, targetKey);
```

<a id="rs-delete"></a>

###  删除单个文件

```
bucketManager.delete(bucket, key);
```


<a id="rs-batch"></a>

###  批量操作

当您需要一次性进行多个操作时, 可以使用批量操作.

```
BucketManager.Batch ops = new BucketManager.Batch()
        .copy(TestConfig.bucket, TestConfig.key, TestConfig.bucket, key)
        .move(TestConfig.bucket, key1, TestConfig.bucket, key2)
        .rename(TestConfig.bucket, key3, key4)
        .stat(TestConfig.bucket, array)
        .stat(TestConfig.bucket, array[0]);
try {
    Response r = bucketManager.batch(ops);
    BatchStatus[] bs = r.jsonToObject(BatchStatus[].class);
    for (BatchStatus b : bs) {
        assertEquals(200, b.code);
    }
} catch (QiniuException e) {
    e.printStackTrace();
    fail();
}
```

<a id="rs-fetch"></a>

###  抓取资源

```
//要求url可公网正常访问
bucketManager.fetch(url, bucket, key);
```

<a id="rs-prefetch"></a>

###  更新镜像资源

```
//将key拼接到镜像源地址，然后拉取资源保存在空间
bucketManager.prefetch(bucket, key);
```

<a id="pfop-api"></a>

##  数据处理接口

大图片(大于 20M)、音视频等处理比较耗时。在上传策略中可指定上传成功后，或在线的文件执行转码等预处理----生成一个异步任务，后台执行。

```
//TODO 触发资源预处理功能正在开发中。。。
```

<a id="contribution"></a>
##  贡献代码

1. Fork
2. 创建您的特性分支 (`git checkout -b my-new-feature`)
3. 提交您的改动 (`git commit -am 'Added some feature'`)
4. 将您的修改记录提交到远程 `git` 仓库 (`git push origin my-new-feature`)
5. 然后到 github 网站的该 `git` 远程仓库的 `my-new-feature` 分支下发起 Pull Request

<a id="license"></a>
##  许可证

Copyright (c) 2014 qiniu.com

基于 MIT 协议发布:

* [www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)

[uploadTokenHref]:    ../api/reference/security/upload-token.html    "上传凭证"
[downloadTokenHref]:  ../api/reference/security/download-token.html  "下载凭证"
[magicVariablesHref]: ../api/overview/up/response/vars.html#magicvar "魔法变量"
[xVariablesHref]:     ../api/overview/up/response/vars.html#xvar     "自定义变量"
