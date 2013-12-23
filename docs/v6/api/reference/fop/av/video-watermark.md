---
layout: docs
title: 视频水印（vwatermark）
order: 139
---
<a id="vwatermark"></a>
# 视频水印（vwatermark）

<a id="vwatermark-spec"></a>
## 视频水印规格（vwatermarkSpec）

```
vwatermark/<Mode>  
          /image/<EncodedRemoteImageUrl>  
          /gravity/<Gravity>  
          /format/<OutputFormat>  
```

参数名称                   | 说明                                  | 必填
:------------------------- | :------------------------------------ | :---
`<Mode>`                   | 固定为1，表示`图片水印`               | 是
`<EncodedRemoteImageUrl>`  | 水印的源路径，目前仅支持远程路径，需要经过`urlsafe_base64_encode` | 是   
`<Gravity>`                | 打水印的位置，目前支持`NorthWest`，`North`，`NorthEast`，<p>`West`，`Center`，`East`，<p>`SouthWest`，`South`，`SouthEast`。<p>缺省值为`NorthEast` |
`<OutputFormat>`           | 指定目标视频的输出格式，取值范围：mp4，flv等。缺省值为`mp4` |

<a id="video-request"></a>
## 请求

<a id="video-request-syntax"></a>
### 请求语法

```
GET <VideoDownloadURI>?<vwatermarkSpec> HTTP/1.1
Host: <VideoDownloadHost>
```

<a id="video-response"></a>
## 响应

<a id="video-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <VideoMimeType>

<VideoBinaryData>
```

<a id="vwatermark-samples"></a>
## 示例

```
http://api-demo.qiniudn.com/test.mov?vwatermark/1
    /image/aHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc=
    /gravity/NorthEast
    /format/mp4
```

[点击观看效果](http://api-demo.qiniudn.com/test.mov?vwatermark/1/image/aHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc=/gravity/NorthEast/format/mp4)

该请求为视频文件`http://api-demo.qiniudn.com/test.mov`打上水印`http://testunit.qiniudn.com/qiniulogo.png`, 水印的位置是右上角，输出格式为`mp4`。  
