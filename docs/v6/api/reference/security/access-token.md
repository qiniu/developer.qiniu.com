---
layout: docs
title: 管理凭证
order: 950
---

<a id="access-token"></a>
# 管理凭证

管理凭证（Access Token）是七牛云存储用于验证管理请求合法性的机制。建议仅在业务服务器使用这一类凭证，避免意外授权导致滥用。  

<a id="access-token-algorithm"></a>
## 算法

1. 生成待签名字符串：  

	抽取请求URL中`<path>`或`<path>?<query>`的部分与请求内容，用“\n”连接起来。  
	如无请求内容，该部分必须为空字符串。  

    注意：当`Content-Type`为`application/x-www-form-urlencoded`时，签名内容须包括报文内容（即Body部分）。  

	```
    signingStr = '<path>?<query>\n'
    或
    signingStr = '<path>?<query>\n<body>'
	```

	假设有如下的管理请求  

	```
    http://rs.qiniu.com/move/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ=
	```

	待签名的字符串是  

	```
    '/move/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ=\n'
	```

2. 将上一步得到的字符串作为[凭证算法][tokenAlgorithmHref]的原始数据进行运算，得到管理凭证，我们称之为`encodedSign`。

3. 最后，将`AccessKey`和`encodedSign`用`:`连接：  

	```
    <AccessKey>:<encodedSign>
	```

    假设`AccessKey`为'j6XaEDm5DwWvn0H9TTJs9MugjunHK8Cwo3luCglo'，最终结果应为  

    
	```
    'j6XaEDm5DwWvn0H9TTJs9MugjunHK8Cwo3luCglo:Ubf-hoK7DkUJQv_P0vyQORA_7IY='
	```

<a id="access-token-remarks"></a>
## 附注

无。

<a id="access-token-samples"></a>
## 代码示例

```
// TODO: 代码示例goes here.
```

<a id="access-external-resources"></a>
## 外部参考资源

- [HMAC-SHA1加密][hmacSha1Href]
- [URL安全的Base64编码][urlsafeBase64Href]

[hmacSha1Href]:             http://en.wikipedia.org/wiki/Hash-based_message_authentication_code                  "HMAC-SHA1加密"
[urlsafeBase64Href]:        http://zh.wikipedia.org/wiki/Base64#.E5.9C.A8URL.E4.B8.AD.E7.9A.84.E5.BA.94.E7.94.A8 "URL安全的Base64编码"
[tokenAlgorithmHref]:		token-algorithm.html
