---
layout: docs
title: 变量
order: 512
---
<a id="vars"></a>
# 变量

变量是七牛云存储同用户交换数据的机制，引入变量概念的目的在于更灵活的控制上传后续动作中的内容组织和传递。可以认为变量是一种占位符，七牛云存储会将占位符按约定替换为实际内容。

在构造[上传策略](/docs/v6/api/reference/security/put-policy.html)时，可在上传策略的`returnBody`和`callbackBody`字段内容中使用变量。

变量分为两种：[魔法变量](#magicvar)和[自定义变量](#xvar)。魔法变量是系统提供的一系列预定义变量，可直接使用，而自定义变量则由调用方指定，通常应对应于上传时的表单参数。服务端会将这些上传参数的具体值返回给调用方。

<a id="magicvar"></a>
## 魔法变量

魔法变量是一组预先定义的变量，可以使用 `$(var)` 或 `$(var.field_name)` 形式求值。

目前可用的魔法变量如下:

变量名       | 包含子项 | 变量说明 | 适用范围
:----------- | :------- |------------------------------------------- |----
bucket       |          | 获得上传的目标空间名。    |
key          |          | 获得文件保存在空间中的资源名。    |
etag         |          | 文件上传成功后的[Etag](http://en.wikipedia.org/wiki/HTTP_ETag)。若上传时未指定资源ID，Etag将作为资源ID使用。    |
<a id="magicvar-fname"></a>fname        |          | 上传的原始文件名。    |   不支持用于`分片上传`
fsize        |          | 资源尺寸，单位为字节。    |
mimeType     |          | 资源类型，比如JPG图片的资源类型为`image/jpg`。    |
endUser      |          | 上传时指定的`endUser`字段，通常用于区分不同终端用户的请求。    |
persistentId |          | 音视频转码持久化的进度查询ID。     |
exif         | 是       | 获取所上传图片的[EXIF](http://en.wikipedia.org/wiki/Exchangeable_image_file_format)信息。<p>该变量包含子字段，比如对`$(exif.ApertureValue.val)`取值将得到该图片拍摄时的光圈值。    | 暂不支持用于`saveKey`中
imageInfo    | 是       | 获取所上传图片的基本信息。<p>该变量包含子字段，比如对`$(imageInfo.width)`取值将得到该图片的宽度。    | 暂不支持用于`saveKey`中
year         |          | 上传时的年份。    | 暂不支持用于'returnBody'、'callbackBody'中
mon          |          | 上传时的月份。    | 暂不支持用于'returnBody'、'callbackBody'中
day          |          | 上传时的日期。    | 暂不支持用于'returnBody'、'callbackBody'中
hour         |          | 上传时的小时。    | 暂不支持用于'returnBody'、'callbackBody'中
min          |          | 上传时的分钟。    | 暂不支持用于'returnBody'、'callbackBody'中
sec          |          | 上传时的秒钟。    | 暂不支持用于'returnBody'、'callbackBody'中
avinfo       | 是       | 音视频资源的元信息。    | 暂不支持用于'saveKey'中
imageAve     |          | 图片主色调。      | 
ext          |          | 上传资源的后缀名，通过自动检测的 mimeType 或者原文件的后缀来获取。 | 不支持用于`分片上传`
uuid         |          | 生成uuid          | 暂不支持用于'saveKey'中
bodySha1     |          | callbackBody的sha1(hex编码) | 只支持用于'callbackUrl'中

魔法变量支持`$(<Object>.<Property>)`形式的访问子项，例如：

- $(\<var\>)
- $(\<var\>.\<field_name\>)
- $(\<var\>.\<field_name\>.\<sub_field_name\>)

求值举例：

- `$(bucket)` 				- 获得上传目标bucket名字
- `$(imageInfo)` 			- 获取当前上传图片的基本属性信息
- `$(imageInfo.height)`	 	- 获取当前上传图片的原始高度


魔法变量不支持访问子项为数组形式

- **不支持**$(\<var\>[0])
- **不支持**$(\<var\>.\<field_name\>[0])

变量`avinfo`在[`returnBody`](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-return-body)中返回的格式不同于url触发返回的`avinfo`格式，`avinfo`在[魔法变量](#magicvar)中的类型如下（内容经过格式化以便阅读）：

```
{
	"audio":{
		"bit_rate":"64028",
		"channels":1,
		"codec_name":"mp3",
		"codec_type":"audio",
		"duration":"30.105556",
		"index":1,
		"nb_frames":"1153",
		"r_frame_rate":"0/0",
		"sample_fmt":"s16p",
		"sample_rate":"44100",
		"start_time":"0.000000",
		"tags":{
			"creation_time":"2012-10-21 01:13:54"
		}
	},
	"format":{
		"bit_rate":"918325",
		"duration":"30.106000",
		"format_long_name":"QuickTime / MOV",
		"format_name":"mov,mp4,m4a,3gp,3g2,mj2",
		"nb_streams":2,
		"size":"3455888",
		"start_time":"0.000000",
		"tags":{
			"creation_time":"2012-10-21 01:13:54"
		}
	},
	"video":{
		"bit_rate":"856559",
		"codec_name":"h264",
		"codec_type":"video",
		"display_aspect_ratio":"4:3",
		"duration":"29.791667",
		"height":480,
		"index":0,
		"nb_frames":"715",
		"pix_fmt":"yuv420p",
		"r_frame_rate":"24/1",
		"sample_aspect_ratio":"1:1",
		"start_time":"0.000000",
		"tags":{
			"creation_time":"2012-10-21 01:13:54"
		},
		"width":640
	}
}
```

变量`exif`的类型如下（内容经过格式化以便阅读，具体细节请参考[EXIF技术白皮书](http://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf)）：  

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

变量`imageInfo`对应的类型如下（内容经过格式化以便阅读）：  

```
{
    "format":       "jpeg",
    "width":        640,
    "height":       427,
    "colorModel":   "ycbcr"
}
```

如果变量取值失败（比如在上传策略中指定了一个并不存在的魔法变量），响应内容中对应的变量将被赋予空值。

<a id="xvar"></a>
## 自定义变量

应用客户端则在上传请求中设定自定义变量的值。七牛云存储收到这些变量信息后，置换掉`returnBody`和`callbackBody`中的自定义变量设置，形成最终的反馈结果。

自定义变量的行为同魔法变量基本一致，但变量名必须以`x:`开始。下面是一个自定义变量的示例：

用户设置了如下的`callbackBody`：

```
put_policy = '{
    ...
    "callbackBody" : "name=$(fname)&hash=$(etag)&location=$(x:location)&price=$(x:price)"
    ...
}'
```

这个例子中的`$(x:location)`和`$(x:price)`就是自定义变量。

之后，用户的客户端构造了如下请求：

```
<form method="post" action="http://upload.qiniu.com/"
enctype="multipart/form-data">
    <input name="key" type="hidden" value="sunflower.jpg">
    <input name="x:location" type="hidden" value="Shanghai">
    <input name="x:price" type="hidden" value="1500.00">
    <input name="token" type="hidden" value="...">
    <input name="file" type="file" />
</form>
```

文件上传完成后，服务端会将请求中`x:location`和`x:price`的值，替换`callbackBody`中的自定义变量：

```
name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm- \
RlQx_4O2&location=Shanghai&price=1500.00
```

然后，七牛云存储将此结果进行[URL安全的Base64编码](/docs/v6/api/overview/appendix.html#urlsafe-base64)，作为回调请求的Body调用`callbackUrl`指定的回调服务器。

如果变量取值失败（比如在上传策略中指定了一个并不存在的表单变量），响应内容中对应的变量将被赋予空值。
