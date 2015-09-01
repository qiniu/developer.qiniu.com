---
layout: docs
title: 主色调（imageAve）
order: 231
---

<a id="imageAve"></a>
# 图片主色调（imageAve）

- [描述](#imageinfo-description)
- [请求](#imageinfo-request)
    - [请求报文格式](#imageinfo-request-syntax)
    - [请求头部](#imageinfo-request-header) 
- [响应](#imageinfo-response)
    - [响应报文格式](#imageinfo-response-syntax)
	- [响应头部](#imageinfo-response-header)
    - [响应内容](#imageinfo-response-content) 
    - [响应状态码](#imageinfo-response-code)
- [附注](#imageinfo-remarks)
- [示例](#imageinfo-samples)
- [内部参考资源](#imageinfo-internal-resources)


<a id="imageAve-description"></a>
## 描述

本接口用于计算一幅图片的平均色调，并以`0xRRGGBB`形式返回。  

---

<a id="imageAve-request"></a>
## 请求

<a id="imageAve-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadUri>?imageAve HTTP/1.1
Host: <imageDownloadHost>
```

<a id="imageAve-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="imageAve-response"></a>
## 响应

<a id="imageAve-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "RGB": "<ImageAve string>"
}
```

<a id="imageAve-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="imageAve-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "RGB": "<ImageAve string>"
}
```

字段名称       | 必填   | 说明
:------------- | :----- | :------------------------------
RGB            | 是     | 图片主色调，0xRRGGBB格式。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#imageAve-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageAve-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 请求成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imageAve-remarks"></a>
## 附注

- 缩略图等经过云处理的新图片不支持该方法。  

---

<a id="imageAve-samples"></a>
## 示例

1. 获取图片主色调：  

	在Web浏览器中输入以下图片地址  

	```
   http://developer.qiniu.com/resource/gogopher.jpg?imageAve
	```

	返回结果（内容经过格式化以便阅读）  

	```
    {
        "RGB": "0x85694d"
    }
	```

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
