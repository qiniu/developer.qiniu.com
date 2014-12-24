---
layout: docs
title: Python SDK 使用指南
---

# Python SDK 使用指南

此 Python SDK 适用于2.6、2.7、3.3、3.4版本，基于 [七牛云存储官方API](../index.html) 构建。使用此 SDK 构建您的网络应用程序，能让您以非常便捷地方式将数据安全地存储到七牛云存储上。无论您的网络应用是一个网站程序，还是包括从云端（服务端程序）到终端（手持设备应用）的架构的服务或应用，通过七牛云存储及其 SDK，都能让您应用程序的终端用户高速上传和下载，同时也让您的服务端更加轻盈。

SDK 下载地址：<https://github.com/qiniu/python-sdk/releases>

**文档大纲**

- [概述](#overview)
- [准备开发环境](#prepare)
	- [安装](#install)
	- [ACCESS_KEY 和 SECRET_KEY](#appkey)
- [使用SDK](#sdk-usage)
	- [初始化环境](#init)
	- [上传文件](#io-put)
		- [上传流程](#io-put-flow)
			- [上传策略](#io-put-policy)
			- [上传凭证](#upload-token)
			- [上传文件](#upload-do)
			- [断点续上传、分块并行上传](#resumable-io-put)
	- [下载文件](#io-get)
		- [下载公有文件](#io-get-public)
		- [下载私有文件](#io-get-private)
		- [断点续下载](#resumable-io-get)
	- [资源操作](#rs)
		- [获取文件信息](#rs-stat)
		- [复制文件](#rs-copy)
		- [移动文件](#rs-move)
		- [删除文件](#rs-delete)
		- [抓取资源](#rs-fetch)
		- [更新镜像资源](#rs-prefetch)
		- [批量操作](#rs-batch)
			- [批量获取文件信息](#batch-stat)
			- [批量复制文件](#batch-copy)
			- [批量移动文件](#batch-move)
			- [批量删除文件](#batch-delete)
	- [高级管理操作](#rsf)
		- [列出文件](#list-prefix)
	- [云处理](#fop)
		- [持久化处理](#pfop)
- [贡献代码](#contribution)
- [许可证](#license)

<a id="overview"></a>

## 概述

七牛云存储的 Python 语言版本 SDK（本文以下称 Python-SDK）是对七牛云存储API协议的一层封装，以提供一套对于 Python 开发者而言简单易用的开发工具。Python 开发者在对接 Python-SDK 时无需理解七牛云存储 API 协议的细节，原则上也不需要对 HTTP 协议和原理做非常深入的了解，但如果拥有基础的 HTTP 知识，对于出错场景的处理可以更加高效。

Python-SDK 被设计为同时适合服务器端和客户端使用。服务端是指开发者自己的业务服务器，客户端是指开发者提供给终端用户的软件，通常运行在 Windows/Mac/Linux 这样的桌面平台上。服务端因为有七牛颁发的 AccessKey/SecretKey，可以做很多客户端做不了的事情，比如删除文件、移动/复制文件等操作。一般而言，客服端操作文件需要获得服务端的授权。客户端上传文件需要获得服务端颁发的 [上传凭证](../api/reference/security/upload-token.html)，客户端下载文件（包括下载处理过的文件，比如下载图片的缩略图）需要获得服务端颁发的 [dntoken（下载授权凭证）][downloadTokenHref]。但开发者也可以将 bucket 设置为公开，此时文件有永久有效的访问地址，不需要业务服务器的授权，这对网站的静态文件（如图片、js、css、html）托管非常方便。

从 v5.0.0 版本开始，我们对 SDK 的内容进行了精简。所有管理操作，比如：创建/删除 bucket、为 bucket 绑定域名（publish）、设置数据处理的样式分隔符（fop seperator）、新增数据处理样式（fop style）等都去除了，统一建议到[开发者后台](https://portal.qiniu.com/)来完成。另外，此前服务端还有自己独有的上传 API，现在也推荐统一成基于客户端上传的工作方式。

从内容上来说，Python-SDK 主要包含如下几方面的内容：

* 基本配置部分：`qiniu.config`（包括的接口HOST设置、连接超时设置、连接重试次数设置）
* 安全部分：`qiniu.Auth`（包括上传凭证、下载凭证的签名以及对管理凭证的签名）
* 上传部分：`qiniu.put_file, qiniu.put_stream`（包括了上传流、上传文件、断点续上传）
* 数据处理部分：`qiniu.pfop`（包括了触发[持久化处理][pfopHref]）
* 处理工具部分：`qiniu.utils`（包括[urlsafe的base64编码](http://developer.qiniu.com/docs/v6/api/overview/appendix.html#urlsafe-base64)和解码部分，文件[etag值](http://developer.qiniu.com/docs/v6/api/overview/appendix.html#qiniu-etag)生成部分，七牛API中使用的[EncodedEntryUrI](http://developer.qiniu.com/docs/v6/api/reference/data-formats.html)的构造）


<a id="prepare"></a>

## 准备开发环境


<a id="install"></a>

### 安装

直接安装:
	
	pip install qiniu
	或者
	easy_install qiniu


源码安装：

从[Python-SDK下载地址](https://github.com/qiniu/python-sdk/releases)下载源码：

	tar xvzf python-sdk-$VERSION.tar.gz
	cd python-sdk-$VERSION
	python setup.py install


<a id="appkey"></a>

### ACCESS_KEY 和 SECRET_KEY

在使用SDK 前，您需要拥有一对有效的 AccessKey 和 SecretKey 用来进行签名授权。

可以通过如下步骤获得：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
2. 登录七牛开发者自助平台，查看 [Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

<a id="sdk-usage"></a>

## 使用SDK

<a id="init"></a>

### 初始化环境

在获取到 Access Key 和 Secret Key 之后，您可以在您的程序中调用如下两行代码进行初始化对接, 要确保`access_key` 和 `secret_key` 在调用所有七牛API服务之前均已赋值：

```
from qiniu import Auth

q = Auth(access_key, secret_key)
```

<a id="io-put"></a>

### 上传文件

为了尽可能地改善终端用户的上传体验，七牛云存储首创了客户端直传功能。一般云存储的上传流程是：

    客户端（终端用户） => 业务服务器 => 云存储服务

这样多了一次上传的流程，和本地存储相比，会相对慢一些。但七牛引入了客户端直传，将整个上传过程调整为：

    客户端（终端用户） => 七牛 => 业务服务器

客户端（终端用户）直接上传到七牛的服务器，通过DNS智能解析，七牛会选择到离终端用户最近的ISP服务商节点，速度会比本地存储快很多。文件上传成功以后，七牛的服务器使用回调功能，只需要将非常少的数据（比如Key）传给应用服务器，应用服务器进行保存即可。

<a id="io-put-flow"></a>

#### 上传流程

在七牛云存储中，整个上传流程大体分为这样几步：

1. 业务服务器颁发 [上传凭证][uploadTokenHref]给客户端（终端用户）
2. 客户端凭借 [上传凭证][uploadTokenHref] 上传文件到七牛
3. 在七牛获得完整数据后，发起一个 HTTP 请求回调到业务服务器
4. 业务服务器保存相关信息，并返回一些信息给七牛
5. 七牛原封不动地将这些信息转发给客户端（终端用户）

需要注意的是，回调到业务服务器的过程是可选的，它取决于业务服务器颁发的 [上传凭证][uploadTokenHref]。如果没有回调，七牛会返回一些标准的信息（比如文件的 hash）给客户端。如果上传发生在业务服务器，以上流程可以自然简化为：

1. 业务服务器生成 uptoken（不设置回调，自己回调到自己这里没有意义）
2. 凭借 [上传凭证][uploadTokenHref] 上传文件到七牛
3. 善后工作，比如保存相关的一些信息

<a id="io-put-policy"></a>

##### 上传策略

[上传凭证][uploadTokenHref] 实际上是用 AccessKey/SecretKey 进行数字签名的[上传策略][putPolicyHref](`qiniu.auth.Auth`)，它控制则整个上传流程的行为。让我们快速过一遍你都能够决策啥：

```
_policy_fields = set([
    'callbackUrl',
    'callbackBody',
    'callbackHost',

    'returnUrl',
    'returnBody',

    'endUser',
    'saveKey',
    'insertOnly',

    'detectMime',
    'mimeLimit',
    'fsizeLimit',

    'persistentOps',
    'persistentNotifyUrl',
    'persistentPipeline',
])

_deprecated_policy_fields = set([
    'asyncOps'
])
```

* `callbackUrl` 设定业务服务器的回调地址，这样业务服务器才能感知到上传行为的发生。
* `callbackBody` 设定业务服务器的回调信息。文件上传成功后，七牛向业务服务器的callbackUrl发送的POST请求携带的数据。支持 [魔法变量][magicVariablesHref] 和 [自定义变量][xVariablesHref]。
* `returnUrl` 设置用于浏览器端文件上传成功后，浏览器执行303跳转的URL，一般为 HTML Form 上传时使用。文件上传成功后浏览器会自动跳转到 `returnUrl?upload_ret=returnBody`。
* `returnBody` 可调整返回给客户端的数据包，支持 [魔法变量][magicVariablesHref] 和 [自定义变量][xVariablesHref]。`returnBody` 只在没有 `callbackUrl` 时有效（否则直接返回 `callbackUrl` 返回的结果）。不同情形下默认返回的 `returnBody` 并不相同。在一般情况下返回的是文件内容的 `hash`，也就是下载该文件时的 `etag`；但指定 `returnUrl` 时默认的 `returnBody` 会带上更多的信息。
* `asyncOps` 已经废弃，取而代之的是`persistentOps`，上传完成后进行的异步处理的持久化操作，具体操作可以参考上传预处理[详解](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops-explanation)和[示例](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-samples-persisntent-ops)。

关于上传策略更完整的说明，请参考 [上传凭证][uploadTokenHref]。

<a id="upload-token"></a>

##### 上传凭证

服务端生成 [上传凭证][uploadTokenHref] 代码如下：

```
from qiniu import Auth

q = Auth(access_key, secret_key)

# 上传策略仅指定空间名和上传后的文件名，其他参数仅为默认值
token = q.upload_token(bucket_name, key)

# 上传策略除空间名和上传后的文件名外，指定上传凭证有效期为7200s
# callcakurl为"http://callback.do"，
# callbackBody为原始文件名和文件Etag值
token2 = q.upload_token(bucket_name, key, 7200, {'callbackUrl':"http://callback.do", 'callbackBody':"name=$(fname)&hash=$(etag)"})
```

<a id="upload-do"></a>

##### 上传文件

上传文件到七牛（通常是客户端完成，但也可以发生在服务端）：


```
# -*- coding: utf-8 -*-
# flake8: noqa

access_key = '...'
secret_key = '...'
bucket_name = '...'

q = Auth(access_key, secret_key)

# 直接上传二进制流

key = 'a\\b\\c"你好'
data = 'hello bubby!'
token = q.upload_token(bucket_name)
ret, info = put_data(token, key, data)
print(info)
assert ret['key'] == key

key = ''
data = 'hello bubby!'
token = q.upload_token(bucket_name, key)
ret, info = put_data(token, key, data, mime_type="application/octet-stream", check_crc=True)
print(info)
assert ret['key'] == key

# 上传本地文件

localfile = __file__
key = 'test_file'
mime_type = "text/plain"
params = {'x:a': 'a'}

token = q.upload_token(bucket_name, key)
ret, info = put_file(token, key, localfile, mime_type=mime_type, check_crc=True)
print(info)
assert ret['key'] == key
assert ret['hash'] == etag(localfile)
```

ret是一个字典，含有`hash`，`key`等信息。

<a id="resumable-io-put"></a>

##### 断点续上传、分块并行上传

除了基本的上传外，七牛还支持你将文件切成若干块（除最后一块外，每个块固定为4M大小），每个块可独立上传，互不干扰；每个分块块内则能够做到断点上续传。

我们来看支持了断点上续传、分块并行上传的基本样例：

```
# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import put_file

import qiniu.config

access_key = '...'
secret_key = '...'
bucket_name = '...'

q = Auth(access_key, secret_key)

mime_type = "text/plain"
params = {'x:a': 'a'}
localfile = '.../.../...'

key = 'big'
token = q.upload_token(bucket_name, key)

progress_handler = lambda progress, total: progress
ret, info = put_file(token, key, localfile, params, mime_type, progress_handler=progress_handler)
print(info)
assert ret['key'] == key
```

<a id="io-get"></a>

### 下载文件

<a id="io-get-public"></a>

#### 下载公有文件

每个 bucket 都会绑定一个或多个域名（domain）。如果这个 bucket 是公开的，那么该 bucket 中的所有文件可以通过一个公开的下载 url 可以访问到：

    http://<domain>/<key>

其中\<domain\>是bucket所对应的域名。七牛云存储为每一个bucket提供一个默认域名。默认域名可以到[七牛云存储开发者平台](https://portal.qiniu.com/)中，空间设置的域名设置一节查询。

假设某个 bucket 既绑定了七牛的二级域名，如 hello.qiniudn.com，也绑定了自定义域名（需要备案），如 hello.com。那么该 bucket 中 key 为 a/b/c.htm 的文件可以通过`http://hello.qiniudn.com/a/b/c.htm`或`http://hello.com/a/b/c.htm`中任意一个 url 进行访问。

**注意： key必须采用utf8编码，如使用非utf8编码访问七牛云存储将反馈错误**

<a id="io-get-private"></a>

#### 下载私有文件

如果某个 bucket 是私有的，那么这个 bucket 中的所有文件只能通过一个的临时有效的 downloadUrl 访问：

    http://<domain>/<key>?e=<deadline>&token=<dntoken>

其中 dntoken 是由业务服务器签发的一个[临时下载授权凭证][downloadTokenHref]，deadline 是 dntoken 的有效期。dntoken 不需要单独生成，SDK 提供了生成完整 private_url 的方法（包含了 dntoken），示例代码如下：

```
# -*- coding: utf-8 -*-
# flake8: noqa
import requests

from qiniu import Auth

access_key = '...'
secret_key = '...'

q = Auth(access_key, secret_key)

bucket = 'test_private_bucket'
key = 'test_private_key'
base_url = 'http://%s/%s' % (bucket + '.qiniudn.com', key)
private_url = q.private_download_url(base_url, expires=3600)
print(private_url)
r = requests.get(private_url)
assert r.status_code == 200
```

生成 private_url 后，服务端下发 private_url 给客户端。客户端收到 private_url 后，和公有资源类似，直接用任意的 HTTP 客户端就可以下载该资源了。唯一需要注意的是，在 private_url 失效却还没有完成下载时，需要重新向服务器申请授权。

无论公有资源还是私有资源，下载过程中客户端并不需要七牛 SDK 参与其中。

<a id="resumable-io-get"></a>

#### 断点续下载

无论是公有资源还是私有资源，获得的下载 url 支持标准的 HTTP 断点续传协议。考虑到多数语言都有相应的断点续下载支持的成熟方法，七牛 Python-SDK 并不提供断点续下载相关代码。

<a id="rs"></a>

### 资源操作

<!--TODO:资源操作介绍-->

```
# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import BucketManager

access_key = '...'
secret_key = '...'
bucket_name = '...'

q = Auth(access_key, secret_key)
bucket = BucketManager(q)
```


<a id="rs-stat"></a>

``` 
# 获取文件信息
key = '...'
ret, info = bucket.stat(bucket_name, key)
print(info)
assert 'hash' in ret
```

<a id="rs-copy"></a>

``` 
# 复制文件
key = '...'
ret, info = bucket.copy(bucket_name, 'copyfrom', bucket_name, key)
print(info)
assert ret == {}
```

<a id="rs-move"></a>

```
# 移动文件
key = '...'
key2 = key + 'move'
ret, info = bucket.move(bucket_name, key, bucket_name, key2)
print(info)
assert ret == {}
```

<a id="rs-delete"></a>

```
# 删除文件
key = '...'
ret, info = bucket.delete(bucket_name, key)
print(info)
assert ret is None
assert info.status_code == 612
```


<a id="rs-fetch"></a>

```
# 抓取资源
ret, info = bucket.fetch('http://developer.qiniu.com/docs/v6/sdk/python-sdk.html', bucket_name, 'fetch.html')
print(info)
assert ret == {}
```


<a id="rs-prefetch"></a>

```
# 更新镜像资源
ret, info = bucket.prefetch(bucket_name, 'python-sdk.html')
print(info)
assert ret == {}
```

<a id="rs-batch"></a>
#### 批量操作

当您需要一次性进行多个操作时, 可以使用批量操作。

```
# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import BucketManager

access_key = '...'
secret_key = '...'
bucket_name = '...'

q = Auth(access_key, secret_key)
bucket = BucketManager(q)
```


<a id="batch-stat"></a>

``` 
# 批量获取文件信息
from qiniu import build_batch_stat

ops = build_batch_stat(bucket_name, ['python-sdk.html','python-sdk2.html'])
ret, info = bucket.batch(ops)
print(info)
assert ret[0]['code'] == 200
```

<a id="batch-copy"></a>

``` 
# 批量复制文件
from qiniu import build_batch_copy

key = 'copyto'
ops = build_batch_copy(bucket_name, {'copyfrom': key}, bucket_name)
ret, info = bucket.batch(ops)
print(info)
assert ret[0]['code'] == 200
```

<a id="batch-move"></a>

``` 
# 批量移动文件
from qiniu import build_batch_move

key = 'moveto'
key2 = key + 'move'
ops = build_batch_move(bucket_name, {key: key2}, bucket_name)
ret, info = bucket.batch(ops)
print(info)
assert ret[0]['code'] == 200
```

<a id="batch-delete"></a>

```
# 批量删除文件 
from qiniu import build_batch_delete

ops = build_batch_delete(bucket_name, ['python-sdk.html'])
ret, info = self.bucket.batch(ops)
print(info)
assert ret[0]['code'] == 612
```


<a id="rsf"></a>
### 高级管理操作

<a id="list-prefix"></a>
#### 列出文件

请求某个存储空间（bucket）下的文件列表，如果有前缀，可以按前缀（prefix）进行过滤；如果前一次返回marker就表示还有资源，下一步请求需要将marker参数填上。

``` 
# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import BucketManager

access_key = '...'
secret_key = '...'
bucket_name = '...'

q = Auth(access_key, secret_key)
bucket = BucketManager(q)

ret, eof, info = bucket.list(bucket_name, limit=4)
print(info)
assert eof is False
assert len(ret.get('items')) == 4

ret, eof, info = bucket.list(bucket_name, limit=100)
print(info)
assert eof is True

# 从上一次list_prefix的位置继续列出文件
ret2, eof, info = bucket.list(bucket_name, prefix="test", marker=ret['marker'], limit=1)
print(info)
assert eof is True
```

一个典型的对整个bucket遍历的操作为：

``` 
q = Auth(access_key, secret_key)

def list_all(bucket_name, bucket=None, prefix=None, limit=None):
	if bucket is None:
		bucket = BucketManager(q)
	marker = None
	eof = False
	while eof is False:
		ret, eof, info = bucket.list(bucket_name, prefix=prefix, marker=marker, limit=limit)
		marker = ret.get('marker', None)
		for item in ret['items']:
			print(item['key'])
			pass
	if eof is not True:
		# 错误处理
		pass
```

<a id="fop"></a>
### 云处理

<a id="pfop"></a>
### 持久化处理

```
# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth, PersistentFop, build_op, op_save

access_key = '...'
secret_key = '...'
bucket_src = '...'
key_src = '...'
saved_bucket = '...'
saved_key = '...'
pipeline = '...'

q = Auth(access_key, secret_key)

pfop = PersistentFop(q, bucket_src, pipeline)
op = op_save('avthumb/m3u8/segtime/10/vcodec/libx264/s/320x240', saved_bucket, saved_key)
ops = []
ops.append(op)
ret, info = pfop.execute(key_src, ops, 1)
print(info)
assert ret['persistentId'] is not None
```

<a id="contribution"></a>
## 贡献代码

+ Fork
+ 创建您的特性分支 (git checkout -b my-new-feature)
+ 提交您的改动 (git commit -am 'Added some feature')
+ 将您的修改记录提交到远程 git 仓库 (git push origin my-new-feature)
+ 然后到 github 网站的该 git 远程仓库的 my-new-feature 分支下发起 Pull Request

<a id="license"></a>
## 许可证

> Copyright (c) 2014 qiniu.com

基于 MIT 协议发布:

> [www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)
 
[putPolicyHref]:      ../api/reference/security/put-policy.html      "上传策略"
[uploadTokenHref]:    ../api/reference/security/upload-token.html    "上传凭证"
[downloadTokenHref]:  ../api/reference/security/download-token.html  "下载凭证"
[magicVariablesHref]: ../api/overview/up/response/vars.html#magicvar "魔法变量"
[xVariablesHref]:     ../api/overview/up/response/vars.html#xvar     "自定义变量"
[pfopHref]:           ../api/reference/fop/pfop/pfop.html            "持久化处理"
