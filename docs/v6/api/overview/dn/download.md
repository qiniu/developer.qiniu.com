---
layout: docs
title: 资源下载
order: 480
---
<a id="download"></a>
# 资源下载

<a id="download-models"></a>
## 下载机制

资源的下载采用`HTTP GET`方式（详见[RFC2616 标准](<http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35>)）。下载过程所需的参数作为URL参数：

```
http://<domain>/<key>?<param1>=<value1>&<param2>=<value2>...
```

下载过程也通过标准的HTTP头`Range`字段支持分片下载。用户可以在下载时通过设定该字段指定只下载该资源的一部分内容：

```
Range: bytes=<first-byte-pos>-<last-byte-pos>
```

支持`Range`字段相当于提供了断点续传功能，对于大资源的下载可以提供比较好的用户体验，比如暂停下载、网络中断并恢复后继续下载。

在移动应用我们经常看到一个设置叫__只在WIFI连接时下载__。这个功能就可以通过资源下载对`Range`字段的支持而比较容易的实现。客户端通过在网络连接切换时判断当前连接类型而自动判断是否应该暂停下载，这样可以避免因为大资源的下载而耗尽3G流量（比如安装包的下载）。
 
<a id="download-response"></a>
## 下载响应

资源下载的响应符合HTTP GET的规范，比如200表示下载成功。除了标准的HTTP字段比如`Content-Type`、`Content-Length`外还会携带一些扩展字段，如`ETag`、`X-Log`、`X-Reqid`等。这些扩展字段非常有助于排查问题。

关于HTTP扩展字段的更多信息，请参见[HTTP扩展字段](../../reference/extended-headers.html)。

如果下载过程中遇到任何错误，我们建议开发者将这些详细信息都写入日志，在请求技术支持时提供这些错误信息以便快速排查。
