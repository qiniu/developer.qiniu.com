---
layout: docs
title: Android SDK使用文档
---

# Android SDK使用文档

## 目录

- [概述](#overview)
- [下载链接](#download-link)
- [使用场景](#use-scenario)
- [接入SDK](#integration)
- [安全性](#security)
- [上传文件](#upload)
	- [简单直传](#form-upload)
	- [断点续上传](#resumable-upload)
- [下载文件](#download)
- [线程安全性](#thread-safety)

<a name="overview"></a>
## 概述

Android SDK只包含了最终用户使用场景中的必要功能。相比服务端SDK而言，客户端SDK不会包含对云存储服务的管理和配置功能。

该SDK支持不低于2.3的Android版本（api9）。

<a name="download-link"></a>
## 下载链接

- SDK 下载地址：<https://codeload.github.com/qiniu/android-sdk/zip/master>
- SDK 源码地址：<https://github.com/qiniu/android-sdk>

<a name="use-scenario"></a>
## 使用场景

在使用Android SDK开发基于七牛云存储的应用之前，请理解正确的开发模型。客户端属于不可控的场景，恶意用户在拿到客户端后可能会对其进行反向工程，因此客户端程序中不可包含任何可能导致安全漏洞的业务逻辑和关键信息。

我们推荐的安全模型如下所示：

![安全模型](http://developer.qiniu.com/docs/v6/api/overview/img/token.png)

开发者需要合理划分客户端程序和业务服务器的职责范围。分发给最终用户的客户端程序中不应有需要使用管理凭证及SecretKey的场景。这些可能导致安全风险的使用场景均应被设计为在业务服务器上进行。

更多的相关内容请查看[编程模型](http://developer.qiniu.com/docs/v6/api/overview/programming-model.html)和[安全机制](http://developer.qiniu.com/docs/v6/api/overview/security.html)。

<a name="integration"></a>
## 接入SDK

该SDK没有包含工程文件，这时需要自己新建一个工程，然后将src里面的代码复制到代码目录里面。

<a name="security"></a>
## 安全性

该SDK未包含凭证生成相关的功能。开发者对安全性的控制应遵循[安全机制](http://developer.qiniu.com/docs/v6/api/overview/security.html)中建议的做法，即客户端应向业务服务器每隔一段时间请求上传凭证，而不是直接在客户端使用AccessKey/SecretKey生成对应的凭证。在客户端使用SecretKey会导致严重的安全隐患。

开发者可以在生成上传凭证前通过配置上传策略以控制上传的后续动作，比如在上传完成后通过回调机制通知业务服务器。该工作在业务服务器端进行，因此非本SDK的功能范畴。

完整的内容请参考[上传策略规格](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html)，[上传凭证规格](http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html)，[下载凭证规格](http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html)。关于上传后可以进行哪些后续动作，请查看[上传后续动作](http://developer.qiniu.com/docs/v6/api/overview/up/response/)。

<a name="upload"></a>
## 上传文件

开发者可以选择SDK提供的两种上传方式：表单上传和分片上传。表单上传使用一个HTTP POST请求完成文件的上传，因此比较适合较小的文件和较好的网络环境。相比而言，分片上传更能适应不稳定的网络环境，也比较适合上传比较大的文件（数百MB或更大）。

若需深入了解上传方式之间的区别，请查看[上传类型](http://developer.qiniu.com/docs/v6/api/overview/up/upload-models.html#upload-types)，[表单上传接口说明](http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html)，[分片上传接口说明（断点续上传）](http://developer.qiniu.com/docs/v6/api/overview/up/chunked-upload.html)。

<a name="form-upload"></a>
### 简单直传

开发者可以通过调用`IO.put()`方法来以表单形式上传一个文件。使用该方式时应确认相应的资源大小合适于使用单一HTTP请求即可上传。过大的文件在使用该方式上传时比较容易出现超时失败的问题。该方式比较适合用于上传经压缩的小图片和短音频等，不适合用于上传较大的视频（比如尺寸超过100MB的）。

该方法的详细说明如下：

```java
public static UploadTaskExecutor put(Authorizer auth, String key,
		InputStreamAt isa, PutExtra extra, CallBack callback);
```

参数说明：

参数 | 类型 | 说明
:---: | :----: | :---
`auth` | `Authorizer` | 用于设置或获取上传token。获取新的token后，设置到auth中，下次上传(如分片上传的下一片)会使用新的token，减少token过期。
`key` | `String` | 将保存为的资源唯一标识。请参见[关键概念：键值对](http://developer.qiniu.com/docs/v6/api/overview/concepts.html#key-value)。
`isa` | `InputStreamAt` | 待上传的Uri、File、InputStream、byte[]的包装类。
`extra` | [`PutExtra`](https://github.com/qiniu/android-sdk/blob/6.x/src/com/qiniu/rs/PutExtra.java) | 上传额外参数。可以设置MIME类型等。
`callback` | [`CallBack`](https://github.com/qiniu/android-sdk/blob/6.x/src/com/qiniu/rs/CallBack.java)  | 开发者需实现该接口以获取上传进度和上传结果。<br>若上传成功，该接口中的`onSuccess()`方法将被调用。否则`onFailure()`方法将被调用。 `onProgress()`会在文件上传量发生更改的时候被调用。运行在主线程中。

返回值： `UploadTaskExecutor` 提供 `cancel` 等方法。

开发者可以在调用方法前构造一个`PutExtra`对象，设置对应的上传参数以控制上传行为。可以设置的参数如下：

参数 | 类型 | 说明
:---: | :----: | :---
`mimeType` | `String` | 指定上传文件的MIME类型。如果未指定，服务端将做自动检测。一般情况下无需设置。
`crc32` | `long` | 本文件的CRC校验码。服务端在上传完成后可以进行一次校验确认文件的完整性。
`params` | `HashMap<String, String>` | 可设置魔法变量和自定义变量。变量可帮助开发者快速的在客户端、业务服务器、云存储服务之间传递资源元信息。详见[变量](http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html)。

以下是一个关于`PutExtra`使用的示例：

```java
extra.mimeType = "application/json"; // 强制设置MIME类型

extra.params = new HashMap<String, String>();
extra.params.put("x:a", "bb"); // 设置一个自定义变量
```

表单上传的示例代码请参见SDK示例中[`MyActivity.doUpload()`](https://github.com/qiniu/android-sdk/blob/6.x/src/com/qiniu/demo/MyActivity.java)方法的实现。

<a name="resumable-upload"></a>
### 断点续上传

可基于分片上传机制实现断点续上传功能。

```java
public static UploadTaskExecutor put(Authorizer auth, String key,
			InputStreamAt input, PutExtra extra, CallBack callback)

public static UploadTaskExecutor put(Authorizer auth, String key,
			InputStreamAt input, PutExtra extra, List<Block> blocks, CallBack callback)

public Block(int idx, String ctx, int length, String host)
```

具体用法和`IO.put`的类似。`blocks`为已上传的块断点记录，以4M为一个断点记录单元。

参数 | 类型 | 说明
:---: | :----: | :---
`idx` | `int` | 待上传资源的第几块，从 0 开始
`ctx` | `String` | 上传成功后的块级上传控制信息
`length` | `int` | 块的长度。小于等于4M
`host` | `String` | 后续上传接收地址

`CallBack#onBlockSuccess(Block blk)` 一个块上传成功后，会调用此回调，可根据情况保存断点记录。

分片上传的示例代码请参见SDK示例中[`MyResumableActivity.doResumableUpload()`](https://github.com/qiniu/android-sdk/blob/6.x/src/com/qiniu/demo/MyResumableActivity.java)方法的实现。

实际情况中，本地文件可能修改，在恢复上传前先做相应的校验。

参考： [`分片上传（断点续上传）`](http://developer.qiniu.com/docs/v6/api/overview/up/chunked-upload.html)  [`上传`](http://developer.qiniu.com/docs/v6/api/reference/up/)

<a name="download"></a>
## 下载文件

该SDK并未提供下载文件相关的功能接口，因为文件下载是一个标准的HTTP GET过程。开发者只需理解资源URI的组成格式即可非常方便的构建资源URI，并在必要的时候加上下载凭证，即可使用HTTP GET请求获取相应资源。

具体做法请参见[资源下载](http://developer.qiniu.com/docs/v6/api/overview/dn/download.html)和[资源下载的安全机制](http://developer.qiniu.com/docs/v6/api/overview/dn/security.html)。

从安全性和代码可维护性的角度考虑，我们建议下载URL的拼装过程也在业务服务器进行，让客户端从业务服务器请求。

<a name="thread-safety"></a>
## 线程安全性

Android 一般的情况下会使用一个主线程来控制UI，非主线程无法控制UI，在Android4.0+之后不能在主线程完成网络请求，
该SDK是根据以上的使用场景设计，所有网络的操作均使用AsyncTask异步运行，所有回调函数又都回到了主线程（`onSuccess()`, `onFailure()`, `onProgress()`）,在回调函数内可以直接操作UI控件。
