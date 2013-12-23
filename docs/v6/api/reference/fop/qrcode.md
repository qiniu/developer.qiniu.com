---
layout: docs
title: 资源下载二维码（qrcode）
order: 110
---

<a id="qrcode"></a>
# 资源下载二维码（qrcode）

<a id="description"></a>
## 描述

生成二维码功能可以为存放在七牛云存储上的资源`下载URL`或`资源内容`生成一个二维码图片，方便用户在各种客户端之间传播资源。  
所生成的二维码图片格式为png。  

<a id="specification"></a>
## 接口规格（qrcodeSpec）

```
<DownloadURL>?qrcode/<Mode>/level/<Level>
```

其中`<DownloadURL>`代表资源的原始下载URL，请参考[下载接口](../../overview/dn/download.html)。  

参数名称      | 说明                              | 必填
:------------ | :-------------------------------- | :-------
`<Mode>`      | 可选值：`0`（为`<DownloadURL>`本身生成二维码）<p>`1`（为`<DownloadURL>`指向的资源内容生成二维码）<p>缺省为`0` | 
`/<level>/Level` | 冗余度，可选值`L`（7%）、`M`（15%）、`Q`（25%），`H`（30%），缺省为`L` |

注意：`L`是最低级别的冗余度，`H`最高。冗余度越高，生成图片体积越大。详情请参考[维基百科](http://en.wikipedia.org/wiki/QR_code#Error_correction)。  

<a id="request"></a>
### 请求

<a id="request-syntax"></a>
#### 请求语法

```
GET <DownloadURI>?<qrcodeSpec> HTTP/1.1
Host: <DownloadHost>
```

<a id="response"></a>
### 响应

<a id="response-syntax"></a>
#### 响应语法

```
HTTP/1.1 200 OK
Content-Type: image/png

<ImageBinaryData>
```

如果请求失败，具体信息请参考响应状态码。

<a id="response-code"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 二维码生成成功
400	       | 请求语法错误
404        | 资源不存在
599	       | 服务端操作失败。<p>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="remarks"></a>
## 附注

二维码的内容实际上是文本，却可存储多种类型的内容，参考[具体用例](https://code.google.com/p/zxing/wiki/BarcodeContents)。  

<a id="samples"></a>
## 示例

1. Mode=0时，基于下载URL生成二维码：  

	```
    http://docs.qiniudn.com/api/qrcode.html?qrcode
	```

	![点击察看图片](http://docs.qiniudn.com/api/qrcode.html?qrcode)

2. Mode=1时，基于下载URL指向的资源内容生成二维码：  

	```
    http://docs.qiniudn.com/api/qrcode.html?qrcode/1
	```

	![点击察看图片](http://docs.qiniudn.com/api/qrcode.html?qrcode/1)

3. 分别用不同的冗余度生成不同尺寸的二维码：   

	```
    http://docs.qiniudn.com/api/qrcode.html?qrcode/0/level/L
	```

	![点击察看图片](http://docs.qiniudn.com/api/qrcode.html?qrcode/0/level/L)

	```
    http://docs.qiniudn.com/api/qrcode.html?qrcode/0/level/H
	```

	![点击察看图片](http://docs.qiniudn.com/api/qrcode.html?qrcode/0/level/H)

	以上两个二维码图片尺寸不同，但表示的内容相同。

<a id="advance-usage"></a>
## 高级用法

想生成二维码 + Logo，可以使用七牛云存储的[Pipeline API](../../overview/fop/pipeline.html)和[图像水印接口](image/watermark.html) 操作实现。例如，

	```
    http://qrcode.qiniudn.com/qiniu.vcard?qrcode/1/level/M|watermark/1/image/aHR0cDovL3FyY29kZS5xaW5pdWRuLmNvbS93ZWlib2xvZ282LnBuZz9pbWFnZU1vZ3IvdGh1bWJuYWlsLzMyeDMy/gravity/center/dx/0/dy/0
	```

	![QRCode+Logo](http://qrcode.qiniudn.com/qiniu.vcard?qrcode/1/level/M|watermark/1/image/aHR0cDovL3FyY29kZS5xaW5pdWRuLmNvbS93ZWlib2xvZ282LnBuZz9pbWFnZU1vZ3IvdGh1bWJuYWlsLzMyeDMy/gravity/center/dx/0/dy/0)

[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
