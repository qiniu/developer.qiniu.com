---
title: 批量操作
order: 500
---

<a id="move"></a>
# 批量操作

- [描述](#batch-description)
- [请求](#batch-request)
  - [请求语法](#batch-request-syntax)
  - [访问权限](#batch-request-auth)
  - [请求参数](#batch-request-params)
  - [头部信息](#batch-request-headers)
  - [请求内容](#batch-request-body)
- [响应](#batch-response)
  - [响应语法](#batch-response-headers)
  - [头部信息](#batch-response-headers)
  - [响应内容](#batch-response-body)
  - [响应状态码](#batch-response-batchus)
- [附注](#batch-remarks)
- [相关资源](#batch-related-resources)

<a id="batch-description"></a>
## 描述

批量操作意指在单一请求中执行多次获取元信息/移动/复制/删除操作，极大提高资源管理效率。  

<a id="batch-request"></a>
## 请求

<a id="batch-request-syntax"></a>
### 请求语法

```
POST /batch HTTP/1.1
Host:           rs.qiniu.com
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>

op=<Operation>&op=<Operation>&...
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

其中`op=<Operation>`是单一资源操作指令。例如`/stat/<EncodeEntryURI>`，`/delete/<EncodeEntryURI>`等。  
EncodeEntryURI、EncodedEntryURISrc与EncodedEntryURIDest的细节请查看[EncodedEntryURI格式][encodedEntryURIHref]。  

<a id="batch-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="batch-request-params"></a>
### 请求参数

该请求无需设置任何参数。  

<a id="batch-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Content-Type  | 是   | 固定为application/x-www-form-urlencoded
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="batch-request-body"></a>
### 请求内容

#### 批量获取元信息

```
op=/stat/<EncodedEntryURI>&op=/stat/<EncodedEntryURI>&...
```

#### 批量复制资源

```
op=/batch/<EncodedEntryURISrc>/<EncodedEntryURIDest>&op=/batch/<EncodedEntryURISrc>/<EncodedEntryURIDest>&...
```

#### 批量移动资源

```
op=/move/<EncodedEntryURISrc>/<EncodedEntryURIDest>&op=/move/<EncodedEntryURISrc>/<EncodedEntryURIDest>&...
```

#### 批量删除资源

```
op=/delete/<EncodedEntryURI>&op=/delete/<EncodedEntryURI>&...
```

#### 混合多种操作

```
op=/stat/<EncodedEntryURI>
&op=/batch/<EncodedEntryURISrc>/<EncodedEntryURIDest>
&op=/move/<EncodedEntryURISrc>/<EncodedEntryURIDest>&...
&op=/delete/<EncodedEntryURI>&...
```

<a id="batch-response"></a>
## 响应

<a id="batch-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
```

<a id="batch-response-headers"></a>
### 头部信息


头部名称      | 必填 | 说明                              
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="batch-response-body"></a>
### 响应内容

#### 批量获取元信息

```
[
    { "code": <HttpCode int>, "data": <Data> },
    { "code": <HttpCode int>, "data": <Data> },
    { "code": <HttpCode int>, "data": { "error": "<ErrorMessage string>" } },
    ...
]
```

#### 批量复制资源

```
[
    { "code": <HttpCode int> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int>, "data": { "error": "<ErrorMessage string>" } },
    ...
]
```

#### 批量移动资源

```
[
    { "code": <HttpCode int> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int>, "data": { "error": "<ErrorMessage string>" } },
    ...
]
```

#### 批量删除资源

```
[
    { "code": <HttpCode int> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int>, "data": { "error": "<ErrorMessage string>" } },
    ...
]
```

#### 混合多种操作

```
[
    { "code": <HttpCode int>, "data": <Data> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int> },
    { "code": <HttpCode int>, "data": { "error": "<ErrorMessage string>" } },
    ...
]
```

<a id="batch-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 所有请求操作都已成功完成
298        | 部分或所有请求操作失败（出错信息参看上述响应内容）
400	       | 请求报文格式错误
401        | 管理凭证无效
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们

<a id="batch-remarks"></a>
## 附注

无。

<a id="batch-related-resources"></a>
## 相关资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
