---
title: 音视频切片（segtime）
order: 148
---

<a id="segtime"></a>
# 音视频切片（segtime）

<a id="segtime-description"></a>
## 描述

音视频切片是七牛云存储提供的云处理功能，用于支持HTTP Live Streaming播放。  
[HTTP Live Streaming](https://developer.apple.com/streaming/)是由Apple提出的基于HTTP的流媒体传输协议。  
它将一整个音视频流切割成可由HTTP下载的一个个小的音视频流，并生成一个播放列表（M3U8），客户端只需要获取资源的 M3U8 播放列表即可播放音视频。  
以下用 HLS 代指 HTTP Live Streaming 。

## 使用
使用上可以使用我们预先定义的预设集或者自己选择需要的参数，如：
```
预设集：avthumb/m3u8/segtime/10/preset/audio_32k
自定义：avthumb/m3u8/vb/500k/t/10
```

预设集参见[hls预设集](#segtime-preset)  
命令的调用可以使用上传时指定[persistentOps](../reference/security/put-policy.html)或者调用[pfop](../reference/fop/pfop/pfop.html)命令

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
            /hlsKey/<HLSKey>
            /hlsKeyType/<HLSKeyType>
            /hlsKeyUrl/<HLSKeyUrl>
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
`/hlsKey/<HLSKey>`      |  A/V |      | AES128加密视频的秘钥，必须是16个字节
`/hlsKeyType/<HLSKeyType>` | A/V|     | 秘钥传递给我们的方式，0或不填：<urlsafe_base64_encode>, 1.x(1.0, 1.1, ...): 见下面详细解释
`/hlsKeyUrl/<HLSKeyUrl>` |  A/V |     | 秘钥的访问url

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
video_16x9_150k | 码率为150K，长宽比为16x9。分辨率400x224 | 3G
video_16x9_240k | 码率为240K，长宽比为16x9。分辨率400x224 | 3G
video_16x9_440k | 码率为440K，长宽比为16x9。分辨率400x224 | WIFI
video_16x9_640k | 码率为640K，长宽比为16x9。分辨率400x224 | WIFI
video_4x3_150k  | 码率为150K，长宽比为4x3。分辨率400x300  | 3G
video_4x3_240k  | 码率为240K，长宽比为4x3。分辨率400x300  | 3G
video_4x3_440k  | 码率为440K，长宽比为4x3。分辨率400x300  | WIFI
video_4x3_640k  | 码率为640K，长宽比为4x3。分辨率400x300  | WIFI
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

### hls加密

hls加密是利用AES-128位对每个ts文件进行加密，播放器在取得PlayList文件的时候，会根据里面的`#EXT-X-KEY`标签请求获得解密的URL，再请求解密秘钥，之后会用秘钥对获取的ts文件解密。用户可以对秘钥的URL做cookie验证等方法来对用户做认证。  
例子：[PlayList文件](http://ztest.qiniudn.com/Fr88-3sZu8HqPFot_BapyYtuz3k%3D%2FFgCBc3IlydY6CFIA8jhe7jIxCt1y) （复制链接，查看文件内容或直接用vlc播放器播放）

参数解释：

`hlsKey`  base64_urlsafe编码或加密过后的秘钥  
`hlsKeyUrl` 指定了秘钥放置的url，经过base64_urlsafe编码，这是生成m3u8 PlayList会使用到的  
`hlsKeyType` 指定了传送秘钥的方式  
 - 不指定或者指定为0，则仅仅是以base64_urlsafe编码的方式传送
 - 指定为1.x(1.0, 1.1, ...)，以RSA的OAEP加密方式，再以<urlsafe_base64_encode>编码传送秘钥，x表示秘钥的版本
 - 公钥：[1.0](http://ztest.qiniudn.com/hls_rsa1.0.pub)

如何加密RSA：

可以编程的方法，或者使用`openssl`，下面提供`openssl`的版本：
```
$ echo -n [AES128KEY] | openssl rsautl -encrypt -oaep -inkey [QINIU_PUB_KEY_FILE] -pubin | openssl base64 -A | tr "+/" "-_"
```

例子：

- 不使用rsa加密： `avthumb/m3u8/preset/video_640k/hlsKey/ZXhhbXBsZWtleTEyMzQ1Ng==/hlsKeyUrl/aHR0cDovL3p0ZXN0LnFpbml1ZG4uY29tL2NyeXB0MC5rZXk=`
- 使用rsa加密： `avthumb/m3u8/preset/video_640k/hlsKey/SyyishA7ompSehjBHsq9EkBpbw6RfPnl49FOyMPoQZa4uxFlyHUCLxmXQ56F5WIteknZWahbqcdNx06pGBNk1zVBm5K6czZ_nCdy7y6PBon7NSUamoUPIGGBuevXOcyuc-4IpkmkcG3MWz7_Lop8zk98k8IVmKYCD_LMv-C_8D0=/hlsKeyType/1.0/hlsKeyUrl/aHR0cDovL3p0ZXN0LnFpbml1ZG4uY29tL2NyeXB0MC5rZXk=`
 
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"
