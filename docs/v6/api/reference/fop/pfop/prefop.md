---
layout: docs
title: 持久化处理状态查询
order: 200
---

<a id="prefop"></a>
# 持久化处理状态查询（prefop）

<a id="prefop-description"></a>
## 描述

用户可以使用`<persistentId>`来主动查询持久化处理的执行状态。  

<a id="prefop-specification"></a>
## 接口规格

```
id=<persistentId>
```

<a id="prefop-specification-params"></a>
## 接口参数

参数名称      | 必填 | 说明
:------------ | :--- | :--------------------------------------------------
`id`          | 是   | 上传预处理或持久化处理接口返回的`<persistentId>`。

<a id="prefop-request"></a>
## 请求

<a id="prefop-request-syntax"></a>
### 请求语法

```
GET /status/get/prefop?id=<persistentId> HTTP/1.1
Host: api.qiniu.com  
```

<a id="prefop-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------
Host          | 是   | 固定为`api.qiniu.com`。

<a id="prefop-response"></a>
## 响应

<a id="prefop-request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: <prefopResponseContentLength>

<prefopResponseContent>
```

<a id="prefop-response-headers"></a>
### 头部信息

头部名称      | 必填 | 说明                              
:------------ | :--- | :----------------------------------------------------------------
Content-Type  | 是   | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。

<a id="prefop-response-body"></a>
### 响应内容

- 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "id": "16864pauo1vc9nhp12",
    "code": 0,
    "desc": "The fop was completed successfully",
    "inputKey": "sample.mp4",
    "inputBucket": "dutest",
    "items": [
        {
            "cmd": "avthumb/mp4/r/30/vb/256k/vcodec/libx264/ar/22061/ab/64k/acodec/libmp3lame",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FrPNF2qz66Bt14JMdgU8Ya7axZx-",
            "key": "v-PtT-DzpyCcqv6xNU25neTMkcc=/FjgJQXuH7OresQL4zgRqYG5bZ64x",
            "returnOld": 0
        },
        {
            "cmd": "avthumb/iphone_low",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FmZ5PbHMYD5uuP1-kHaLjKbrv-75",
            "key": "tZ-w8jHlQ0__PYJdiisskrK5h3k=/FjgJQXuH7OresQL4zgRqYG5bZ64x",
            "returnOld": 0
        },
        {
            "cmd": "avthumb/m3u8/r/30/vb/256k/vcodec/libx264/ar/22071/ab/64k/acodec/libmp3lame",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "Fi4gMX0SvKVvptxfvoiuDfFkCuEG",
            "key": "8ehryqviSaMIjkVQDGeDcKRZ6qc=/FjgJQXuH7OresQL4zgRqYG5bZ64x",
            "returnOld": 0
        },
        {
            "cmd": "avthumb/m3u8/vb/440k",
            "code": 0,
            "desc": "The fop was completed successfully",
            "error": "",
            "hash": "FtuxnwAY9NVBxAZLcxNUuToR9y97",
            "key": "s2_PQlcIOz1uP6VVBXk5O9dXYLY=/FjgJQXuH7OresQL4zgRqYG5bZ64x",
            "returnOld": 0
        }
    ],
    pipeline: "0.default",
    reqid: "ffmpeg.3hMAAH3p5Gupb6oT"
}
```

字段名称      | 必填  | 说明
:------------ | :---- | :------------------------------------------------
`id`          | 是    | 持久化处理的进程ID，即前文中的`<persistentId>`。
`code`        | 是    | 状态码，`0`（成功），`1`（等待处理），`2`（正在处理），`3`（处理失败），`4`（通知提交失败）。
`desc`        | 是    | 与状态码相对应的详细描述。
`inputKey`    | 是    | 处理源文件的文件名。
`inputBucket` | 是    | 处理源文件所在的空间名。
`items`       | 是    | 云处理操作列表，包含每个云处理操作的状态信息。
    `cmd`     | 是    | 所执行的云处理操作命令（fopN）。
    `error`   |       | 如果处理失败，该字段会给出失败的详细原因。
    `hash`    | 是    | 云处理结果保存在服务端的唯一`hash`标识。
    `key`     | 是    | 云处理结果的外链资源名（Key）。
     `returnOld` | 是    | 默认为0。当用户执行saveas时，如果未加force且指定的bucket：key存在，则返回1 ，告诉用户返回的是旧数据。
`pipeline`    | 是    | 云处理操作的处理队列，默认使用队列为共享队列`0.default`。
`reqid`       | 是    | 云处理请求的请求id，主要用于七牛技术人员的问题排查。

- 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<ErrMsg    string>"
}
```

<a id="pfop-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 查询成功
400	       | 请求报文格式错误
612        | 查询对象不存在
599	       | 服务端操作失败<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
