---
layout: docs
title: 视频水印（vwatermark）
order: 139
---
<a id="vwatermark"></a>
# 视频水印（vwatermark）

<a id="vwatermark-spec"></a>
## 视频水印规格

```
vwatermarkSpec = "vwatermark/<Mode>
                            /image/<EncodedRemoteImageUrl>
                            /gravity/<Gravity>
                            /format/<OutputFormat>"
```

参数名称                   | 必填 | 说明
:------------------------- | :--- | :---------------------------------
`<Mode>`                   | 是   | 固定为1，表示`图片水印`。
`<EncodedRemoteImageUrl>`  | 是   | 水印的源路径，目前仅支持远程路径，需要经过`urlsafe_base64_encode`。
`<Gravity>`                |      | 打水印的位置，参考[水印锚点参数表](#vwatermark-anchor-spec)，缺省值为`NorthEast`（右上角）。
`<OutputFormat>`           |      | 指定目标视频的输出格式，取值范围：mp4，flv等，缺省值为`mp4`。

<a id="vwatermark-anchor-spec"></a>
### 水印锚点参数表

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

<a id="vwatermark-samples"></a>
## 示例

```
    vwatermark/1
              /image/aHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc=
              /gravity/NorthEast
              /format/mp4
```

为视频文件打上水印`http://testunit.qiniudn.com/qiniulogo.png`, 水印的位置是右上角，输出格式为`mp4`。

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

