---
layout: docs
title: 下载安全机制
order: 340
---

<a id="security"></a>
# 下载安全机制

- [公开资源下载](#download-public-resource)
- [私有资源下载](#download-private-resource)
- [防盗链](#anti-leech)

<a id="download-public-resource"></a>
## 公开资源下载

公开资源下载非常简单，以HTTP GET方式访问资源URL即可。资源URL的构成如下：

```公开
http://<domain>/<key>
```

以上的`<domain>`有两种形态：七牛子域名，自定义域名。

七牛子域名是一个创建空间时缺省分配的域名，开发者可以在[开发者平台 - 空间设置 - 域名设置](https://portal.qiniu.com)查看该子域名。子域名通常类似于`developer.qiniu.com`，用户可以通过以下URL下载名为flower.jpg的资源：

```
http://developer.qiniu.com/resource/flower.jpg
```

开发者可以申请为某特定空间绑定一个自定义域名，以通过这个域名访问资源，比如绑定了一个自定义域名`i.example.com`，就可以通过以下URL访问同样的资源：

```
http://i.example.com/flower.jpg
```

<a id="download-private-resource"></a>
## 私有资源下载

当用户将空间设置成私有后，所有对空间内资源的访问都必须获得授权。

私有资源下载也是通过以HTTP GET方式访问一个特定URL完成。私有资源URL与公开资源URL相比只是增加了两个参数`e`和`token`，分别表示过期时间和下载凭证。一个完整的私有资源URL如下所示：

```
http://<domain>/<key>?e=<deadline>&token=<downloadToken>
```

参数`e`表示URL的过期时间，采用[UNIX Epoch时间戳格式](http://en.wikipedia.org/wiki/Unix_time)，单位为秒。超时的访问将返回401错误。

> 如果请求方的时钟未校准，可能会造成有效期验证不正常，比如直接认为已过期。因此需要进行时钟校准。
> 
> 由于开发者无法保证客户端的时间都校准，所以应该在业务服务器上创建时间戳，并周期性校准业务服务器时钟。

参数`token`携带下载凭证。下载凭证是对资源访问的授权，不带下载凭证或下载凭证不合法都会导致401错误，表示验证失败。关于下载凭证的生成，请参见[下载凭证][downloadTokenHref]。

<a id="anti-leech"></a>
## 防盗链

下载还有一种常见的场景，即公开资源的防盗链，比如禁止特定来源域名的访问，禁止非浏览器发起的访问等。

我们可以通过HTTP协议支持的Referer机制（参见HTTP Referer）来进行相应的来源识别和管理。

防盗链是一个系统设置，不影响开发工作。如发现有盗链情况，开发者可在开发者平台的空间设置页面进行相应的设置。

[downloadTokenHref]: /docs/v6/api/reference/security/download-token.html "下载凭证"
