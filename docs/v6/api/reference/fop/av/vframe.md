---
title: 视频截图（vframe）
order: 149
---

<a id="video-thumbnail"></a>
# 视频帧缩略图

<a id="description"></a>
## 描述

从视频流中截取指定时刻的单帧画面并按指定大小缩放成图片。  

<a id="specification"></a>
## 接口规格（vframeSpec）  

```
vframe/<Format>
      /offset/<Second>
      /w/<Width>
      /h/<Height>
```

参数名称           | 说明                                                                | 必填
:----------------- | :------------------------------------------------------------------ | :-----
`<Format>`         | 输出的目标截图格式，支持jpg、png等                                  | 是
`/offset/<Second>` | 指定截取视频的时刻，单位：秒                                        | 是
`/w/<Width>`       | 缩略图宽度，单位：像素（px），取值范围为1-1920                      | 是
`/h/<Height>`      | 缩略图高度，单位：像素（px），取值范围为1-1080                      | 是

<a id="request"></a>
## 请求

<a id="request-syntax"></a>
### 请求语法

```
GET <VideoDownloadURI>?<vframeSpec> HTTP/1.1
Host: <VideoDownloadHost>
```

<a id="response"></a>
## 响应

<a id="response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <ImageMimeType>

<ImageBinaryData>
```

如果请求失败，具体信息请参考响应状态码。

<a id="response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 截图并缩放成功
400	       | 请求语法错误
404        | 资源不存在
TODO       | 未支持的图片格式
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="remarks"></a>
## 附注

无。

<a id="samples"></a>
## 示例

1. 取视频第7秒的截图，图片格式为jpg，宽度为480px，高度为360px：

	```
    http://open.qiniudn.com/thinking-in-go.mp4?vframe/jpg
                                                     /offset/7
                                                     /w/480
                                                     /h/360
	```

	![Go——基于连接与组合的语言](http://open.qiniudn.com/thinking-in-go.mp4?vframe/jpg/offset/7/w/480/h/360)

[thumbnailHref]:                ../../list/thumbnail.html                       "缩略图文档列表"
[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
