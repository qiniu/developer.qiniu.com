---
layout: docs
title: 列举资源（list）
order: 400
---

<a id="list"></a>
# 列举资源（list）

<a id="list-description"></a>
## 描述

本接口用于将指定空间内的资源分批列出。  

<a id="list-specification"></a>
## 接口规格

```
listSpec = bucket=<bucket>&marker=<marker>&limit=<limit>&prefix=<prefix>
```

参数名称          | 必填 | 说明
:---------------- | :--- | :-----------------------------
`bucket=<bucket>` | 是   | 指定空间
`marker=<marker>` |      | 上一次列举返回的位置标记，作为本次列举的起点信息
`limit=<limit>`   |      | 本次列举的条目数，范围为1-1000，缺省值为1000
`prefix=<prefix>` |      | 指定前缀，只有资源名匹配该前缀的资源会被列出，缺省值为空字符串

<a id="list-request"></a>
## 请求

<a id="list-request-syntax"></a>
### 请求报文格式

```
POST /list?<listSpec> HTTP/1.1
Host:           rsf.qbox.me
Content-Type:   application/x-www-form-urlencoded
Authorization:  QBox <AccessToken>
```

<a id="list-request-auth"></a>
### 访问权限

[管理凭证（AccessToken）][accessTokenHref]方式。

<a id="list-request-headers"></a>
### 头部信息

该请求必须指定以下头部信息。

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Host          | 是   | 管理服务器域名，固定为rsf.qbox.me
Content-Type  | 是   | 请求内容MIME类型，固定为application/x-www-form-urlencoded
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

使用本API无需设置额外头部信息。  
其它可用请求头部信息请参考[常用请求头部信息]()。

<a id="list-request-body"></a>
### 请求内容

该请求无需指定请求内容。

<a id="list-response"></a>
## 响应

<a id="list-request-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
```

<a id="list-response-headers"></a>
### 头部信息

头部名称      | 说明                              
:------------ | :--------------------------------------------------------------------
Content-Type  | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

<a id="list-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "marker": "<marker string>",
    "items": [
        {
            "key"：     "<key           string>",
            "time":      <filePutTime   int64>,
            "hash":     "<fileETag      string>",
            "fsize":    "<fileSize      string>",
            "mimeType": "<mimeType      string>",
            "customer": "<endUserId     string>"
        },
        ...
    ]
}
```

字段名称       | 必填 | 说明                              
:------------- | :--- | :------------------------------------------------------------------------------------
`marker`       | 是   | 有剩余条目则返回非空字符串，作为下一次列举的参数传入<p>如果没有剩余条目则返回空字符串
`items`        | 是   | 所有返回条目的数组，如没有剩余条目则为空数组(TODO)
    `key`      | 是   | 资源名
    `time`     | 是   | 上传时间，单位：100纳秒
    `hash`     | 是   | 资源内容的SHA1值
    `mimeType` | 是   | 资源内容的MIME类型
    `customer` | 是   | 资源内容的唯一属主标识，请参考[上传策略][putPolicyHref]

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#list-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="list-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 列举成功
400	       | 请求报文格式错误
401        | 管理凭证无效
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="list-example1-command"></a>
### 命令行示例

```
TODO
```

<a id="list-remarks"></a>
## 附注

无。

<a id="list-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [上传策略][putPolicyHref]

[sendBugReportHref]: mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[accessTokenHref]:   http://docs.qiniu.com/api/v6/rs.html#digest-auth "管理凭证"
[putPolicyHref]:     ../token/upload.html#upload-policy               "上传策略"
