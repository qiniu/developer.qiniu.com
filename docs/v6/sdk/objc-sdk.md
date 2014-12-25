---
layout: docs
title: Objective-C SDK 使用指南
---

# Objective-C SDK 使用指南

- [SDK下载](#download)
- [环境准备](#prepare)
- [上传文件](#upload)
- [上传选项](#option)
- [实现参考](#reference)
- [常见问题](#troubleshooting)
- [许可证](#license)

<a id="download"></a>
## SDK下载

- Objective-C SDK 下载地址：<https://github.com/qiniu/objc-sdk/releases>
- Objective-C SDK 源码地址：<https://github.com/qiniu/objc-sdk>
- Objective-C SDK 单元测试：<https://github.com/qiniu/objc-sdk/tree/master/QiniuSDKTests>
- Objective-C SDK 在线文档: <http://cocoadocs.org/docsets/Qiniu/7.0.7/>

或者使用Cocoapods 进行安装，命令如下

```ruby
pod "Qiniu", "~> 7.0"
```

本SDK同时支持Mac和iOS，会根据文件大小自动选择mulipart form直传还是断点续上传。

<a id="prepare"></a>
## 环境准备
本SDK为客户端SDK，没有包含token生成实现，为了安全，token都建议通过网络从服务端获取，具体生成代码可以参考java/python/php/ruby/go等服务端sdk。

<a id="upload"></a>
## 上传文件

```objective-c
#import <QiniuSDK.h>
...
    NSString token = @"从服务端SDK获取";
    QNUploadManager *upManager = [[QNUploadManager alloc] init];
    NSData *data = [@"Hello, World!" dataUsingEncoding : NSUTF8StringEncoding];
    [upManager putData:data key:@"hello" token:token
        complete: ^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
        NSLog(@"%@", info);
        NSLog(@"%@", resp);
    } option:nil];
...
```

**注意： key及所有需要输入的字符串必须采用utf8编码，如使用非utf8编码访问七牛云存储将反馈错误**

### 关于option参数

一般情况下，开发者可以忽略 put 方法中的 option 参数，即在调用时保持 option 的值为 nil 即可。但对于一些特殊的场景，我们可以给 option 传入一些高级选项以更精确的控制上传行为，获取进度信息。

option QNUploadOption 类型，其中包含变量：params，mimeType，checkCrc，progressHandler, cancelSignal。

#### mimeType

为上传的文件设置一个自定义的 MIME 类型，如果为空，那么服务端自动检测文件的 MIME 类型。

#### checkCrc

checkCrc 为 NO 时，服务端不会校验 crc32 值，checkCrc 为 YES 时，服务端会计算上传文件的 crc32 值，然后与用户提供的 crc32 参数值相比较确认文件的完整性，如果校验失败会返回 406 错误。

#### params

用户自定义参数，必须以 "x:" 开头，这些参数可以作为变量用于 upToken 的 callbackBody，returnBody，asyncOps 参数中，具体见：[自定义变量][xVariablesHref]。简单的一个例子为：

```objective-c

    QNUploadOption *opt = [[QNUploadOption alloc] initWithMime:@"text/plain" progressHandler:nil params:@{ @"x:foo":@"fooval" } checkCrc:YES cancellationSignal:nil];
    [upManager putData:data key:@"hello" token:token
        complete: ^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
        NSLog(@"%@", info);
        NSLog(@"%@", resp);
    } option:opt];

```

#### 上传进度

上传进度的block 为

```
typedef void (^QNUpProgressHandler)(NSString *key, float percent);
```

如果实现了这个block, 并作为option参数传入，会及时得到上传进度通知。

#### 取消上传

如果希望中途可以取消上传，需要实现下面的block，并作为参数传入option

```
typedef BOOL (^QNUpCancellationSignal)(void);
```

当进行取消操作时，让这个函数返回YES，这样上传中途即可停止，具体可参考 [QNFileRecorderTest.m](https://github.com/qiniu/objc-sdk/blob/master/QiniuSDKTests/QNFileRecorderTest.m) 这个测试中的例子。

### 失败或取消后继续上传

本SDK实现了断点续上传，如果需要保存上传进度，需要您在生成UploaderManager 实例时传入一个实现了进度保存的代理，SDK自带了将进度保存到文件的方法，您可以自己实现其他保存方式。具体可参考 [QNFileRecorderTest.m](https://github.com/qiniu/objc-sdk/blob/master/QiniuSDKTests/QNFileRecorderTest.m)  这个测试中的例子。

```objective-c
    NSError *error;
    QNFileRecorder *file = [QNFileRecorder fileRecorderWithFolder:@"保存目录" error:&error];
    //check error
    QNUploadManager *upManager = [[QNUploadManager alloc] initWithRecorder:file];
```

<a id="reference"></a>
## 代码参考

本SDK代码都有对应的单元测试检查，如果需要实现某个功能，参考单元测试可以很快获得答案。

<a id="troubleshooting"></a>
## 常见问题

- 如果碰到crc链接错误，请把libz.dylib加入到项目中去。
- 如果需要支持iOS 5 或者支持restKit, 请用 AFNetworking 1.x 分支的版本
- 如果碰到其他编译错误，请参考 Cocoapods 的 [troubleshooting](http://guides.cocoapods.org/using/troubleshooting.html)

<a id="License"></a>
## 许可证
MIT 许可证
Copyright (c) 2012-2014 qiniu.com

[uploadTokenHref]:    ../api/reference/security/upload-token.html    "上传凭证"
[downloadTokenHref]:  ../api/reference/security/download-token.html  "下载凭证"
[magicVariablesHref]: ../api/overview/up/response/vars.html#magicvar "魔法变量"
[xVariablesHref]:     ../api/overview/up/response/vars.html#xvar     "自定义变量"
