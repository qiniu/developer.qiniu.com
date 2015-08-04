---
layout: docs
title: 多文件压缩（mkzip）
order: 100
---

<a id="mkzip"></a>
# 多文件压缩（mkzip）

<a id="description"></a>
## 描述

多文件压缩存储为用户提供了批量文件的压缩存储功能。 用户通过指定一系列URL，即可将若干七牛空间中的资源文件，在七牛服务端压缩后存储。若用户同时指定了[saveas](/docs/v6/api/reference/fop/saveas.html)，则将生成的压缩文件以用户指定的key存储到指定的bucket中，若未指定[saveas](/docs/v6/api/reference/fop/saveas.html)，则以压缩文件的hash值作为key并存储到当前bucket中。  

<a id="specification"></a>
## 接口规格（mkzipSpec）

```
mkzip/<mode>
     /url/<Base64EncodedURL>
     /alias/<Base64EncodedAlias>
     /url/<Base64EncodedURL>
     ...  
```

参数名称      | 说明                              | 必填
:------------ | :-------------------------------- | :-------
`<Mode>`      | 当前固定值为`2`，该字段主要用作后续功能扩展 | 必填
`<Base64EncodedURL>` | 需要被压缩的资源的URL，必须是公网可访资源，在请求中需要经过[URL安全的Base64编码](/docs/v6/api/overview/appendix.html#urlsafe-base64) |  至少一项
`<Base64EncodedAlias>` | 资源在压缩文件中的别名，需要经过[URL安全的Base64编码](/docs/v6/api/overview/appendix.html#urlsafe-base64)，若不指定则为url中资源的原文件名 |


**注意**：

- 该操作仅用作触发[pfop操作](/docs/v6/api/reference/fop/pfop/pfop.html)；
- 由于[pfop操作](/docs/v6/api/reference/fop/pfop/pfop.html)接口规格要求请求body中参数必须包含`bucket`和`key`，因此即使并未对空间特定资源进行操作，在执行`mkzip`操作时仍然需要指定账号下的特定空间和该空间的已有资源。
- URL所指的资源内容对mkzip操作本身没有影响。 


<a id="samples"></a>
## 示例

以[触发持久化处理][pfopHref]的形式：

1. 获取`http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg`、`http://developer.qiniu.com/resource/dive-into-golang.pptx`和`http://77fzez.com2.z0.glb.qiniucdn.com/thinking-in-go.mp4`中的资源；
2. 将`http://developer.qiniu.com/resource/dive-into-golang.pptx`重命名为`golang.pptx`；
3. 将`gogopher.jpg`、`golang.pptx`和`thinking-in-go.mp4`打包，并另存为成`test.zip`保存到空间`test`中。

```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=test
    &key=sample.mp4
    &fops=mkzip%2f2%2furl%2faHR0cDovL3Fpbml1cGhvdG9zLnFpbml1ZG4uY29tL2dvZ29waGVyLmpwZw==%2furl%2faHR0cDovL2RldmVsb3Blci5xaW5pdS5jb20vcmVzb3VyY2UvZGl2ZS1pbnRvLWdvbGFuZy5wcHR4%2falias%2fZ29sYW5nLnBwdHg=%2faHR0cDovL29wZW4ucWluaXVkbi5jb20vdGhpbmtpbmctaW4tZ28ubXA0%7csaveas%2fdGVzdDp0ZXN0LnppcA==
    
```

其中，请求body中的`key=sample.mp4`仅仅为符合[pfop操作][pfopHref]的接口规格而存在，并没有实际的意义，但需要是操作空间中存在的资源的key。

<a id="avthumb-internal-resources"></a>
## 内部参考资源

- [预转持久化处理][persistentOpsHref]
- [触发持久化处理][pfopHref]

[persistentOpsHref]: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"
[pfopHref]:          http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html                                        "触发持久化处理"
[pfopNotificationHref]: http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification                   "持久化处理结果通知"

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
