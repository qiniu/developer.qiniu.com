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
POST /bput/<ctx>/<nect_chunk_offset> HTTP/1.1
Host:           <host>
Content-Type:   application/octet-stream
Content-Length: <next_chunk_size>
Authorization:  UpToken <UploadToken>

<next_chunk_binary>
```

<a id="bput-request-params"></a>
### 请求参数

参数名称        | 类型   | 说明
:-------------- | :----- | :------------------------------
ctx             | string | 上次返回的服务端上传控制字段
next_chunk_offset | int64  | 当前片在整个块中的起始偏移

<a id="bput-request-headers"></a>
### 头部信息

该请求须指定以下头部信息。

头部名称       | 说明                                   | 必填
:------------- | :------------------------------------- | :-------
Host           | 上一次响应内容中夹带的后续上传接收地址 | 是
Content-Type   | 必须为application/octet-stream         | 是
Content-Length | 当前片的内容长度，单位为字节。         | 是
Authorization  | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。 | 是

使用本API无需设置额外头部信息。  

<a id="bput-request-body"></a>
### 请求内容

该请求的内容为当前片的二进制内容。

<a id="bput-request-auth"></a>
### 访问权限

[上传凭证（UploadToken）][uploadTokenHref]方式。

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

如果请求成功，返回的响应内容将是一个JSON结构体。格式如下：

```
{
	"ctx":            "<Ctx          string>", 
    "checksum":       "<Checksum     string>",
    "crc32":           <Crc32        int64>,
    "offset":          <Offset       int64>,
    "host":           "<Host         string>"
}
```

字段含义如下：

字段名称       | 类型   | 说明
:------------- | :----- | :------------------------------
ctx            | string | 服务端上传控制字段，后继上传及生成文件(mkfile)时用到。
checksum       | string | 上传块校验码。
crc32          | int64  | 上传块Crc32,客户可通过此字段对上传块的完整性进行较验。
offset         | int64  | 下一个上传块在切割块中的偏移。
host           | string | 后续上传接收地址。

如果请求失败，请参见错误消息。

<a id="bput-error-messages"></a>
### 错误消息

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 创建块成功
400	       | 请求参数错误
401        | 上传凭证无效
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。
701        | 后续上传接收地址不正确，或ctx信息已过期

<a id="bput-remarks"></a>
## 附注

- 可以复用创建块时使用的上传凭证。  
- 上传凭证将被重新验证，若已过期，可以重新生成新的凭证。  

<a id="bput-internal-resources"></a>
## 内部参考资源

- [上传凭证（UploadToken）][uploadTokenHref]
- [创建块（mkblk）](mkblk.html)
- [创建资源（mkfile）](mkfile.html)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              ../security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: ../extended-headers.html                         "常见响应头部信息"
