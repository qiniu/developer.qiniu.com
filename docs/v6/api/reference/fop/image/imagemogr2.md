---
layout: docs
title: 高级处理（imageMogr2）
order: 235
---

<a id="imagemogr2"></a>
# 图片高级处理（imageMogr2）

- [描述](#imagemogr2-description)
- [接口规格](#imagemogr2-specification)
    - [缩放操作参数表](#imagemogr2-thumbnail-spec)
	- [图片处理重心参数表](#imagemogr2-anchor-spec)
    - [裁剪操作参数表（cropsize）](#imagemogr2-crop-size-spec) 	 	
    - [裁剪偏移参数表（cropoffset）](#imagemogr2-crop-offset-spec)
	- [转义说明](#imagemogr2-escape-sequence
	)
- [请求](#imagemogr2-request)
    - [请求报文格式](#imagemogr2-request-syntax)
    - [请求头部](#imagemogr2-request-header) 	
- [响应](#imagemogr2-response)
    - [响应报文格式](#imagemogr2-response-syntax)
	- [响应头部](#imagemogr2-response-header)
    - [响应内容](#imagemogr2-response-content) 
    - [响应状态码](#imagemogr2-response-code)
- [附注](#imagemogr2-remarks)
- [示例](#imagemogr2-samples)
  - [缩放](#imagemogr2-thumbnail)
  - [裁剪](#imagemogr2-crop)
   - [旋转](#imagemogr2-rotate)
   - [高斯模糊](#imagemogr2-blur)
   - [渐进显示](#imagemogr2-interlace)
- [内部参考资源](#imagemogr2-internal-resources)

<a id="imagemogr2-description"></a>
## 描述

imageMogr2是原[imageMogr接口](/docs/v6/api/reference/obsolete/imagemogr.html)的更新版本，实现略有差异，功能更为丰富。同样，为开发者提供一系列高级图片处理功能，包括缩放、裁剪、旋转等等。imageMogr2接口可支持处理的原图片格式有psd、jpeg、png、gif、webp、tiff、bmp。<br>
**注意：**`imageMogr2`接口支持的最大 gif 帧数为200，超过200，处理结果只返回原图。

 <a id="imagemogr2-specification"></a>
## 接口规格

 接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
imageMogr2/auto-orient
          /thumbnail/<imageSizeGeometry>
          /strip
          /gravity/<gravityType>
          /crop/<imageSizeAndOffsetGeometry>
          /rotate/<rotateDegree>
          /format/<destinationImageFormat>
          /blur/<radius>x<sigma>
          /interlace/<Interlace>
          /quality/<quality>
          /size-limit/<sizeLimit>
```

参数名称                             | 必填 | 说明                                                
:----------------------------------- | :--- | :---------------------------------------------------
`/auto-orient`                       |      | **建议放在首位**，根据原图EXIF信息自动旋正，便于后续处理。
`/thumbnail/<imageSizeGeometry>`     |      | 参看[缩放操作参数表](#imagemogr2-thumbnail-spec)，缺省为不缩放。
`/strip`                             |      | 去除图片中的元信息。
`/gravity/<gravityType>`             |      | 参看[图片处理重心参数表](#imagemogr2-anchor-spec)，目前在`imageMogr2`中只影响其后的裁剪偏移参数，缺省为左上角<br>(NorthWest)。
`/crop/<imageSizeAndOffsetGeometry>` |      | 参看[裁剪操作参数表](#imagemogr2-crop-size-spec)，缺省为不裁剪。
`/rotate/<rotateDegree>`             |      | 旋转角度，取值范围为1-360，缺省为不旋转。
`/format/<destinationImageFormat>`   |      | 图片格式，支持jpg、gif、png、webp等，缺省为原图格式，参考[支持转换的图片格式](http://www.imagemagick.org/script/formats.php)。
`/blur/<radius>x<sigma>`             |      | 高斯模糊参数，`<radius>`是模糊半径，取值范围为1-50。`<sigma>`是正态分布的标准差，必须大于0。图片格式为gif时，不支持该参数。
`/interlace/<Interlace>`            |           | 是否支持渐进显示，取值1 支持渐进显示，取值0不支持渐进显示（缺省为0）。适用jpg目标格式，网速慢时，图片显示由模糊到清晰。
`/quality/<Quality>` |   | 新图的图片质量<br>取值范围是[1, 100]，默认75。<br>七牛会根据原图质量算出一个[修正值](#image-quality)，取[修正值](#image-quality)和指定值中的小值。<br>**注意：<br>** ● 如果图片的质量值本身大于90，会根据指定值进行处理，此时修正值会失效。<br> ● 指定值后面可以增加 `!`，表示强制使用指定值，如`100!`。<br> ● 支持图片类型：jpg。
`/size-limit/<sizeLimit>` |   | 限制图片转换后的大小，支持字节数以M和K为单位的图片。<br>● 若设置图片转出结果的最大限制（目前仅支持jpg格式），支持魔法变量`$(fsize)`。如：`http://developer.qiniu.com/resource/Ship.jpg?imageMogr2/size-limit/$(fsize)`。<br>● 若在尾部加上!，表示强制结果在此限制内（支持所有图片格式），结果不符合则返回原图。如：`http://developer.qiniu.com/resource/Ship.jpg?imageMogr2/size-limit/15k!`。<br>**注：**需要根据图片实际大小设置合理的`sizeLimit`大小。


<a id="image-quality"></a>
`<quality>`修正值算法： `min[90, 原图quality*sqrt(原图长宽乘积/结果图片长宽乘积)]`
<br>**注意：**
处理前的图片w和h参数不能超过3万像素，总像素不能超过1亿5000万像素。

<a id="imagemogr2-thumbnail-spec"></a>
### 缩放操作参数表

参数名称                        | 必填 | 说明
:------------------------------ | :--- | :---------------------------------------------------
`/thumbnail/!<Scale>p`          |      | 基于原图大小，按指定百分比缩放。取值范围为0-1000。
`/thumbnail/!<Scale>px`         |      | 以百分比形式指定目标图片宽度，高度不变。取值范围为<br>0-1000。
`/thumbnail/!x<Scale>p`         |      | 以百分比形式指定目标图片高度，宽度不变。取值范围为<br>0-1000。
`/thumbnail/<Width>x`           |      | 指定目标图片宽度后高度等比缩放。取值范围为0-10000。
`/thumbnail/x<Height>`          |      | 指定目标图片高度后宽度等比缩放。取值范围为0-10000。
`/thumbnail/<Width>x<Height>`   |      | 限定长边，短边自适应缩放，将目标图片限制在指定宽高矩形内。取值范围不限，但若宽高超过10000时只能缩不能放。
`/thumbnail/!<Width>x<Height>r` |      | 限定短边，长边自适应缩放，目标图片会延伸至指定宽高矩形外。取值范围不限，但若宽高超过10000时只能缩不能放。
`/thumbnail/<Width>x<Height>!`  |      | 限定目标图片宽高值，忽略原图宽高比例，按照指定宽高值强行缩略，可能导致目标图片变形。取值范围不限，但若宽高超过10000时只能缩不能放。
`/thumbnail/<Width>x<Height>>`  |      | 当原图尺寸大于给定的宽度或高度时，按照给定宽高值缩小。取值范围不限，但若宽高超过10000时只能缩不能放。
`/thumbnail/<Width>x<Height><`  |      | 当原图尺寸小于给定的宽度或高度时，按照给定宽高值放大。取值范围不限，但若宽高超过10000时只能缩不能放。
`/thumbnail/<Area>@`            |      | 按原图高宽比例等比缩放，缩放后的像素数量不超过指定值。取值范围不限，但若像素数超过25000000时只能缩不能放。

<a id="imagemogr2-anchor-spec"></a>
### 图片处理重心参数表

在[高级图片处理](#imagemogr2)现有的功能中只影响其后的[裁剪偏移参数表](#imagemogr2-crop-size-spec)，即裁剪操作以`gravity`为原点开始偏移后，进行裁剪操作。

```
NorthWest     |     North      |     NorthEast
              |                |    
              |                |    
--------------+----------------+--------------
              |                |    
West          |     Center     |          East 
              |                |    
--------------+----------------+--------------
              |                |    
              |                |    
SouthWest     |     South      |     SouthEast
```

<a id="imagemogr2-crop-size-spec"></a>
### 裁剪操作参数表（cropsize）

参数名称                 | 必填 | 说明
:----------------------- | :--- | :------------------------------------------
`/crop/<Width>x`         |      | 指定目标图片宽度，高度不变。取值范围为0-10000。
`/crop/x<Height>`        |      | 指定目标图片高度，宽度不变。取值范围为0-10000。
`/crop/<Width>x<Height>` |      | 同时指定目标图片宽高。取值范围为0-10000。

<a id="imagemogr2-crop-offset-spec"></a>
### 裁剪偏移参数表（cropoffset）

参数名称                      | 必填 | 说明
:---------------------------- | :--- | :--------------------------------------------------
`/crop/!{cropsize}a<dx>a<dy>` |      | 相对于偏移锚点，向右偏移`dx`个像素，同时向下偏移`dy`个像素。取值范围不限，小于原图宽高即可。
`/crop/!{cropsize}-<dx>a<dy>` |      | 相对于偏移锚点，从指定宽度中减去`dx`个像素，同时向下偏移`dy`个像素。取值范围不限，小于原图宽高即可。
`/crop/!{cropsize}a<dx>-<dy>` |      | 相对于偏移锚点，向右偏移`dx`个像素，同时从指定高度中减去<dy>个像素。取值范围不限，小于原图宽高即可。
`/crop/!{cropsize}-<dx>-<dy>` |      | 相对于偏移锚点，从指定宽度中减去`dx`个像素，同时从指定高度中减去`dy`个像素。取值范围不限，小于原图宽高即可。

 **Example**

`/crop/!300x400a10a10`表示从源图坐标为x:10,y:10处截取300x400的子图片。  
`/crop/!300x400-10a10`表示从源图坐标为x:0,y:10处截取290x400的子图片。  

**Note**: 必须同时指定横轴偏移和纵轴偏移。  
**Note**: 计算偏移值会受到位置偏移指示符（/gravity/<gravityType>）的影响。默认为相对于左上角(NorthWest)计算偏移值，参看[图片处理重心参数表](#imagemogr2-anchor-spec)。  

<a id="imagemogr2-escape-sequence"></a>
### 转义说明

部分参数以“!”开头，表示参数将被转义。为便于阅读，我们采用特殊转义方法，如下所示：

```
p => % (percent)
r => ^ (reverse)
a => + (add)
```

即`!50x50r`实际代表`50x50^`这样一个字符串。  
而`!50x50`实际代表`50x50`这样一个字符串（该字符串并不需要转义）。  
`<imageSizeAndOffsetGeometry>`中的OffsetGeometry部分可以省略，缺省为`+0+0`。  
即`/crop/50x50`等价于`/crop/!50x50a0a0`，执行`-crop 50x50+0+0`语义。

<a id="imagemogr2-request"></a>
## 请求

<a id="imagemogr2-request-syntax"></a>
### 请求报文格式

```
GET <ImageDownloadURI>?<接口规格> HTTP/1.1
Host: <ImageDownloadHost>
```

**注意：**当您下载私有空间的资源时，`ImageDownloadURI`的生成方法请参考七牛的[下载凭证][download-tokenHref]。

**示例：**
资源为`http://developer.qiniu.com/resource/gogopher.jpg`，处理样式为`imageMogr2/rotate/45`。

```
#构造下载URL
DownloadUrl = 'http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/rotate/45'
……
#最后得到
RealDownloadUrl = 'http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/rotate/45&e=×××&token=MY_ACCESS_KEY:×××'
```

<a id="imagemogr2-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[七牛自定义域名绑定流程][cnameBindingHref]。

---

<a id="imagemogr2-response"></a>
## 响应

<a id="imagemogr2-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: <imageMimeType>

<imageBinaryData>
```

<a id="imagemogr2-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，成功时为图片的MIME类型，失败时为application/json。
Cache-Control  |      | 缓存控制，失败时为no-store，不缓存。

<a id="imagemogr2-response-content"></a>
### 响应内容

- 如果请求成功，返回图片的二进制数据。  

- 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态码](#imagemogr2-response-code)。
`error`      | 是   | 与HTTP状态码对应的消息文本。

<a id="imagemogr2-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 缩放成功。
400	       | 请求报文格式错误。
404        | 资源不存在。
599	       | 服务端操作失败。如遇此错误，请将完整错误信息（包括所有的HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imagemogr2-remarks"></a>
## 附注

- imageMogr2生成的图片会被七牛云存储缓存以加速下载，但不会持久化。需要持久化的缩略图，请参考[触发持久化处理（pfop）][pfopHref]和[处理结果另存（saveas）][saveasHref]。  
- `auto-orient` 参数是和图像处理顺序相关的，一般建议放在首位（根据原图EXIF信息自动旋正）。
- `thumbnail` 和 `crop` 之间的操作可以链式处理，即可以先对图进行缩略再裁剪，或者先裁剪再缩略。
- `gravity` 只会使其后的裁剪偏移（cropoffset）受到影响，建议放在`/crop`参数之前。
- 当处理多帧gif图片时，可能处理所需的时间较长并且输出的图片体积较大。如果您有多张多帧gif图片需要处理，可在图片上传完成后异步进行预转，这样不必在初次访问时进行图片处理，访问速度更快。
    - 参考[预转持久化处理（persistentOps）][persistentOpsHref]。
- 当一张含有透明区域的图片，转换成不支持透明区域的图片格式（jpg, bmp, etc）时，透明区域填充白色。

<a id="imagemogr2-samples"></a>
## 示例

### 缩放

- 生成480x320缩略图

	- 等比缩小75%：
	
	```
   http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!75p
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!75p)

	- 按原宽度75%等比缩小：

	```
   http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!75px
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!75px)

	- 按原高度75%等比缩小：

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!x75p
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!x75p)

- 生成700x467放大图

	- 指定新宽度为700px：

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/700x
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/700x)

	- 指定新高度为467px：

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/x467
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/x467)

-  限定长边，生成不超过300x300的缩略图

	```
  http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/300x300)

- 限定短边，生成不小于200x200的缩略图

	```
   http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!200x200r
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/!200x200r)

- 强制生成200x300的缩略图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/200x300!
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/200x300!)

- 原图大于指定长宽矩形，按长边自动缩小为200x133缩略图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/200x300>
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/200x300>)

-  原图小于指定长宽矩形，按长边自动拉伸为700x467放大图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/700x600<
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/700x600<)

- 生成图的像素总数小于指定值

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/350000@
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/350000@)

### 裁剪

- 生成300x427裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/300x
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/300x)

- 生成640x200裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/x200
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/x200)

- 生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/300x300)

-  生成300x300裁剪图，偏移距离30x100

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300a30a100
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300a30a100)

- 生成300x200裁剪图，偏移距离30x0

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300a30-100
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300a30-100)

- 生成270x300裁剪图，偏移距离0x100

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300-30a100
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300-30a100)

- 生成270x200裁剪图，偏移距离0x0

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300-30-100
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/crop/!300x300-30-100)

- 锚点在左上角（NorthWest），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/NorthWest/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/NorthWest/crop/300x300)

- 锚点在正上方（North），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/North/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/North/crop/300x300)

-  锚点在右上角（NorthEast），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/NorthEast/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/NorthEast/crop/300x300)

- 锚点在正左方（West），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/West/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/West/crop/300x300)

- 锚点在正中（Center），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/Center/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/Center/crop/300x300)

- 锚点在正右方（East），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/East/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/East/crop/300x300)

-  锚点在左下角（SouthWest），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/SouthWest/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/SouthWest/crop/300x300)

-  锚点在正下方（South），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/South/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/South/crop/300x300)

-  锚点在右下角（SouthEast），生成300x300裁剪图

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/SouthEast/crop/300x300
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/gravity/SouthEast/crop/300x300)

### 旋转

-  顺时针旋转45度

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/rotate/45
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/rotate/45)

### 高斯模糊

- 半径为3，Sigma值为5

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/blur/3x5
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/blur/3x5)

### 渐进显示

-  渐进显示图片：  

	```
    http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/300x300/interlace/1
	```

	![查看效果图](http://developer.qiniu.com/resource/gogopher.jpg?imageMogr2/thumbnail/300x300/interlace/1)

---

<a id="imagemogr2-internal-resources"></a>
## 内部参考资源

- [七牛自定义域名绑定流程][cnameBindingHref]
- [触发持久化处理（pfop）][pfopHref]
- [预转持久化处理（persistentOps）][persistentOpsHref]
- [处理结果另存（saveas）][saveasHref]

[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"
[pfopHref]:                     http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                            "触发持久化处理"
[persistentOpsHref]:            http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[saveasHref]:                   http://developer.qiniu.com/docs/v6/api/reference/fop/saveas.html                                   "saveas处理"

[thumbnailHref]:                ../../list/thumbnail.html                       "缩略图文档列表"
[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
[download-tokenHref]: http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html  "下载凭证"