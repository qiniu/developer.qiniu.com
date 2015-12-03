---
layout: docs
title: 文档转换服务
order: 300
---

<a id="yifangyun_preview"></a>
# 文档转换服务（yifangyun_preview）

<a id="yifangyun_preview-description"></a>
## 描述

文档转换服务(`yifangyun_preview`)能帮您把各种office文档转换为PDF格式，从而达到在各个浏览器上面预览PDF的效果。

本服务由`亿方云科技`（以下简称`亿方云`）提供。启用服务后，您存储在七牛云空间的文件将在您主动请求的情况下被提供给`亿方云`以供其计算使用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="yifangyun_preview-open"></a>
## 如何开启

进入`https://portal.qiniu.com/service/market`, 找到文档转换服务点击开始使用。

<a id="yifangyun_preview-request"></a>
## 请求

<a id="yifangyun_preview-request-syntax"></a>
### 请求参数

```
yifangyun_preview/v2/ext=<Ext>/action=<Action>/format=<DestFormat>/page_number=<PageNumber>
```

参数           | 必填 | 说明
:------------- | :--- | :------------------------------------------
Ext            | 否   | 当key的后缀不是文件的正确格式时，可以在这个参数中指定对应的格式，优先级大于key的后缀
Action         | 否   | 为1. `get_preview`获取文件预览(默认行为) 2. `get_page_count`获取文件页码
DestFormat     | 否   | 目标格式，1. pdf(默认) 2. jpg  当指定为jpg的时候行为是获取office文档的某一个转为jpg图片，需要指定页码，原文件必须pdf格式
PageNumber     | 否   | 文件的页码

支持转换的文件格式：

```
word: doc, docx, odt, rtf, wps
ppt: ppt, pptx, odp, dps
excel: xls, xlsx, ods, csv, et
```

NOTE. 当需要把office转换为图片的时候，需要用本接口把office先转为pdf，然后从pdf转到jpg图片

<a id="yifangyun_preview-request-methods"></a>
### 请求方式

因为考虑到转换时间会比较久，用http实时转换很容易出现超时，为达到更好的显示效果，需要使用异步处理来进行文档的转换

1. 以[预转持久化][persistentOpsHref]形式：

	```
    {
        "scope":                "ztest:preview_test.docx",
        "deadline":             1390528576,
        "persistentOps":        "yifangyun_preview",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
	```

2. 以[触发持久化处理][pfopHref]形式，这一部分建议使用Qiniu提供的各个语言的SDK来处理：

	```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=ztest&key=preview_test.docx&fops=yifangyun_preview/v2&notifyURL=http%3A%2F%2Ffake.com%2Fqiniu%2Fnotify
	```

---

<a id="yifangyun_preview-samples"></a>
## 示例

```
原文件：             http://developer.qiniu.com/resource/preview_test.docx
对应转换过后的文件： http://developer.qiniu.com/resource/Fnbt4DFz0IjRP5CLyxWvRtR7ny5B

原文件：             http://developer.qiniu.com/resource/preview_test.pptx
对应转换过后的文件： http://developer.qiniu.com/resource/FhpYDdF3mYRKD4zBen4yYis7qqI1
```

<a id="yifangyun_preview-price"></a>
## 服务价格

|                 | 每千页PPT      | 每千页Word     |  每千个Excel的sheet |
:---------------- | :------------ | :------------ | :----------- |
|      价格       | 0.3元         | 0.1元  |        0.1元 | 

<a id="internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification                   "持久化处理结果通知"


