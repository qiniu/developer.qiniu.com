---
layout: docs
title: 变量
order: 512
---
<a id="vars"></a>
# 变量

变量是七牛云存储同用户交换数据的机制，引入变量概念的目的在于更灵活的控制上传后续动作中的内容组织和传递。可以认为变量是一种占位符，七牛云存储会将占位符按约定替换为实际内容。

在构造[上传策略](../../../reference/security/put-policy.html)时，可在上传策略的`returnBody`和`callbackBody`字段内容中使用变量。

变量分为两种：[魔法变量](#magicvar)和[自定义变量](#xvar)。魔法变量是系统提供的一系列预定义变量，可直接使用，而自定义变量则由调用方指定，通常应对应于上传时的表单参数。服务端会将这些上传参数的具体值返回给调用方。

<a id="magicvar"></a>
## 魔法变量

魔法变量是一组预先定义的变量，可以使用 `$(var)` 或 `$(var.field_name)` 形式求值。

目前可用的魔法变量如下:

变量名        | 包含子项 | 变量说明
:----------- |:------:|-------------------------------------------
bucket       | 否     | 获得上传的目标空间名。
etag         | 否     | 文件上传成功后的[Etag](http://en.wikipedia.org/wiki/HTTP_ETag)。若上传时未指定资源ID，Etag将作为资源ID使用。
fname        | 否     | 上传的原始文件名。
fsize        | 否     | 资源尺寸，单位为字节。
mimeType     | 否     | 资源类型，比如JPG图片的资源类型为`image/jpg`。
endUser      | 否     | 上传时指定的`endUser`字段，通常用于区分不同终端用户的请求。
persistentId | 否     | 音视频转码持久化的进度查询ID。
exif         | 是     | 获取所上传图片的[EXIF](http://en.wikipedia.org/wiki/Exchangeable_image_file_format)信息。<p>该变量包含子字段，比如对`$(exif.ApertureValue.val)`取值将得到该图片拍摄时的光圈值。
imageInfo    | 是     | 获取所上传图片的基本信息。<p>该变量包含子字段，比如对`$(imageInfo.width)`取值将得到该图片的宽度。

魔法变量支持`<Object>.<Property>`形势的访问方法，例如：

- \<var\>
- \<var\>.\<field_name\>
- \<var\>.\<field_name\>.\<field_name\>

求值举例：

- `$(bucket)` 				- 获得上传目标bucket名字
- `$(imageInfo)` 			- 获取当前上传图片的基本属性信息
- `$(imageInfo.height)`	 	- 获取当前上传图片的原始高度

变量`exif`的类型以下：

> TODO: exif的类型结构。

变量`imageInfo`对应的类型如下：

> TODO: imageInfo的类型结构。

如果变量取值失败（比如在上传策略中指定了一个并不存在的魔法变量），响应内容中对应的变量将被赋予空值。

<a id="xvar"></a>
## 自定义变量

应用客户端则在上传请求中设定自定义变量的值。七牛云存储收到这些变量信息后，置换掉`returnBody`和`callbackBody`中的自定义变量设置，形成最终的反馈结果。

自定义变量的行为同魔法变量基本一致，但变量名必须以`x:`开始。下面是一个自定义变量的示例：

用户设置了如下的`callbackBody`：

```
put_policy = '{
    ...
    "callbackBody" : "name=$(fname)&hash=$(etag)&location=$(x:location)&=$(x:price)"
    ...
}'
```

这个例子中的`$(x:location)`和`$(x:price)`就是自定义变量。

之后，用户的客户端构造了如下请求：

```
<form method="post" action="http://up.qiniu.com/" 
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

然后，七牛云存储将此结果进行[URL安全的Base64编码](../../appendix.html#urlsafe-base64)，作为回调请求的Body调用`callbackUrl`指定的回调服务器。

如果变量取值失败（比如在上传策略中指定了一个并不存在的表单变量），响应内容中对应的变量将被赋予空值。
