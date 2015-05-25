---
layout: docs
title: Android SDK使用指南
---

# Android SDK使用指南

## 目录

- [概述](#overview)
- [使用场景](#use-scenario)
- [下载链接](#download-link)
- [安装](#integration)
- [功能说明](#functions)
    - [安全性](#security)
    - [配置](#config)
    - [上传文件](#upload)
    - [代码参考](#reference)
    - [下载文件](#download)
    - [线程安全性](#thread-safety)

<a name="overview"></a>
## 概述

Android SDK只包含了最终用户使用场景中的必要功能。相比服务端SDK而言，客户端SDK不会包含对云存储服务的管理和配置功能。

该SDK支持不低于2.2的Android版本（api8）。

历史版本 参考: [android-sdk-6](http://developer.qiniu.com/docs/v6/sdk/android-sdk-6.html)

<a name="use-scenario"></a>
## 使用场景

在使用Android SDK开发基于七牛云存储的应用之前，请理解正确的开发模型。客户端属于不可控的场景，恶意用户在拿到客户端后可能会对其进行反向工程，因此客户端程序中不可包含任何可能导致安全漏洞的业务逻辑和关键信息。

我们推荐的安全模型如下所示：

![安全模型](http://developer.qiniu.com/docs/v6/api/overview/img/token.png)

开发者需要合理划分客户端程序和业务服务器的职责范围。分发给最终用户的客户端程序中不应有需要使用管理凭证及SecretKey的场景。这些可能导致安全风险的使用场景均应被设计为在业务服务器上进行。

更多的相关内容请查看[编程模型](http://developer.qiniu.com/docs/v6/api/overview/programming-model.html)和[安全机制](http://developer.qiniu.com/docs/v6/api/overview/security.html)。

<a name="download-link"></a>
## 下载链接

- 下载地址：<https://github.com/qiniu/android-sdk/releases>
- 源码地址：<https://github.com/qiniu/android-sdk>
- jar地址：<http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.qiniu%22%20AND%20a%3A%22qiniu-android-sdk%22>
- 单元测试地址：<https://github.com/qiniu/android-sdk/tree/master/library/src/androidTest/java/com/qiniu/android>
- Android SDK 在线文档：<http://developer.qiniu.com/android_docs/index.html>

<a name="integration"></a>
## 安装

* 通过maven安装

```
<dependency>
    <groupId>com.qiniu</groupId>
    <artifactId>qiniu-android-sdk</artifactId>
    <version>(7.0.1，7.1]</version>
</dependency>
```

* 下载[qiniu-android-sdk-VERSION.jar/aar](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.qiniu%22%20AND%20a%3A%22qiniu-android-sdk%22)包，导入到项目中去；下载[http://loopj.com/android-async-http](http://loopj.com/android-async-http/) 1.4.6及以上版本导入到项目中。


<a name="functions"></a>
## 功能说明

<a name="security"></a>
### 安全机制

该SDK未包含凭证生成相关的功能。开发者对安全性的控制应遵循[安全机制](http://developer.qiniu.com/docs/v6/api/overview/security.html)中建议的做法，即客户端应向业务服务器每隔一段时间请求上传凭证，而不是直接在客户端使用AccessKey/SecretKey生成对应的凭证。在客户端使用SecretKey会导致严重的安全隐患。

开发者可以在生成上传凭证前通过配置上传策略以控制上传的后续动作，比如在上传完成后通过回调机制通知业务服务器。该工作在业务服务器端进行，因此非本SDK的功能范畴。

完整的内容请参考[上传策略规格](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html)，[上传凭证规格](http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html)，[下载凭证规格](http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html)。关于上传后可以进行哪些后续动作，请查看[上传后续动作](http://developer.qiniu.com/docs/v6/api/overview/up/response/)。


<a name="config"></a>
### 初始化配置

一般下直接使用默认设置，不用单独配置。
可以配置超时时长、分片上传阀值等。

```
Configuration config = new Configuration.Builder()
                    .chunkSize(256 * 1024)  //分片上传时，每片的大小。 默认 256K
                    .putThreshhold(512 * 1024)  // 启用分片上传阀值。默认 512K
                    .connectTimeout(10) // 链接超时。默认 10秒
                    .responseTimeout(60) // 服务器响应超时。默认 60秒
                    .recorder(recorder)  // recorder 分片上传时，已上传片记录器。默认 null
                    .recorder(recorder, keyGen)  // keyGen 分片上传时，生成标识符，用于片记录器区分是那个文件的上传记录
                    .build();
// 重用 uploadManager。一般地，只需要创建一个 uploadManager 对象
UploadManager uploadManager = new UploadManager(config);

```

<a name="upload"></a>
### 上传文件

SDK内置两种上传方式：表单上传和分片上传，并根据情况内部做了自动切换。表单上传使用一个HTTP POST请求完成文件的上传，因此比较适合较小的文件和较好的网络环境。相比而言，分片上传更能适应不稳定的网络环境，也比较适合上传比较大的文件（数百MB或更大）。

若需深入了解上传方式之间的区别，请查看[上传类型](http://developer.qiniu.com/docs/v6/api/overview/up/upload-models.html#upload-types)，[表单上传接口说明](http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html)，[分片上传接口说明（断点续上传）](http://developer.qiniu.com/docs/v6/api/overview/up/chunked-upload.html)。


UploadManager.put参数说明：

参数 | 类型 | 说明
:---: | :----: | :---
`data` | `byte[]/String/File` | 数据，可以是byte数组，文件路径，文件。
`key` | `String` | 保存在服务器上的资源唯一标识。请参见[关键概念：键值对](http://developer.qiniu.com/docs/v6/api/overview/concepts.html#key-value)。
`token` | `String` | 服务器分配的token。
`completionHandler` | `UpCompletionHandler` | 上传回调函数，必填。
`options` | `UploadOptions`  | 如果需要进度通知、crc校验、中途取消、指定mimeType则需要填写相应字段，详见[UploadOptions参数说明](#upload_options)

<a name="upload_options"></a>
UploadOptions参数说明：

参数 | 类型 | 说明
:---: | :----: | :---
`params` | `String` |自定义变量，key必须以 x: 开始。
`mimeType`| `String` | 指定文件的mimeType。
`checkCrc` | `boolean` |是否验证上传文件。
`progressHandler` | `UpProgressHandler` |上传进度回调。
`cancellationSignal` | `UpCancellationSignal` |取消上传，当isCancelled()返回true时，不再执行更多上传。

<a id="reference"></a>
### 代码参考
本SDK代码都有对应的单元测试检查，如果需要实现某个功能，参考单元测试可以很快获得答案，下面提供几个简单的代码段。

#### 简单上传
```
// 重用 uploadManager。一般地，只需要创建一个 uploadManager 对象
UploadManager uploadManager = new UploadManager();
data = <File对象、或 文件路径、或 字节数组>
String key = <指定七牛服务上的文件名，或 null>;
String token = <从服务端SDK获取>;
uploadManager.put(data, key, token,
new UpCompletionHandler() {
    @Override
    public void complete(String key, ResponseInfo info, JSONObject response) {
        Log.i("qiniu", info);
    }
}, null);
```

回调参数说明：

参数 | 说明
:---: | :---
key | 即uploadManager.put(file, key, ...)方法指定的key。
info | http请求的状态信息等，可记入日志。isOK()返回 true表示上传成功。
response | 七牛反馈的信息。可从中解析保存在七牛服务的key等信息，具体字段取决于上传策略的设置。

注：可能抛出异常：文件不存在，没有权限访问等。


#### 记录上传进度
```
uploadManager.put(data, key, token,handler,
 	new UploadOptions(null, null, false,
   		new UpProgressHandler(){
     		public void progress(String key, double percent){
       			Log.i("qiniu", key + ": " + percent);
     		}
   		}, null));
```

注：progress(key, percent)中的key 即uploadManager.put(file, key, ...)方法指定的key



#### 取消上传

```
...
private volatile boolean isCancelled;
...
// 某方法中执行取消：isCancelled = true;
...
uploadManager.put(data, key, token,handler,
	new UploadOptions(null, null, false, progressHandler,
		new UpCancellationSignal(){
     		public boolean isCancelled(){
       			return isCancelled;
     		}
   		}));

```

#### 记录断点

分片上传中，可将各个已上传的块记录下来，再次上传时，已上传的部分不用再次上传。
断点记录类需实现 com.qiniu.android.storage.Recorder 接口。已提供保存到文件的 FileRecorder 实现。

```
String dirPath = <断点记录文件保存的文件夹位置>
Recorder recorder = new FileRecorder(dirPath);


//默认使用 key 的url_safe_base64编码字符串作为断点记录文件的文件名。
//避免记录文件冲突（特别是key指定为null时），也可自定义文件名(下方为默认实现)：
KeyGenerator keyGen = new KeyGenerator(){
	public String gen(String key, File file){
    	// 不必使用url_safe_base64转换，uploadManager内部会处理
    	// 该返回值可替换为基于key、文件内容、上下文的其它信息生成的文件名
        return key + "_._" + new StringBuffer(file.getAbsolutePath()).reverse();
  	}
};

// 重用 uploadManager。一般地，只需要创建一个 uploadManager 对象
//UploadManager uploadManager = new UploadManager(recorder);  // 1
//UploadManager uploadManager = new UploadManager(recorder, keyGen); // 2
// 或 在初始化时指定：
Configuration config = new Configuration.Builder()
                    // recorder 分片上传时，已上传片记录器
                    // keyGen 分片上传时，生成标识符，用于片记录器区分是那个文件的上传记录
                    .recorder(recorder, keyGen)  
                    .build();

UploadManager uploadManager = new UploadManager(config);

uploadManager.put(data, key, ...)
```

<a name="download"></a>
### 下载文件

该SDK并未提供下载文件相关的功能接口，因为文件下载是一个标准的HTTP GET过程。开发者只需理解资源URI的组成格式即可非常方便的构建资源URI，并在必要的时候加上下载凭证，即可使用HTTP GET请求获取相应资源。

具体做法请参见[资源下载](http://developer.qiniu.com/docs/v6/api/overview/dn/download.html)和[资源下载的安全机制](http://developer.qiniu.com/docs/v6/api/overview/dn/security.html)。

从安全性和代码可维护性的角度考虑，我们建议下载URL的拼装过程也在业务服务器进行，让客户端从业务服务器请求。

<a name="thread-safety"></a>
### 线程安全性

Android 一般的情况下会使用一个主线程来控制UI，非主线程无法控制UI，在Android4.0+之后不能在主线程完成网络请求，
该SDK是根据以上的使用场景设计，所有网络的操作均使用独立的线程异步运行，`UpCompletionHandler#complete`、`UpProgressHandler#progress`是在主线程调用的，在回调函数内可以直接操作UI控件。

## 贡献代码

- Fork
- 创建您的特性分支 (git checkout -b my-new-feature)
- 提交您的改动 (git commit -am ‘Added some feature’)
- 将您的修改记录提交到远程 git 仓库 (git push origin my-new-feature)
- 然后到 github 网站的该 git 远程仓库的 my-new-feature 分支下发起 Pull Request


## 代码许可

The MIT License (MIT).详情见 [License文件](https://github.com/qiniu/android-sdk/blob/master/LICENSE).
