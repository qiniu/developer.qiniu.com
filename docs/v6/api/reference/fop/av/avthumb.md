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
### 接口规格（audioSpec）  

```
avthumb/<Format>
       /ab/<BitRate>
       /aq/<AudioQuality>
       /ar/<SamplingRate>
```

参数名称             | 说明                                                                | 必填
:------------------- | :------------------------------------------------------------------ | :-----
`<Format>`           | 目标音频的格式（比如mp3、aac、m4a等），参考[支持转换的音频格式](http://ffmpeg.org/general.html#Audio-Codecs) | 是
`/ab/<BitRate>`      | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等 |
`/aq/<AudioQuality>` | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用 |
`/ar/<SamplingRate>` | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等 |

<a id="audio-request"></a>
### 请求

<a id="audio-request-syntax"></a>
#### 请求语法

```
GET <AudioDownloadURI>?<audioSpec> HTTP/1.1
Host: <AudioDownloadHost>
```

<a id="audio-response"></a>
### 响应

<a id="audio-response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <AudioMimeType>

<AudioBinaryData>
```

<a id="audio-samples"></a>
### 示例

#### 将wav音频转换为mp3格式

```
http://apitest.qiniudn.com/sample.wav?avthumb/mp3
```

[点击收听效果](http://apitest.qiniudn.com/sample.wav?avthumb/mp3)

1. 将wav音频转换为mp3格式，比特率为192k

	```
    http://apitest.qiniudn.com/sample.wav?avthumb/mp3/ab/192k
	```

	[点击收听效果](http://apitest.qiniudn.com/sample.wav?avthumb/mp3/ab/192k)

2. 将wav音频转换为mp3格式，VBR参数为3，采样频率为44100

	```
    http://apitest.qiniudn.com/sample.wav?avthumb/mp3/ar/44100/aq/3
	```

	[点击收听效果](http://apitest.qiniudn.com/sample.wav?avthumb/mp3/ar/44100/aq/3)

<a id="audio-remarks"></a>
### 附注

支持的音频编码器（Codec）有：libmp3lame，libfaac，libvorbis等。  

<a id="audio-optimization"></a>
### 优化建议

为了保证良好的用户体验，请配合上传预转机制使用。参考: [上传预转](#upload-fop)

<a id="video-convert"></a>
## 视频转码

视频转码是七牛云存储提供的云处理功能。  
使用视频转码功能，用户可以对存放在七牛云存储的视频资源进行编码和转换处理。  
视频转码包括两种方式：[视频转换预设集](#video-preset)和[视频自定义转换](#self-def-video-convert)。  

<a id="video-preset"></a>
## 视频转换预设集

<a id="video-preset-description"></a>
### 描述

视频转换预设集是七牛云存储预先设置的一组视频转码设置，适用于特定业务场景。  
用户可以方便地使用这些预设的转码设置，面向特定格式进行转码。  

<a id="video-preset-spec"></a>
### 接口规格（videoPresetSpec）  

```
avthumb/<Preset>
```

预设集列表：  

预设集       | 视频编码器 | 视频格式 | 分辨率   | 视频码率 | 音频编码器 | 音频码率 | 音频采样率
:----------- | :--------- | :------- | :------- | :------- | :--------- | :------- | :---------
android_high | libx264    | mp4      | 480x320  | 700k     | libfaac    | 128k     | 48k
android_low  | libx264    | mp4      | 480x320  | 96k      | libfaac    | 64k      | 48k
android      | libx264    | mp4      | 480x320  | 512k     | libfaac    | 128k     | 48k
flash        | flv        | flv      | 320x240  | 512k     | libmp3lame | 64k      | 44100
ipad_high    | libx264    | mp4      | 1024x768 | 1200k    | libfaac    | 128k     | 48k
ipad_low     | libx264    | mp4      | 1024x768 | 512k     | libfaac    | 128k     | 48k
ipad         | libx264    | mp4      | 1024x768 | 700k     | libfaac    | 128k     | 48k
iphone_high  | libx264    | mp4      | 480x320  | 700k     | libfaac    | 128k     | 48k
iphone_low   | libx264    | mp4      | 480x320  | 96k      | libfaac    | 64k      | 48k
iphone       | libx264    | mp4      | 480x320  | 512k     | libfaac    | 128k     | 48k
webm         | libvpx     | webm     |          | 700k     | libvorbis  | 128k     | 48k

<a id="video-request"></a>
### 请求

<a id="video-request-syntax"></a>
#### 请求语法

```
GET <VideoDownloadURI>?<videoPresetSpec> HTTP/1.1
Host: <VideoDownloadHost>
```

<a id="video-response"></a>
### 响应

<a id="video-response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <VideoMimeType>

<VideoBinaryData>
```

<a id="audio-samples"></a>
### 示例

1. 将mp4视频转换为`iphone`格式：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/iphone
	```

	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/iphone)

2. 将mp4视频格式转换为`andriod-high`格式：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/android_high
	```

	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/android_high)

<a id="video-selfdef-convert"></a>
## 视频自定义转换

<a id="video-preset-description"></a>
### 描述

七牛云存储还支持使用自定义参数进行视频转码。  

<a id="video-selfdef-spec"></a>
### 接口规格（videoSelfDefSpec）  

```
avthumb/<Format>
       /r/<FrameRate>
       /vb/<VideoBitRate>
       /vcodec/<VideoCodec>
       /acodec/<AudioCodec>
       /ab/<BitRate>
       /aq/<AudioQuality>
       /ar/<SamplingRate>
```

参数名称                | 说明                                                                | 必填
:---------------------- | :------------------------------------------------------------------ | :-----
`<Format>`              | 目标视频的格式（比如flv、mp4等），参考[支持转换的视频格式](http://ffmpeg.org/general.html#File-Formats) | 是
`/ab/<BitRate>`         | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等 |
`/aq/<AudioQuality>`    | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用 |
`/ar/<SamplingRate>`    | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等 |
`/r/<FrameRate>`        | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值 |
`/vb/<VideoBitRate>`    | 视频比特率，单位：比特每秒（bit/s），常用视频比特率：128k，1.25m，5m等 |
`/vcodec/<VideoCodec>`  | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid等 |
`/acodec/<AudioCodec>`  | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等 |
`/ss/<SeekStart>`       | 指定视频截取的开始时间，单位：秒。用于视频截取，从一段视频中截取一段视频 |
`/t/<Duration>`         | 指定视频截取的长度，单位：秒。用于视频截取，从一段视频中截取一段视频。 |
`/s/<Resolution>`       | 指定视频分辨率，格式为 wxh 或者预定义值。 |

<a id="video-request"></a>
### 请求

<a id="video-request-syntax"></a>
#### 请求语法

```
GET <VideoDownloadURI>?<videoSelfDefSpec> HTTP/1.1
Host: <VideoDownloadHost>
```

<a id="video-response"></a>
### 响应

<a id="video-response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <VideoMimeType>

<VideoBinaryData>
```

<a id="audio-samples"></a>
### 示例

1. 将mp4视频转换为flv格式，帧率为24，使用x264进行视频编码：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/flv/r/24/vcodec/libx264
	```
	
	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/flv/r/24/vcodec/libx264)

2. 将mp4视频转换为avi格式，使用mp3进行音频编码，且音频比特率为64k：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/avi/ab/64k/acodec/libmp3lame
	```

	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/avi/ab/64k/acodec/libmp3lame)

3. 将mp4视频转换为flv格式，帧率为30，视频比特率为256k，使用x264进行视频编码，音频采样频率为22050，音频比特率为64k，使用mp3进行音频编码：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/flv
                                                      /r/30
                                                      /vb/256k
                                                      /vcodec/libx264
                                                      /ar/22050
                                                      /ab/64k
                                                      /acodec/libmp3lame
	```

	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/flv/r/30/vb/256k/vcodec/libx264/ar/22050/ab/64k/acodec/libmp3lame)

4. 将mp4视频转换为ogv格式，帧率为30，视频比特率为1800k，使用libtheora进行视频编码，音频采样频率为44100，音频比特率为128k，使用libvorbis进行音频编码：  

	```
    http://open.qiniudn.com/thinking-in-go.mp4?avthumb/ogv
                                                      /r/30
                                                      /vb/1800k
                                                      /vcodec/libtheora
                                                      /ar/44100
                                                      /ab/128k
                                                      /acodec/libvorbis
	```

	[点击观看效果](http://open.qiniudn.com/thinking-in-go.mp4?avthumb/ogv/r/30/vb/1800k/vcodec/libtheora/ar/44100/ab/128k/acodec/libvorbis)

<a id="audio-remarks"></a>
### 附注

支持的视频编码器（Codec）有：libx264，libvpx，libtheora，libxvid等。
支持的音频编码器（Codec）有：libmp3lame，libfaac，libvorbis等。  

<a id="audio-optimization"></a>
### 优化建议

为了保证良好的用户体验，请配合上传预转机制使用。参考: [上传预转](#upload-fop)
