---
title: 音视频切片（segtime）
order: 148
---

<a id="segtime"></a>
# 音视频切片（segtime）

<a id="audio-preset-description"></a>
### 描述

音视频切片是七牛云存储提供的云处理功能，用于支持HTTP Live Streaming回放。  
HTTP Live Streaming是由Apple提出的基于HTTP的流媒体传输协议。  
它将一整个音视频流切割成可由HTTP下载的一个个小的音视频流，并生成一个播放列表（M3U8），客户端只需要获取资源的 M3U8 播放列表即可播放音视频。  
以下用 HLS 代指 HTTP Live Streaming 。

HLS API规格支持两种形式：预设集和自定义两种。  

<a id="segtime-preset"></a>
### 切片预设集接口规格（presetSpec）  

```
avthumb/m3u8/segtime/<SegSeconds>/preset/<Preset>
```

参数名称                | 说明                                         | 必填
:---------------------- | :------------------------------------------- | :-----
`/segtime/<SegSeconds>` | 用于自定义每一小段音/视频流的播放时长，单位：秒，取值范围10-60秒，缺省值为10秒。若不指定该参数，整个`segtime/<SegSeconds>`部分都不必在API接口中设置 |
`/preset/<Preset>`      | 预设集（Preset）名称                         | 是

音频预设集：  

预设集    | 说明
:-------- | :--------------
audio_32k | 码率为32k的音频
audio_48k | 码率为48k的音频
audio_64k | 码率为64k的音频

视频预设集：  

预设集          | 说明
:-------------- | :-----------------------------------------------
video_16x9_150k | 码率为150K，长宽比为16x9，推荐在 3G 环境下使用
video_16x9_240k | 码率为240K，长宽比为16x9，推荐在 3G 环境下使用
video_16x9_440k | 码率为440K，长宽比为16x9，推荐在 WIFI 环境下使用
video_16x9_640k | 码率为640K，长宽比为16x9，推荐在 WIFI 环境下使用
video_4x3_150k  | 码率为150K，长宽比为4x3，推荐在 3G 环境下使用
video_4x3_240k  | 码率为240K，长宽比为4x3，推荐在 3G 环境下使用
video_4x3_440k  | 码率为440K，长宽比为4x3，推荐在 WIFI 环境下使用
video_4x3_640k  | 码率为640K，长宽比为4x3，推荐在 WIFI 环境下使用

<a id="segtime-preset-request"></a>
### 请求

<a id="segtime-preset-request-syntax"></a>
#### 请求语法

```
GET <DownloadURI>?<presetSpec> HTTP/1.1
Host: <DownloadHost>
```

<a id="segtime-preset-response"></a>
### 响应

<a id="segtime-preset-response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <MimeType>

<BinaryData>
```

<a id="segtime-selfdef"></a>
### 自定义切片接口规格（selfDefSpec）  

```
avthumb/m3u8/segtime/<SegSeconds>
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
`/segtime/<SegSeconds>` | 用于自定义每一小段音/视频流的播放时长，单位：秒，取值范围10-60秒，缺省值为10秒。若不指定该参数，整个`segtime/<SegSeconds>`部分都不必在API接口中设置 |
`/ab/<BitRate>`         | 静态码率（CBR），单位：比特每秒（bit/s），常用码率：64k，128k，192k，256k，320k等 |
`/aq/<AudioQuality>`    | 动态码率（VBR），取值范围为0-9，值越小码率越高。不能与上述静态码率参数共用 |
`/ar/<SamplingRate>`    | 音频采样频率，单位：赫兹（Hz），常用采样频率：8000，12050，22050，44100等 |
`/r/<FrameRate>`        | 视频帧率，每秒显示的帧数，单位：赫兹（Hz），常用帧率：24，25，30等，一般用默认值 |
`/vb/<VideoBitRate>`    | 视频比特率，单位：比特每秒（bit/s），常用视频比特率：128k，1.25m，5m等 |
`/vcodec/<VideoCodec>`  | 视频编码方案，支持方案：libx264，libvpx，libtheora，libxvid等 |
`/acodec/<AudioCodec>`  | 音频编码方案，支持方案：libmp3lame，libfaac，libvorbis等 |
`/segtime/<SegSeconds>` | 用于HLS自定义每一小段音/视频流的播放时长，取值范围为: 10-60秒，缺省为10秒 |

注意：以上参数若不指定参数值，参数及其值都不必在API接口中设置。  

<a id="segtime-selfdef-request"></a>
### 请求

<a id="segtime-selfdef-request-syntax"></a>
#### 请求语法

```
GET <DownloadURI>?<selfDefSpec> HTTP/1.1
Host: <DownloadHost>
```

<a id="segtime-selfdef-response"></a>
### 响应

<a id="segtime-selfdef-response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <MimeType>

<BinaryData>
```

<a id="segtime-alias"></a>
### 别名

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

<a id="upload-fop"></a>
### 上传预转

由于在线音视频频转换或将音视频切割成多个小文件并生成M3U8播放列表是一个相对耗时的操作，为了保证良好的用户体验，需要配合上传预转机制使用。实际上，七牛官方推荐音视频在线编解码都通过上传预转的方式进行。  

上传预转参考文档：[音视频上传预转 - persistentOps](../../security/put-policy.html#put-policy-struct)  

接上述示例，已知`m3u8_audio`的API规格定义，将其作为上传授权凭证（`uploadToken`）预转参数（`asyncOps`）的值即可。

```
asyncOps = "http://example.qiniudn.com/$(key)?avthumb/m3u8/preset/audio_32k"
```

可以设置多个预转指令，用分号“;”隔开即可:

```
asyncOps = "http://example.qiniudn.com/$(key)?avthumb/m3u8/preset/audio_32k;
           http://example.qiniudn.com/$(key)?avthumb/m3u8/preset/audio_48k"
```

实际情况下，`example.qiniudn.com` 换成存储空间（bucket）绑定的域名即可。  
同样，视频预转的操作方式也一样。  
设置预转后，当文件上传完毕即可异步执行预转指令操作。第一次访问该资源时，就无需再转换了，访问到的即已经转换好的资源。  
