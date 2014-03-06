---
layout: docs
title: 数据格式
order: 150
---

<a id="data-format"></a>
# 数据格式

本节描述七牛云存储API中使用到的数据格式。

<a id="data-format-encoded-entry-uri"></a>
## EncodedEntryURI格式

本格式用于在URI中指定目标资源空间与目标资源名，格式如下：  

```
entry = '<Bucket>:<Key>'
encodedEntryURI = urlsafe_base64_encode(entry)
```

假设entry为`qiniuphotos:gogopher.jpg`，则对应的encodedEntryURI为`cWluaXVwaG90b3M6Z29nb3BoZXIuanBn`。  

<a id="download-internal-resources"></a>
## 内部参考资源

- [URL安全的Base64编码][urlsafeBase64Href]

[urlsafeBase64Href]: ../overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
