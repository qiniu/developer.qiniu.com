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

<a id="segtime-preset"></a>
<a id="segtime-specification"></a>
## 音视频切片接口规格  

```
avthumb/m3u8/segtime/<SegSeconds>
            /preset/<Preset>
            /ab/<BitRate>
            /aq/<AudioQuality>
            /ar/<SamplingRate>
            /r/<FrameRate>
            /vb/<VideoBitRate>
            /vcodec/<VideoCodec>
            /acodec/<AudioCodec>
            /ss/<SeekStart>
            /t/<Duration>
            /stripmeta/<StripMeta>
            /rotate/<Degree>
```

参数名称                | 类别 | 必填 | 说明
:---------------------- | :--- | :--- | :----------------------------------------
`/segtime/<SegSeconds>` | A/V  |      | 用于自定义每一小段音/视频流的播放时长，单位：秒，取值范围10-60秒，默认值为10秒。
`/preset/<Preset>`      | A/V  |      | 预设集（Preset）名称。
`/ab/<BitRate>`         | A    |      | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等。 
`/aq/<AudioQuality>`    | A    |      | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用。 
`/ar/<SamplingRate>`    | A    |      | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等。
`/r/<FrameRate>`        |  V   |      | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值。 
`/vb/<VideoBitRate>`    |  V   |      | 视频比特率，单位：比特每秒（bit/s），常用视频比特率：128k，1.25m，5m等。 
`/vcodec/<VideoCodec>`  |  V   |      | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid等。 
`/acodec/<AudioCodec>`  |  V   |      | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等。 
`/scodec/<SubtitleCodec>`|  V  |      | 字幕的编方案，支持方案：mov_text, srt, ass等
`/s/<Resolution>`       |  V   |      | 指定视频分辨率，格式为 wxh 或者预定义值。 
<a id="m3u8-strip-meta"></a>`/stripmeta/<StripMeta>` | A/V   |      | 是否清除文件的metadata，1为清除，0为保留。
<a id="m3u8-rotate"></a>`/rotate/<Degree>` |  V   |      | 指定顺时针旋转的度数，可取值为`90`、`180`、`270`、`auto`，默认为不旋转。

<a id="segtime-preset-list"></a>
### 预设集列表

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
video_1000k     | 码率为1000K，长宽比沿用源视频设置。| WIFI
video_1500k     | 码率为1500K，长宽比沿用源视频设置。| WIFI

<a id="segtime-remarks"></a>
## 附注

- 指定`/preset/<Preset>`参数时，可以同时指定其它参数以覆盖对应预设参数。
- 不指定`/preset/<Preset>`参数时，通过指定其它参数构造自定义切片规格，未指定的参数使用默认值。

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

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="segtime-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"
