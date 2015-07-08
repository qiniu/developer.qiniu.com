---
layout: docs
title: 音视频拼接
order: 148
---

<a id="avconcat"></a>
# 音视频拼接

<a id="avconcat-description"></a>
## 描述

本接口用于将指定的数个音视频片段拼接成一段。

<a id="avconcat-specification"></a>
## 接口规格

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
avconcat/<Mode>
        /format/<Format>
        /<encodedUrl0>
        /<encodedUrl1>
        /<encodedUrl2>
        /...
```

参数名称                | 必填 | 说明
:---------------------- | :--- | :---------------------------------------------------------------
`<Mode>`                | 是   | ● `2` 表示使用filter方法。
`<Format>`              | 是   | ● 目标视频的格式（比如flv、mp4等）<br>请参考[支持转换的视频格式](http://ffmpeg.org/general.html#File-Formats)。
`<encodedUrlN>`         | 是   | ● 经过[URL安全的Base64编码][urlsafeBase64Href]的完整源文件URL<br>1. 除去作为数据处理对象的源文件以外，还可以指定最多5个源文件（即总计6个片段）；<br>2. 所有源文件必须属于同一存储空间。

<a id="avconcat-remarks"></a>
## 附注

1. 拼接视频片段时要保证所有源的画面长宽值一致；
2. 本接口只能用于[预转持久化处理][persistentOpsHref]和[触发持久化处理][pfopHref]。

<a id="avconcat-samples"></a>
## 示例

2. 以触发持久化处理形式，将多段mp4视频拼接成一段（分别是thinking-in-go.1.mp4、thinking-in-go.2.mp4、thinking-in-go.3.mp4。 假设这几个视频放在一个绑定了域名`test.clouddn.com`的空间中）：  

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com
    Content-Type: application/x-www-form-urlencoded
    Authorization: QBox <AccessToken>

    bucket=qiniu-ts-demo
    &key=thinking-in-go.1.mp4
    &fops=avconcat%2Fmode%2F1%2Fformat%2Fmp4%2FaHR0cDovL3Rlc3QuY2xvdWRkbi5jb20vdGhpbmtpbmctaW4tZ28uMi5tcDQ%3D%2FaHR0cDovL3Rlc3QuY2xvdWRkbi5jb20vdGhpbmtpbmctaW4tZ28uMy5tcDQ%3D
    &notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="avconcat-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

[urlsafeBase64Href]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
