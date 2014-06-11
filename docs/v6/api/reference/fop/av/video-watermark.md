---
layout: docs
title: 视频水印（watermark）
order: 139
---
<a id="vwatermark"></a>
# 视频水印

<a id="vwatermark-spec"></a>
## 视频水印规格

```
现在视频水印功能已经和转码（avthumb）功能合并，可以同时转码以及做水印
在avthumb中添加wmImage，wmGravity与原先的vwatermark里面的image，gravity对应

```

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
avthumb/<format>
       /...
       /vmImage/<EncodedRemoteImageUrl>
       /vmGravity/<Gravity>
```

参数名称                   | 必填 | 说明
:------------------------- | :--- | :---------------------------------
`...`                      |      | [avthumb](avthumb.html)的其他参数 
`<EncodedRemoteImageUrl>`  | 是   | 水印的源路径，目前仅支持远程路径，需要经过`urlsafe_base64_encode`。
`<Gravity>`                |      | 打水印的位置，参考[水印锚点参数表](#vwatermark-anchor-spec)，缺省值为`NorthEast`（右上角）。

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
        "persistentOps":        "avthumb/mp4/vmImage/aHR0cDovL3Rlc3R1bml0LnFpbml1ZG4uY29tL3Fpbml1bG9nby5wbmc=/vmGravity/NorthEast",
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

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例为指定视频资源打上水印`http://testunit.qiniudn.com/qiniulogo.png`, 水印的位置是右上角，生成格式为`mp4`的新视频资源。

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: ../../security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          ../pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: ../pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

