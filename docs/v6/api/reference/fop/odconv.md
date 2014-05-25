---
layout: docs
title: office文档转换（odconv）
order: 111
---

<a id="odconv"></a>
# office文档转换（odconv）

<a id="description"></a>
## 描述

七牛云存储支持直接将office文档转换，包括三部分：

1. office文档(doc/ppt)转换成pdf
2. 获取pdf文档的信息
3. pdf文档转换成图片(jpg/png)

<a id="specification"></a>
## 接口规格（odconvSpec）

1. 将ppt转换为pdf

```
odconv/pdf
```

无附加参数。

2. 获取pdf信息，如pdf总页数等。

```
odconv/[jpg|png]/info
```

3. pdf转换成图片

```
odconv/[jpg|png]/page/<page>/density/<density>/quality/<quality>/resize/<resize>
```


参数名称          | 类型   | 说明                                                                          | 必填 
:---------------- | :----- | :---------------------------------------------------------------------------- | :---
`<page>`          | int    | 要转换的页码，默认为1，pdf页码从1开始                                         |
`<density>`       | int    | 像素密度，取值范围1～1200,默认为72，值越大越清晰                              |
`<quality>`       | int    | 图像质量，取值1～100, 默认为92,值越大越清晰                                   |
`<resize>`        | int    | 调整输出图像大小，按宽度等比缩放                                              |


### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 转换成功
400	       | 请求参数错误
404        | 资源不存在
500	       | 转换失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="samples"></a>

## 示例

测试ppt: [http://qiniudocs.u.qiniudn.com/dive-into-golang.pptx](http://qiniudocs.u.qiniudn.com/dive-into-golang.pptx)

1. 将ppt转换为pdf:

[http://qiniudocs.u.qiniudn.com/dive-into-golang.pptx?odconv/pdf](http://qiniudocs.u.qiniudn.com/dive-into-golang.pptx?odconv/pdf)

2. 获取pdf信息：

[http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/info](http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/info)

返回信息：

```
{
 "page_num": 26
}
```

表明文档有26页

3. 将pdf转为图片

[http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800](http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800)

上面将pdf的第4页转换为jpg图片，其中设置像素密度150, 图像质量80%，并且调整图像宽度为800（高度自动缩放为600）

我们可以通过imageInfo来查看生成的图像信息：

[http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800|imageInfo](http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800|imageInfo)

```
{"format":"jpeg","width":800,"height":600,"colorModel":"gray"}
```

转换效果：

![http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800
](http://qiniudocs.u.qiniudn.com/dive-into-golang.pdf?odconv/jpg/page/4/density/150/quality/80/resize/800
)
