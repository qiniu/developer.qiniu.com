---
layout: docs
title: 触发持久化处理（pfop）
order: 300
---

<a id="pfop-existing-resource"></a>
# 触发持久化处理（pfop）

<a id="pfop-description"></a>
## 描述

如果需要对已保存在空间中的资源进行云处理并将结果持久化，可以使用`pfop`接口。  

<a id="pfop-specification"></a>
## 接口规格

无。

<a id="pfop-request"></a>
## 请求

<a id="pfop-request-syntax"></a>
### 请求语法

```
POST /pfop/ HTTP/1.1
Host: api.qiniu.com  
Content-Type: application/x-www-form-urlencoded  
Authorization: QBox <AccessToken>  

<PfopRequestParams>
```

<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

<a id="pfop-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------
Host          | 是   | 固定为`api.qiniu.com`。
Content-Type  | 是   | 固定为`application/x-www-form-urlencoded`。
Authorization | 是   | 该参数应严格按照[管理凭证][accessTokenHref]格式进行填充，否则会返回401错误码。<br>一个合法的Authorization值应类似于：`QBox QNJi_bYJlmO5LeY08FfoNj9w_r7...`。

<a id="pfop-request-auth"></a>
### 访问权限

[管理凭证][accessTokenHref]方式。

<a id="pfop-request-params"></a>
### 请求参数

请求参数以表单形式组织，作为请求内容提交，格式如下：  

```
bucket=<urlEncodedBucket>&key=<urlEncodedKey>&fops=<urlEncodedFops>&notifyURL=<urlEncodedPersistentNotifyUrl>&force=<Force>&pipeline=<Pipeline Name>
```

参数名称      | 必填 | 需要[URL转义][urlescapeHref] | 说明
:------------ | :--- | :--------------------------- | :----------------------------------------------------------------
`bucket`      | 是   | 是                           | 资源空间。
`key`         | 是   | 是                           | 源资源名。
`fops`        | 是   | 是                           | 云处理操作列表，用 `;` 分隔，整个字串（包括 `;` 分隔符）进行[URL转义][urlescapeHref]，含义请参见[persistentOps详解](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops-explanation)。
`notifyURL`   | 是   | 是                           | 处理结果通知接收URL，请参考[处理结果通知](#pfop-notification)小节。
<a id="pfop-force"></a>`force`       |      |       | 强制执行数据处理。<br>当服务端发现fops指定的数据处理结果已经存在，那就认为已经处理成功，避免重复处理浪费资源。加上本字段并设为1，则可强制执行数据处理并覆盖原结果。
`pipeline`	  |    |  | 指定独立的队列，转码的时候使用独立的计算资源

<a id="pfop-response"></a>
## 响应

<a id="pfop-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: <PfopResponseContentLength>

<PfopResponseContent>
```

<a id="pfop-response-headers"></a>
### 头部信息

头部名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
Content-Type  | 是    | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

<a id="pfop-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "persistentId": <persistentId int64>
}
```

字段名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
persistentId  | 是    | 持久化处理会话标识，可用于查询处理进度，请参考[持久化处理状态查询](http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/prefop.html)。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

<a id="pfop-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 触发持久化处理成功。
400	       | 请求报文格式错误。
401        | 管理凭证无效。
404        | 资源不存在。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="pfop-failures"></a>
## 故障排除

1. 301跳转问题

如果遇到类似如下301跳转现象，请检查Pfop的URL最后是否少了一个斜杠符号（"/"），误写成`http://api.qiniu.com/pfop`：  

```
W, [2014-04-05T00:14:07.748721 #686]  WARN -- : 301 Moved Permanently => Qiniu::HTTP.post('http://api.qiniu.com/pfop')
```

正确写法是`http://api.qiniu.com/pfop/`。  

<a id="pfop-notification"></a>
# 处理结果通知

服务端按顺序完成所有指定的云处理操作后，会将处理结果状态提交到`<persistentNotifyUrl>`指向的网址。   

<a id="pfop-notification-request"></a>
## 请求

<a id="pfop-notification-request-syntax"></a>
### 请求语法

```
POST <persistentNotifyUri> HTTP/1.1
Host:         <persistentNotifyDomain>
Content-Type: application/json

<JsonStatusDescription>
```

<a id="pfop-request-headers"></a>
### 头部信息

该请求会指定以下头部信息。

头部名称      | 必填 | 说明                                    
:------------ | :--- | :-------------------------------------------
Host          | 是   | 接收持久化处理结果状态的服务器域名。
Content-Type  | 是   | 固定为`application/json`。

<a id="pfop-request-content"></a>
### 请求内容

用户获得的持久化云处理结果状态是一个JSON字符串，内容范例如下：

```
{
    "id": "16864pauo1vc9nhp12",
    "code": 0,
    "desc": "The fop was completed successfully",
    "items": [
        {
            "cmd": "avthumb/mp4/r/30/vb/256k/vcodec/libx264/ar/22061/ab/64k/acodec/libmp3lame",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FrPNF2qz66Bt14JMdgU8Ya7axZx-",
            "key": "v-PtT-DzpyCcqv6xNU25neTMkcc=/FjgJQXuH7OresQL4zgRqYG5bZ64x"
        },
        {
            "cmd": "avthumb/iphone_low",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FmZ5PbHMYD5uuP1-kHaLjKbrv-75",
            "key": "tZ-w8jHlQ0__PYJdiisskrK5h3k=/FjgJQXuH7OresQL4zgRqYG5bZ64x"
        },
        {
            "cmd": "avthumb/m3u8/r/30/vb/256k/vcodec/libx264/ar/22071/ab/64k/acodec/libmp3lame",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "Fi4gMX0SvKVvptxfvoiuDfFkCuEG",
            "key": "8ehryqviSaMIjkVQDGeDcKRZ6qc=/FjgJQXuH7OresQL4zgRqYG5bZ64x"
        },
        {
            "cmd": "avthumb/m3u8/preset/video_16x9_440k",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FtuxnwAY9NVBxAZLcxNUuToR9y97",
            "key": "s2_PQlcIOz1uP6VVBXk5O9dXYLY=/FjgJQXuH7OresQL4zgRqYG5bZ64x"
        }
    ]
}
```

字段名称      | 必填 | 说明
:------------ | :--- | :------------------------------------------
`id`          | 是   | 持久化处理的进程ID，即前文中的`<persistentId>`。
`code`        | 是   | 状态码，`0`（成功），`1`（等待处理），`2`（正在处理），`3`（处理失败），`4`（通知提交失败）。
`desc`        | 是   | 与状态码相对应的详细描述。
`items`       | 是   | 云处理操作列表，包含每个云处理操作的状态信息。
    `cmd`     | 是   | 所执行的云处理操作命令（fopN）。
    `error`   |      | 如果处理失败，该字段会给出失败的详细原因。
    `hash`    | 是   | 云处理结果保存在服务端的唯一`hash`标识。
    `key`     | 是   | 云处理结果的外链资源名（Key）。
    
上述范例中，`avthumb/iphone_low`的这一处理结果可以通过如下URL访问：  

```
http://<domain>/tZ-w8jHlQ0__PYJdiisskrK5h3k=/FjgJQXuH7OresQL4zgRqYG5bZ64x
```

[accessTokenHref]:      http://developer.qiniu.com/docs/v6/api/reference/security/access-token.html                 "管理凭证"
[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"

[urlescapeHref]:            http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
