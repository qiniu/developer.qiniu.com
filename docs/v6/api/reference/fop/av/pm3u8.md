---
layout: docs
title: 私有M3U8
order: 143
---

<a id="pm3u8"></a>
# 私有M3U8（pm3u8）

<a id="pm3u8-description"></a>
## 描述

pm3u8 接口只能用于私有空间中的 m3u8 文件，作用是对 m3u8文件中的 ts 资源进行批量下载授权。
通过将ts资源的url改写成私有url，以临时获取访问权限。  

<a id="pm3u8-specification"></a>

```
[GET]pm3u8/<Mode>
         /expires/<Expires>
        /deadline/<Deadline>
 ```

参数名称             | 必填 | 说明
:------------------- | :--- | :--------------------------------------------------------
`/<Mode>`            | 是   | 处理模式，只有一个值0。<br>0表示对所有ts资源的url进行下载授权。
`/expires/<Expires>` |    | 私有ts资源url下载凭证的相对有效期，单位秒。<br>推荐43200秒（12小时）。
`/deadline/<Deadline>`            |    | 私有ts资源url下载凭证的绝对有效期，单位秒。<br>此参数填写后，expires失效。

<a id="pm3u8-request"></a>
## 请求

<a id="pm3u8-request-syntax"></a>
### 请求语法

```
GET <M3U8DownloadURI>?<接口规格> HTTP/1.1
Host: <M3U8DownloadHost>
```

<a id="pm3u8-response"></a>
## 响应

<a id="pm3u8-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/x-mpegURL

<M3U8TextData>
```

<a id="pm3u8-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 授权成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="pm3u8-response-body"></a>
### 响应内容

■ 如果请求成功，返回新的、包含已颁发下载授权凭证的各个ts资源访问URL的m3u8文件：

```
...过多内容已省略...
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00000_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:qhXZvVauNafcUMoBeo4SkRWaWiw
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00001_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:h1Oy8oW7oAIOGWZP8QNVAPI82Vw
...过多内容已省略...
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
`code`       | 是   | HTTP状态码，请参考[响应状态](#pm3u8-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="pm3u8-samples"></a>
## 示例

原始m3u8链接与内容如下所示：  

```
http://developer.qiniu.com/samples/fop/av/live_net.m3u8

#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-ALLOW-CACHE:YES
#EXT-X-TARGETDURATION:31
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00000_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00001_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00002_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00003_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00004_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00005_.ts
#EXTINF:30.827000,
http://developer.qiniu.com/samples/fop/av/live_00006_.ts
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00007_.ts
#EXTINF:30.827000,
http://developer.qiniu.com/samples/fop/av/live_00008_.ts
#EXTINF:25.149000,
http://developer.qiniu.com/samples/fop/av/live_00009_.ts
#EXT-X-ENDLIST
```

对m3u8资源进行私有资源下载授权时指定`pm3u8`接口，可以获取到相应的批量授权下载URL：  

```
http://developer.qiniu.com/samples/fop/av/live_net.m3u8?pm3u8/0&e=1388734117&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:sKjXkO59AxPtdaO2cEtWtiHmzdo=

#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-ALLOW-CACHE:YES
#EXT-X-TARGETDURATION:31
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00000_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:qhXZvVauNafcUMoBeo4SkRWaWiw
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00001_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:h1Oy8oW7oAIOGWZP8QNVAPI82Vw
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00002_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:OQ6GMLEjFRnCAne9K9YU8-tXeIg
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00003_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:XWdLiYgUxNZbqikNLQ3joG3Mvhk
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00004_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:3EKOMwcqSUWsdap3SaY4l3RoaCg
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00005_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:j4uORlTKDBHk4Xwkv90eCM3I87U
#EXTINF:30.827000,
http://developer.qiniu.com/samples/fop/av/live_00006_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:tp7CjnEBGxGHkDbRqd8OehlGSno
#EXTINF:30.826000,
http://developer.qiniu.com/samples/fop/av/live_00007_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:QxYkdqWEAYj90kgX5jUPedFxXVo
#EXTINF:30.827000,
http://developer.qiniu.com/samples/fop/av/live_00008_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:MQ7EDzKP2f_EtpXq-maGr88mazA
#EXTINF:25.149000,
http://developer.qiniu.com/samples/fop/av/live_00009_.ts?e=1388773727&token=u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:jmx4dIZndnrNFqzLg72YZM-qtmY
#EXT-X-ENDLIST
```

<a id="pm3u8-remarks"></a>
## 附注

- ts资源的原始下载URL必须以`http://`打头。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
