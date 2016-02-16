---
layout: docs
title: 抓取（fetch）
order: 599
---

<a id="fetch"></a>
# 多区域抓取资源（glb/fetch）

- [描述](#fetch-description)
- [请求](#fetch-request)
  - [请求语法](#fetch-request-syntax)
  - [访问权限](#fetch-request-auth)
  - [请求参数](#fetch-request-params)
  - [头部信息](#fetch-request-headers)
  - [请求内容](#fetch-request-body)
- [响应](#fetch-response)
  - [响应语法](#fetch-response-headers)
  - [头部信息](#fetch-response-headers)
  - [响应内容](#fetch-response-body)
  - [响应状态码](#fetch-response-fetchus)
- [示例](#fetch-samples)
  - [命令行示例](#fetch-sample1-command)
  - [请求示例](#fetch-sample1-request)
  - [响应示例](#fetch-sample1-response)
- [附注](#fetch-remarks)
- [内部参考资源](#fetch-internal-resources)

<a id="fetch-description"></a>
## 描述

从指定URL抓取资源，并将该资源存储到指定空间中。

<a id="fetch-request"></a>
## 请求

<a id="fetch-request-syntax"></a>
### 请求语法

```
POST /glb/fetch/<EncodedURL>/to/<EncodedEntryURI> HTTP/1.1
Host:           api.qiniu.com
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```

EncodedURL参数为对指定URL地址进行[URL安全的Base64编码][urlsafeBase64Href]后的字符串，[EncodedEntryURI][encodedEntryURIHref]为 `<bucket>:<key>` 或者 `<bucket>` 的 urlsafe base64 编码。如果指定为`<bucket>`的 urlsafe base64 编码，默认文件的[hash][qetag]值作为key。

<a id="fetch-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="fetch-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="fetch-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="fetch-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="fetch-response"></a>
## 响应

<a id="fetch-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "hash": "<hash>",
    "key":  "<key>"
}
```

<a id="fetch-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="fetch-response-body"></a>
### 响应内容

- 如果请求成功，返回文件的[hash][qetag]值和key。
- 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="fetch-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 抓取成功
400	   | 请求报文格式错误
401        | 管理凭证无效
404        | 抓取资源不存在
478        | 源站返回404外，所有非200的response都返回478
599	   | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们
其余状态码 | 源站返回的状态码，请检查源站资源的可访问性

<a id="fetch-sample1-command"></a>
### 命令行示例

```
curl -i \
     -o - \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...' \
     -X POST \
     'http://api.qiniu.com/glb/fetch/aHR0cDovL3Fpbml1LmNvbS9pbmRleC5odG1s/to/bmV3ZG9jczpmaW5kLm1hbi50eHQ='
```

<a id="fetch-sample1-request"></a>
### 请求示例

```
POST /glb/fetch/aHR0cDovL3Fpbml1LmNvbS9pbmRleC5odG1s/to/bmV3ZG9jczpmaW5kLm1hbi50eHQ= HTTP/1.1
User-Agent: curl/7.30.0
Host: api.qiniu.com
Accept: */*
Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...(过长已省略)
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="fetch-sample1-response"></a>
### 响应示例

```
HTTP/1.1 200 OK
Server: nginx/1.0.8
Date: Thu, 05 Dec 2013 06:55:29 GMT
Content-Type: application/json
Connection: keep-alive
Content-Length: 0
X-Log: RS.in;RS.mo;qtbl.mv:3;MQ;MC/404;RS.mcd:1;RS:5
X-Reqid: wxIAAD3btw-v3TwT
```

<a id="fetch-remarks"></a>
## 附注

- 本接口执行同步操作，如果抓取的资源过大，可能会导致超时。

<a id="fetch-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]
- [URL安全的Base64编码][urlsafeBase64Href]
- [七牛etag算法][qetag]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html                             "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"

[urlsafeBase64Href]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
[qetag]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html "文件etag算法"
