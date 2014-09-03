---
layout: docs
title: 上传片（bput）
order: 90
---

<a id="bput"></a>
# 上传片（bput）

<a id="bput-description"></a>
## 描述

上传指定块的一片数据，具体数据量可根据现场环境调整。  
同一块的每片数据必须串行上传。  

<a id="bput-request"></a>
## 请求

<a id="bput-request-syntax"></a>
### 请求语法

```
POST /bput/<ctx>/<nextChunkOffset> HTTP/1.1
Host:           <UpHost>
Content-Type:   application/octet-stream
Content-Length: <nextChunkSize>
Authorization:  UpToken <UploadToken>

<nextChunkBinary>
```

<a id="bput-request-params"></a>
### 请求参数

参数名称            | 必填  | 类型   | 说明
:------------------ | :---  | :----- | :------------------------------
`<ctx>`             | 是    | string | 前一次上传返回的块级上传控制信息。
`<nextChunkOffset>` | 是    | int64  | 当前片在整个块中的起始偏移。

<a id="bput-request-headers"></a>
### 头部信息

头部名称       | 必填 | 说明
:------------- | :--- | :-------------------------------------
Host           | 是   | 上一次上传响应返回的后续上传接收地址。
Content-Type   | 是   | 固定为application/octet-stream。
Content-Length | 是   | 当前片的内容长度，单位：字节（Byte）。
Authorization  | 是   | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码。<br>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

<a id="bput-request-body"></a>
### 请求内容

该请求的内容为当前片的二进制内容。

<a id="bput-request-auth"></a>
### 访问权限

[上传凭证][uploadTokenHref]方式。

<a id="bput-response"></a>
## 响应

<a id="bput-response-headers"></a>
### 头部信息

头部名称      | 说明                              
:------------ | :--------------------------------------------------------------------
Content-Type  | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="bput-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"ctx":            "<Ctx          string>", 
    "checksum":       "<Checksum     string>",
    "crc32":           <Crc32        int64>,
    "offset":          <Offset       int64>,
    "host":           "<UpHost       string>"
}
```

字段名称       | 必填 | 说明
:------------- | :--- | :------------------------------
ctx            | 是   | 本次上传成功后的块级上传控制信息，用于后续[上传片](http://developer.qiniu.com/docs/v6/api/reference/up/bput.html)及[生成文件](http://developer.qiniu.com/docs/v6/api/reference/up/mkfile.html)。<br>本字段是只能被七牛服务器解读使用的不透明字段，上传端不应修改其内容。<br>每次返回的`<ctx>`都只对应紧随其后的下一个上传数据片，上传非对应数据片会返回701状态码。
checksum       | 是   | 本块已上传部分的校验码，只能被七牛服务器解读使用。
crc32          | 是   | 本块已上传部分的CRC32值，上传端可通过此字段对本块已上传部分的完整性进行校验。
offset         | 是   | 下一个上传片在上传块中的偏移。
host           | 是   | 后续上传接收地址。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>"
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态码](#bput-response-status)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="bput-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 上传片成功。
400	       | 请求报文格式错误，报文构造不正确或者没有完整发送。
401        | 上传凭证无效。
413        | 上传内容长度大于 [fsizeLimit](/docs/v6/api/reference/security/put-policy.html#put-policy-fsize-limit) 中指定的长度限制。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。
701        | 后续上传接收地址不正确，或ctx信息已过期。

<a id="bput-remarks"></a>
## 附注

- 可以复用创建块时使用的上传凭证。  
- 上传凭证将被重新验证，若已过期，可以使用重新生成的凭证。  

<a id="bput-internal-resources"></a>
## 内部参考资源

- [上传凭证][uploadTokenHref]
- [创建块（mkblk）](http://developer.qiniu.com/docs/v6/api/reference/up/mkblk.html)
- [创建资源（mkfile）](http://developer.qiniu.com/docs/v6/api/reference/up/mkfile.html)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
