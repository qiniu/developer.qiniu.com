---
layout: docs
title: 访问持久化处理的结果（p）
order: 290
---

<a id="p-download"></a>
# 访问持久化处理的结果（p）

<a id="p-description"></a>
## 描述

[持久化处理][pfopHref]成功完成后，可以使用本接口访问已持久化的处理结果。  

<a id="p-specification"></a>
## 接口规格

```
p/1/<fop>
```

参数名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
`fop`         | 是   | 持久化时指定的处理规格字符串。

<a id="p-request"></a>
## 请求

<a id="request-syntax"></a>
### 请求语法

```
GET <RawDownloadURI>?<接口规格> HTTP/1.1
Host: <RawDownloadDomain>
```

<a id="request-headers"></a>
### 头部信息

头部名称      | 必填  | 说明
:------------ | :---- | :----------------------------------
Host          | 是    | 可下载指定资源的域名。

<a id="p-response"></a>
## 响应

<a id="request-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type: <ResourceMimeType>
Content-Length: <ResourceBinaryLength>

<ResourceBinary>
```

<a id="p-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 下载成功。
400	       | 请求报文格式错误。
401        | 管理凭证无效。
404        | 资源不存在。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

[pfopHref]:             pfop.html                                        "触发持久化处理"
[accessTokenHref]:      ../../security/access-token.html                 "管理凭证"
[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"

[urlescapeHref]:            http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
