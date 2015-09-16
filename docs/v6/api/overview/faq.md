---
layout: docs
title: 常见问题
order: 98
---

<a id="faq"></a>
# 常见问题

- [技术问题](#technology-faq)
- [业务问题](#business-faq)

<a id="technology-faq"></a>
## 技术问题
### 1. 七牛云存储支持目录或文件夹概念么？

七牛云存储的服务端是一个 key-value 系统，而非树形结构，因此没有“目录”或“文件夹”的概念。
其中，value 是用户上传到七牛云存储的文件，key 是一个用户自定义的字符串，用于在服务端标识这个 value 文件。一个 key 对应一个 value，因此，在每个空间（Bucket）中，key 必须是唯一的。
key 中可以包含斜杠“/”，让你感觉像目录结构，比如 “a/b/c/d.txt” 这个 key，在服务端只对应一个文件，但它看起来像 a 目录下的 b 目录下的 c 目录下的文件 d.txt。实际上，服务端是不存在 a、b、c 三个目录的，也没法创建目录。

### 2. 七牛回调（callback）在本地如何调试？

[本地调试问题](http://developer.qiniu.com/docs/v6/api/overview/up/upload-models/response-types.html#FAQ)

### 3. 七牛下载文件内容/数据处理（get/fop）中的跳转规则是什么？

请求包：

```
GET /<UrlEncodedKey>[?e=<Deadline>&token=<DownloadToken>]
Host: <BucketHost>
```

或

```
GET /<UrlEncodedKey>?<Fop>/<Params>[sp=<StyleParam>&e=<Deadline>&token=<DownloadToken>]
Host: <BucketHost>
```
或

```
GET /<UrlEncodedKey><Sep><Style>@<StyleParam>[?e=<Deadline>&token=<DownloadToken>]
Host: <BucketHost>
```
返回包：

```
200 OK
<FileContentOrFopResult>
```
**跳转规则：**

- 如果key中存在连续的多个斜杠，并且这个key不存在，会做一次[path.Clean](http://golang.org/pkg/path/#Clean)并跳转。例如`http://gist.qiniudn.com//1.txt`会301跳转到`http://gist.qiniudn.com/1.txt`。
- 当文件的`mimeType`满足`"application/redirect30x`(其中x可以为`1,2,3,7`)时，在获取文件的时候会返回`30x`的跳转，跳转的地址为文件本身的内容。
- 当[noIndexPage](https://github.com/qbox/bs-apidoc/blob/master/apidoc/v6/uc.md#noindexpage-设置bucket-noindexpage属性)为0时，
  + 如果key以斜杠结尾，并且这个key不存在，但key/index.html或key/index.htm存在，会返回200并且取key/index.html或key/index.htm的数据。例如`http://gist.qiniudn.com/2/`会直接返回200，并且返回`http://gist.qiniudn.com/2/index.html`的数据。
   + 如果key不以斜杠结尾，并且这个key不存在，但key/index.html或key/index.htm存在，会进行302跳转。例如`http://gist.qiniudn.com/2`会跳转到`http://gist.qiniudn.com/2/index.html`。
   
<a id="business-faq"></a>
## 业务问题
### 1. 七牛的费用是怎么计算的？

七牛对存储量、下载流量、请求次数分别计费。最终支付款项为三项之和。
存储量取月度日均值，进行费用的结算。如存储量每日的绝对值为D1、D2、D3...D31 ，则最终月度结算费用时为(D1+D2+...+D31)/31。
下载流量和请求次数以新增的数量进行累积计算。
