---
layout: docs
title: 图片、音视频等数据处理功能
order: 250
---

<a id="builtin-fop"></a>
# 图片、音视频等数据处理功能

为了有效提升开发者的工作效率，七牛云存储已经提供了大量非常有价值的内置数据处理功能。

- [图片处理](#imageFop)
- [图片水印](#pic-watermark)
- [音视频处理](#avthumb)
- [音视频切片](#segtime)
- [视频水印](#vwatermark)
- [视频帧缩略图](#video-thumbnail)


<a id="imageFop"></a>
## 图片处理

图片处理包括各种规格的缩略和裁剪，具体请参见[图片处理规格](/docs/v6/api/reference/fop/image/index.html)。

<a id="pic-watermark"></a>
## 图片水印

开发者可以在任何一张图片上按指定位置叠加一个水印。具体请参见[水印规格](/docs/v6/api/reference/fop/image/watermark.html)。

<a id="avthumb"></a>
## 音视频处理

七牛云存储服务内置了音频的转码等相关的数据处理功能。具体请参见[音频处理规格](/docs/v6/api/reference/fop/av/avthumb.html)。

因为视频处理是非常耗时的操作，因此应使用异步的处理结果持久化机制。请参见[处理结果持久化](/docs/v6/api/overview/fop/persistent-fop.html)。

<a id="segtime"></a>
## 音视频切片

音视频切片是指从一个音频或视频源按指定的偏移位置截取指定长度的音视频片段，主要用于支持HTTP Live Streaming回放。具体请参见[音视频切片](/docs/v6/api/reference/fop/av/segtime.html)。

<a id="vwatermark"></a>
## 视频水印

七牛云存储服务内置了对视频打水印的功能。具体请参见[视频水印规格](/docs/v6/api/reference/fop/av/video-watermark.html)。

<a id="video-thumbnail"></a>
## 视频帧缩略图

可以从视频中截取指定时刻的单帧画面并按指定大小缩放成图片。具体请参见[视频帧缩略图](/docs/v6/api/reference/fop/av/vframe.html)。


