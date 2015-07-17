---
layout: docs
title: 视频水印
order: 145
---
<a id="vwatermark"></a>
# 视频水印（vwatermark）

<a id="vwatermark-spec"></a>
## 视频水印规格


* 现在视频水印功能已经和转码（avthumb）功能合并，可以同时转码以及做水印
* 在avthumb中添加wmImage，wmGravity与原先的vwatermark里面的image，gravity对应
* 与原vwatermark相比，增加文字水印接口，新增参数wmText、wmGravityText、wmFont、wmFontColor、wmFontSize


注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
avthumb/<format>
       /...
       /wmImage/<EncodedRemoteImageUrl>
       /wmGravity/<Gravity>
       /wmText/<EncodedText>
       /wmGravityText/<GravityText>
       /wmFont/<EncodeFont>
       /wmFontColor/<EncodeFontColor>
       /wmFontSize/<FontSize>
```

参数名称                   | 必填 | 说明
:------------------------- | :--- | :---------------------------------
`...`                      |      | [avthumb](http://developer.qiniu.com/docs/v6/api/reference/fop/av/avthumb.html)的其他参数 
`<EncodedRemoteImageUrl>`<p>`<EncodedText>` | 至少填一项  | 水印的源路径，图片水印目前仅支持远程路径，需要经过`urlsafe_base64_encode`。
`<Gravity>`及`<GravityText>`|      | 打水印的位置，参考[水印锚点参数表](#vwatermark-anchor-spec)，缺省值为`NorthEast`（右上角）。
`<EncodeFont>`         |      | 文本字体（详见支持[字体列表](http://kb.qiniu.com/support-fonts)），需要经过`urlsafe_base64_encode`，缺省为黑体,注意：中文水印必须指定中文字体。
`<EncodeFontColor>`    |      | 水印文字颜色，需要经过`urlsafe_base64_encode`，RGB格式，可以是颜色名称（比如red）或十六进制（比如#FF0000），参考RGB颜色编码表，缺省为黑色
`<FontSize>`     |      | 水印文字大小，单位: 缇，等于1/20磅，缺省值0（默认大小）

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

1. 以[预转持久化][persistentOpsHref]形式，给视频资源打图片和文字水印：  

	```
    {
        "scope":                "test:sample.mp4",
        "deadline":             1608652800,
        "persistentOps":        "avthumb/mp4/wmImage/aHR0cDovL3Rlc3QtMi5xaW5pdWRuLmNvbS9sb2dvLnBuZw==/wmText/d2Vsb3ZlcWluaXU=/wmFontColor/cmVk/wmFontSize/60/wmGravityText/North|saveas/dGVzdDpzYW1wbGVfdGFyZ2V0Lm1wNA==",
        “persistentPipeline”:   “newtest”,
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

2. 以[触发持久化处理][pfopHref]形式，给视频资源打水印：  

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  
    
    bucket=test&key=sample.mp4&fops=avthumb%2fmp4%2fwmImage%2faHR0cDovL3Rlc3QtMi5xaW5pdWRuLmNvbS9sb2dvLnBuZw==%2fwmText%2fd2Vsb3ZlcWluaXU=%2fwmFontColor%2fcmVk%2fwmFontSize%2f60%2fwmGravityText%2fNorth%2csaveas%2fdGVzdDpzYW1wbGVfdGFyZ2V0Lm1wNA==&notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例为指定视频资源打上图片水印`http://test-2.qiniudn.com/logo.png`, 位置是右上角；同时给视频打上文字水印`weloveqiniu`，颜色为红色，大小为3磅（60缇），字体为黑体，位置为正上方；生成文件名为为`sample_target.mp4`的新`mp4`视频资源。

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]:  http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

