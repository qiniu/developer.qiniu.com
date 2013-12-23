---
layout: docs
title: 创建文件（mkfile）
order: 10
---

<a id="mkfile"></a>
# 创建文件（mkfile）

<a id="mkfile-description"></a>
## 描述

将上传好的所有数据块按指定顺序合并成一个资源文件。  

<a id="mkfile-request"></a>
## 请求

<a id="mkfile-request-syntax"></a>
### 请求语法

```
POST /mkfile/<file_size>/key/<encodedKey> HTTP/1.1
Content-Type:   text/plain
Content-Length: <ctx_list_size>
Host:           <selectUpHost>
Authorization:  UpToken <UploadToken>

<ctx_list>
```

<a id="mkfile-request-params"></a>
### 请求参数

参数名称        | 类型   | 说明
:-------------- | :----- | :------------------------------
file_size       | int64  | 资源文件大小
encodedKey      | string | 进行URL安全的Base编码后的资源名

<a id="mkfile-request-headers"></a>
### 头部信息

该请求须指定以下头部信息。

参数名称       | 说明                                      | 必填
:------------- | :---------------------------------------- | :-------
Host           | 上一次响应内容中夹带的后续上传接收地址    | 是
Content-Type   | 必须为text/plain                          | 是
Content-Length | 所有块的ctx及分隔符的总长度，单位为字节。 | 是
Authorization  | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。 | 是

使用本API无需设置额外头部信息。  

<a id="mkfile-request-body"></a>
### 请求内容

该请求的内容为所有块的ctx列表，以“,”分隔，按其在源文件中的位置排序。  

```
<ctx1>,<ctx2>,<ctx3>,<ctx4>,<ctx5>,...
```

<a id="mkfile-request-auth"></a>
### 访问权限

[上传凭证（UploadToken）][uploadTokenHref]方式。

<a id="mkfile-response"></a>
## 响应

<a id="mkfile-response-headers"></a>
### 头部信息

头部名称      | 说明                              
:------------ | :--------------------------------------------------------------------
Content-Type  | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="mkfile-response-body"></a>
### 响应内容

如果请求成功，返回的响应内容将是一个JSON结构体。格式如下：

```
{
	"hash": "<ContentHash  string>", 
    "key":  "<Key          string>"
}
```

字段含义如下：

字段名称       | 类型   | 说明
:------------- | :----- | :------------------------------
hash           | string | 资源内容的SHA1值
key            | string | 资源名

如果请求失败，请参见错误消息。

<a id="mkfile-error-messages"></a>
### 错误消息

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 创建块成功
400	       | 请求参数错误
401        | 上传凭证无效
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。
614        | 目标资源已存在

<a id="mkfile-remarks"></a>
## 附注

- 可以复用创建块时使用的上传凭证。  
- 上传凭证将被重新验证，若已过期，可以重新生成新的凭证。  

<a id="mkfile-internal-resources"></a>
## 内部参考资源

- [上传凭证（UploadToken）][uploadTokenHref]
- [创建块（mkblk）](mkblk.html)
- [上传片（bput）](bput.html)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              ../security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: ../extended-headers.html                         "常见响应头部信息"
