---
layout: docs
title: Ruby SDK 使用指南
---

# Ruby SDK 使用指南

- [概述](#overview)
    - [参考链接](#extern-links)
    - [状态](#status)
    - [维护人员](#contributors)
- [准备开发环境](#prepare)
	- [环境依赖](#dependences)
	- [安装](#install)
	- [ACCESS_KEY 和 SECRET_KEY](#appkey)
- [使用SDK](#sdk-usage)
	- [初始化环境与清理](#init)
	- [上传文件](#io-put)
		- [上传流程](#io-put-flow)
		- [上传策略](#io-put-policy)
	- [下载文件](#io-get)
		- [下载公有文件](#io-get-public)
		- [下载私有文件](#io-get-private)
		- [断点续下载](#resumable-io-get)
	- [资源操作](#rs)
		- [获取文件信息](#rs-stat)
		- [删除文件](#rs-delete)
		- [复制文件](#rs-copy)
		- [移动文件](#rs-move)
- [错误报告](#error-report)
- [贡献代码](#contribution)
- [许可证](#licenses)

<a id="overview"></a>

## 概述

此 Ruby SDK 适用于 Ruby 1.9.x，2.0.x，2.1.x，jruby，rbx，ree 版本，基于 [七牛云存储官方API](../index.html) 构建。使用此 SDK 构建您的网络应用程序，能让您以非常便捷的方式将数据安全地存放到七牛云存储上。无论您开发的是一个网站，还是基于“云端（服务端程序）－终端（手持设备应用）架构”的服务或应用，借助七牛云存储及其SDK，都能让该应用的终端用户高速上传和下载，同时也让您的服务端更加轻盈。

<a id="extern-links"></a>

### ■ 参考链接

源码地址：[https://github.com/qiniu/ruby-sdk](https://github.com/qiniu/ruby-sdk)  
打包下载：[https://github.com/qiniu/ruby-sdk/archive/master.zip](https://github.com/qiniu/ruby-sdk/archive/master.zip)  
历史版本：[https://github.com/qiniu/ruby-sdk/releases](https://github.com/qiniu/ruby-sdk/releases)  

<a id="status"></a>

### ■ 状态

集成测试：[![Build Status](https://api.travis-ci.org/qiniu/ruby-sdk.png?branch=master)](https://travis-ci.org/qiniu/ruby-sdk)  
Gem发布：[![Gem Version](https://badge.fury.io/rb/qiniu.png)](http://badge.fury.io/rb/qiniu)  
依赖关系：[![Dependency Status](https://gemnasium.com/qiniu/ruby-sdk.png)](https://gemnasium.com/qiniu/ruby-sdk)  
代码评分：[![Code Climate](https://codeclimate.com/github/qiniu/ruby-sdk.png)](https://codeclimate.com/github/qiniu/ruby-sdk)  

<a id="contributors"></a>

### ■ 维护人员

[liangtao@qiniu.com](mailto:liangtao@qiniu?subject=RubySDK使用疑问)（[@无锋之刃](http://weibo.com/bluntblade)）  

---

<a id="prepare"></a>

## 准备开发环境

### ■ 通过 bundle 工具安装

1. 在您 Ruby 应用程序的 `Gemfile` 文件中，添加如下一行代码：  

	```
	gem 'qiniu', '~> 6.1.0'
	```

2. 然后，在应用程序所在的目录下，可以运行 `bundle` 安装依赖包：  

	```
	$ bundle
	```

### ■ 直接安装 Gem 包

```
$ gem install qiniu
```

<a id="appkey"></a>

### ■ ACCESS_KEY 和 SECRET_KEY

在使用SDK 前，您需要拥有一对有效的 AccessKey 和 SecretKey 用来进行签名授权。

可以通过如下步骤获得：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
2. 登录七牛开发者平台，查看 [AccessKey 和 SecretKey](https://portal.qiniu.com/setting/key)

**注意：用户应当妥善保存SECRET_KEY，不能对外泄露（尤其不能放置在客户端中，并分发给最终用户）。一旦发生泄露，请立刻到开发者平台更新。**

---

<a id="sdk-usage"></a>

## 使用SDK

<a id="init"></a>

### ■ 初始化环境

在使用Ruby SDK之前，需要初始化环境，并且设置默认的ACCESS_KEY和SECRET_KEY：

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

Qiniu.establish_connection! :access_key => '<YOUR_APP_ACCESS_KEY>',
                            :secret_key => '<YOUR_APP_SECRET_KEY>'
```

如果您使用的是 [Ruby on Rails](http://rubyonrails.org/) 框架，我们建议您在应用初始化启动的过程中，调用上述方法即可，操作如下：  

1. 首先，在应用初始化脚本加载的目录中新建一个文件：`YOUR_RAILS_APP/config/initializers/qiniu_sdk.rb`  

2. 然后，编辑 `YOUR_RAILS_APP/config/initializers/qiniu_sdk.rb` 文件内容如下：  

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

Qiniu.establish_connection! :access_key => '<YOUR_APP_ACCESS_KEY>',
                            :secret_key => '<YOUR_APP_SECRET_KEY>'
```

这样，您就可以在您的 `RAILS_APP` 中使用七牛云存储 Ruby SDK 提供的其他任意方法了。

<a id="io-put"></a>

### ■ 上传文件

为了尽可能地改善终端用户的上传体验，七牛云存储首创了客户端直传功能。一般云存储的上传流程是：

```
客户端（终端用户） ==上传==> 业务服务器 ==上传==> 云存储服务
```

这样多了一次上传的流程，和本地存储相比，会相对慢一些。为减少上传浆糊，七牛引入“客户端直传”概念，将整个上传过程调整为：  

```
客户端（终端用户） ==上传==> 七牛云存储 ==通知==> 业务服务器
```

客户端（终端用户）直接将文件上传到七牛服务器。这一过程中，七牛会通过DNS智能解析，为客户端选择到传输距离最近的运营商节点，速度会比本地存储快很多。  
文件上传成功以后，七牛服务器通过回调功能，将少量元数据（比如Key、文件元信息或开发者自定义变量）传给业务服务器，再由业务服务器按业务逻辑处理即可。  

<a id="io-put-flow"></a>

### □ 上传流程

在七牛云存储中，整个上传流程大体分为如下几步：  

1. 业务服务器颁发 [uptoken（上传凭证，下同）][uploadTokenHref] 给客户端（终端用户）；  
2. 客户端凭借 uptoken 上传文件到七牛云存储；  
3. 在七牛云存储收存完整数据后，发起一个 HTTP 请求，回调业务服务器预设的通知接收接口；  
4. 业务服务器处理上传通知，保存相关业务信息，并返回一些响应信息给七牛云存储；  
5. 七牛云存储将响应信息（含HTTP响应码）原封不动地转发给客户端（终端用户）。  

请注意“回调业务服务器”这一行为是可选的，执行与否取决于业务服务器使用的[上传策略](../api/reference/security/put-policy.html)。如果未设置回调，七牛云存储会将一些标准的信息（比如文件的 hash）返回给客户端。  

如果上传发生在业务服务器，以上流程可以简化为：  

1. 业务服务器生成 uptoken（不设置回调，自己回调到自己这里没有意义）；  
2. 凭借 uptoken 上传文件到七牛；  
3. 善后工作，比如保存相关的元信息。  

<a id="io-put-policy"></a>

### □ 上传策略

uptoken本质上是用 AccessKey/SecretKey 进行数字签名的**上传策略**，它控制着整个上传流程的行为。让我们快速过一遍都能够决策啥：  

```{ruby}
module Qiniu
  module Auth
    class PutPolicy
      PARAMS = {
        # 字符串类型参数
        :scope                  => "scope"               ,
        :save_key               => "saveKey"             ,
        :end_user               => "endUser"             ,
        :return_url             => "returnUrl"           ,
        :return_body            => "returnBody"          ,
        :callback_url           => "callbackUrl"         ,
        :callback_body          => "callbackBody"        ,
        :persistent_ops         => "persistentOps"       ,
        :persistent_notify_url  => "persistentNotifyUrl" ,

        # 数值类型参数
        :deadline               => "deadline"            ,
        :insert_only            => "insertOnly"          ,
        :fsize_limit            => "fsizeLimit"          ,
        :detect_mime            => "detectMime"          ,
        :mime_limit             => "mimeLimit"
      } # PARAMS
    end # class PutPolicy
  end # module Auth
end # module Qiniu
```

更完整的说明请参考[上传策略](../api/reference/security/put-policy.html)。

<a id="upload-token"></a>

### □ 生成上传凭证

服务端生成 uptoken 的示例代码如下：

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

put_policy = Qiniu::Auth::PutPolicy.new(
    bucket,     # 存储空间
    key,        # 最终资源名，可省略，即缺省为“创建”语义
    expires_in, # 相对有效期，可省略，缺省为3600秒后 uptoken 过期
    deadline    # 绝对有效期，可省略，指明 uptoken 过期期限（绝对值），通常用于调试
)

uptoken = Qiniu::Auth.generate_uptoken(put_policy)
```

<a id="upload-do"></a>

### □ 上传文件

上传文件到七牛（通常是客户端完成，但也可以发生在服务端）：

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法
# 已生成一个有效的put_policy，参考前文

code, result, response_headers = Qiniu::Upload.upload_with_put_policy(
    put_policy,     # 上传策略
    local_file,     # 本地文件名
    key,            # 最终资源名，可省略，缺省为上传策略 scope 字段中指定的Key值
    x_var           # 用户自定义变量，可省略，需要指定为一个 Hash 对象
)
```

<a id="io-get"></a>

### ■ 下载文件

<a id="io-get-public"></a>

### □ 下载公有文件

每个 bucket 都会绑定一个或多个域名（domain）。如果这个 bucket 是公开的，那么该 bucket 中的任意资源都可以通过对应的公开下载 url 访问到：

```
http://<domain>/<key>
```

假设某个 bucket 既绑定了七牛的二级域名，如 hello.qiniudn.com，也绑定了自定义域名（需要备案），如 hello.com。那么该 bucket 中 key 为 a/b/c.htm 的资源可以通过`http://hello.qiniudn.com/a/b/c.htm`或`http://hello.com/a/b/c.htm`进行访问。

**注意： key必须采用utf8编码，如使用非utf8编码访问七牛云存储将反馈错误**

<a id="io-get-private"></a>

### □ 下载私有文件

如果某个 bucket 是私有的，那么这个 bucket 中的所有文件只能通过一个的临时有效的下载 url 访问：

```
http://<domain>/<key>?e=<deadline>&token=<dntoken>
```

其中 dntoken 是由业务服务器签发的一个[临时下载授权凭证][downloadTokenHref]，deadline 是 dntoken 的有效期。dntoken不需要单独生成，SDK 提供了生成完整下载 url 的方法（包含了 dntoken），示例代码如下：

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

primitive_url = 'http://hello.qiniudn.com/a/b/c.htm'
download_url = Qiniu::Auth.authorize_download_url(primitive_url)
```

生成下载 url 后，业务服务器将其下发给客户端。客户端收到下载 url 后，直接用任意 HTTP 客户端即可下载该资源（与下载公有资源无异）。  
唯一需要注意的是，在下载 url 已失效却还没有完成下载时，需要重新向业务服务器申请授权。

无论公有资源还是私有资源，下载过程中客户端并不需要七牛 SDK 参与其中。

<a id="resumable-io-get"></a>

### □ 断点续下载

无论是公有资源还是私有资源，获得的下载 url 支持标准的 HTTP 断点续传协议。考虑到多数语言都有相应的断点续下载支持的成熟方法，七牛 Ruby-SDK 并不提供断点续下载相关代码。

<a id="rs"></a>

### ■ 资源操作

资源操作包括对存储在七牛云存储上的文件进行查看、复制、移动和删除处理，并且允许批量地执行文件管理操作，方便用户使用。

<a id="rs-stat"></a>

### □ 获取文件信息

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

code, result, response_headers = Qiniu::Storage.stat(
    bucket,     # 存储空间
    key         # 资源名
)
```

<a id="rs-delete"></a>

### □ 删除文件

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

code, result, response_headers = Qiniu::Storage.delete(
    bucket,     # 存储空间
    key         # 资源名
)
```

<a id="rs-copy"></a>

### □ 复制文件

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

code, result, response_headers = Qiniu::Storage.copy(
    src_bucket,     # 源存储空间
    src_key,        # 源资源名
    dst_bucket,     # 目标存储空间
    dst_key         # 目标资源名
)
```

<a id="rs-move"></a>

### □ 移动文件

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用Qiniu#establish_connection!方法

code, result, response_headers = Qiniu::Storage.move(
    src_bucket,     # 源存储空间
    src_key,        # 源资源名
    dst_bucket,     # 目标存储空间
    dst_key         # 目标资源名
)
```

---

<a id="error-report"></a>

## 错误报告

如果遇到错误，请将各个方法返回的code、result、response_headers以如下方法格式化输出，并将输出结果[通过邮件发送](mailto:support@qiniu.com?subject=RubySDK错误)给我们。

```{ruby}
#!/usr/bin/env ruby

require 'qiniu'

# 已在某处调用某个SDK方法

puts code.inspect
puts result.inspect
puts response_headers.inspect
```

<a id="contribution"></a>

## 贡献代码

1. Fork；
2. 创建您的特性分支 (git checkout -b my-new-feature)；
3. 提交您的改动 (git commit -am 'Added some feature')；
4. 将您的修改记录提交到远程 git 仓库 (git push origin my-new-feature)；
5. 然后到 github 网站的该 git 远程仓库的 my-new-feature 分支下发起 Pull Request。

<a id="license"></a>

## 许可证

Copyright (c) 2014 qiniu.com

基于 MIT 协议发布:

* [www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)

[uploadTokenHref]:    ../api/reference/security/upload-token.html    "上传凭证"
[downloadTokenHref]:  ../api/reference/security/download-token.html  "下载凭证"
[magicVariablesHref]: ../api/overview/up/response/vars.html#magicvar "魔法变量"
[xVariablesHref]:     ../api/overview/up/response/vars.html#xvar     "自定义变量"
