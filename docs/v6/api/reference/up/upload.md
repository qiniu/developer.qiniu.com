---
layout: docs
title: 直传文件（upload）
order: 200
---

<a id="upload"></a>
# 直传文件（upload）

<a id="upload-description"></a>
## 描述

`upload`是七牛云存储提供的最基础的接口，用于在一次HTTP会话中上传单一的一个文件。  

---
## 使用方法

我们可以用如下的HTML表单来描述表单上传的基本用法：

```
<form method="post" action="http://upload.qiniu.com/"
 enctype="multipart/form-data">
  <input name="key" type="hidden" value="<resource_key>">
  <input name="x:<custom_name>" type="hidden" value="<custom_value>">
  <input name="token" type="hidden" value="<upload_token>">
  <input name="file" type="file" />
  <input name="crc32" type="hidden" />
  <input name="accept" type="hidden" />
</form>
```

<a id="upload-request"></a>
## 请求报文

<a id="upload-request-syntax"></a>
### 请求报文格式

请求报文的内容以`multipart/form-data`格式组织，具体细节请参考[multipart格式][multipartFrontierHref]。  

```
POST / HTTP/1.1
Host:           upload.qiniu.com
Content-Type:   multipart/form-data; boundary=<frontier>
Content-Length: <multipartContentLength>

--<frontier>
Content-Disposition:       form-data; name="token"

<uploadToken>
--<frontier>
Content-Disposition:       form-data; name="key"

<key>
--<frontier>
Content-Disposition:       form-data; name="<xVariableName>"

<xVariableValue>
--<frontier>
Content-Disposition:       form-data; name="crc32"

<crc32>
--<frontier>
Content-Disposition:       form-data; name="accept"

<acceptContentType>
--<frontier>
Content-Disposition:       form-data; name="file"; filename="<fileName>"
Content-Type:              application/octet-stream
Content-Transfer-Encoding: binary

<fileBinaryData>
--<frontier>--
```

<a id="upload-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 上传服务器域名，固定为upload.qiniu.com。
Content-Type   | 是   | 固定为multipart/form-data。`<frontier>`为[Multipart分隔符][multipartFrontierHref]，必须是任何Multipart消息都不包含的字符串。
Content-Length | 是   | 整个Multipart内容的总长度，单位：字节（Byte）。

<a id="upload-request-params"></a>
### 请求报文参数

请求报文的每一个参数（以“<>”标记）的具体说明如下表所示（按出现位置顺序排列）：  

参数名称                      | 必填 | 说明
:---------------------------- | :--- | :-----------------------------------------
`<token>`                     | 是   | [上传凭证][uploadTokenHref]，位于`token`消息中。
`<xVariableName>`             |      | [自定义变量][xVariablesHref]的名字。
`<xVariableValue>`            |      | [自定义变量][xVariablesHref]的值。
`<file>`                      | 是   | 原文件名。<br>对于没有文件名的情况，建议填入随机生成的纯文本字符串。<br>本参数的值将作为[魔法变量$(fname)](/docs/v6/api/overview/up/response/vars.html#magicvar-fname)的值使用。
`<fileBinaryData>`            | 是   | 上传文件的完整内容。
`<key>`                       |      | 资源的最终名称，位于`key`消息中。如不指定则使用[上传策略][putPolicyHref]saveKey字段所指定模板生成Key，如无模板则使用Hash值作为Key。
`<crc32>`                     |      | 上传内容的 CRC32 校验码。<br>如填入，则七牛服务器会使用此值进行内容检验。
`<accept>`             |      | 当 HTTP 请求指定 `Accept` 头部时，七牛会返回的 `Content-Type` 头部的值。<br>该值用于兼容低版本 IE 浏览器行为。低版本 IE 浏览器在 multiform 返回 `application/json` 的时候会表现为下载，返回 `text/plain` 才会显示返回内容。

注意：用户自定义变量可以有多对。  

---

<a id="upload-response"></a>
## 响应报文

<a id="upload-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type:   application/json
Cache-Control:  no-store

{
    "hash": "<hash>",
    "key":  "<key>"
}
```

<a id="upload-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json。
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存。

<a id="upload-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "hash": "<Hash  string>",
    "key":  "<Key   string>"
}
```

字段名称 | 必填 | 说明                              
:------- | :--- | :--------------------------------------------------------------------
`hash`   | 是   | 目标资源的[hash值](/docs/v6/api/overview/appendix.html#qiniu-etag)，可用于ETag头部。
`key`    | 是   | 目标资源的最终名字，可由七牛云存储自动命名。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#upload-response-status)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="upload-response-status"></a>
### 响应状态

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 上传成功。
400	       | 请求报文格式错误，报文构造不正确或者没有完整发送。
401        | 上传凭证无效。
413        | 上传内容长度大于 [fsizeLimit](/docs/v6/api/reference/security/put-policy.html#put-policy-fsize-limit) 中指定的长度限制。
579        | 回调业务服务器失败。
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。
614        | 目标资源已存在。

---

<a id="upload-remarks"></a>
## 附注

无。

<a id="upload-example"></a>
## 在线示例

- [表单上传](http://jsfiddle.net/gh/get/library/pure/icattlecoder/jsfiddle/tree/master/formupload)

- [异步表单上传](http://jsfiddle.net/gh/get/jquery/1.9.1/icattlecoder/jsfiddle/tree/master/ajaxupload)

---

<a id="upload-internal-resources"></a>
## 内部参考资源

- [EncodedEntryURI格式][encodedEntryURIHref]
- [上传策略][putPolicyHref]
- [上传凭证][uploadTokenHref]
- [自定义变量][xVariablesHref]
- [URL安全的Base64编码][urlsafeBase64Href]

<a id="upload-external-resources"></a>
## 外部参考资源

- [Multipart分隔符][multipartFrontierHref]
- [MIME类型][mimeTypeHref]
- [MIME清单][mimeTypeListHref]

[encodedEntryURIHref]:          /docs/v6/api/reference/data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"

[uploadTokenHref]:          /docs/v6/api/reference/security/upload-token.html                               "上传凭证"
[putPolicyHref]:            /docs/v6/api/reference/security/put-policy.html                                  "上传策略"
[xVariablesHref]:           /docs/v6/api/overview/up/response/vars.html#xvar                    "自定义变量"

[multipartFrontierHref]:    http://en.wikipedia.org/wiki/MIME#Multipart_messages           "Multipart分隔符"
[mimeTypeHref]:             http://en.wikipedia.org/wiki/MIME                              "MIME类型"
[mimeTypeListHref]:         http://www.iana.org/assignments/media-types/media-types.xhtml  "MIME清单"
[urlsafeBase64Href]: /docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
