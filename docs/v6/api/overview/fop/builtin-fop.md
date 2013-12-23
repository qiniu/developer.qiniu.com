---
layout: docs
title: 内置数据处理功能
order: 250
---

<a id="builtin-fop"></a>
# 内置数据处理功能

为了有效提升开发者的工作效率，七牛云存储已经提供了大量非常有价值的内置数据处理功能。

## 图片处理

图片处理包括各种规格的缩略和裁剪，具体请参见[图片处理规格](../../reference/fop/image/)。

## 图片水印

开发者可以在任何一张图片上按指定位置叠加一个水印。具体请参见[水印规格](../../reference/fop/image/watermark.html)。

## 音视频处理

七牛云存储服务内置了音频的转码等相关的数据处理功能。具体请参见[音频处理规格](../../reference/fop/av/avthumb.html)。

因为视频处理是非常耗时的操作，因此应使用异步的处理结果持久化机制。请参见[处理结果持久化](persistent-fop.html)。

## 音视频切片

音视频切片是指从一个音频或视频源按指定的偏移位置截取指定长度的音视频片段，主要用于支持HTTP Live Streaming回放。具体请参见[音视频切片](../../reference/fop/av/vframe.html)。

## 视频水印

七牛云存储服务内置了对视频打水印的功能。具体请参见[视频水印规格](../../reference/fop/av/video-watermark.html)。

## 视频截图

可以从视频中截取指定时刻的单帧画面并按指定大小缩放成图片。具体请参见[视频截图](../../reference/fop/av/vframe.html)。

## 其他

除以上常见的数据处理功能外，七牛云存储还内置了一些其他的数据处理功能，比如[资源下载二维码（qrcode）](../../reference/fop/qrcode.html)和[MD转HTML（md2html）](../../reference/fop/md2html.html)。
