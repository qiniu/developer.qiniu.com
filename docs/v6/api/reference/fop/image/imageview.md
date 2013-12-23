---
layout: docs
title: 图片处理（imageView）
order: 175
---

<a id="imageView"></a>
# 图片处理（imageView）

<a id="imageView-description"></a>
## 描述

imageView是七牛云存储提供的一种简易却强大的图片处理接口，只需要填写少数几个参数即可对图片进行缩放操作，生成各种缩略图。  

<a id="imageView-specification"></a>
## 接口规格

```
imageViewSpec = imageView/<mode>
                         /w/<width>
                         /h/<height>
                         /q/<quality>
                         /format/<format>
```

参数名称            | 必填  | 说明
:------------------ | :---- | :----------------------------------------------------------
`/<mode>`           | 是    | 图像缩放处理模式
`/w/<width>`        |       | 目标图片的宽度，单位：像素（px）
`/h/<height>`       |       | 目标图片的高度，单位：像素（px）
`/q/<quality>`      |       | 目标图片的图像质量，取值范围：1-100，缺省为85
`/format/<format>`  |       | 目标图片的输出格式，取值范围：jpg，gif，png，webp等，缺省为原图格式

其中 `<mode>` 分为如下几种情况：  

模式         | 说明
:----------- | :----------------------------------------------------------------------------------------------
`<mode>=1`   | 同时指定宽度和高度，等比裁剪原图正中部分并缩放为<Width>x<Height>大小的新图片
`<mode>=2`   | 同时指定宽度和高度，原图缩小为不超出<Width>x<Height>大小的缩略图，避免裁剪长边
`<mode>=2`   | 仅指定宽度，高度等比缩小
`<mode>=2`   | 仅指定高度，宽度等比缩小

<a id="imageView-request"></a>
## 请求

<a id="imageView-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadURI>?<imageViewSpec> HTTP/1.1
Host: <imageDownloadHost>
```

<a id="imageView-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="imageView-response"></a>
## 响应

<a id="imageView-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: <imageMimeType>

<imageBinaryData>
```

<a id="imageView-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，成功时为图片的MIME类型，失败时为application/json
Cache-Control  |      | 缓存控制，失败时为no-store，不缓存

<a id="imageView-response-content"></a>
### 响应内容

■ 如果请求成功，返回图片的二进制数据。  

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <httpCode  int>, 
    "error":   "<errMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#imageView-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageView-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 缩放成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imageView-remarks"></a>
## 附注

- imageView生成的图片会被七牛云存储缓存以加速下载，但不会持久化。需要持久化的缩略图，请参考[触发异步处理][pfopHref]和[saveas处理][saveasHref]。  

<a id="imageView-samples"></a>
## 示例

1. 裁剪正中部分，等比缩小生成200x200缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/1/w/200/h/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/1/w/200/h/200)

2. 裁剪正中部分，等比放大生成500x500放大图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/1/w/500/h/500
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/1/w/500/h/500)

3. 宽度固定为200px，高度等比缩小，生成200x133缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/2/w/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/2/w/200)

4. 高度固定为200px，宽度等比缩小，生成300x200缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/2/h/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView/2/h/200)

---

<a id="imageView-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]
- [触发异步处理][pfopHref]
- [saveas处理][saveasHref]

[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"
[pfopHref]:                     ../pfop/pfop.html                            "触发异步处理"
[saveasHref]:                   ../saveas.html                                   "saveas处理"

[thumbnailHref]:                ../../list/thumbnail.html                       "缩略图文档列表"
[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
