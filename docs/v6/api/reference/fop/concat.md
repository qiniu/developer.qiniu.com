---
layout: docs
title: 文件拼接（concat）
order: 135
---

<a id="concat"></a>
# 文件拼接（concat）

<a id="concat-description"></a>
## 描述

本接口用于将数个源文件按指定顺序拼接成新文件。

<a id="concat-specification"></a>
## 接口规格

注意：接口规格不含任何空格与换行符，下列内容经过格式化以便阅读。  

```
concat/mimeType/<encodedMimeType>
      /<encodedUrl2>
      /<encodedUrl3>
      /<encodedUrl4>
      /...
```

参数名称                | 必填 | 说明
:---------------------- | :--- | :---------------------------------------------------------------
`/mimeType`             | 是   | ● 目标文件的MIME类型<br>需要进行[URL安全的Base64编码][urlsafeBase64Href]。
`/encodedUrlN`          | 是   | ● 经过[URL安全的Base64编码][urlsafeBase64Href]的完整源文件URL<br>1. 除去作为数据处理对象的源文件以外，还可以指定多个源文件；<br>2. 所有源文件必须属于同一存储空间；<br>3. 最多1000 个文件(含当前文件)。

<a id="concat-remarks"></a>
## 附注

1. 本接口只能用于[预转持久化处理][persistentOpsHref]和[触发持久化处理][pfopHref]。

<a id="concat-samples"></a>
## 示例

1. 以触发持久化处理形式，将多个文本文件拼接成一个（分别是a.txt、b.txt和c.txt）：  

	```
    POST /pfop HTTP/1.1
    Host: api.qiniu.com
    Content-Type: application/x-www-form-urlencoded
    Authorization: QBox <AccessToken>

    bucket=qiniu-ts-demo
    &key=a.txt
    &fops=concat%2FmimeType%2FdGV4dC9wbGFpbg%3D%3D%2FYi50eHQ%3D%2FYy50eHQ%3D
    &notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

	<span style="color: red;">注意：要在Authorization头部的`<AccessToken>`前添加`QBox`和半角空格。</span>

以上示例的处理结果通知方式请参考[持久化处理结果通知][pfopNotificationHref]。  

<a id="concat-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification "持久化处理结果通知"

[urlsafeBase64Href]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
