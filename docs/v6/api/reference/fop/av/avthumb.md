---
layout: docs
title: 音视频处理
order: 150
---

<a id="avthumb"></a>
# 音视频处理（avthumb）

- [描述](#avthumb-description)
- [接口规格](#avthumb-specification)
- [示例](#avthumb-samples)
- [附注](#avthumb-remarks)
- [内部参考资源](#avthumb-internal-resources)


<a id="avthumb-description"></a>
## 描述

音视频处理是七牛云存储提供的云处理功能，方便用户对音视频资源进行编码和格式转换。  

<a id="avthumb-specification"></a>
## 接口规格

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
avthumb/<Format>
       /ab/<BitRate>
       /aq/<AudioQuality>
       /ar/<SamplingRate>
       /r/<FrameRate>
       /vb/<VideoBitRate>
       /vcodec/<VideoCodec>
       /acodec/<AudioCodec>
       /scodec/<SubtitleCodec>
       /subtitle/<SubtitleURL>
       /ss/<SeekStart>
       /t/<Duration>
       /s/<Resolution>
       /autoscale/<Autoscale>
       /aspect/<Aspect>
       /stripmeta/<StripMeta>
       /rotate/<Degree>
       /wmImage/<EncodedRemoteImageUrl>
       /wmGravity/<Gravity>
       /wmText/<text>
       /wmGravityText/<gravity_text>
       /wmFont/<font>
       /wmFontColor<fontcolor>
       /wmFontSize<fontsize>
       /writeXing/<Xing>
       /an/<AudioNo>
       /vn/<VideoNo>       
```

参数名称                | 类别 | 必填 | 说明
:---------------------- | :--- | :--- | :---------------------------------------------------------------
`<Format>`              | A/V  | 是   | 目标视频的格式（比如flv、mp4等），参考[支持转换的视频格式](http://ffmpeg.org/general.html#File-Formats)
`/ab/<BitRate>`         | A    |      | 音频码率，单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等。若指定码率大于原音频码率，则使用原音频码率进行转码。 
`/aq/<AudioQuality>`    | A    |      | 音频质量，取值范围为0-9（mp3），10-500（aac），仅支持mp3和aac，值越小越高。不能与上述码率参数共用。 
`/ar/<SamplingRate>`    | A    |      | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等。
`/r/<FrameRate>`        |  V   |      | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值。 
`/vb/<VideoBitRate>`    |  V   |      | 视频码率，单位：比特每秒（bit/s），常用视频码率：128k，1.25m，5m等。若指定码率大于原视频码率，则使用原视频码率进行转码。 
`/vcodec/<VideoCodec>`  |  V   |      | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid，libvpx-vp9等。 
`/acodec/<AudioCodec>`  |  A   |      | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等。 
`/scodec/<SubtitleCodec>`|  V  |      | 字幕编码方案，支持方案：mov_text。该参数仅用于修改带字幕视频的字幕编码。
`/subtitle/<SubtitleURL>`| V |    | 添加字幕，支持：srt格式字幕（uft-8编码）、带有字幕的mkv文件、embed（将原视频的字幕流嵌入目标视频）。基于base64编码。
`/ss/<SeekStart>`       |  A/V   |      | 指定视频截取的开始时间，单位：秒。用于视频截取，从一段视频中截取一段视频。 
`/t/<Duration>`         |  V   |      | 指定视频截取的长度，单位：秒。用于视频截取，从一段视频中截取一段视频。 
`/s/<Resolution>`       |  V   |      | 指定视频分辨率，格式为`<width>x<height>`或者预定义值。 
`/autoscale/<Autoscale>`|  V   |      | 配合参数`/s/`使用，指定为1时，把视频按原始比例缩放到`/s/`指定的矩形框内，0或者不指定会强制缩放到对应分辨率，可能造成视频变形
`/aspect/<Aspect>`      |   V  |      | 该参数为视频在播放器中显示的宽高比，格式为格式为`<width>:<height>`，譬如取值为`3:4`，表示视频在播放器中播放是`宽:高=3:4`。
<a id="video-strip-meta"></a><a id="avthumb-strip-meta"></a>`/stripmeta/<StripMeta>` | A/V   |      | 是否清除文件的metadata，1为清除，0为保留。
<a id="video-rotate"></a><a id="avthumb-rotate"></a>`/rotate/<Degree>` |  V   |      | 指定顺时针旋转的度数，可取值为`90`、`180`、`270`、`auto`，默认为不旋转。
`/wmImage/<EncodedRemoteImageUrl>`| V | | 水印图片的源路径，目前仅支持远程路径，需要经过`urlsafe_base64_encode`。水印具体介绍见[视频水印](http://developer.qiniu.com/docs/v6/api/reference/fop/av/video-watermark.html)
`/wmGravity/<Gravity>`  |  V   |      | 视频图片水印位置，存在`/wmImage/`时生效。
`/wmText/<EncodedText>`        |  V   |      | 水印文本内容,需要经过`urlsafe_base64_encode`。
`/wmGravityText/<GravityText>` |   V  |      |  文本位置（默认NorthEast）
`/wmFont/<Font>`        |  V   |      | 文本字体，需要经过`urlsafe_base64_encode`，默认为黑体,注意：中文水印必须指定中文字体。
`/wmFontColor/<FontColor>` |  V   |     | 水印文字颜色，RGB格式，可以是颜色名称（比如red）或十六进制（比如#FF0000），参考RGB颜色编码表，默认为黑色
`/wmFontSize<FontSize>`    |  V   |     | 水印文字大小，单位: 缇，等于1/20磅，默认值0（默认大小）
<a id="mp3-xing">`/writeXing/<Xing>`     | A    |      | 转码成mp3时是否写入xing header，默认1写入，写入会导致 `file`，`afinfo` 等命令识别出错误的码率。好处是在需要音频时长、帧数的时候只需要获取header。
<a id="an">`/an/<AudioNo>`     | A    |      | 是否去除音频流，0为保留，1为去除。<br>默认值为0。
<a id="vn">`/vn/<VideoNo>`     |  V   |      | 是否去除视频流，0为保留，1为去除。<br>默认值为0。

**注意**

转码操作若未指定音视频码率，转码结果的码率会小于等于原音视频码率，若指定码率大于原音视频码率，转码操作会使用原视频码率进行转码。

<a id="avthumb-samples"></a>
## 示例

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

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

4. 以[预转持久化][persistentOpsHref]形式，将mp4视频转换为flv格式，帧率为24，使用x264进行视频编码：  

	```
    {
        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/flv/r/24/vcodec/libx264",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```
	
5. 以预转持久化形式，将mp4视频转换为avi格式，使用mp3进行音频编码，且音频比特率为64k：  

	```
    {
        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
        "deadline":             1390528576,
        "persistentOps":        "avthumb/avi/ab/64k/acodec/libmp3lame",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

6. 以[触发持久化处理][pfopHref]形式，将mp4视频转换为flv格式，帧率为30，视频比特率为256k，使用x264进行视频编码，音频采样频率为22050，音频比特率为64k，使用mp3进行音频编码：  

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

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

7. 以触发持久化处理形式，将mp4视频转换为ogv格式，帧率为30，视频比特率为1800k，使用libtheora进行视频编码，音频采样频率为44100，音频比特率为128k，使用libvorbis进行音频编码：  

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

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="avthumb-remarks"></a>
## 附注

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

[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification                   "持久化处理结果通知"
