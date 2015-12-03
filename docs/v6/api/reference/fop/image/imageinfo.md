---
layout: docs
title: 基本信息（imageInfo）
order: 234
---

<a id="imageinfo"></a>
# 图片基本信息（imageInfo）

- [描述](#imageinfo-description)
- [请求](#imageinfo-request)
    - [请求报文格式](#imageinfo-request-syntax)
    - [请求头部](#imageinfo-request-header) 
- [响应](#imageinfo-response)
    - [响应报文格式](#imageinfo-response-syntax)
	- [响应头部](#imageinfo-response-header)
    - [响应内容](#imageinfo-response-content) 
    - [响应状态码](#imageinfo-response-code)
- [示例](#imageinfo-samples)
- [内部参考资源](#imageinfo-internal-resources)

<a id="imageinfo-description"></a>
## 描述

图片基本信息包括图片格式、图片大小、色彩模型。  
在图片下载URL后附加`imageInfo`指示符（区分大小写），即可获取JSON格式的图片基本信息。  

<a id="imageinfo-request"></a>
## 请求

<a id="imageinfo-request-syntax"></a>
### 请求报文格式

```
GET <ImageDownloadURI>?imageInfo HTTP/1.1
Host: <ImageDownloadHost>
```
**注意：**当您下载私有空间的资源时，`ImageDownloadURI`的生成方法请参考七牛的[下载凭证][download-tokenHref]。

**示例：**
资源为`http://developer.qiniu.com/resource/gogopher.jpg`，处理样式为`imageInfo`。

```
#构造下载URL

DownloadUrl = 'http://developer.qiniu.com/resource/gogopher.jpg?imageInfo'
……

#最后得到

RealDownloadUrl = 'http://developer.qiniu.com/resource/gogopher.jpg?imageInfo&e=×××&token=MY_ACCESS_KEY:×××'
```

<a id="imageinfo-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[七牛自定义域名绑定流程][cnameBindingHref]

<a id="imageinfo-response"></a>
## 响应

<a id="imageinfo-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "format":       "<ImageType         string>",
    "width":         <ImageWidth        int>,
    "height":        <ImageHeight       int>,
    "colorModel":   "<ImageColorModel   string>",
    "frameNumber":   <ImageFrameNumber  int>
}
```

<a id="imageinfo-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="imageinfo-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "format":       "<ImageType         string>",
    "width":         <ImageWidth        int>,
    "height":        <ImageHeight       int>,
    "colorModel":   "<ImageColorModel   string>",
    "frameNumber":   <ImageFrameNumber  int>
}
```

字段名称       | 必填   | 说明
:------------- | :----- | :------------------------------
format         | 是     | 图片类型，如png、jpeg、gif、bmp等。
width          | 是     | 图片宽度，单位：像素（px）。
height         | 是     | 图片高度，单位：像素（px）。
colorModel     | 是     | 彩色空间，如palette16、ycbcr等。
frameNumber    |        | 帧数，gif 图片会返回此项。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态码](#imageinfo-response-code)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageinfo-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 下载成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="imageinfo-samples"></a>
## 示例

1. 获取图片基本信息：  

	在Web浏览器中输入以下图片地址  

	```
   http://developer.qiniu.com/resource/gogopher.jpg?imageInfo
	```

	返回结果（内容经过格式化以便阅读）  

	```
    {
        "format":       "jpeg",
        "width":        640,
        "height":       427,
        "colorModel":   "ycbcr"
    }
	```

<a id="imageinfo-internal-resources"></a>
## 内部参考资源

- [七牛自定义域名绑定流程][cnameBindingHref]

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"
[download-tokenHref]: http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html  "下载凭证"