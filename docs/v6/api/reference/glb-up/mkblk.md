---
layout: docs
title: 创建块
order: 100
---

<a id="mkblk"></a>
# 多区域创建块

- [描述](#mkblk-description)
- [请求](#mkblk-request)
  - [请求语法](#mkblk-request-syntax)
  - [访问权限](#mkblk-request-auth)
  - [请求参数](#mkblk-request-params)
  - [头部信息](#mkblk-request-headers)
  - [请求内容](#mkblk-request-body)
- [响应](#mkblk-response)
  - [头部信息](#mkblk-response-headers)
  - [响应内容](#mkblk-response-body)
  - [响应状态码](#mkblk-response-status)
- [示例](#mkblk-examples)
  - [命令行示例](#mkblk-example1-command)
  - [请求示例](#mkblk-example1-request)
  - [响应示例](#mkblk-example1-response)
- [附注](#mkblk-remarks)
- [内部参考资源](#mkblk-internal-resources)


<a id="mkblk-description"></a>
## 描述

为后续分片上传创建一个新的块，同时上传第一片数据。

<a id="mkblk-request"></a>
## 请求

<a id="mkblk-request-syntax"></a>
### 请求语法

```
POST /glb/mkblk/<blockSize> HTTP/1.1
Host:           up-glb.qiniu.com
Content-Type:   application/octet-stream
Content-Length: <firstChunkSize>
Authorization:  UpToken <UploadToken>

<firstChunkBinary>
```

<a id="mkblk-request-auth"></a>
### 访问权限

[上传凭证][uploadTokenHref]方式。

<a id="mkblk-request-params"></a>
### 请求参数

参数名称            | 必填 | 类型   | 说明
:------------------ | :--- | :----- | :------------------------------
`<blockSize>`       | 是   | int64  | 块大小，为4MB，最后一块大小不超过4MB。

<a id="mkblk-request-headers"></a>
### 头部信息

头部名称       | 必填 | 说明
:------------- | :--- | :--------------------------------
Host           | 是   | 上传服务器域名。<br>● 分块上传的首块上传域名为：`up-glb.qiniu.com`。<br>● 后续片的上传为上一次上传响应返回的后续上传接收地址。
Content-Type   | 是   | 固定为application/octet-stream。
Content-Length | 是   | 第一个片的内容长度，单位为字节。
Authorization  | 是   | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码。<br>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

<a id="mkblk-request-body"></a>
### 请求内容

该请求的内容为第一个片的二进制内容。

<a id="mkblk-response"></a>
## 响应

<a id="mkblk-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :--------------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[HTTP响应扩展字段][commonHttpResponseHeaderHref]。

<a id="mkblk-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：

```
{
	"ctx":          "<Ctx           string>",
    "checksum":     "<Checksum      string>",
    "crc32":         <Crc32         int64>,
    "offset":        <Offset        int64>,
    "host":         "<UpHost        string>"
}
```

字段名称       | 必填 | 说明
:------------- | :--- | :------------------------------
ctx            | 是   | 本次上传成功后的块级上传控制信息，用于后续[上传片](bput.html)及[创建文件](mkfile.html)。<br>本字段是只能被七牛服务器解读使用的不透明字段，上传端不应修改其内容。<br>每次返回的`<ctx>`都只对应紧随其后的下一个上传数据片，上传非对应数据片会返回701状态码。
checksum       | 是   | 上传块校验码。
crc32          | 是   | 上传块Crc32,客户可通过此字段对上传块的完整性进行校验。
offset         | 是   | 下一个上传块在切割块中的偏移。
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
`code`       | 是   | HTTP状态码，请参考[响应状态码](#mkblk-response-status)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="mkblk-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 创建块成功。
400	       | 请求报文格式错误，报文构造不正确或者没有完整发送。
401        | 上传凭证无效。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

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
     "http://up-glb.qiniu.com/glb/mkblk/1024"
```

<a id="mkblk-example1-request"></a>
### 请求示例

```
POST /glb/mkblk/1024 HTTP/1.1
User-Agent: curl/7.30.0
Host: up-glb.qiniu.com
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

- [上传凭证][uploadTokenHref]
- [上传片](bput.html)
- [创建文件](mkfile.html)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
