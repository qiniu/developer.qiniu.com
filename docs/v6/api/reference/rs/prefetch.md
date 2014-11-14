---
layout: docs
title: 更新镜像资源（prefetch）
order: 300
---

<a id="prefetch"></a>
# 更新镜像资源（prefetch）

<a id="prefetch-description"></a>
## 描述

对于设置了镜像存储的空间，从镜像源站抓取指定名称的资源并存储到该空间中。  
如果该空间中已存在该名称的资源，则会将镜像源站的资源覆盖空间中相同名称的资源。  

<a id="prefetch-request"></a>
## 请求

<a id="prefetch-request-syntax"></a>
### 请求语法

```
POST /prefetch/<EncodedEntryURI>
Host:           iovip.qbox.me
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```

EncodedEntryURI的细节请查看[EncodedEntryURI格式][encodedEntryURIHref]。

<a id="prefetch-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="prefetch-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="prefetch-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="prefetch-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="prefetch-response"></a>
## 响应

<a id="prefetch-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
```

<a id="prefetch-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="prefetch-response-body"></a>
### 响应内容

■ 如果请求成功，不返回任何内容。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="prefetch-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 抓取成功
400	       | 请求报文格式错误
401        | 管理凭证无效
404        | 抓取资源不存在
478        | 源站返回404外，所有非200的response都返回478
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们
其余状态码 | 源站返回的状态码，请检查源站资源的可访问性

<a id="prefetch-sample1-command"></a>
### 命令行示例

```
curl -i \
     -o - \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...' \
     -X POST \
     'http://iovip.qbox.me/prefetch/bmV3ZG9jczpmaW5kLm1hbi50eHQ='
```

<a id="prefetch-sample1-request"></a>
### 请求示例

```
POST /prefetch/bmV3ZG9jczpmaW5kLm1hbi50eHQ= HTTP/1.1
User-Agent: curl/7.30.0
Host: iovip.qbox.me
Accept: */*
Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...(过长已省略)
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="prefetch-sample1-response"></a>
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

<a id="prefetch-remarks"></a>
## 附注

- 本接口执行同步操作，如果抓取的资源过大，可能会导致超时。

<a id="prefetch-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html                             "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                        "常见响应头部信息"
