---
layout: docs
title: 高级图片处理（imageMogr）
order: 174
---

<a id="imageMogr"></a>
# 高级图像处理

<a id="imageMogr-description"></a>
## 描述

除了能简便地生成缩略图外，七牛云处理服务还提供一系列高级图片处理功能，包括缩放、裁剪、旋转等等，称为imageMogr。  

<a id="imageMogr-specification"></a>
## 接口规格

建议优先使用第二版`imageMogr`，其规格是：

```
imageMogrSpecV2 = imageMogr/v2/auto-orient
                              /thumbnail/<imageSizeGeometry>
                              /gravity/<gravityType>
                              /crop/<imageSizeAndOffsetGeometry>
                              /quality/<imageQuality>
                              /rotate/<rotateDegree>
                              /format/<destinationImageFormat>
```

第一版`imageMogr`兼容保留，其规格是：

```
imageMogrSpec = imageMogr/auto-orient
                         /thumbnail/<imageSizeGeometry>
                         /gravity/<gravityType>
                         /crop/<imageSizeAndOffsetGeometry>
                         /quality/<imageQuality>
                         /rotate/<rotateDegree>
                         /format/<destinationImageFormat>
```

参数名称                             | 必填 | 说明                                                
:----------------------------------- | :--- | :---------------------------------------------------
`/auto-orient`                       |      | 根据原图EXIF信息自动旋正，便于后续处理，建议放在首位
`/thumbnail/<imageSizeGeometry>`     |      | 参看缩放操作参数表，缺省为不缩放
`/gravity/<gravityType>`             |      | 参看裁剪锚点参数表，只影响其后的裁剪偏移参数，缺省为左上角（NorthWest）
`/crop/<imageSizeAndOffsetGeometry>` |      | 参看裁剪操作参数表，缺省为不裁剪
`/quality/<imageQuality>`            |      | 图片质量，取值范围1-100，缺省为85
`/rotate/<rotateDegree>`             |      | 旋转角度，取值范围1-360，缺省为不旋转
`/format/<destinationImageFormat>`   |      | 图片格式，支持jpg、gif、png、webp等，缺省为原图格式

<a id="imageMogr-thumbnail-spec"></a>
### 缩放操作参数表

参数名称                        | 必填 | 说明
:------------------------------ | :--- | :---------------------------------------------------
`/thumbnail/!<Scale>p`          |      | 基于原图大小，按指定百分比缩放。<p>取值范围0-1000
`/thumbnail/!<Scale>px`         |      | 以百分比形式指定目标图片宽度，高度等比缩放。<p>取值范围0-1000
`/thumbnail/!x<Scale>p`         |      | 以百分比形式指定目标图片高度，宽度等比缩放。<p>取值范围0-1000
`/thumbnail/<Width>x`           |      | 指定目标图片宽度，高度等比缩放。<p>取值范围0-10000
`/thumbnail/x<Height>`          |      | 指定目标图片高度，宽度等比缩放。<p>取值范围0-10000
`/thumbnail/<Width>x<Height>`   |      | 限定长边，短边自适应缩放，将目标图片限制在指定宽高矩形内。<p>取值范围0-10000
`/thumbnail/!<Width>x<Height>r` |      | 限定短边，长边自适应缩放，目标图片会延伸至指定宽高矩形外。<p>取值范围0-10000
`/thumbnail/<Width>x<Height>!`  |      | 限定目标图片宽高值，忽略原图宽高比例，按照指定宽高值强行缩略，可能导致目标图片变形。<p>取值范围0-10000
`/thumbnail/<Width>x<Height>>`  |      | 当原图尺寸大于给定的宽度或高度时，按照给定宽高值缩小。<p>取值范围0-10000
`/thumbnail/<Width>x<Height><`  |      | 当原图尺寸小于给定的宽度或高度时，按照给定宽高值放大。<p>取值范围0-10000
`/thumbnail/<Area>@`            |      | 按原图高宽比例等比缩放，缩放后的像素数量不超过指定值。<p>取值范围0-100000000

<a id="imageMogr-crop-size-spec"></a>
### 裁剪操作参数表（cropSize）

参数名称                 | 必填 | 说明
:----------------------- | :--- | :------------------------------------------
`/crop/<Width>x`         |      | 指定目标图片宽度，高度不变。取值范围0-10000
`/crop/x<Height>`        |      | 指定目标图片高度，宽度不变。取值范围0-10000
`/crop/<Width>x<Height>` |      | 同时指定目标图片宽高。取值范围0-10000

<a id="imageMogr-crop-offset-spec"></a>
### 裁剪偏移参数表（cropOffset）

参数名称                      | 必填 | 说明
:---------------------------- | :--- | :--------------------------------------------------
`/crop/!{cropSize}a<dx>a<dy>` |      | 相对于偏移锚点，向右偏移<dx>个像素，同时向下偏移<dy>个像素。<p>取值范围0－1000
`/crop/!{cropSize}-<dx>a<dy>` |      | 相对于偏移锚点，向下偏移<dy>个像素，同时从指定宽度中减去<dx>个像素。<p>取值范围0－1000
`/crop/!{cropSize}a<dx>-<dy>` |      | 相对于偏移锚点，向右偏移<dx>个像素，同时从指定高度中减去<dy>个像素。<p>取值范围0－1000
`/crop/!{cropSize}-<dx>-<dy>` |      | 相对于偏移锚点，从指定宽度中减去<dx>个像素，同时从指定高度中减去<dy>个像素。<p>取值范围0－1000

例如，  

`/crop/!300x400a10a10`表示从源图坐标为x:10,y:10处截取300x400的子图片。  
`/crop/!300x400-10a10`表示从源图坐标为x:0,y:10处截取290x400的子图片。  

注意1：必须同时指定横轴偏移和纵轴偏移。  
注意2：计算偏移值会受到位置偏移指示符（/gravity/<gravityType>）影响。默认为相对于左上角计算偏移值（即NorthWest），参看[裁剪锚点参数表](#imageMogr-anchor-spec)。  

<a id="imageMogr-anchor-spec"></a>
### 裁剪锚点参数表

注意：不区分大小写。  

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

<a id="imageMogr-escape-sequence"></a>
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

<a id="imageMogr-request"></a>
## 请求

<a id="imageMogr-request-syntax"></a>
### 请求报文格式

```
GET <imageDownloadURI>?<imageMogrSpecV2> HTTP/1.1
Host: <imageDownloadHost>
```

<a id="imageMogr-request-header"></a>
### 请求头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定][cnameBindingHref]

---

<a id="imageMogr-response"></a>
## 响应

<a id="imageMogr-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: <imageMimeType>

<imageBinaryData>
```

<a id="imageMogr-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，成功时为图片的MIME类型，失败时为application/json
Cache-Control  |      | 缓存控制，失败时为no-store，不缓存

<a id="imageMogr-response-content"></a>
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
`code`       | 是   | HTTP状态码，请参考[响应状态](#imageMogr-response-status)
`error`      | 是   | 与HTTP状态码对应的消息文本

<a id="imageMogr-response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 缩放成功
400	       | 请求报文格式错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

---

<a id="imageMogr-remarks"></a>
## 附注

- imageMogr生成的图片会被七牛云存储缓存以加速下载，但不会持久化。需要持久化的缩略图，请参考[触发异步处理][pfopHref]和[saveas处理][saveasHref]。  
- `auto-orient` 参数是和图像处理顺序相关的，一般建议放在首位（根据原图EXIF信息自动旋正）。
- `thumbnail` 和 `crop` 之间的操作可以链式处理，即可以先对图进行缩略再裁剪，或者先裁剪再缩略。
- `gravity` 只会使其后的裁剪偏移(cropOffset)受到影响，建议放在`/crop`参数之前。
- 当处理多帧gif图片时，可能处理所需的时间较长并且输出的图片体积较大。如果您有多张多帧gif图片需要处理，可在图片上传完成后异步进行预转，这样不必在初次访问时进行图片处理，访问速度更快。
    - 参考[预转异步处理（persistentOps）][persistentOpsHref]。
- 第一版的`imageMogr`对gif图片仅反回原图，不做处理。

<a id="imageMogr-samples"></a>
## 示例

### 缩放

1. 生成480x320缩略图

	等比缩小75%：
	
	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!75p
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!75p)

	按原宽度75%等比缩小：

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!75px
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!75px)

	按原高度75%等比缩小：

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!x75p
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!x75p)

2. 生成700x467放大图

	指定新宽度为700px：

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/700x
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/700x)

	指定新高度为467px：

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/x467
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/x467)

3. 限定长边，生成不超过300x300的缩略图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/300x300)

4. 限定短边，生成不小于200x200的缩略图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!200x200r
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/!200x200r)

5. 强制生成200x300的缩略图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/200x300!
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/200x300!)

6. 原图大于指定长宽矩形，按长边自动缩小为200x133缩略图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/200x300>
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/200x300>)

7. 原图小于指定长宽矩形，按长边自动拉伸为700x467放大图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/700x600<
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/700x600<)

8. 生成图的像素总数小于指定值

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/350000@
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/thumbnail/350000@)

### 裁剪

1. 生成300x427裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/300x
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/300x)

2. 生成640x200裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/x200
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/x200)

3. 生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/300x300)

4. 生成300x300裁剪图，偏移距离30x100

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300a30a100
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300a30a100)

5. 生成300x200裁剪图，偏移距离30x0

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300a30-100
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300a30-100)

6. 生成270x300裁剪图，偏移距离0x100

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300-30a100
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300-30a100)

7. 生成270x200裁剪图，偏移距离0x0

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300-30-100
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/crop/!300x300-30-100)

8. 锚点在左上角（NorthWest），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/NorthWest/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/NorthWest/crop/300x300)

9. 锚点在正上方（North），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/North/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/North/crop/300x300)

10. 锚点在右上角（NorthEast），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/NorthEast/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/NorthEast/crop/300x300)

11. 锚点在正左方（West），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/West/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/West/crop/300x300)

12. 锚点在正中（Center），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/Center/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/Center/crop/300x300)

13. 锚点在正右方（East），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/East/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/East/crop/300x300)

14. 锚点在左下角（SouthWest），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/SouthWest/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/SouthWest/crop/300x300)

15. 锚点在正下方（South），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/South/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/South/crop/300x300)

16. 锚点在右下角（SouthEast），生成300x300裁剪图

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/SouthEast/crop/300x300
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/gravity/SouthEast/crop/300x300)

### 旋转

1. 顺时针旋转45度

	```
    http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/rotate/45
	```

	![查看效果图](http://qiniuphotos.qiniudn.com/gogopher.jpg?imageMogr/v2/rotate/45)

---

<a id="imageMogr-internal-resources"></a>
## 内部参考资源

- [域名绑定][cnameBindingHref]
- [触发异步处理][pfopHref]
- [预转异步处理][persistentOpsHref]
- [saveas处理][saveasHref]

[cnameBindingHref]:             http://kb.qiniu.com/53a48154                     "域名绑定"
[pfopHref]:                     ../pfop/pfop.html                            "触发异步处理"
[persistentOpsHref]:            ../../security/put-policy.html#put-policy-struct "预转异步处理"
[saveasHref]:                   ../saveas.html                                   "saveas处理"

[thumbnailHref]:                ../../list/thumbnail.html                       "缩略图文档列表"
[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
