---
layout: docs
title: 获取资源信息（stat）
order: 900
---

<a id="stat"></a>
# 获取资源信息（stat）

<a id="stat-description"></a>
## 描述

仅获取资源的Metadata信息，不返回资源内容。

<a id="stat-request"></a>
## 请求

<a id="stat-request-syntax"></a>
### 请求语法

```
GET /stat/<EncodedEntryURI> HTTP/1.1
Host:          rs.qiniu.com
Authorization: QBox <AccessToken>
```

EncodedEntryURI的细节请查看[EncodedEntryURI格式][encodedEntryURIHref]。

<a id="stat-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="stat-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="stat-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="stat-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="stat-response"></a>
## 响应

<a id="stat-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="stat-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"fsize":     <FileSize  int>, 
    "hash":     "<FileETag  string>",
    "mimeType": "<MimeType  string>",
    "putTime":   <PutTime   int64> 
}
```

字段含义如下：

字段名称       | 必填 | 说明
:------------- | :--- | :------------------------------
`fsize`        | 是   | 文件尺寸，单位：字节（Byte）
`hash`         | 是   | 文件的ETag信息
`mimeType`     | 是   | 以MIME信息表达的文件类型<p>关于各种MIME值的含义，请参见[MIME Media Types][mimeMediaTypesHref]（内容由IANA维护）
`putTime`      | 是   | 文件上传时的服务器端Epoch时间戳，单位：100纳秒<p>例如值为`13603956734587420`的时间对应实际时间为`2013-02-09 15:41:13`

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<errMsg    string>"
}
```

字段名称     | 必填 | 说明
:----------- | :--- | :--------------------------------------------------------------------
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="stat-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 获取Metadata成功
400	       | 请求报文格式错误
401        | 管理凭证无效
612        | 目标资源不存在
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们

<a id="stat-samples"></a>
## 示例

<a id="stat-sample1-command"></a>
### 命令行示例

```
curl -i \
     -H "Authorization: QBox QNJi_bYJlmO5LeY..." \
     "http://rs.qiniu.com/stat/ZGVtbzoyMDEzLTAyLTA5LTA3LTM5LTIwLmpwZw=="
```

<a id="stat-sample1-request"></a>
### 请求示例

```
GET /stat/ZGVtbzoyMDEzLTAyLTA5LTA3LTM5LTIwLmpwZw== HTTP/1.1
User-Agent: curl/7.30.0
Host: rs.qiniu.com
Accept: */*
Authorization: QBox QNJi_bYJlmO5LeY08FfoNj9w_r72Vsn...(过长已省略)
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="stat-sample1-response"></a>
### 响应示例

以下响应中JSON字符串经过格式化，以便阅读。

```
HTTP/1.1 200 OK
Server: nginx/1.0.8
Date: Sun, 03 Nov 2013 14:01:28 GMT
Content-Type: application/json
Connection: keep-alive
Cache-Control: no-store
Content-Length: 121
X-Log: qtbl.get;RS
X-Reqid: swEAAMipp-5bIjMT

{
	"fsize":        5122935,
	"hash":         "ljfockr0lOil_bZfyaI2ZY78HWoH",
	"mimeType":     "application/octet-stream",
	"putTime":      13603956734587420
}
```

<a id="stat-remarks"></a>
## 附注

无。

<a id="stat-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[mimeMediaTypesHref]:           http://www.iana.org/assignments/media-types      "MIME媒体类型"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
