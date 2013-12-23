---
layout: docs
title: 下载凭证
order: 960
---

<a id="download-token"></a>
# 下载凭证

下载凭证是七牛云存储用于验证下载私有资源请求合法性的机制。用户通过下载凭证授权客户端，使其具备访问指定私有资源的能力。  

<a id="download-token-algorithm"></a>
## 算法

1. 构造下载URL：  

	```
    DownloadUrl = 'http://my-bucket.qiniu.com/sunflower.jpg'
	```

2. 为下载URL加上过期时间（e参数，[Unix时间][unixTimeHref]）：  

	```
    DownloadUrl = 'http://my-bucket.qiniu.com/sunflower.jpg?e=1451491200'
	```

3. 将上一步得到的URL字符串作为[凭证算法][tokenAlgorithmHref]的原始数据进行运算，得到下载凭证。

4. 将下载凭证添加到含过期时间参数的下载URL之后，作为最后一个参数（token参数）：  

	```
    RealDownloadUrl = 'http://my-bucket.qiniu.com/sunflower.jpg?e=1451491200&token=HbAKtTogKqDLWEkq7zVSX6T35NI='
	```

`RealDownloadUrl`即为下载对应私有资源的可用URL，并在指定时间后失效。  
失效后，可按需重新生成下载凭证。  

<a id="download-token-remarks"></a>
## 附注

- 为确保客户端、业务服务器和七牛服务器对于授权截止时间的理解保持一致，需要同步校准各自的时钟。频繁返回401状态码时请先检查时钟同步性与生成e参数值的代码逻辑。  

<a id="download-token-samples"></a>
## 代码示例

```
// TODO: 代码示例goes here.
```

<a id="download-external-resources"></a>
## 外部参考资源

- [Unix时间][unixTimeHref]
- [HMAC-SHA1加密][hmacSha1Href]
- [URL安全的Base64编码][urlsafeBase64Href]

[unixTimeHref]:             http://en.wikipedia.org/wiki/Unix_time                                               "Unix时间"
[jsonHref]:                 http://en.wikipedia.org/wiki/JSON                                                    "JSON格式"
[hmacSha1Href]:             http://en.wikipedia.org/wiki/Hash-based_message_authentication_code                  "HMAC-SHA1加密"
[urlsafeBase64Href]:        http://zh.wikipedia.org/wiki/Base64#.E5.9C.A8URL.E4.B8.AD.E7.9A.84.E5.BA.94.E7.94.A8 "URL安全的Base64编码"
[tokenAlgorithmHref]:		token-algorithm.html
