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
bucket=<UrlEncodedBucket>&marker=<Marker>&limit=<Limit>&prefix=<UrlEncodedPrefix>&delimiter=<UrlEncodedDelimiter>
```

参数名称    | 必填 | 需要[URL转义][urlescapeHref] | 说明
:---------- | :--- | :--------------------------- | :-----------------------------
`bucket`    | 是   | 是                           | 指定空间。
`limit`     |      |                              | 本次列举的条目数，范围为1-1000。<p>缺省值为1000。
`prefix`    |      | 是                           | 指定前缀，只有资源名匹配该前缀的资源会被列出。<p>缺省值为空字符串。
`delimiter` |      | 是                           | 指定目录分隔符，列出所有公共前缀（模拟列出目录效果）。<p>缺省值为空字符串。
`marker`    |      |                              | 上一次列举返回的位置标记，作为本次列举的起点信息。<p>缺省值为空字符串。

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

[管理凭证][accessTokenHref]方式。

<a id="list-request-headers"></a>
### 头部信息

该请求必须指定以下头部信息。

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
Host          | 是   | 管理服务器域名，固定为`rsf.qbox.me`。
Content-Type  | 是   | 请求内容MIME类型，固定为`application/x-www-form-urlencoded`。
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码。<p>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

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
    "commonPrefixes": [
        "xxx",
        "yyy"
    ],
    "items": [
        {
            "key"：     "<key           string>",
            "putTime":   <filePutTime   int64>,
            "hash":     "<fileETag      string>",
            "fsize":     <fileSize      int64>,
            "mimeType": "<mimeType      string>",
            "customer": "<endUserId     string>"
        },
        ...
    ]
}
```

字段名称         | 必填 | 说明                              
:--------------- | :--- | :------------------------------------------------------------------------------------
`marker`         |      | 有剩余条目则返回非空字符串，作为下一次列举的参数传入。<p>如果没有剩余条目则返回空字符串。
`commonPrefixes` |      | 所有目录名的数组，如没有指定`delimiter`参数则不输出。
`items`          | 是   | 所有返回条目的数组，如没有剩余条目则为空数组。
    `key`        | 是   | 资源名。
    `putTime`    | 是   | 上传时间，单位：100纳秒，其值去掉低七位即为[Unix时间][unixTimeHref]。
    `fsize`      | 是   | 资源内容的大小，单位：字节。
    `hash`       | 是   | 资源内容的[ETag](../../overview/appendix.html#qiniu-etag)值。
    `mimeType`   | 是   | 资源内容的MIME类型。
    `customer`   |      | 资源内容的唯一属主标识，请参考[上传策略][putPolicyHref]。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#list-response-status)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="list-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 列举成功。
400	       | 请求报文格式错误。
401        | 管理凭证无效。
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="list-remarks"></a>
## 附注

无。

<a id="list-samples"></a>
## 示例

1. 列出所有`00`打头的资源：  

```
接口规格
bucket=qiniu-ts-demo&prefix=00

返回结果
{"items"=>[{"key"=>"00000001.txt", "hash"=>"Fi2XEahn6IfmwBLwvXb0HGowjyym", "fsize"=>93966, "mimeType"=>"text/plain", "putTime"=>13993416549476933}, {"key"=>"00000002.txt", "hash"=>"Foiz8WAEOgOo8B-lyYegCHcl6VSb", "fsize"=>172422, "mimeType"=>"text/plain", "putTime"=>13993416551051809}, {"key"=>"00000003.txt", "hash"=>"FgsZJh9ACX9-tz2PWjKfFpURlXU2", "fsize"=>175778, "mimeType"=>"text/plain", "putTime"=>13993416553903813}, ...更多内容已省略...]}
```

2. 列出所有`00`打头的资源，每批2个：

```
接口规格
bucket=qiniu-ts-demo&prefix=00&limit=2

返回结果
{"marker"=>"eyJjIjowLCJrIjoiMDAwMDAwMDIuRENNIn0=", "items"=>[{"key"=>"00000001.txt", "hash"=>"Fi2XEahn6IfmwBLwvXb0HGowjyym", "fsize"=>93966, "mimeType"=>"text/plain", "putTime"=>13993416549476933}, {"key"=>"00000002.txt", "hash"=>"Foiz8WAEOgOo8B-lyYegCHcl6VSb", "fsize"=>172422, "mimeType"=>"text/plain", "putTime"=>13993416551051809}]}
{"marker"=>"eyJjIjowLCJrIjoiMDAwMDAwMDQuRENNIn0=", "items"=>[{"key"=>"00000003.txt", "hash"=>"FgsZJh9ACX9-tz2PWjKfFpURlXU2", "fsize"=>175778, "mimeType"=>"text/plain", "putTime"=>13993416553903813}, {"key"=>"00000004.txt", "hash"=>"FikIBhnekDHYA8xugBDchkOrnpEx", "fsize"=>177876, "mimeType"=>"text/plain", "putTime"=>13993416555380554}]}
...更多内容已省略...
```

3. 列出所有`00`打头的资源，包括目录，每批2个：

```
接口规格
bucket=qiniu-ts-demo&prefix=00&limit=2&delimiter=%2F

返回结果
{"marker"=>"eyJjIjowLCJrIjoiMDAwMDAwQ0MuRENNIn0=", "items"=>[{"key"=>"000000CB.txt", "hash"=>"FhSEKlNHeuI1w89AvZMP4ZtlijrO", "fsize"=>208472, "mimeType"=>"text/plain", "putTime"=>13993417254549955}, {"key"=>"000000CC.txt", "hash"=>"FtEIQ24V4Dbx9PVrgK-6S1R3zvbn", "fsize"=>209004, "mimeType"=>"text/plain", "putTime"=>13993417256200466}]}
{"marker"=>"eyJjIjowLCJrIjoiMDAwMDAwQ0UuRENNIn0=", "items"=>[{"key"=>"000000CD.txt", "hash"=>"FsfU5MxvxQxhvxts1KBBbZYPwhui", "fsize"=>210170, "mimeType"=>"text/plain", "putTime"=>13993417258134446}, {"key"=>"000000CE.txt", "hash"=>"FjLnLfzKyNpPHAWcjhRLnwEj-1EP", "fsize"=>209276, "mimeType"=>"text/plain", "putTime"=>13993417259836335}]}
{"marker"=>"eyJjIjowLCJrIjoiMDAyLzAwMDAwMDAyLkRDTSJ9", "items"=>[], "commonPrefixes"=>["001/", "002/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDA0LzAwMDAwMDA0LkRDTSJ9", "items"=>[], "commonPrefixes"=>["003/", "004/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDA2LzAwMDAwMDA2LkRDTSJ9", "items"=>[], "commonPrefixes"=>["005/", "006/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDA4LzAwMDAwMDA4LkRDTSJ9", "items"=>[], "commonPrefixes"=>["007/", "008/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDBBLzAwMDAwMDBBLkRDTSJ9", "items"=>[], "commonPrefixes"=>["009/", "00A/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDBDLzAwMDAwMDBDLkRDTSJ9", "items"=>[], "commonPrefixes"=>["00B/", "00C/"]}
{"marker"=>"eyJjIjowLCJrIjoiMDBFLzAwMDAwMDBFLkRDTSJ9", "items"=>[], "commonPrefixes"=>["00D/", "00E/"]}
{"items"=>[], "commonPrefixes"=>["00F/"]}
```

<a id="list-internal-resources"></a>
## 内部参考资源

- [管理凭证][accessTokenHref]
- [上传策略][putPolicyHref]

<a id="list-external-resources"></a>
## 外部参考资源

- [Unix时间][unixTimeHref]
- [URL转义][urlescapeHref]

[sendBugReportHref]: mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[accessTokenHref]:   ../security/access-token.html                    "管理凭证"
[putPolicyHref]:     ../security/put-policy.html                      "上传策略"

[unixTimeHref]:      http://en.wikipedia.org/wiki/Unix_time           "Unix时间"

[urlescapeHref]:     http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
