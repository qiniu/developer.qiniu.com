---
layout: docs
title: 修改元信息
order: 200
---

<a id="chgm"></a>
# 修改元信息

<a id="chgm-description"></a>
## 描述

主动修改指定资源的文件类型，也就是资源的[mimeType](http://www.iana.org/assignments/media-types/media-types.xhtml)。

<a id="chgm-request"></a>
## 请求

<a id="chgm-request-syntax"></a>
### 请求语法

```
POST /chgm/<EncodedEntryURI>/mime/<EncodedMimeType> HTTP/1.1
Host:           rs.qiniu.com
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```

EncodedEntryURI和EncodedMimeType的细节请查看[EncodedEntryURI格式][encodedEntryURIHref]，而EncodedMimeType编码前的明文为要设置的新mimeType。

<a id="chgm-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="chgm-request-params"></a>
### 请求参数

该请求无需设置任何参数。

<a id="chgm-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`QBox bt500PzCG9tV0bccCOdnrmC...`

<a id="chgm-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="chgm-mimetype-name"></a>
### mimeType命名规则
* 目前所有的`mimetype`包括如下字符集：a-z, A-Z, 0-9, ., +, /, -
* 因为`mimetype`日后还会增加，为保证兼容将来的增加如下字符“;=,_”和空格
* 目前`mimetype`最大长度为79, 为保证兼容将来的这里限制最大长度为200
* `mimetype`为空这里认为合法，因为如果为空后面会进一步检测并设置
* `mimetype`可以包括空格，例如：“text/plain; charset=iso-8859-1”
* 禁止转义，如"%0A"表示"\n"，所以禁止出现"%"

<a id="chgm-response"></a>
## 响应

<a id="chgm-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
```

<a id="chgm-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :-----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="chgm-response-body"></a>
### 响应内容

■ 如果请求成功，不返回任何内容。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<errMsg    string>"
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="chgm-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 更改成功
400	       | 请求报文格式错误<br>当`<EncodedEntryURI>`解析失败，返回400 Bad Request {"error":"invalid argument"}<br>当`<EncodedEntryURI>`不符合UTF-8编码，返回400 Bad Request {"error":"key must be utf8 encoding"}
401        | 管理凭证无效
612        | 目标资源不存在
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们

<a id="chgm-example1-command"></a>
### 命令行示例

```
curl -i \
     -o - \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Authorization: QBox bt500PzCG9tV0bccCOdnrmCHPXCPLieGSDEprB7M:4wG...' \
     -X POST \
     'http://rs.qiniu.com/chgm/aXRpc2F0ZXN0OmdvZ29waGVyLmpwZw==/mime/YXBwbGljYXRpb24vdGVzdA=='
```

<a id="chgm-example1-request"></a>
### 请求示例

```
POST /chgm/aXRpc2F0ZXN0OmdvZ29waGVyLmpwZw==/mime/YXBwbGljYXRpb24vdGVzdA== HTTP/1.1
User-Agent: curl/7.30.0
Host: rs.qiniu.com
Accept: */*
Authorization: QBox bt500PzCG9tV0bccCOdnrmCHPXCPLieGSDEprB7M:4wG...(过长已省略)
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="chgm-example1-response"></a>
### 响应示例

```
HTTP/1.1 200 OK
Server: nginx/1.4.4
Date: Wed, 17 Sep 2014 07:53:25 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
X-Log: rs7_3.chgm;MQ;mc.d:1;RS:3
X-Reqid: vDEAAG2lN7zSqpQT
```

<a id="chgm-remarks"></a>
## 附注

无。

<a id="chgm-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [EncodedEntryURI格式][encodedEntryURIHref]

[encodedEntryURIHref]:          http://developer.qiniu.com/docs/v6/api/reference/data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"
[accessTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                    "管理凭证"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
