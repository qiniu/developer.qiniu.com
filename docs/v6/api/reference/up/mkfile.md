---
layout: docs
title: 创建文件
order: 10
---

<a id="mkfile"></a>
# 创建文件

<a id="mkfile-description"></a>
## 描述

将上传好的所有数据块按指定顺序合并成一个资源文件。  

<a id="mkfile-request"></a>
## 请求

<a id="mkfile-request-syntax"></a>
### 请求语法

```
POST /mkfile/<fileSize>/key/<encodedKey>/mimeType/<encodedMimeType>/x:user-var/<encodedUserVars> HTTP/1.1
Host:           <UpHost>
Content-Type:   text/plain
Content-Length: <ctxListSize>
Authorization:  UpToken <UploadToken>

<ctxList>
```

<a id="mkfile-request-params"></a>
### 请求参数

参数名称            | 必填 | 类型   | 说明
:------------------ | :--- | :----- | :------------------------------
`/<fileSize>`       | 是   | int64  | 资源文件大小。
`/key/<encodedKey>` |      | string | 进行[URL安全的Base64编码][urlsafeBase64Href]后的资源名<br>若未指定，则使用[saveKey](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-save-key)；<br>若未指定`saveKey`，则使用资源内容的SHA1值作为资源名。
`mimeType/<encodedMimeType>` |     | string | 进行[URL安全的Base64编码][urlsafeBase64Href]后的文件mimeType<br>若未指定，则根据文件内容自动检测mimeType
`/x:user-var/<encodedUserVars>` |     | string | 指定[自定义变量](http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html#xvar)。

<a id="mkfile-request-headers"></a>
### 头部信息

头部名称       | 必填 | 说明
:------------- | :--- | :----------------------------------------
Host           | 是   | 上一次上传响应返回的后续上传接收地址。
Content-Type   | 是   | 固定为text/plain。
Content-Length | 是   | 所有块的`<ctx>`及分隔符的总长度，单位：字节（Byte）。
Authorization  | 是   | 该参数应严格按照[上传凭证][uploadTokenHref]格式进行填充，否则会返回401错误码<br>一个合法的Authorization值应类似于：`UpToken QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

<a id="mkfile-request-body"></a>
### 请求内容

该请求的内容为每个数据块最后一个数据片上传后得到的`<ctx>`的列表，以“,”分隔，按其在源文件中的位置排序。  
注意：列表最后一项后面不需要添加“,”。

```
<lastCtxOfBlock1>,<lastCtxOfBlock2>,<lastCtxOfBlock3>,...,<lastCtxOfBlockN>
```

<a id="mkfile-request-auth"></a>
### 访问权限

[上传凭证][uploadTokenHref]方式。

<a id="mkfile-response"></a>
## 响应

<a id="mkfile-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :--------------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

其它可能返回的头部信息，请参考[常见响应头部信息][commonHttpResponseHeaderHref]。

<a id="mkfile-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"hash": "<ContentHash  string>", 
    "key":  "<Key          string>"
}
```

字段名称       | 必填 | 说明
:------------- | :--- | :------------------------------
hash           | 是   | 资源内容的SHA1值
key            | 是   | 实际资源名

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>"
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态码](#mkfile-response-status)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="mkfile-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 创建文件成功。
400	       | 请求报文格式错误。
401        | 上传凭证无效。
579        | 回调业务服务器失败。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。
614        | 目标资源已存在。

<a id="mkfile-remarks"></a>
## 附注

- 可以复用创建块时使用的上传凭证。  
- 上传凭证将被重新验证，若已过期，可以使用重新生成的凭证。  
- 若参数中指定了资源名，而所用上传策略的[scope字段](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-scope)中也指定了资源名，且两者不一致，操作将失败且返回401状态码。

<a id="mkfile-internal-resources"></a>
## 内部参考资源

- [上传凭证][uploadTokenHref]
- [创建块（mkblk）](mkblk.html)
- [上传片（bput）](bput.html)
- [URL安全的Base64编码][urlsafeBase64Href]

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[uploadTokenHref]:              http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html                    "上传凭证"
[commonHttpResponseHeaderHref]: http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html                         "常见响应头部信息"
[urlsafeBase64Href]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
