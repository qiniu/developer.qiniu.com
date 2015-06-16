---
layout: docs
title: 基本图片处理版本2
order: 238
---

<a id="imageview2"></a>
# 基本图片处理版本2

- [描述](#imageView2-description)
- [接口规格](#imageView2-specification)
- [请求](#imageView2-request)
    - [请求报文格式](#imageView2-request-syntax)
    - [请求头部](#imageView2-request-header) 	
- [响应](#imageView2-response)
    - [响应报文格式](#imageView2-response-syntax)
	- [响应头部](#imageView2-response-header)
    - [响应内容](#imageView2-response-content) 	 	
    - [响应状态码](#imageView2-response-code)
- [附注](#imageView2-remarks)
- [示例](#imageView2-samples)
- [内部参考资源](#imageView2-internal-resources)

<a id="imageView2-description"></a>
## 描述

imageView2是原[imageView接口](http://developer.qiniu.com/docs/v6/api/reference/obsolete/imageview.html)的更新版本，实现略有差异，功能更为丰富。  
同样，只需要填写几个参数即可对图片进行缩略操作，生成各种缩略图。  

<a id="imageView2-specification"></a>
## 接口规格

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
imageView2/<mode>
          /w/<Width>
          /h/<Height>
          /format/<Format>
```

或

```
imageView2/<mode>
          /w/<LongEdge>
          /h/<ShortEdge>
          /format/<Format>
          /interlace/<Interlace>
```

其中 `<mode>` 分为如下几种情况：  

模式                            | 说明
:------------------------------ | :----------------------------------------------------------------------------
`/0/w/<LongEdge>/h/<ShortEdge>` | 限定缩略图的长边最多为`<LongEdge>`，短边最多为`<ShortEdge>`，进行等比缩放，不裁剪。如果只指定 w 参数则表示限定长边（短边自适应），只指定 h 参数则表示限定短边（长边自适应）。
`/1/w/<Width>/h/<Height>`       | 限定缩略图的宽最少为`<Width>`，高最少为`<Height>`，进行等比缩放，居中裁剪。转后的缩略图通常恰好是 `<Width>x<Height>` 的大小（有一个边缩放的时候会因为超出矩形框而被裁剪掉多余部分）。如果只指定 w 参数或只指定 h 参数，代表限定为长宽相等的正方图。
`/2/w/<Width>/h/<Height>`       | 限定缩略图的宽最多为`<Width>`，高最多为`<Height>`，进行等比缩放，不裁剪。如果只指定 w 参数则表示限定宽（长自适应），只指定 h 参数则表示限定长（宽自适应）。它和模式0类似，区别只是限定宽和高，不是限定长边和短边。从应用场景来说，模式0适合移动设备上做缩略图，模式2适合PC上做缩略图。
`/3/w/<Width>/h/<Height>`       | 限定缩略图的宽最少为`<Width>`，高最少为`<Height>`，进行等比缩放，不裁剪。如果只指定 w 参数或只指定 h 参数，代表长宽限定为同样的值。你可以理解为模式1是模式3的结果再做居中裁剪得到的。
`/4/w/<LongEdge>/h/<ShortEdge>` | 限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，不裁剪。如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。这个模式很适合在手持设备做图片的全屏查看（把这里的长边短边分别设为手机屏幕的分辨率即可），生成的图片尺寸刚好充满整个屏幕（某一个边可能会超出屏幕）。
`/5/w/<LongEdge>/h/<ShortEdge>` | 限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，居中裁剪。如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。同上模式4，但超出限定的矩形部分会被裁剪。

注意：  

1. 可以仅指定w参数或h参数；  
2. 新图的宽/高/长边/短边，不会比原图大，即本接口总是缩小图片；
3. 所有模式都可以只指定w参数或只指定h参数，并获得合理结果。在w、h为限定最大值时，未指定某参数等价于将该参数设置为无穷大（自适应）；在w、h为限定最小值时，未指定参数等于给定的参数，也就限定的矩形是正方形。

参数名称            | 必填  | 说明
:------------------ | :---- | :--------------------------------------------------------------------------------
`/format/<Format>`  |       | ● 新图的输出格式<br>取值范围：jpg，gif，png，webp等，缺省为原图格式。<br>参考[支持转换的图片格式](http://www.imagemagick.org/script/formats.php)。
<a id="imageView2-interlace"></a>``/interlace/<Interlace>` |  | ● 是否支持渐进显示<br>取值范围：1 支持渐进显示，0不支持渐进显示(缺省为0)<br>适用目标格式：jpg<br>效果：网速慢时，图片显示由模糊到清晰。

<a id="imageView2-request"></a>
## 请求

<a id="imageView2-request-syntax"></a>
### 请求报文格式

```
GET <ImageDownloadURI>?<接口规格> HTTP/1.1
Host: <ImageDownloadHost>
```

<a id="imageView2-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="imageView2-response"></a>
## 响应

<a id="imageView2-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: <ImageMimeType>

<ImageBinaryData>
```

<a id="imageView2-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，成功时为图片的MIME类型，失败时为application/json
Cache-Control  |      | 缓存控制，失败时为no-store，不缓存

<a id="imageView2-response-content"></a>
### 响应内容

■ 如果请求成功，返回图片的二进制数据。  

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态](#imageView2-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageView2-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 缩略成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imageView2-remarks"></a>
## 附注

- imageView2生成的图片会被七牛云存储缓存以加速下载，但不会持久化。需要持久化的缩略图，请参考[触发持久化处理][pfopHref]。  
- 如果原图带有[EXIF][exifHref]信息且包含`Orientation`字段，imageView2缺省根据此字段的值进行自动旋转修正。
- 具备处理动态gif图片的能力。
- 当一张含有透明区域的图片，转换成不支持透明的格式（jpg, bmp, etc...）时，透明区域填充白色。
- 当处理并输出多帧gif图片时，可能处理所需的时间较长并且输出的图片体积较大，建议使用[预转持久化处理][persistentOpsHref]或[触发持久化处理][pfopHref]进行转码。

<a id="imageView2-samples"></a>
## 示例

1. 裁剪正中部分，等比缩小生成200x200缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/1/w/200/h/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/1/w/200/h/200)


2. 宽度固定为200px，高度等比缩小，生成200x133缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/2/w/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/2/w/200)

3. 高度固定为200px，宽度等比缩小，生成300x200缩略图：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/2/h/200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/2/h/200)

4. 渐进显示图片：  

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageView2/1/w/200/h/200/interlace/1
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher-imageview2-interlace.jpg)

---

<a id="imageView2-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]
- [触发持久化处理][pfopHref]
- [预转持久化处理][persistentOpsHref]

[cnameBindingHref]:  http://kb.qiniu.com/53a48154                     "域名绑定"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                "触发持久化处理"
[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[exifHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/image/exif.html                                        "EXIF信息"

[sendBugReportHref]: mailto:support@qiniu.com?subject=599错误日志 "发送错误报告"
