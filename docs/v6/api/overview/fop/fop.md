---
layout: docs
title: 数据处理机制
order: 290
---

<a id="fop-model"></a>
# 数据处理机制

七牛云存储内建了一个非常高效易用的数据处理框架。数据处理框架可以管理和执行一系列符合规范的数据处理操作（fop）。开发者可以在访问资源时制定执行一个或多个数据处理指令，以直接获取经过处理后的结果。

比较典型的一个场景是图片查看。客户端可以上传一张高精度的图片，然后在查看图片的时候根据屏幕规格生成一张大小适宜的缩略图，比如为iPhone生成一张960x640大小的缩略图。这样既可以明显降低网络流量，而且可以提高图片显示速度，还能降低移动设备的内存占用。而要达到这样的效果非常简单：

原图（[链接](http://qiniu-images.qiniudn.com/gogopher.jpg)）：

```
http://qiniu-images.qiniudn.com/gogopher.jpg
```
针对该原图获取一个适合iPhone5屏幕尺寸的图片（[链接](http://qiniu-images.qiniudn.com/gogopher.jpg?imageView/2/w/640/h/960)）：

```
http://qiniu-images.qiniudn.com/gogopher.jpg?imageView/2/w/640/h/960
```

我们可以再定义图片样式比如叫iphone5，以缩短URL并提高可读性（[链接](http://qiniu-images.qiniudn.com/gogopher.jpg-iphone5)）：
```
http://qiniu-images.qiniudn.com/gogopher.jpg-iphone5
```

一个常规的数据处理操作包含一个操作指令和若干操作参数，如下所示：

```
<fop>/<param1_value>/<param2_name>/<param2_value>/...
```

数据处理框架对于资源类型并没有限制，但是特定某个数据处理操作则会有各自适合的处理对象，比如对非图片类型的资源类型上应用缩略图操作可能会返回错误的结果。

数据处理操作的触发有以下几个机会和方式：

1. 访问资源时。如上面的例子所示范的，只需要在资源URL后加上具体数据操作指令和参数即可。
1. 资源上传时。上传时可在上传策略中设置异步数据处理，在资源上传完成时七牛云存储会以异步的方式执行数据处理操作，并持久化存储数据处理结果。支持查询数据处理操作的进度。具体请参见[上传后续动作 - 数据预处理](../up/response/persistent-op.html)。
1. 对已有资源手动触发处理流程。与上传时的数据处理支持相同，这个过程也为异步且可查询操作进度。具体请参见[处理结果持久化](persistent-fop.html)。
