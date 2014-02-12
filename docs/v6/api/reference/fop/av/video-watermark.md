---
layout: docs
title: 视频水印（vwatermark）
order: 139
---
<a id="vwatermark"></a>
# 视频水印（vwatermark）

<a id="vwatermark-spec"></a>
## 视频水印规格

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
vwatermark/<Mode>
          /image/<EncodedRemoteImageUrl>
          /gravity/<Gravity>
          /format/<OutputFormat>
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

1. 以[预转持久化][persistentOpsHref]形式，给视频资源打水印：  

	```
    {
        "scope":                "qiniu-ts-demo:sample.mp4",
        "deadline":             1390528576,
        "persistentOps":        "vwatermark/1/image/aHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc=/gravity/NorthEast/format/mp4",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

2. 以[触发持久化处理][pfopHref]形式，给视频资源打水印：  

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo&key=sample.mp4&fops=vwatermark%2F1%2Fimage%2FaHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc%3D%2Fgravity%2FNorthEast%2Fformat%2Fmp4&notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

以上示例为指定视频资源打上水印`http://testunit.qiniudn.com/qiniulogo.png`, 水印的位置是右上角，生成格式为`mp4`的新视频资源。

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

