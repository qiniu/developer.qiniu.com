---
layout: docs
title: 管理凭证
order: 950
---

<a id="access-token"></a>
# 管理凭证

管理凭证（Access Token）是七牛云存储用于验证管理请求合法性的机制。建议仅在业务服务器端使用这一类凭证，避免意外授权导致滥用。

- [凭证算法](#access-token-algorithm)
- [计算示例](#access-token-fakecode)
- [附注](#access-token-remarks)
- [代码示例](#access-token-samples)
- [内部参考资源](#access-internal-resources) 
- [外部参考资源](#access-external-resources)   

<a id="access-token-algorithm"></a>
## 凭证算法

1. 生成待签名的原始字符串：  

	抽取请求URL中`<path>`或`<path>?<query>`的部分与请求内容部分（即HTTP Body），用“\n”连接起来。  
	如无请求内容，该部分必须为空字符串。  

    注意：当`Content-Type`为`application/x-www-form-urlencoded`时，签名内容必须包括请求内容（即HTTP Body）。  

	```
    signingStr = "<path>?<query>\n"
    或
    signingStr = "<path>?<query>\n<body>"
	```

2. 使用`SecertKey`对上一步生成的原始字符串计算[HMAC-SHA1][hmacSha1Href]签名：

	```
    sign = hmac_sha1(signingStr, "<SecretKey>")
	```

3. 对签名进行[URL安全的Base64编码][urlsafeBase64Href]：

	```
	encodedSign = urlsafe_base64_encode(sign)
	```

4. 最后，将`AccessKey`和`encodedSign`用`:`连接起来：  

	```
    accessToken = "<AccessKey>:<encodedSign>"
	```

<a id="access-token-fakecode"></a>
## 计算示例

假设有如下的管理请求：  

	```
    AccessKey = "MY_ACCESS_KEY"
    SecretKey = "MY_SECRET_KEY"

    url = "http://rs.qiniu.com/move/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ="
	```

则待签名的原始字符串是：  

	```
    signingStr = "/move/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ=\n"
	```

签名字符串是：  

	```
    注意：签名结果是二进制数据，此处输出的是每个字节的十六进制表示，以便核对检查。

    sign = "157b18874c0a1d83c4b0802074f0fd39f8e47843"
	```

编码后的签名字符串是：  

	```
    encodedSign = "FXsYh0wKHYPEsIAgdPD9OfjkeEM="
	```

最终的管理凭证是：  

	```
    accessToken = "MY_ACCESS_KEY:FXsYh0wKHYPEsIAgdPD9OfjkeEM="
	```

<a id="access-token-remarks"></a>
## 附注

无。

<a id="access-token-samples"></a>
## 代码示例

```
// TODO: 代码示例goes here.
```

<a id="access-internal-resources"></a>
## 内部参考资源

- [URL安全的Base64编码][urlsafeBase64Href]

<a id="access-external-resources"></a>
## 外部参考资源

- [HMAC-SHA1签名][hmacSha1Href]

[hmacSha1Href]:             http://en.wikipedia.org/wiki/Hash-based_message_authentication_code                  "HMAC-SHA1签名"
[urlsafeBase64Href]: http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
