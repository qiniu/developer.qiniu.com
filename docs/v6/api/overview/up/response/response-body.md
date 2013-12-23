---
layout: docs
title: 自定义响应内容
order: 513
---
<a id="return-body"></a>
# 自定义响应内容（returnBody）

[简单反馈](simple-response.html)只会包含资源的最基本信息，但很多情况下用户都希望得到更多的资源信息。

用户可以通过[资源管理](../../rs/index.html)和[数据处理](../../fop/index.html)功能获得资源的扩展信息。但这些都需要用户发起一个新请求。七牛云存储支持在上传请求的响应中直接返回客户端需要的资源扩展信息。

在生成[上传凭证](../../../reference/security/upload-token.html)时，开发者可以通过设置[上传策略](../../../reference/security/put-policy.html)中的`returnBody`字段指定需要返回的信息，比如资源的大小、类型，图片的尺寸等等。

`returnBody`实际上是一个用户定义的反馈信息模板，**内容必须用JSON格式表达**。下面是一个示例：

```
{
    "foo": "bar",
    "name": $(fname),
    "size": $(fsize),
    "type": $(mimeType),
    "hash": $(etag),
    "w": $(imageInfo.width),
    "h": $(imageInfo.height),
    "color": $(exif.ColorSpace.val)
}
```

用户可以在在`returnBody`中使用[变量](vars.html)，包括[魔法变量](vars.html#magicvar)和[自定义变量](vars.html#xvar)。七牛云存储会将这些变量替换为对应实际值，然后作为响应内容反馈给用户，如下所示：

```
  {
    "foo": "bar",
    "name": "gogopher.jpg",
    "size": 214513,
    "type": "image/jpg",
    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
    "w": 640,
    "h": 480,
    "color": "sRGB"
  }
```

需要注意的是，`returnBody`不能在启用了回调时使用。如果上传策略中通过设置`callbackUrl`字段启用了回调，`returnBody`将直接被忽略。

在回调模式中如果也想自定义响应内容，请在生成上传凭证时设置上传策略中的`callbackBody`字段。更多关于回调模式的解释，请参见[回调（callback）](callback.html)。
