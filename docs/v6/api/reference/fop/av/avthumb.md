---
layout: docs
title: 音视频处理（avthumb）
order: 150
---

<a id="avthumb"></a>
# 音视频处理（avthumb）

<a id="audio-convert"></a>
## 音频转换

<a id="audio-preset-description"></a>
### 描述

音频转码是七牛云存储提供的云处理功能。  
使用音频转码功能，用户可以对存放在七牛云存储的音频资源进行编码和转换处理。  

<a id="audio-spec"></a>
### 接口规格

```
audioSpec = "avthumb/<Format>
                    /ab/<BitRate>
                    /aq/<AudioQuality>
                    /ar/<SamplingRate>"
```

参数名称             | 必填 | 说明
:------------------- | :--- | :---------------------------------------------------------------
`<Format>`           | 是   | 目标音频的格式（比如mp3、aac、m4a等），参考[支持转换的音频格式](http://ffmpeg.org/general.html#Audio-Codecs)。
`/ab/<BitRate>`      |      | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等。
`/aq/<AudioQuality>` |      | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用。
`/ar/<SamplingRate>` |      | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等。
<a id="audio-strip-meta"></a>`/stripmeta/<StripMeta>` |     | 是否清除文件的metadata，1为清除，0为保留。

<a id="audio-samples"></a>
### 示例

1. 以[预转持久化][persistentOpsHref]形式，将wav音频转换为mp3格式：

	```
    {
        "scope":                "qiniu-ts-demo:sample.wav",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/mp3",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

2. 以预转持久化形式，将wav音频转换为mp3格式，比特率为192k：

	```
    {
        "scope":                "qiniu-ts-demo:sample.wav",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/mp3/ab/192k",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

3. 以[触发持久化处理][pfopHref]形式，将wav音频转换为mp3格式，VBR参数为3，采样频率为44100：

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo&key=sample.wav&fops=avthumb%2Fmp3%2Far%2F44100%2Faq%2F3&notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="audio-remarks"></a>
### 附注

支持的音频编码器（Codec）有：libmp3lame，libfaac，libvorbis等。  

---

<a id="video-convert"></a>
## 视频转码

<a id="video-preset-description"></a>
### 描述

视频转码是七牛云存储提供的云处理功能。  
使用视频转码功能，用户可以对存放在七牛云存储的视频资源进行编码和转换处理。  

<a id="video-selfdef-spec"></a>
### 接口规格

```
videoSelfDefSpec = "avthumb/<Format>
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
                           /rotate/<Degree>"
```

参数名称                | 必填 | 说明
:---------------------- | :--- | :---------------------------------------------------------------
`<Format>`              | 是   | 目标视频的格式（比如flv、mp4等），参考[支持转换的视频格式](http://ffmpeg.org/general.html#File-Formats)
`/ab/<BitRate>`         |      | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等。 
`/aq/<AudioQuality>`    |      | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用。 
`/ar/<SamplingRate>`    |      | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等。
`/r/<FrameRate>`        |      | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值。 
`/vb/<VideoBitRate>`    |      | 视频比特率，单位：比特每秒（bit/s），常用视频比特率：128k，1.25m，5m等。 
`/vcodec/<VideoCodec>`  |      | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid等。 
`/acodec/<AudioCodec>`  |      | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等。 
`/scodec/<SubtitleCodec>`|     | 字幕的编方案，支持方案：mov_text, srt, ass等
`/ss/<SeekStart>`       |      | 指定视频截取的开始时间，单位：秒。用于视频截取，从一段视频中截取一段视频。 
`/t/<Duration>`         |      | 指定视频截取的长度，单位：秒。用于视频截取，从一段视频中截取一段视频。 
`/s/<Resolution>`       |      | 指定视频分辨率，格式为 wxh 或者预定义值。 
<a id="video-strip-meta"></a>`/stripmeta/<StripMeta>` |      | 是否清除文件的metadata，1为清除，0为保留。
<a id="video-rotate"></a>`/rotate/<Degree>` |      | 指定顺时针旋转的度数，可取值为`90`、`180`、`270`、`auto`，默认为不旋转。

<a id="video-samples"></a>
### 示例

1. 以[预转持久化][persistentOpsHref]形式，将mp4视频转换为flv格式，帧率为24，使用x264进行视频编码：  

	```
    {
        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/flv/r/24/vcodec/libx264",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```
	
2. 以预转持久化形式，将mp4视频转换为avi格式，使用mp3进行音频编码，且音频比特率为64k：  

	```
    {
        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/avi/ab/64k/acodec/libmp3lame",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

3. 以[触发持久化处理][pfopHref]形式，将mp4视频转换为flv格式，帧率为30，视频比特率为256k，使用x264进行视频编码，音频采样频率为22050，音频比特率为64k，使用mp3进行音频编码：  

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo
    &key=thinking-in-go.mp4
    &fops=avthumb%2Fflv%2Fr%2F30%2Fvb%2F256k%2Fvcodec%2Flibx264%2Far%2F22050%2Fab%2F64k%2Facodec%2Flibmp3lame
    &notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

4. 以触发持久化处理形式，将mp4视频转换为ogv格式，帧率为30，视频比特率为1800k，使用libtheora进行视频编码，音频采样频率为44100，音频比特率为128k，使用libvorbis进行音频编码：  

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo
    &key=thinking-in-go.mp4
    &fops=avthumb%2Fogv%2Fr%2F30%2Fvb%2F1800k%2Fvcodec%2Flibtheora%2Far%2F44100%2Fab%2F128k%2Facodec%2Flibvorbis
    &notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="avthumb-remarks"></a>
### 附注

- 支持的视频编码器（Codec）有：libx264，libvpx，libtheora，libxvid等。
- 支持的音频编码器（Codec）有：libmp3lame，libfaac，libvorbis等。  
- 我们为一些预设集设置了默认参数，如果用户觉得某些参数不适合自己的业务场景可以在后面加参数覆盖。
 - 如： `avthumb/mp3/ab/64k` 会把默认码率128k调整为64k

默认参数列表：  

格式         | 视频编码器 | 视频码率 | 音频编码器 | 音频码率 | 音频采样率
:----------- | :--------- | :------- | :--------- | :------- | :---------
flash        | flv        | 512k     | libmp3lame | 64k      | 44100
webm         | libvpx     | 700k     | libvorbis  | 128k     | 48k
mp3          | -          | -        | libmp3lame | 128k     | 44100
amr          | -          | -        | amr_nb     | 12.20k   | 8000

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"
