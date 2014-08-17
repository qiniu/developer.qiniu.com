---
layout: docs
title: 下载凭证
order: 960
---

<a id="download-token"></a>
# 下载凭证

下载凭证是七牛云存储用于验证下载私有资源请求合法性的机制。  
用户通过下载凭证授权客户端，使其具备访问指定私有资源的能力。  

下载公开空间资源不需要下载凭证。  

<a id="download-token-algorithm"></a>
## 算法

1. 构造下载URL：  

	```
    DownloadUrl = 'http://my-bucket.qiniudn.com/sunflower.jpg'
	```

2. 为下载URL加上过期时间（e参数，[Unix时间][unixTimeHref]）：  

	```
    DownloadUrl = 'http://my-bucket.qiniudn.com/sunflower.jpg?e=1451491200'
	```

3. 对上一步得到的URL字符串计算HMAC-SHA1签名（假设`SecretKey`是`MY_SECRET_KEY`），并对结果做[URL安全的Base64编码][urlsafeBase64Href]：

	```
    Sign = hmac_sha1(DownloadUrl, 'MY_SECRET_KEY')
    EncodedSign = urlsafe_base64_encode(Sign)
	```

4. 将`AccessKey`（假设是`MY_ACCESS_KEY`）与上一步计算得到的结果以“:”连接起来：

	```
    Token = 'MY_ACCESS_KEY:NTQ3YWI5N2E5MjcxN2Y1ZTBiZTY3ZTZlZWU2NDAxMDY1YmI4ZWRhNwo='
	```

5. 将下载凭证添加到含过期时间参数的下载URL之后，作为最后一个参数（token参数）：  

	```
    RealDownloadUrl = 'http://my-bucket.qiniudn.com/sunflower.jpg?e=1451491200&token=MY_ACCESS_KEY:NTQ3YWI5N2E5MjcxN2Y1ZTBiZTY3ZTZlZWU2NDAxMDY1YmI4ZWRhNwo='
	```

`RealDownloadUrl`即为下载对应私有资源的可用URL，并在指定时间后失效。  
失效后，可按需重新生成下载凭证。  

<a id="download-token-remarks"></a>
## 附注

- 为确保客户端、业务服务器和七牛服务器对于授权截止时间的理解保持一致，需要同步校准各自的时钟。频繁返回401状态码时请先检查时钟同步性与生成e参数值的代码逻辑。  
- 对于包含中文或其它非英文字符的Key，需要做到以下两点：  
    - Key 本身要做 UTF-8 编码；
    - 为 URL 签名之前，对 Path 部分（不含前导`/`符号，通常就是 Key 本身，即上例中的 `sunflower.jpg`）做一次 [URL转义][urlescapeHref]。

<a id="download-token-samples"></a>
## 代码示例

```
// TODO: 代码示例goes here.
```

<a id="download-internal-resources"></a>
## 内部参考资源

- [URL安全的Base64编码][urlsafeBase64Href]

<a id="download-external-resources"></a>
## 外部参考资源

- [Unix时间][unixTimeHref]
- [HMAC-SHA1签名][hmacSha1Href]

[unixTimeHref]:             http://en.wikipedia.org/wiki/Unix_time                                               "Unix时间"
[jsonHref]:                 http://en.wikipedia.org/wiki/JSON                                                    "JSON格式"
[hmacSha1Href]:             http://en.wikipedia.org/wiki/Hash-based_message_authentication_code                  "HMAC-SHA1签名"
[urlsafeBase64Href]: ../../overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"

[urlescapeHref]:            http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
