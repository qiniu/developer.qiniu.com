---
layout: docs
title: 图片基本信息（imageInfo）
order: 173
---

<a id="imageInfo"></a>
# 图片基本信息（imageInfo）

<a id="imageInfo-description"></a>
## 描述

图片基本信息包括图片格式、图片大小、色彩模型。  
在图片下载URL后附加`imageInfo`指示符（区分大小写），即可获取JSON格式的图片基本信息。  

---

<a id="imageInfo-request"></a>
## 请求

<a id="imageInfo-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadUri>?imageInfo HTTP/1.1
Host: <imageDownloadHost>
```

<a id="imageInfo-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="imageInfo-response"></a>
## 响应

<a id="imageInfo-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "format":       "<ImageType         string>",
    "width":         <ImageWidth        int>,
    "height":        <ImageHeight       int>,
    "colorModel":   "<ImageColorModel   string>"
}
```

<a id="imageInfo-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="imageInfo-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "format":       "<ImageType         string>",
    "width":         <ImageWidth        int>,
    "height":        <ImageHeight       int>,
    "colorModel":   "<ImageColorModel   string>"
}
```

字段名称       | 必填   | 说明
:------------- | :----- | :------------------------------
format         | 是     | 图片类型，如png、jpeg、gif、bmp等
width          | 是     | 图片宽度，单位：像素（px）
height         | 是     | 图片高度，单位：像素（px）
colorModel     | 是     | 彩色空间，如palette16、ycbcr等

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#imageInfo-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageInfo-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 下载成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imageInfo-remarks"></a>
## 附注

- 缩略图等经过云处理的新图片不支持该方法。  

---

<a id="imageInfo-samples"></a>
## 示例

1. 获取图片基本信息：  

	在Web浏览器中输入以下图片地址  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageInfo
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

<a id="imageInfo-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"
