---
layout: docs
title: 简单反馈
order: 515
---
<a id="simple-response"></a>
# 简单反馈

如果资源上传成功，服务端会响应HTTP 200返回码，且在响应内容中包含两个字段：

- `name`：已成功上传的资源ID；
- `hash`：已上传资源的校验码，供用户核对使用。

以下是一个典型的上传成功反馈：

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "name": "gogopher.jpg",
    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
}
```

如果资源上传失败，服务端会反馈相应的错误信息。比如，HTTP 401代表验证失败。此时相应内容中会包含详细错误信息。错误信息同样为JSON格式：{"error":"\<reason\>"}

以下是一个典型的上传失败反馈：

```
HTTP/1.1 400 Bad Request
Date: Mon, 05 Aug 2013 13:56:34 GMT
Server: nginx/1.0.14
Content-Type: application/json
Access-Control-Allow-Origin: *
Content-Length: 28
X-Log: MC;SBD:10;RBD:11;BDT:12;FOPD/400;FOPG:63/400;IO:109/400
X-Reqid: -RIAAIAI8UjcgRcT
X-Via: 1.1 jssq179:8080 (Cdn Cache Server V2.0), 1.1 jsyc96:9080 (Cdn Cache Server V2.0)
Connection: close

{
    "error":"invalid argument"
}
```

这些返回的错误信息可以帮助开发者分析问题原因。完整的返回码信息请参见[返回码](../../../reference/codes.html)。

从上面的错误示例中可以看到，响应头中还包含了一些以`X-`为前缀的扩展字段，如`X-Reqid`和`X-Log`等。这些扩展信息非常有助于问题定位。我们建议开发者将所有接收到的错误信息写到日志中，以便于我们的技术支持人员在协助分析问题时有足够详细的线索。

关于这些扩展字段的详细描述，请参见[HTTP扩展字段](../../../reference/extended-headers.html)。