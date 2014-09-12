---
layout: docs
title: 下载设置
order: 320
---

<a id="download-settings"></a>
# 下载设置

<a id="404-not-found"></a>
## 自定义404响应

开发者可以要求七牛云存储在目标资源不存在时返回一个特定的内容，比如在网站上为这些找不到的资源显示一张特定的提示图片。

通过自定义404响应可以达成这个效果。开发者只需向指定的空间上传一个资源名为`errno-404`的文件即可。

<a id="download-friendly-name"></a>
## 自定义资源下载名

默认情况下，如果在浏览器中访问一个资源URL，浏览器都会试图直接在浏览器中打开这个资源，比如一张图片。如果希望浏览器的动作是下载而不是打开，可以给该URL添加参数`?attname=<file_name>`，如下所示：

```
http://<domain>/<key>?attname=<file_name>
```

如果访问的URL是带[数据处理操作](/docs/v6/api/overview/fop/index.html)的，那么可以给URL添加参数`&attname=<file_name>`，多个[数据处理操作](/docs/v6/api/overview/fop/index.html)间用[管道](/docs/v6/api/overview/fop/pipeline.html)连接，如下所示：

```
http://<domain>/<key>?<fop>&attname=<file_name>
http://<domain>/<key>?<fop1>|<fop2>|<fop3>&attname=<file_name>  （被下载的是fop3的处理结果）

```

当收到此指令时，七牛云存储会在响应中增加一个标准HTTP字段`Content-Disposition`，格式如下：

```
Content-Disposition: attachment;filename="<file_name>"
```

该字段告诉浏览器将资源下载成为指定的文件名`<file_name>`。下面是几个可体验的完整示例：

**原图按照原图文件名下载：**<br>
<http://newdocs.qiniudn.com/gogopher.jpg?attname=><br>
**原图按照文件名down.jpg下载：**<br>
<http://newdocs.qiniudn.com/gogopher.jpg?attname=down.jpg><br>
**原图先按照200x200大小缩放，再将处理结果按照文件名down.jpg下载：**<br>
<http://newdocs.qiniudn.com/gogopher.jpg?imageView2/1/w/200/h/200&attname=down2.jpg><br>
**原图先按照200x200大小缩放，然后将缩放结果按照50x50裁剪，再将最后裁剪结果结果按照文件名down.jpg下载：**<br>
<http://newdocs.qiniudn.com/gogopher.jpg?imageView2/1/w/200/h/200|imageMogr2/crop/50x50&attname=down3.jpg>
