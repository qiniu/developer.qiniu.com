---
title: 音视频切片（segtime）
order: 148
---

<a id="segtime"></a>
# 音视频切片（segtime）

<a id="segtime-description"></a>
## 描述

音视频切片是七牛云存储提供的云处理功能，用于支持HTTP Live Streaming回放。  
HTTP Live Streaming是由Apple提出的基于HTTP的流媒体传输协议。  
它将一整个音视频流切割成可由HTTP下载的一个个小的音视频流，并生成一个播放列表（M3U8），客户端只需要获取资源的 M3U8 播放列表即可播放音视频。  
以下用 HLS 代指 HTTP Live Streaming 。

HLS API规格支持两种形式：预设集和自定义两种。  

<a id="segtime-preset"></a>
## 切片预设集接口规格  

```
presetSpec = "avthumb/m3u8/segtime/<SegSeconds>
                          /preset/<Preset>"
```

参数名称                | 必填 | 说明
:---------------------- | :--- | :----------------------------------------
`/segtime/<SegSeconds>` |      | 用于自定义每一小段音/视频流的播放时长，单位：秒，取值范围10-60秒，默认值为10秒。
`/preset/<Preset>`      | 是   | 预设集（Preset）名称。

音频预设集：  

预设集    | 说明
:-------- | :--------------
audio_32k | 码率为32k的音频。
audio_48k | 码率为48k的音频。
audio_64k | 码率为64k的音频。

视频预设集：  

预设集          | 说明                               | 推荐应用环境
:-------------- | :--------------------------------- | :--------------
video_16x9_150k | 码率为150K，长宽比为16x9。         | 3G
video_16x9_240k | 码率为240K，长宽比为16x9。         | 3G
video_16x9_440k | 码率为440K，长宽比为16x9。         | WIFI
video_16x9_640k | 码率为640K，长宽比为16x9。         | WIFI
video_4x3_150k  | 码率为150K，长宽比为4x3。          | 3G
video_4x3_240k  | 码率为240K，长宽比为4x3。          | 3G
video_4x3_440k  | 码率为440K，长宽比为4x3。          | WIFI
video_4x3_640k  | 码率为640K，长宽比为4x3。          | WIFI
video_150k      | 码率为150K，长宽比沿用源视频设置。 | 3G
video_240k      | 码率为240K，长宽比沿用源视频设置。 | 3G
video_440k      | 码率为440K，长宽比沿用源视频设置。 | WIFI
video_640k      | 码率为640K，长宽比沿用源视频设置。 | WIFI

<a id="segtime-selfdef"></a>
## 自定义切片接口规格

```
selfDefSpec = "avthumb/m3u8/segtime/<SegSeconds>
                           /ab/<BitRate>
                           /aq/<AudioQuality>
                           /ar/<SamplingRate>
                           /r/<FrameRate>
                           /vb/<VideoBitRate>
                           /vcodec/<VideoCodec>
                           /acodec/<AudioCodec>"
```

参数名称                | 必填 | 说明
:---------------------- | :--- | :--------------------------------------------------------------
`/segtime/<SegSeconds>` |      | 用于自定义每一小段音/视频流的播放时长，单位：秒，取值范围10-60秒，默认值为10秒。
`/ab/<BitRate>`         |      | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等。
`/aq/<AudioQuality>`    |      | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用。
`/ar/<SamplingRate>`    |      | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等。
`/r/<FrameRate>`        |      | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值。
`/vb/<VideoBitRate>`    |      | 视频比特率，单位：比特每秒（bit/s），常用视频比特率：128k，1.25m，5m等。
`/vcodec/<VideoCodec>`  |      | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid等。
`/acodec/<AudioCodec>`  |      | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等。

<a id="segtime-samples"></a>
## 示例

1. 以[预转持久化][persistentOpsHref]形式，将mp4视频按video_240k预设规格切片（15秒一片）：

	```
    {
        "scope":                "qiniu-ts-demo:sample.mp4",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/m3u8/segtime/15/video_240k",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

2. 以[触发持久化处理][pfopHref]形式，将mp4视频切片，静态码率为320K，帧率为24fps：

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo
    &key=sample.mp4
    &fops=avthumb%2Fm3u8%2Fab%2F320k%2Fr%2F24
    &notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="segtime-alias"></a>
## 别名

七牛云存储还支持为音视频切片规格设置别名，以使得下载URL更为友好。  
可以使用命令行工具[qboxrsctl](../../../../tools/qboxrsctl.html)配置这类别名。

```
指令1，登录授权:

    qboxrsctl login <注册邮箱> <登录密码>

指令2，设置友好风格的 URL 分隔符:

    qboxrsctl separator <空间名称> <分隔符字符>

指令3，设置 API 规格别名:

    qboxrsctl style <空间名称> <API规格别名> <API规格定义字符串>
```

注意:

- qboxrsctl工具需在命令行模式下使用
- 尖括号注明的参数是需要自行替换的内容

示例：  

```
    // 设置分隔符为点号（“.”) 
    qboxrsctl separator <空间名称> .

    // 设置风格名为 m3u8_audio，代表音频的 HLS, 码率为32k
    qboxrsctl style <空间名称> m3u8_audio avthumb/m3u8/preset/audio_32k

    // 设置风格名为 m3u8_video，代表视频的 HLS, 长宽比为16x9，码率为150k
    qboxrsctl style <空间名称> m3u8_video avthumb/m3u8/preset/video_16x9_150k
```

已知文件上传到七牛后，下载方式如下:

```
公开资源

    [GET] http://<Domain>/<Key>

私有资源

    [GET] http://<Domain>/<Key>?token=<DownloadToken>
```

则上述示例设置完之后就可以用以下URL来访问HLS资源：  

```

    // 公开资源
    [GET] http://<Domain>/<Key>.m3u8_audio
    [GET] http://<Domain>/<Key>.m3u8_video

    // 私有资源（m3u8私有资源访问暂不支持）
    [GET] http://<Domain>/<Key>.m3u8_audio?token=<DownloadToken>
    [GET] http://<Domain>/<Key>.m3u8_video?token=<DownloadToken>

    HTTP/1.1 200 OK
    Content-Type: application/x-mpegurl
    Body: <M3U8File>
```

<a id="segtime-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"
