---
layout: docs
title: 图片EXIF信息（exif）
order: 172
---

<a id="exif-exif"></a>
# 图片EXIF信息（exif）

<a id="exif-description"></a>
## 描述

[EXIF（EXchangeable Image File Format）](http://zh.wikipedia.org/wiki/EXIF)是专门为数码相机的照片设定的可交换图像文件格式，通过在图片下载URL后附加`exif`指示符（区分大小写）获取。  

注意：缩略图等经过云处理的新图片不支持该方法。  

<a id="exif-request"></a>
## 请求

<a id="exif-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadUri>?exif HTTP/1.1
Host: <imageDownloadHost>
```

<a id="exif-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="exif-response"></a>
## 响应

<a id="exif-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    // ...EXIF Data...
}
```

<a id="exif-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="exif-response-content"></a>
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

各EXIF字段说明，请参考[EXIF技术白皮书][exifWhitePaperHref]。  

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#exif-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="exif-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 下载成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="exif-samples"></a>
## 示例

1. 获取图片EXIF信息  

	在Web浏览器中输入以下图片地址：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?exif
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

<a id="exif-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]

<a id="exif-external-resources"></a>
## 外部参考资源

- [EXIF技术白皮书][exifWhitePaperHref]

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"

[exifWhitePaperHref]            http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf  "EXIF技术白皮书"
