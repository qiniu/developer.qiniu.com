---
layout: docs
title: 音视频元信息
order: 147
---

<a id="avinfo"></a>
# 音视频元信息（avinfo）

<a id="avinfo-description"></a>
## 描述

本接口用于获取指定音视频资源的元信息。  

<a id="avinfo-request"></a>
## 请求

<a id="avinfo-request-syntax"></a>
### 请求语法

```
GET <AvDownloadURI>?avinfo HTTP/1.1
Host: <AvDownloadHost>
```
**注意：**当您下载私有空间的资源时，`AvDownloadURI`的生成方法请参考七牛的[下载凭证][download-tokenHref]。

**示例：**
资源为`http://developer.qiniu.com/resource/thinking-in-go.mp4`，处理样式为`avinfo`。

```
#构造下载URL

DownloadUrl = 'http://developer.qiniu.com/resource/thinking-in-go.mp4?avinfo'
……

#最后得到

RealDownloadUrl = 'http://developer.qiniu.com/resource/thinking-in-go.mp4?avinfo&e=×××&token=MY_ACCESS_KEY:×××'
```

<a id="avinfo-response"></a>
## 响应

<a id="avinfo-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json

<AvMetadataInfo>
```

<a id="avinfo-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "streams": [
        {
            "index": 0,
            "codec_name": "h264",
            "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
            "codec_type": "video",
            "codec_time_base": "1/30",
            "codec_tag_string": "avc1",
            "codec_tag": "0x31637661",
            "width": 1152,
            "height": 864,
            ...
        },
        {
            "index": 1,
            "codec_name": "aac",
            "codec_long_name": "Advanced Audio Coding",
            "codec_type": "audio",
            "codec_time_base": "1/44100",
            "codec_tag_string": "mp4a",
            "codec_tag": "0x6134706d",
            ...
        }
    ],
    "format": {
        "filename": "/disk1/fopd_tmpdir/avinfo184020568",
        "nb_streams": 2,
        "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
        "format_long_name": "QuickTime/MPEG-4/Motion JPEG 2000 format",
        "start_time": "0.000000",
        "duration": "6413.359589",
        ...
    }
}
```

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#avinfo-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="avinfo-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 获取成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="avinfo-samples"></a>
## 示例

```
http://developer.qiniu.com/resource/thinking-in-go.mp4?avinfo
```

将返回如下元信息（已经经过格式化，以便阅读）：

```
{
    "streams": [
        {
            "index": 0,
            "codec_name": "h264",
            "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
            "codec_type": "video",
            "codec_time_base": "1/30",
            "codec_tag_string": "avc1",
            "codec_tag": "0x31637661",
            "width": 1152,
            "height": 864,
            "has_b_frames": 0,
            "sample_aspect_ratio": "1:1",
            "display_aspect_ratio": "4:3",
            "pix_fmt": "yuv420p",
            "level": 40,
            "is_avc": "1",
            "nal_length_size": "4",
            "r_frame_rate": "15/1",
            "avg_frame_rate": "15/1",
            "time_base": "1/15000",
            "start_time": "0.000000",
            "duration": "6413.333333",
            "nb_frames": "96200",
            "tags": {
                "creation_time": "2013-01-07 12:58:08",
                "language": "eng",
                "handler_name": "Video Media Handler"
            }
        },
        {
            "index": 1,
            "codec_name": "aac",
            "codec_long_name": "Advanced Audio Coding",
            "codec_type": "audio",
            "codec_time_base": "1/44100",
            "codec_tag_string": "mp4a",
            "codec_tag": "0x6134706d",
            "sample_fmt": "s16",
            "sample_rate": "44100",
            "channels": 2,
            "bits_per_sample": 0,
            "r_frame_rate": "0/0",
            "avg_frame_rate": "0/0",
            "time_base": "1/44100",
            "start_time": "0.000000",
            "duration": "6413.374694",
            "nb_frames": "276201",
            "tags": {
                "creation_time": "2013-01-07 12:58:08",
                "language": "eng",
                "handler_name": "Sound Media Handler"
            }
        }
    ],
    "format": {
        "filename": "/disk1/fopd_tmpdir/avinfo184020568",
        "nb_streams": 2,
        "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
        "format_long_name": "QuickTime/MPEG-4/Motion JPEG 2000 format",
        "start_time": "0.000000",
        "duration": "6413.359589",
        "size": "101416337",
        "bit_rate": "126506",
        "tags": {
            "major_brand": "mp42",
            "minor_version": "1",
            "compatible_brands": "M4V mp42isom",
            "creation_time": "2013-01-07 12:58:08"
        }
    }
}
```

[点击查看示例结果](http://developer.qiniu.com/resource/thinking-in-go.mp4?avinfo)

<a id="avinfo-remarks"></a>
## 附注

无。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[download-tokenHref]: http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html  "下载凭证"