---
layout: docs
title: PHP SDK 使用指南
---

# PHP SDK 使用指南

此 SDK ( version: 7.x.x ) 适用于 PHP 5.3 及其以上版本。基于 [七牛云存储官方API](../index.html) 构建。使用此 SDK 构建您的网络应用程序，能让您以非常便捷地方式将数据安全地存储到七牛云存储上。无论您的网络应用是一个网站程序，还是包括从云端（服务端程序）到终端（手持设备应用）的架构的服务或应用，通过七牛云存储及其 SDK，都能让您应用程序的终端用户高速上传和下载，同时也让您的服务端更加轻盈。

SDK源码地址：<https://github.com/qiniu/php-sdk/tags>

SDK在线文档：<http://developer.qiniu.com/php_docs/index.html>

SDK( version: 6.x.x 适用于PHP 5.1.0 及其以上版本)相关文档：<http://developer.qiniu.com/docs/v6/sdk/legacy-php-sdk.html>



- [应用接入](#install)
	- [PHP-SDK 安装](#sdk-install)
	- [获取Access Key 和 Secret Key](#acc-appkey)
- [资源管理接口](#rs-api)
	- [查看单个文件属性信息](#rs-stat)
	- [复制单个文件](#rs-copy)
	- [移动单个文件](#rs-move)
	- [删除单个文件](#rs-delete)
	- [列举空间中的文件](#rs-list)
- [上传下载接口](#get-and-put-api)
	- [文件上传](#upload)
		- [上传流程](#io-put-flow)
		- [上传策略](#io-put-policy)
	- [文件下载](#io-download)
		- [公有资源下载](#public-download)
		- [私有资源下载](#private-download)
- [数据处理接口](#fop-api)
	- [图像](#fop-image)
		- [查看图像属性](#fop-image-info)
		- [查看图片EXIF信息](#fop-exif)
		- [生成图片预览](#fop-image-view)
	- [持久化数据处理](#pfop-api)
		- [视频切片](#av-hls)
- [贡献代码](#contribution)
- [许可证](#license)



<a name=install></a>
## 应用接入

<a id="sdk-install"></a>

###  PHP-SDK 安装


###### 使用 `Composer` 安装（推荐）

---

此 SDK 使用 Composer 进行依赖管理。我们也推荐使用 Composer 进行该sdk的安装。
Composer是PHP的依赖管理工具，用来管理你项目中的依赖。首先需要先[安装 Composer](http://docs.phpcomposer.com/00-intro.html)， 然后就可以使用了：

1 . 在你项目中的`composer.json`中添加对七牛phpsdk的依赖。

```
{
	"require": {
		"qiniu/php-sdk": "7.*"
	}
}
```

然后在 `composer.json` 所在的文件夹, 运行安装命令 `composer install` 即可将该sdk安装到你的项目中。


2 . 如果你之前的项目没有使用 Composer，也可以在项目中运行以下命令来安装七牛phpsdk：

```
$ composer require qiniu/php-sdk
```


3 . 安装成功后会在当前目录生成如下目录结构：

```
vendor
├── autoload.php
├── composer
│   ├── ClassLoader.php
│   ├── autoload_classmap.php
│   ├── autoload_files.php
│   ├── autoload_namespaces.php
│   ├── autoload_psr4.php
│   ├── autoload_real.php
│   └── installed.json
└── qiniu
    └── php-sdk
```

4 . 引用 Composer 生成的 autoloader

```
require '/path/to/sdk/vendor/autoload.php';
```

PS： 鉴于某些原因, 国内的用户使用 Composer 下载依赖库比较慢， 我们将phpsdk的 Composer 依赖进行了打包。你可以也可以通过以下方式来使用：

* 下载依赖包 [vender.tar.gz](http://devtools.qiniu.io/vendor.tar.gz)
* 解压vendor.tar.gz到您的项目目录下，在需要使用七牛的源文件头部加入 `require '/path/to/sdk/vendor/autoload.php';` 既可引用七牛phpsdk中的包。


###### 下载源码安装（不推荐）

---
* 首先需要下载一个你需要的版本的sdk： [https://github.com/qiniu/php-sdk/releases](https://github.com/qiniu/php-sdk/releases)
* 将你下载的zip文件解压到你项目中，并增加你的autoloader程序。  



<a id="acc-appkey"></a>

###  获取Access Key 和 Secret Key

要接入七牛云存储，您需要拥有一对有效的 Access Key 和 Secret Key 用来进行签名认证。可以通过如下步骤获得：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
2. 登录七牛开发者自助平台，查看 [Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

<a name=rs-api></a>
## 资源管理接口

<a id="rs-stat"></a>
### 查看单个文件属性信息

示例代码如下：

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\BucketManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);
	
	$bucketMgr = new BucketManager($auth);
	$bucket = 'phpsdk';
	$key = 'php-logo.png';

	list($ret, $err) = $bucketMgr->stat($bucket, $key);
	echo "\n====> stat result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		var_dump($ret);
	}

<a id="rs-copy"></a>
### 复制单个文件

示例代码如下：

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\BucketManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	
	$bucketMgr = new BucketManager($auth);
	$bucket = 'phpsdk';
	$key = 'php-logo.png';
	$key2 = 'php-logo2.png';
	
	$err = $bucketMgr->copy($bucket, $key, $bucket, $key2);
	echo "\n====> stat result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		echo "Success!";
	}

<a name=rs-move></a>
### 移动单个文件

示例代码如下：

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\BucketManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	
	$bucketMgr = new BucketManager($auth);
	$bucket = 'phpsdk';
	$key = 'php-logo.png';
	$key3 = 'php-logo3.png';
	
	$err = $bucketMgr->move($bucket, $key, $bucket, $key3);
	echo "\n====> move result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		echo "Success!";
	}

	
<a name=rs-delete></a>
### 删除单个文件

示例代码如下：

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\BucketManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucketMgr = new BucketManager($auth);
	$bucket = 'phpsdk';
	$key = 'php-logo.png';
	
	$err = $bucketMgr->delete($bucket, $key);
	echo "\n====> delete result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		echo "Success!";
	}
	
	
<a name=rs-list></a>
### 列举空间中的文件

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\BucketManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucketMgr = new BucketManager($auth);
	$bucket = 'phpsdk';
	$prefix = 'php';
	
	list($items, $marker, $err) = $bucketMgr->listFiles($bucket, $prefix);
	echo "\n====> List result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		echo "Marker: $marker\n";
		echo 'items====>\n';
		var_dump($items);
	}

<a id="get-and-put-api"></a>
## 上传下载接口
	
<a name=upload></a>
### 文件上传

为了尽可能地改善终端用户的上传体验，七牛云存储首创了客户端直传功能。一般云存储的上传流程是：

    客户端（终端用户） => 业务服务器 => 云存储服务

这样多了一次上传的流程，和本地存储相比，会相对慢一些。但七牛引入了客户端直传，将整个上传过程调整为：

    客户端（终端用户） => 七牛 => 业务服务器

客户端（终端用户）直接上传到七牛的服务器，通过DNS智能解析，七牛会选择到离终端用户最近的ISP服务商节点，速度会比本地存储快很多。文件上传成功以后，七牛的服务器使用回调功能，只需要将非常少的数据（比如Key）传给应用服务器，应用服务器进行保存即可。

<a id="io-put-flow"></a>
#### 上传流程

在七牛云存储中，整个上传流程大体分为这样几步：

1. 业务服务器颁发 [上传凭证][uploadTokenHref]给客户端（终端用户）
2. 客户端凭借 [上传凭证][uploadTokenHref] 上传文件到七牛
3. 在七牛获得完整数据后，发起一个 HTTP 请求回调到业务服务器
4. 业务服务器保存相关信息，并返回一些信息给七牛
5. 七牛原封不动地将这些信息转发给客户端（终端用户）

需要注意的是，回调到业务服务器的过程是可选的，它取决于业务服务器颁发的 [上传凭证][uploadTokenHref]。如果没有回调，七牛会返回一些标准的信息（比如文件的 hash）给客户端。如果上传发生在业务服务器，以上流程可以自然简化为：

1. 业务服务器生成 uptoken（不设置回调，自己回调到自己这里没有意义）
2. 凭借 [上传凭证][uploadTokenHref] 上传文件到七牛
3. 善后工作，比如保存相关的一些信息

服务端生成 [上传凭证][uploadTokenHref] 代码如下：


	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucket = 'phpsdk';
    $token = $auth->uploadToken($bucket);
	
上传文件到七牛（通常是客户端完成，但也可以发生在服务端）：


上传字符串

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\UploadManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucket = 'phpsdk';

	// 设置put policy的其他参数, 上传回调
	//$opts = array(
	//			'callbackUrl' => 'http://www.callback.com/',  
	//			'callbackBody' => 'name=$(fname)&hash=$(etag)'
	//		);
	//$token = $auth->uploadToken($bucket, null, 3600, $opts);

        $token = $auth->uploadToken($bucket);
        $uploadMgr = new UploadManager();
	
	list($ret, $err) = $uploadMgr->put($token, null, 'content string');
	echo "\n====> put result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		var_dump($ret);
	}    

上传本地文件

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Storage\UploadManager;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucket = 'phpsdk';

	// 设置put policy的其他参数, 上传回调
	//$opts = array(
	//			'callbackUrl' => 'http://www.callback.com/',  
	//			'callbackBody' => 'name=$(fname)&hash=$(etag)'
	//		);
	//$token = $auth->uploadToken($bucket, null, 3600, $opts);

        $token = $auth->uploadToken($bucket);
	$uploadMgr = new UploadManager();
    
	list($ret, $err) = $uploadMgr->putFile($token, null, __file__);
	echo "\n====> putFile result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		var_dump($ret);
	}


<a id="io-put-policy"></a>
### 上传策略

[上传凭证][uploadTokenHref] 实际上是用 AccessKey/SecretKey 进行数字签名的上传策略(`PutPolicy`)，它控制则整个上传流程的行为。让我们快速过一遍你都能够决策啥：


    private static $policyFields = array(
        'callbackUrl',				// 可选
        'callbackBody',				// 可选
        'callbackHost',				// 可选
        'callbackBodyType',			// 可选
        'callbackFetchKey',			// 可选

        'returnUrl',				//可选， 更贴切的名字是 redirectUrl。
        'returnBody',

        'endUser',					// 可选
        'saveKey',                 // 可选
        'insertOnly',              // 可选

        'detectMime',              // 可选
        'mimeLimit',               // 可选
        'fsizeLimit',              // 可选

        'persistentOps',           // 可选
        'persistentNotifyUrl',     // 可选
        'persistentPipeline',      // 可选
      );
  
* `callbackUrl` 设定业务服务器的回调地址，这样业务服务器才能感知到上传行为的发生。
* `callbackBody` 设定业务服务器的回调信息。文件上传成功后，七牛向业务服务器的callbackUrl发送的POST请求携带的数据。支持 [魔法变量][magicVariablesHref] 和 [自定义变量][xVariablesHref]。
* `callbackBodyType`设定七牛向业务服务器发起回调的body的Content-Type，默认为`application/x-www-form-urlencoded`，也可设置为`application/json`。
* `callbackFetchKey`设置是否启用fetchKey上传模式，0为关闭，1为启用；具体见[fetchKey上传模式](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#fetch-key-explaination)。
* `returnUrl` 设置用于浏览器端文件上传成功后，浏览器执行303跳转的URL，一般为 HTML Form 上传时使用。文件上传成功后浏览器会自动跳转到 `returnUrl?upload_ret=returnBody`。
* `returnBody` 可调整返回给客户端的数据包，支持 [魔法变量][magicVariablesHref] 和 [自定义变量][xVariablesHref]。`returnBody` 只在没有 `callbackUrl` 时有效（否则直接返回 `callbackUrl` 返回的结果）。不同情形下默认返回的 `returnBody` 并不相同。在一般情况下返回的是文件内容的 `hash`，也就是下载该文件时的 `etag`；但指定 `returnUrl` 时默认的 `returnBody` 会带上更多的信息。
* `persistentOps` 可指定音视频文件上传完成后，需要进行的转码持久化操作。asyncOps的处理结果保存在缓存当中，有可能失效。而persistentOps的处理结果以文件形式保存在bucket中，体验更佳。[数据处理(持久化)](../api/overview/fop/index.html)  
* `persistentNotifyUrl` 音视频转码持久化完成后，七牛的服务器会向用户发送处理结果通知。这里指定的url就是用于接收通知的接口。设置了`persistentOps`,则需要同时设置此字段。

关于上传策略更完整的说明，请参考 [上传凭证][uploadTokenHref]。


<a name=io-download></a>
### 文件下载
七牛云存储上的资源下载分为 公有资源下载 和 私有资源下载 。

私有（private）是 Bucket（空间）的一个属性，一个私有 Bucket 中的资源为私有资源，私有资源不可匿名下载。

新创建的空间（Bucket）缺省为私有，也可以将某个 Bucket 设为公有，公有 Bucket 中的资源为公有资源，公有资源可以匿名下载。

<a name=public-download></a>
#### 公有资源下载
如果在给bucket绑定了域名的话，可以通过以下地址访问。

	[GET] http://<domain>/<key>
	
其中\<domain\>是bucket所对应的域名。七牛云存储为每一个bucket提供一个默认域名。默认域名可以到[七牛云存储开发者平台](https://portal.qiniu.com/)中，空间设置的域名设置一节查询。用户也可以将自有的域名绑定到bucket上，通过自有域名访问七牛云存储。

**注意： key必须采用utf8编码，如使用非utf8编码访问七牛云存储将反馈错误**

<a name=private-download></a>
#### 私有资源下载
私有资源必须通过临时下载授权凭证(downloadToken)下载，如下：

	[GET] http://<domain>/<key>?e=<deadline>&token=<downloadToken>

注意，尖括号不是必需，代表替换项。  
私有下载链接可以使用 SDK 提供的如下方法生成：

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$baseUrl = 'http://7j1xlg.com2.z0.glb.qiniucdn.com/php-logo.png';
	$authUrl = $auth->privateDownloadUrl($baseUrl);
    
<a name=fop-api></a>
## 数据处理接口
七牛支持在云端对图像, 视频, 音频等富媒体进行个性化处理

<a name=fop-image></a>
### 图像
<a name=fop-image-info></a>
#### 查看图像属性

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Processing\Operation;

	$key = 'php-logo.png';
	$domain = '7j1xlg.com2.z0.glb.qiniucdn.com';
	$op = new Operation($domain);

	list($ret, $err) = $op->execute($key, 'imageInfo');
	echo "\n====> imageInfo result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		var_dump($ret);
	}

<a name=fop-exif></a>
#### 查看图片EXIF信息

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Processing\Operation;

	$key = 'php-logo.png';
	$domain = '7j1xlg.com2.z0.glb.qiniucdn.com';
	$op = new Operation($domain);

	list($ret, $err) = $op->execute($key, 'exif');
	echo "\n====> exif result: \n";
	if ($err !== null) {
		var_dump($err);
	} else {
		var_dump($ret);
	}

<a name=fop-image-view></a>
#### 生成图片预览URL

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Processing\Operation;

	$key = 'php-logo.png';
	$domain = '7j1xlg.com2.z0.glb.qiniucdn.com';
	$op = new Operation($domain);

	$ops = 'imageView2/0/w/10/h/20';
	$url = $op->buildUrl($key, $ops);
	echo "\n====> imageView2 URL: \n $url";
	
<a name=pfop-api></a>
### 持久化数据处理
七牛支持在云端对图像, 视频, 音频等富媒体进行持久化处理处理。 由于音视频的处理比较耗时，所以音视频的处理较多采用异步持久化操作。

<a name=av-hls></a>
#### 视频切片

	require_once '<path_to_autoload_file>/autoload.php';

	use Qiniu\Auth;
	use Qiniu\Processing\PersistentFop;

	$accessKey = '<YOUR_APP_ACCESS_KEY>';
	$secretKey = '<YOUR_APP_SECRET_KEY>';
	$auth = new Auth($accessKey, $secretKey);

	$bucket = 'phpsdk';
	$key = 'clock.flv';
	$pfop = new PersistentFop($auth, $bucket);

	$fops='avthumb/m3u8/segtime/40/vcodec/libx264/s/320x240';
	list($id, $err) = $pfop->execute($key, $fops);
	
	echo "\n====> pfop avthumb result: \n";
	if ($err != null) {
		var_dump($err);
	} else {
		echo "PersistentFop Id: $id";
	}

<a name=contribution></a>
## 贡献代码

1. Fork
2. 创建您的特性分支 (`git checkout -b my-new-feature`)
3. 提交您的改动 (`git commit -am 'Added some feature'`)
4. 将您的修改记录提交到远程 `git` 仓库 (`git push origin my-new-feature`)
5. 然后到 github 网站的该 `git` 远程仓库的 `my-new-feature` 分支下发起 Pull Request

<a name=license></a>
## 许可证

Copyright (c) 2014 qiniu.com

基于 MIT 协议发布:

* [www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)

[uploadTokenHref]:    ../api/reference/security/upload-token.html    "上传凭证"
[downloadTokenHref]:  ../api/reference/security/download-token.html  "下载凭证"
[magicVariablesHref]: ../api/overview/up/response/vars.html#magicvar "魔法变量"
[xVariablesHref]:     ../api/overview/up/response/vars.html#xvar     "自定义变量"
