---
layout: docs
title: 附录
order: 100
---

<a id="appendix"></a>
# 附录

<a id="urlsafe-base64"></a>
## URL安全的Base64编码

URL安全的Base64编码适用于以URL方式传递Base64编码结果的场景。该编码方式的基本过程是先将内容以Base64格式编码为字符串，然后检查该结果字符串，将字符串中的加号`+`换成中划线`-`，并且将斜杠`/`换成下划线`_`。

详细编码规范请参见[RFC4648](http://www.ietf.org/rfc/rfc4648.txt)标准中的相关描述。

<a id="domain-binding"></a>
## 域名绑定

每个空间都可以绑定一个到多个自定义域名，以便于更方便的访问资源。

比如`www.qiniu.com`的所有静态资源均存放于一个叫`qiniu-resources`的公开空间中。并将该空间绑定到一个二级域名`i1.qiniu.com`，那么如果要在一个HTML页面中引用该空间的`logo.png`资源，大概的写法如下：

```
<img source="http://i1.qiniu.com/logo.png"></img>
```

这样既可以在一定程度上隐藏正在使用七牛云存储的事实，但更大的好处是如果需要从一个云存储迁移到另一个云存储，只需要修改域名DNS的CNAME设置，而无需更新网页源代码。
