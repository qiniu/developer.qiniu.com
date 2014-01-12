---
layout: docs
title: 上传凭证
order: 970
---

<a id="upload-token"></a>
# 上传凭证

上传凭证是七牛云存储用于验证上传请求合法性的机制。用户通过上传凭证授权客户端，使其具备访问指定资源的能力。  

<a id="upload-token-algorithm"></a>
## 算法

1. 构造[上传策略][putPolicyHref]：  

	用户根据业务需求，确定上传策略要素，构造出具体的上传策略。  
	比如，有用户需要向空间`my-bucket`上传一个名为`sunflower.jpg`的图片，授权有效期截止到`2015-12-31 00:00:00`，并且希望得到图片的名称、大小、宽高和校验值。那么相应的上传策略各字段分别为：  

	```
    scope = 'my-bucket:sunflower.jpg'
    deadline = 1451491200
    returnBody = '{
      "name": $(fname),
      "size": $(fsize),
      "w": $(imageInfo.width),
      "h": $(imageInfo.height),
      "hash": $(etag)
    }'
	```

2. 将上传策略序列化成为[JSON格式][jsonHref]：  

	用户可以使用各种语言的JSON库，也可以手工地拼接字符串。  
	序列化后，应得到如下形式的字符串（字符串值以外部分不含空格或换行）。  

	```
    putPolicy = '{"scope":"my-bucket:sunflower.jpg","deadline":1451491200,"returnBody":"{\"name\":$(fname),\"size\":$(fsize),\"w\":$(imageInfo.width),\"h\":$(imageInfo.height),\"hash\":$(etag)}"}'
	```

3. 对JSON编码的上传策略进行[URL安全的Base64编码][urlsafeBase64Href]，得到待签名字符串：

	```
    signingStr = urlsafe_base64_encode(putPolicy)
	```

实际值为：  

	```
    signingStr = "eyJzY29wZSI6Im15LWJ1Y2tldDpzdW5mbG93ZXIuanBnIiwiZGVhZGxpbmUiOjE0NTE0OTEyMDAsInJldHVybkJvZHkiOiJ7XCJuYW1lXCI6JChmbmFtZSksXCJzaXplXCI6JChmc2l6ZSksXCJ3XCI6JChpbWFnZUluZm8ud2lkdGgpLFwiaFwiOiQoaW1hZ2VJbmZvLmhlaWdodCksXCJoYXNoXCI6JChldGFnKX0ifQ=="
	```


4. 使用`SecertKey`对上一步生成的待签名字符串计算[HMAC-SHA1][hmacSha1Href]签名：

	```
    sign = hmac_sha1(signingStr, "<SecretKey>")
	```

假设`SecretKey`为'MY_SECRET_KEY'，实际签名为：  

	```
    注意：签名结果是二进制数据，此处输出的是每个字节的十六进制表示，以便核对检查。
    sign = "c10e287f2b1e7f547b20a9ebce2aada26ab20ef2"
	```

5. 对签名进行[URL安全的Base64编码][urlsafeBase64Href]：

	```
	encodedSign = urlsafe_base64_encode(sign)
	```

最终签名值为：  

	```
    encodedSign = "wQ4ofysef1R7IKnrziqtomqyDvI="
	```

6. 将`AccessKey`、`encodedSign`和`encodedPutPolicy`用`:`连接起来：  

	```
    uploadToken = AccessKey + ':' + encodedSign + ':' + encodedPutPolicy
	```

	假设用户的`AccessKey`为'MY_ACCESS_KEY'，则最后得到的上传凭证应为  

	```
    uploadToken = "MY_ACCESS_KEY:eyJzY29wZSI6Im15LWJ1Y2tldDpzdW5mbG93ZXIuanBnIiwiZGVhZGxpbmUiOjE0NTE0OTEyMDAsInJldHVybkJvZHkiOiJ7XCJuYW1lXCI6JChmbmFtZSksXCJzaXplXCI6JChmc2l6ZSksXCJ3XCI6JChpbWFnZUluZm8ud2lkdGgpLFwiaFwiOiQoaW1hZ2VJbmZvLmhlaWdodCksXCJoYXNoXCI6JChldGFnKX0ifQ==:wQ4ofysef1R7IKnrziqtomqyDvI="
	```

<a id="upload-token-remarks"></a>
## 附注

- 为确保客户端、业务服务器和七牛服务器对于授权截止时间的理解保持一致，需要同步校准各自的时钟。频繁返回401状态码时请先检查时钟同步性与生成deadline值的代码逻辑。  

<a id="upload-token-samples"></a>
## 代码示例

```
// TODO: 代码示例goes here.
```

<a id="upload-token-samples"></a>
## 上传凭证生成器

[在线示例](http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken)

<a id="upload-internal-resources"></a>
## 内部参考资源

- [上传策略][putPolicyHref]

<a id="upload-external-resources"></a>
## 外部参考资源

- [HMAC-SHA1加密][hmacSha1Href]
- [URL安全的Base64编码][urlsafeBase64Href]

[putPolicyHref]:            put-policy.html "上传策略"

[jsonHref]:                 http://en.wikipedia.org/wiki/JSON                                                    "JSON格式"
[hmacSha1Href]:             http://en.wikipedia.org/wiki/Hash-based_message_authentication_code                  "HMAC-SHA1加密"
[urlsafeBase64Href]:        http://zh.wikipedia.org/wiki/Base64#.E5.9C.A8URL.E4.B8.AD.E7.9A.84.E5.BA.94.E7.94.A8 "URL安全的Base64编码"
