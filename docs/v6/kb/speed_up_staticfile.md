---
layout: docs
title: "使用七牛加速静态文件"
snapshot: "为了方便测试，我们已经人工上传了一个测试音频，同时将文件所在的存储空间暂设为公开属性。公开属性表示我们上传的文件能够以 HTTP 的方式公开提供下载。"
---

- [下载测速](#speed)
- [图片在线处理](#image-process)
- [音频/视频在线压缩转码](#audio-video-process)
    - [HTTP Live Streaming - 流媒体](#hls) 
- [上传测试](#upload)
- [文件隐私安全保护](#private-download)


<a id="speed"></a>

## 下载测速

为了方便测试，我们已经人工上传了一个测试音频，同时将文件所在的存储空间暂设为公开属性。公开属性表示我们上传的文件能够以 HTTP 的方式公开提供下载。公开URL如下：

<http://apitest.b1.qiniudn.com/sample.wav>

该文件是一段时长为1分30秒的无损音频，文件体积约为：15.27 MB 。可以用第三方测速工具针对该 URL 进行下载测速。

实测全国平均下载速度为：**3.75MB/s**

实测地址: <http://17ce.com/>


<a id="image-process"></a>

## 图片在线处理

我们选取一家在使用七牛云存储的互联网初创公司——[蟬￼游记](http://chanyouji.com/)作为我们的测试案例。

蟬游记网站 <http://chanyouji.com/> 主要以图片为主，这些图片都存于七牛云存储，使用七牛云存储提供的在线缩略图处理和加速分发功能。我们可以随便挑选一张图片作为测试。

**原图**:
 
- <http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg>

![原图](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg)

**水印**（将蟬游记LOGO打到原图上去）:

- <http://t.cn/zQIqIGi> (可点击查看完整URL)

![水印](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?watermark/1/image/aHR0cDovL2N5anMucWluaXVkbi5jb20vYXNzZXRzL3RvcC1sb2dvLTViMTY2MWVhZmVhODY5NDY3YjgzM2Y0Yjk3MjgyNDNiLnBuZw==/dissolve/85/gravity/SouthEast/dx/20/dy/20)

**缩略图1**

![缩略图1](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg-home_4)

缩略图1源文件URL如下:

- <http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?imageView/1/w/310/h/395/q/80> (裸API形式)
- <http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg-home_4> (自定义API规格别名)
- 以上两个URL等价，即 `home_4` 是 `imageView/1/w/310/h/395/q/80` 的API规格别名。

**缩略图2**（可指定URL中任意宽高等参数来调整缩略图的大小）

- <http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?imageView/1/w/310/h/187/q/80/format/webp> (支持webp等其他图片格式互转)

![缩略图2（可指定任意宽高等参数来调整缩略图的大小）](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?imageView/1/w/310/h/187/q/80)

**缩略图3** (缩略、裁剪、旋转)

- <http://t.cn/zQIqJPv> (可点击查看完整URL)

![缩略图3缩略、裁剪、旋转](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?imageMogr/auto-orient/thumbnail/!310x310r/gravity/center/crop/!310x310/quality/80/rotate/45)

**缩略图4** (API链式处理，基于缩略图打水印)

- <http://t.cn/zQIq6O8> (可点击查看完整URL)

![API链式处理，基于缩略图打水印](http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg?imageView/1/w/310/h/187/q/80|watermark/1/image/aHR0cDovL2N5anMucWluaXVkbi5jb20vYXNzZXRzL3RvcC1sb2dvLTViMTY2MWVhZmVhODY5NDY3YjgzM2Y0Yjk3MjgyNDNiLnBuZw==/dissolve/85/gravity/SouthEast)


### 更多

- [七牛云存储图像处理 API](/api/image-process.html)
- 蟬游记-七牛云存储使用心得：<http://quake.iteye.com/blog/1816807>


<a id="audio-video-process"></a>

## 音频/视频在线压缩转码

七牛云存储支持常见的音视频格式互转，比如 mp3、aac，m4a, mp4、avi、flv 等。支持互转的音频格式可参考：<http://ffmpeg.org/general.html#File-Formats>

示例1：将 wav 音频格式转换为 mp3 格式：

[GET] <http://apitest.b1.qiniudn.com/sample.wav?avthumb/mp3>

示例2：将 wav 音频格式转换为 mp3 格式，并指定静态码率（CBR）为 192k：

[GET] <http://apitest.b1.qiniudn.com/sample.wav?avthumb/mp3/ab/192k>

示例3：将 wav 音频格式转换为 mp3 格式，并指定动态码率（VBR）参数为3，采样频率为 44100：

[GET] <http://apitest.b1.qiniudn.com/sample.wav?avthumb/mp3/ar/44100/aq/3>

示例4：视频帧提取

源视频

- [GET] <http://open.qiniudn.com/thinking-in-go.mp4>

取视频第 7 秒的截图，图片格式为 jpg，宽度为 480px，高度为 360px

- [GET] <http://open.qiniudn.com/thinking-in-go.mp4?vframe/jpg/offset/7/w/480/h/360>

![获取视频帧缩略图](http://open.qiniudn.com/thinking-in-go.mp4?vframe/jpg/offset/7/w/480/h/360)

- [七牛云存储音/视频处理接口](/api/audio-video-hls-process.html)


<a id="hls"></a>

### HTTP Live Streaming - 流媒体

七牛云存储支持 Apple 提出的基于 HTTP 的流媒体传输协议（HTTP Live Streaming，简称 HLS）。 基于HLS技术，可将一整个音视频文件切割成可由 HTTP 传输下载的一个个细碎的音视频流，并生成一个播放列表（M3U8），客户端只需要获取资源的 M3U8 播放列表URL即可以流式地播放该音视频。

目前 iOS, Android 3.0+ 系列的设备包括 Safari 浏览器都可以直接播放 HLS 的音视频，并且 HLS 可以通过传统的 CDN （内容分发网络）和七牛的加速节点来加速分发（七牛目前的加速节点超过500+）。

除此之外，七牛云存储的 HLS 还有一个显著优点，可以基于同一份音视频文件转码多份 m3u8 playlist，即实现音视频播放多码率自适应终端用户网络带宽环境。当终端用户网络质量不佳时，优先播放低码率音视频流，当网络质量优时，可自动切换到高品质音视频流。流式播放输出，无需等待缓冲，智能切换码率不卡顿，用户体验极佳。

以下URL就是一个已经使用七牛 HLS API 处理的流媒体资源：

- <http://apitest.b1.qiniudn.com/sample.wav-m3u8_audio>

其中 `m3u8_audio` 是自定义的 API 规格别名（`avthumb/m3u8/preset/audio_32k`）。

您可以使用播放器来打开该 URL 进行流媒体播放体验。参考:

- [HOW TO: View an HLS Stream in QuickTime or VLC](https://softron.zendesk.com/entries/22255163-how-to-view-an-hls-stream-in-quicktime-or-vlc)
- 或者使用 HTML5 的 audio/video 标签，如下代码:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HTML5 HLS Demo</title>
  </head>
  <body>
    <audio src="http://apitest.b1.qiniudn.com/sample.wav-m3u8_audio" controls="true"></audio>
  </body>
</html>
```

将以上 HTML 代码保存为一个后缀为 `.html` 的文件，然后用 [Apple Safari](http://www.apple.com.cn/safari/) 浏览器打开网页即可体验流媒体播放。

- 七牛云存储 [HTTP Live Streaming API](/api/audio-video-hls-process.html#hls)

支持 [在上传时进行异步预转](/api/audio-video-hls-process.html#upload-fop)，终端用户访问时获得更好的用户体验。

我们还在深化 HLS API, 欢迎提供建议！


<a id="upload"></a>

## 测试上传文件

为方便测试，我们准备了测试帐号，并使用七牛提供的上传工具。

实际情况下，若您的业务偏 UGC(User Generate Content)，可以使用 [七牛提供的SDK](https://github.com/qiniu) 让终端用户直传图片/音频/视频/文件到七牛云存储。

若不想用测试帐号，也可自行注册申请帐号。注册地址：<https://portal.qiniu.com/signup>

为方便测试，我们在测试帐号申里边创建了一个名为 `qtestbucket` 的存储空间。

然后可以使用七牛云存储提供的 [qrysnc](/tools/qrsync.html) 进行文件上传。

可以点击如下网址下载 qrsync 工具，以及了解其用法：

以下内容可以存档为 `qiniu-test-config.json`，其配置是根据测试帐号相关的。其中 `sync_dir` 项需要修改成绝对路径。注意：Windows 平台上路径的表示格式为：`盘符:/目录`，比如 E 盘下的路径 `data/photos` 表示为：`e:/data/photos`。

    {
        "access_key": "iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV",
        "secret_key": "6QTOr2Jg1gcZEWDQXKOGZh5PziC2MCV5KsntT70j",
        "bucket": "qtestbucket",
        "sync_dir": "/PATH/TO/YOUR/SYNC_DIR",// 需根据实际情况自行替换
        "domains": ["qtestbucket.b1.qiniudn.com","qtestbucket.qiniudn.com"],
        "debug_level": 1
    }

配置项说明可参考上述提到的 [qrsync使用文档](/tools/qrsync.html) 。

`qiniu-test-config.json` 修改并存档完毕后，可在 `sync_dir` 所指定的目录放入需要进行上传的具体文件（可包含子目录结构）。然后进入到 qrsync 所在的目录，运行以下命令行：

    $ qrsync /PATH/TO/qiniu-test-config.json

控制台输出可以看到文件上传的具体信息。


<a id="private-download"></a>

## 下载文件

**公有资源下载**

    http://<空间绑定域名>/<key>

在我们前面的示例中，此URL: <http://apitest.b1.qiniudn.com/sample.wav> 可看出如下信息。

- 存储空间名称是 `apitest`
- 空间绑定域名是 `apitest.b1.qiniudn.com`
- 空间隐私属性是 `公开`
- 文件索引 (key) `sample.wav`

key 一般是具体的文件名称或路径（非“/”开头）。比如 `sample.wav` 和 `a/b/c.txt` 都是合法的 key 。

**文件隐私安全保护**

可以将空间属性设置为私有，设置为私有后，必须签发下载授权凭证才能提供文件访问。私有文件访问方式为：

    http://<空间绑定域名>/<key>?token=<downloadToken>

`downloadToken` 支持有效期和作用域，

私有资源详情参考：[下载接口——私有资源下载](/api/get.html#private-download)



## 结束语

以上测试方案仅适用非编程环境，如果需要更深入的编程接入或其他测试，可以根据具体需求提供。请与我们保持联系！[support@qiniu.com](mailto:support@qiniu.com)

