---
layout: docs
title: 303重定向
order: 513
---
<a id="redirect"></a>
# 303重定向

HTTP 303重定向（参见[RFC 2616 - 10.3.4](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.4)）是HTTP 1.1规范的组成部分。  
服务器可以通过返回303状态码告诉客户端，本次请求的内容可以通过返回的跳转URL取到，因此客户端应该重定向到新的URL。  
该技术被广泛用于网页开发领域，如在文件上传完成后让客户端自动重定向到一个上传成功的结果页面。  

七牛云存储的资源资源上传后续动作也支持303重定向功能。

在构造[上传凭证](../../../reference/security/upload-token.html)时，开发者可以通过设置[上传策略](../../../reference/security/put-policy.html)中的`returnUrl`参数以激活303重定向功能。在成功完成上传后，服务端会向客户端返回HTTP 303状态码，并在`Location`字段中携带上传时指定的重定向地址。如下所示：

```
HTTP/1.1 303 See Other
Location: <returnUrl>
```

客户端收到这样的反馈后，应按HTTP 1.1标准将当前页面重定向到`Location`字段所指定的URL。  
主流浏览器都能正确的支持该跳转操作。  

如果上传策略中还设定了自定义返回内容`returnBody`，则到时服务端返回的303响应中的`Location`字段也会包含自定义返回内容。参数值采用[URL安全的Base64编码](../../appendix.html#urlsafe-base64)。此时的响应内容如下所示：

```
HTTP/1.1 303 See Other
Location: <returnUrl>?upload_ret=<encoded_return_body>
```

如果希望返回的自定义返回内容能得到正确处理，重定向URL所对应的服务器需支持请求参数`upload_ret`。 
