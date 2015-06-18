---
layout: docs
title: 复制资源
order: 800
---

<a id="copy"></a>
# 复制资源

- [描述](#copy-description)
- [请求](#copy-request)
  - [请求语法](#copy-request-syntax)
  - [访问权限](#copy-request-auth)
  - [请求参数](#copy-request-params)
  - [头部信息](#copy-request-headers)
  - [请求内容](#copy-request-body)
- [响应](#copy-response)
  - [响应语法](#copy-response-syntax)
  - [头部信息](#copy-response-headers)
  - [响应内容](#copy-response-body)
  - [响应状态码](#copy-response-copyus)
- [示例](#copy-samples)
  - [命令行示例](#copy-sample1-command)
  - [请求示例](#copy-sample1-request)
  - [响应示例](#copy-sample1-response)
- [附注](#copy-remarks)
- [内部参考资源](#copy-internal-resources)

<a id="copy-description"></a>
## 描述

将指定资源复制为新命名资源。  

<a id="copy-request"></a>
## 请求

<a id="copy-request-syntax"></a>
### 请求语法

```
POST /copy/<EncodedEntryURISrc>/<EncodedEntryURIDest> HTTP/1.1
Host:           rs.qiniu.com
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```

EncodedEntryURISrc与EncodedEntryURIDest的细节请查看[EncodedEntryURI格式][encodedEntryURIHref]。

<a id="copy-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="copy-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="copy-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="copy-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="copy-response"></a>
## 响应

<a id="copy-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
```

<a id="copy-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

<a id="copy-response-body"></a>
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
`code`       | 是   | HTTP状态码，请参考[响应状态](#copy-response-copyus)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="copy-response-copyus"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 复制成功
400	       | 请求报文格式错误
401        | 管理凭证无效
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们
612        | 待复制资源不存在
614        | 目标资源已存在

<a id="copy-samples"></a>
## 示例

<a id="copy-sample1-command"></a>
### 命令行示例

```
curl -i \
     -o - \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...' \
     -X POST \
     'http://rs.qiniu.com/copy/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ='
```

<a id="copy-sample1-request"></a>
### 请求示例

```
POST /copy/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ= HTTP/1.1
User-Agent: curl/7.30.0
Host: rs.qiniu.com
Accept: */*
Authorization: QBox u8WqmQu1jH21kxpIQmo2LqntzugM1VoHE9_pozCU:2LJIG...(过长已省略)
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="copy-sample1-response"></a>
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

<a id="copy-remarks"></a>
## 附注

无。

<a id="copy-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志        "发送错误报告"
