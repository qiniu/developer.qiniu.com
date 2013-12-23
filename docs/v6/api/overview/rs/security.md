---
layout: docs
title: 安全机制
order: 350
---

# 安全机制

资源管理属于比较敏感的操作。原则上所有的资源管理操作均应在业务服务端进行。

每一个资源管理请求均需在HTTP请求头部增加一个`Authorization`字段，其值为符合管理凭证规格的字符串，样例如下：

```
GET /stat/<EncodedEntryURI> HTTP/1.1
Host: rs.qiniu.com
Authorization: QBox <管理凭证>
```

关于凭证的生成规则，请参见[管理凭证规格](/docs/v6/api/reference/security/access-token.html)。
