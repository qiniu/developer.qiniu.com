---
layout: docs
title: 流媒体播放
order: 240
---
<a id="streaming"></a>
# 流媒体播放

七牛云存储以HTTP Live Streaming方式提供流媒体播放支持。

<a id="streaming-model"></a>
## 流媒体基本机制

[HTTP Live Streaming](https://developer.apple.com/streaming/)（以下简称为HLS）是基于HTTP的流媒体传输协议。它将一整个音视频流切割成一个个小的音视频文件，并生成一个播放列表（m3u8）。客户端只需要获取资源的播放列表即可以流的方式播放音视频。


使用[处理结果持久化功能](persistent-fop.html)，在播放前事先以异步方式创建播放列表并切割小文件，然后将两类文件均持久化存储在空间中。

<a id="streaming-pfop"></a>
## 流媒体处理结果持久化

HLS相关的数据处理操作如下所示：

```
avthumb/m3u8[/segtime/<SegSeconds>][/<fop_cmd>/<fop_params>]
```

这里的`segtime`和`<fop_cmd>`都是可选项。

`segtime`用于定义切割的音视频流长度（单位为秒），取值范围为10 - 60，缺省值为10。

`<fop>`表示常规的数据处理操作，可以添加以便在切割成小文件之前先进行适当的格式转换，比如码率调整、视频画面大小调整等。


我们可以配合[处理结果持久化](persistent-fop.html)功能使用以上的音视频处理命令，以达到预处理流播放内容的目的。当然，我们也可以使用`persistentId`来获取特定音视频文件的转换和切割进度。

<a id="streaming-preset-pfop"></a>
## 预设处理指令

为了方便使用，我们提供了一系列的预设数据处理指令，可以用`preset`指令直接调用。比如以下这个预设值可以将音频的码率转为32K：

```
avthumb/m3u8/segtime/10/preset/audio_32k
```

请参见[音视频预设集](../../reference/fop/av/segtime.html#segtime-preset)了解完整的预设数据处理指令。

<a id="streaming-custom-pfop"></a>
## 自定义处理指令

流媒体处理指令也支持完全自定义的音视频处理参数，如下所示：

```
avthumb/m3u8/segtime/<SegSeconds>
            /r/<FrameRate>
            /vb/<VideoBitRate>
            /vcodec/<VideoCodec>
            /acodec/<AudioCodec>
            /ab/<BitRate>
            /aq/<AudioQuality>
            /ar/<SamplingRate>
```

完整的音视频处理参数含义解释请参见[音视频处理规格（avthumb）](../../reference/fop/av/avthumb.html)。
