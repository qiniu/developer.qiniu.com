---
layout: docs
title: 文档转换服务
order: 300
---

<a id="yifangyun_preview"></a>
# 文档转换服务（yifangyun_preview）

<a id="yifangyun_preview-description"></a>
## 描述

文档转换服务(`yifangyun_preview`)能帮您把各种office文档转换为PDF格式，从而达到在各个浏览器上面预览PDF的效果。

本服务由`亿方云科技`（以下简称`亿方云`）提供。启用服务后，您存储在七牛云空间的文件将在您主动请求的情况下被提供给`亿方云`以供其计算使用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="yifangyun_preview-open"></a>
## 如何开启

进入`https://portal.qiniu.com/service/market`, 找到文档转换服务点击开始使用。

<a id="yifangyun_preview-request"></a>
## 请求

<a id="yifangyun_preview-request-syntax"></a>
### 请求报文格式

```
GET http[s]://<DownloadHost>/<Key>?yifangyun_preview/<Ext> HTTP/1.1
```

<a id="yifangyun_preview-request-args"></a>
### 请求参数

参数           | 必填 | 说明
:------------- | :--- | :------------------------------------------
Key            | 是   | 保存在Qiniu上面的文件key，后缀需要为对应的office类型的文件格式
Ext            | 否   | 当key的后缀不是文件的正确格式时，可以在这个参数中指定对应的格式，优先级大于key的后缀

支持转换的文件格式：

```
word: doc, docx, odt, rtf, wps
ppt: ppt, pptx, odp, dps
excel: xls, xlsx, ods, csv, et
```

---

<a id="yifangyun_preview-response"></a>
## 响应

<a id="yifangyun_preview-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/pdf

<Body>
```

<a id="yifangyun_preview-response-header"></a>
### 响应参数

说明       | 说明
:------------- | :------------------------------------------
Content-Type   | MIME类型，固定为application/pdf
Body           | 为对应的PDF文件内容

<a id="yifangyun_preview-samples"></a>
## 示例

在Web浏览器中输入以下地址：

```
http://ztest.qiniudn.com/preview_test.docx?yifangyun_preview
http://ztest.qiniudn.com/preview_test.pptx?yifangyun_preview
```

预期结果是一个PDF文档


