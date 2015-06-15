---
layout: docs
title: 图片Exif信息（Exif）
order: 235
---

<a id="Exif-Exif"></a>
# 图片Exif信息（Exif）

- [描述](#Exif-description)
- [请求](#Exif-request)
    - [请求报文格式](#Exif-request-syntax)
    - [请求头部](#Exif-request-header) 	
- [响应](#Exif-response)
    - [响应报文格式](#Exif-response-syntax)
	- [响应头部](#Exif-response-header)
    - [响应内容](#Exif-response-content) 	 	
    - [响应状态码](#Exif-response-code)
- [示例](#Exif-samples)
- [内部参考资源](#Exif-internal-resources)
- [外部参考资源](#Exif-internal-resources)

<a id="Exif-description"></a>
## 描述

[Exif（EXchangeable Image File Format）](http://zh.wikipedia.org/wiki/Exif)是专门为数码相机的照片设定的可交换图像文件格式，通过在图片下载URL后附加`Exif`指示符（区分大小写）获取。  

注意：缩略图等经过云处理的新图片不支持该方法。  

<a id="Exif-request"></a>
## 请求

<a id="Exif-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadUri>?Exif HTTP/1.1
Host: <imageDownloadHost>
```

<a id="Exif-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="Exif-response"></a>
## 响应

<a id="Exif-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    // ...Exif Data...
}
```

<a id="Exif-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="Exif-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
   "DateTime" : {
      "type" : 2,
      "val" : "2011:11:19 17:09:23"
   },
   "ExposureBiasValue" : {
      "type" : 10,
      "val" : "0.33 EV"
   },
   ...
}
```

各Exif字段说明，请参考[Exif技术白皮书][ExifWhitePaperHref]。  

■ 如果请求失败，返回包含错误信息的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":   "<errMsg    string>"
}
```

<a id="Exif-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 下载成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="Exif-samples"></a>
## 示例

1. 获取图片Exif信息  

	在Web浏览器中输入以下图片地址：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?Exif
	```

	返回结果（内容经过格式化以便阅读）  

	```
    {
       "DateTime" : {
          "type" : 2,
          "val" : "2011:11:19 17:09:23"
       },
       "ExposureBiasValue" : {
          "type" : 10,
          "val" : "0.33 EV"
       },
       "ExposureTime" : {
          "type" : 5,
          "val" : "1/50 sec."
       },
       "Model" : {
          "type" : 2,
          "val" : "Canon EOS 600D"
       },
       "ISOSpeedRatings" : {
          "type" : 3,
          "val" : "3200"
       },
       "ResolutionUnit" : {
          "type" : 3,
          "val" : " 英寸"
       },

       ...后续内容已省略...
    }
	```

---

<a id="Exif-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]

<a id="Exif-external-resources"></a>
## 外部参考资源

- [Exif技术白皮书][ExifWhitePaperHref]

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"

[ExifWhitePaperHref]:           http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf  "Exif技术白皮书"
