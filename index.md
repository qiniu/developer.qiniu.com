---
layout: homepage
title: 七牛云存储使用指南
---



<a name="introduce-qiniu"></a>

## 七牛云存储

七牛云存储致力于提供最适合开发者的数据在线托管、传输加速以及云端处理的服务。区别于国内外其他云存储，七牛自行研发的全分布式架构解决了其他云存储单一数据中心的架构可能存在的风险，同时首创双向加速特性对数据上传下载均加速，使得数据访问速度较传统方案平均提升50%以上。此外，镜像存储，客户端直传，断点续上传，云端富媒体处理等七牛云存储独有的功能也大大提升了开发效率，最大程度减少了服务器资源浪费。目前，七牛已经为大量移动互联网，Web2.0，媒体，电商以及游戏等领域的知名企业提供了全方位的解决方案与服务。

<a name="use-qiniu"></a>

## 使用七牛

在使用七牛云存储之前，需要[注册成为七牛用户](https://portal.qiniu.com/signup)，然后[取得AccessKey和SecretKey](https://portal.qiniu.com/setting/key)。

**注意： Secret Key是七牛云存储对用户访问安全验证的核心要素，用户必须妥善保管，不能泄露给第三方，亦不可置于最终用户使用的客户端中。如发生泄露，请立刻更换Access Key和Secret Key。**

七牛云存储的使用非常简单。根据不同的用况，用户可以选择适合自身的方式。

最简单快捷的数据上传是使用[qrsync](http://docs.qiniu.com/tools/qrsync.html)命令行工具。qrsync工具可以用于单个文件的上传，也可用于整个目录内文件的上传。

如果用户需要在自己的业务逻辑中向七牛云存储上传数据，则有更多的选择。用户可以根据自己使用的服务端语言，选择一种[SDK](http://docs.qiniu.com/sdk/index.html)方便地实现数据上传操作。

七牛云存储提供以下SDK：

- [Objective-C (iOS)](http://docs.qiniu.com/ios-sdk/index.html)
- [Java (Android)](http://docs.qiniu.com/android-sdk/index.html)
- [Java](http://docs.qiniu.com/java-sdk/index.html)
- [PHP](http://docs.qiniu.com/php-sdk/index.html)
- [Python](http://docs.qiniu.com/python-sdk/index.html)
- [Ruby](http://docs.qiniu.com/ruby-sdk/index.html)
- [Node.js](http://docs.qiniu.com/nodejs-sdk/index.html)
- [C#](http://docs.qiniu.com/csharp-sdk/index.html)
- [C/C++](http://docs.qiniu.com/c-sdk/index.html)
- [Go](http://docs.qiniu.com/go-sdk/index.html)

这些SDK遵循共同接口规范。用户可以用同样的方式使用不同的SDK，方便那些同时使用多种语言的用户。

如果用户有一些特殊的使用方式，而现有SDK无法满足，可以直接通过[API](http://docs.qiniu.com/api/index.html)访问七牛云存储。

很多开发网络应用的用户需要从他们自己的客户端访问七牛云存储。传统上，用户会将数据上传至他们的业务服务器，然后由业务服务器转发至云存储。这种做法增加了客户业务服务器的压力，并且增加了用户的流量成本。七牛云存储允许用户[从客户端直接上传数据](http://docs.qiniu.com/api/v6/put.html#upload-without-callback)，而无需到业务服务器中转。这种模式具有更广泛的用途和灵活性。

在客户端直接上传数据的基础上，为方便用户业务服务器和客户端的信息交互，七牛云存储还提供了[回调业务服务器](http://docs.qiniu.com/api/v6/put.html#upload-with-callback)的功能。用户可以在一次数据上传请求中，完成客户端和业务服务器的数据交换。在此基础上，七牛云存储还允许用户利用[魔法变量](http://docs.qiniu.com/api/v6/put.html#MagicVariables)和[自定义变量](http://docs.qiniu.com/api/v6/put.html#xVariables)设定回调中所传递的数据。

用户可以将一个空间（Bucket）设置为公有，任何人都可以[无需授权下载它的内容](http://docs.qiniu.com/api/v6/get.html#public-download)。或者将空间设为私有，以授权访问的方式，对外提供[授权下载](http://docs.qiniu.com/api/v6/get.html#private-download)。用户可以根据自己的应用对安全性的要求，灵活使用这两种方式。

七牛云存储不仅仅提供数据存储服务，用户还可以在七牛云存储的服务平台上，直接对所存储的服务进行数据处理。七牛云存储提供了多种数据处理功能，包括：

- [图片处理](http://docs.qiniu.com/api/image-process.html)
- [音视频处理](http://docs.qiniu.com/api/audio-video-hls-process.html)
- [文档转换](http://docs.qiniu.com/api/office-process.html)
- [管道](http://docs.qiniu.com/api/pipeline.html)
- [杂项](http://docs.qiniu.com/api/misc-file-process.html)

等等，并且在不断扩展中。在这些数据处理功能的基础上，七牛云存储还允许用户将它们以[Pipeline](http://docs.qiniu.com/api/pipeline.html)的形式串联起来，执行更加复杂的数据处理操作。比如，先从视频中摘取一帧缩略图，然后进行裁剪和旋转，并且打上水印。这一组操作可以在一次请求中完成，更加快捷方便。


如果在使用七牛云存储各类服务的过程中，有问题或建议，欢迎随时通过如下途径向我们反馈：

- 在七牛云存储的[开发者平台](https://portal.qiniu.com/)，点击右侧的“咨询和建议”；
- 在七牛云存储的[客户支持平台](http://support.qiniu.com/home)提交你的问题和建议。
