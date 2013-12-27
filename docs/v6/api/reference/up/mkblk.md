---
layout: docs
title: 创建块（mkblk）
order: 100
---

<a id="mkblk"></a>
# 创建块（mkblk）

<a id="mkblk-description"></a>
## 描述

为后续分片上传创建一个新的块，同时上传第一片数据。

<a id="mkblk-request"></a>
## 请求

<a id="mkblk-request-syntax"></a>
### 请求语法

```
POST /mkblk/<block_size> HTTP/1.1
Host:           up.qiniu.com
Content-Type:   application/octet-stream
Content-Length: <first_chunk_size>
Authorization:  UpToken <UploadToken>

<first_chunk_binary>
```

<a id="mkblk-request-auth"></a>
### 访问权限

[上传凭证（UploadToken）][uploadTokenHref]方式。

<a id="mkblk-request-params"></a>
### 请求参数

该请求不支持任何参数。

<a id="mkblk-request-headers"></a>
### 头部信息

该请求须指定以下头部信息。

参数名称       | 说明                              | 必填
:------------- | :-------------------------------- | :-------
Content-Type   | 必须为application/octet-stream    | 是
Content-Length | 第一个片的内容长度，单位为字节。  | 是
Authorization  | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。 | 是

使用本API无需设置额外头部信息。  

<a id="mkblk-request-body"></a>
### 请求内容

该请求的内容为第一个片的二进制内容。

<a id="mkblk-response"></a>
## 响应

<a id="mkblk-response-headers"></a>
### 头部信息

头部名称      | 说明                              
:------------ | :--------------------------------------------------------------------
Content-Type  | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="mkblk-response-body"></a>
### 响应内容

如果请求成功，返回的响应内容将是一个JSON结构体。格式如下：

```
{
	"ctx":          "<Ctx           string>", 
    "checksum":     "<Checksum      string>",
    "crc32":         <Crc32         int64>,
    "offset":        <Offset        int64>,
    "host":         "<Host          string>"
}
```

参数含义如下：

参数名称       | 类型   | 说明
:------------- | :----- | :------------------------------
ctx            | string | 服务端上传控制字段，后继上传及生成文件(mkfile)时用到。
checksum       | string | 上传块校验码。
crc32          | int64  | 上传块Crc32,客户可通过此字段对上传块的完整性进行较验。
offset         | int64  | 下一个上传块在切割块中的偏移。
host           | string | 后续上传接收地址。

如果请求失败，请参考[错误消息](#error-messages)。

<a id="mkblk-error-messages"></a>
### 错误消息

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 创建块成功
400	       | 请求参数错误
401        | 管理凭证无效
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="mkblk-examples"></a>
## 示例

我们拿一个小文件作为示例，该文件的大小适合作为一次完整上传展示。  

<a id="mkblk-example1-command"></a>
### 命令行示例

```
curl -i \
     --data-binary '@test.txt' \
     -H "Authorization: UpToken QNJi_bYJlmO5LeY..." \
     -H "Content-Length: 1024" \
     "http://up.qiniu.com/mkblk/1024"
```

<a id="mkblk-example1-request"></a>
### 请求示例

```
POST /mkblk/1024 HTTP/1.1
User-Agent: curl/7.30.0
Host: up.qiniu.com
Accept: */*
Authorization: UpToken QNJi_bYJlmO5LeY08FfoNj9w_r...(过长已省略)
```

<a id="mkblk-example1-response"></a>
### 响应示例

以下响应中JSON字符串经过格式化，以便查看。

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
	"ctx":          "ctx", 
    "checksum":     "checksum",
    "crc32":        1345,
    "offset":       0,
    "host":         "http://up-nb-5.qbox.me"
}
```

<a id="mkblk-remarks"></a>
## 附注

无。

<a id="mkblk-internal-resources"></a>
## 内部参考资源

- [上传凭证（UploadToken）][uploadTokenHref]
- [上传片数据（bput）](bput.html)
- [创建资源（mkfile）](mkfile.html)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              ../security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: ../extended-headers.html                         "常见响应头部信息"
