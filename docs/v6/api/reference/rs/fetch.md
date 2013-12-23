---
layout: docs
title: 抓取资源（fetch）
order: 400
---

<a id="fetch"></a>
# 抓取资源（fetch）

<a id="fetch-description"></a>
## 描述

从指定的URL抓取资源，并将该资源存储到指定的空间中。

<a id="fetch-request"></a>
## 请求

<a id="fetch-request-syntax"></a>
### 请求语法

```
POST /fetch/<EncodedURL>/to/<EncodedEntryURI> HTTP/1.1
Host:           iovip.qbox.me
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```
EncodedURL 参数为对指定URL地址的URL安全的base64编码后的字符串，EncodedEntryURI 的细节请查看[EncodedEntryURI]。

<a id="fetch-request-auth"></a>
### 访问权限

[管理凭证（AccessToken）][accessTokenHref]方式。

<a id="fetch-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="fetch-request-headers"></a>
### 头部信息

该请求必须指定以下头部信息。

头部名称      | 说明                              | 必填
:------------ | :-------------------------------- | :-------
Authorization | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`。 | 是

使用本API无需设置额外头部信息。  

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
```

<a id="fetch-response-headers"></a>
### 头部信息

头部名称      | 说明                              
:------------ | :--------------------------------------------------------------------
Content-Type  | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="fetch-response-body"></a>
### 响应内容

如果请求成功，该响应不返回任何内容。  
如果请求失败，返回的响应内容将是一个JSON结构体。格式如下：

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

<a id="fetch-example1-command"></a>
### 命令行示例

```
curl -i \
     -o - \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...' \
     -X POST \
     'http://iovip.qbox.me/fetch/aHR0cDovL3Fpbml1LmNvbS9pbmRleC5odG1s/to/bmV3ZG9jczpmaW5kLm1hbi50eHQ='
```

<a id="fetch-example1-request"></a>
### 请求示例

```
POST /fetch/aHR0cDovL3Fpbml1LmNvbS9pbmRleC5odG1s/to/bmV3ZG9jczpmaW5kLm1hbi50eHQ= HTTP/1.1
User-Agent: curl/7.30.0
Host: iovip.qbox.me
Accept: */*
Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...(过长已省略)
```

<a id="fetch-example1-response"></a>
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

无。

<a id="fetch-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          ../data-formats.html                             "EncodedEntryURI格式"
[accessTokenHref]:              ../security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[commonHttpResponseHeaderHref]: ../extended-headers.html                         "常见响应头部信息"
