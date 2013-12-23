---
layout: docs
title: qrsync 命令行同步工具
---


- [简介](#overview)
- [下载](#download)
- [用法](#usage)


<a id="overview"></a>
## 简介

qrsync 是一个根据七牛云存储API实现的简易命令行辅助上传同步工具，支持断点续上传，增量同步，它可将用户本地的某目录的文件同步到七牛云存储中，同步或上传几百GB甚至上TB的文件毫无鸭梨。

**注意：被同步的文件名和路径必须是utf8编码，非utf8的文件名和路径将会同步失败**

<a id="download"></a>
## 下载

qrsync 命令行辅助同步工具下载地址：

- Mac OS: <http://devtools.qiniudn.com/qiniu-devtools-darwin_amd64-current.zip>
- Linux 64bits: <http://devtools.qiniudn.com/qiniu-devtools-linux_amd64-current.zip>
- Linux 32bits: <http://devtools.qiniudn.com/qiniu-devtools-linux_386-current.zip>
- Windows 32bits: <http://devtools.qiniudn.com/qiniu-devtools-windows_386-current.zip>
- Windows 64bits: <http://devtools.qiniudn.com/qiniu-devtools-windows_amd64-current.zip>

<a id="usage"></a>
## 用法

先建立一个配置文件，比如叫 conf.json，内容大体如下：

    {
        "access_key": "Please apply your access key here",
        "secret_key": "Dont send your secret key to anyone",
        "bucket": "Bucket name on qiniu resource storage",
        "sync_dir": "Local directory to upload",
        "async_ops": "fop1;fop2;fopN",
        "debug_level": 1
    }

配置文件语法可以参考 [JSON](http://json.org/json-zh.html) 。

其中，`access_key` 和 `secret_key` 在七牛云存储平台上申请。步骤如下：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
2. [登录七牛开发者自助平台，查看 Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

`bucket` 是你在七牛云存储上希望保存数据的 Bucket 名（类似于数据库的表），这个自己选择一个合适的就可以，要求是只能由字母、数字、下划线等组成。

`sync_dir` 是本地需要上传的目录，绝对路径完整表示。这个目录中的所有内容会被同步到指定的 `bucket` 上。注意：Windows 平台上路径的表示格式为：`盘符:/目录`，比如 E 盘下的目录 data 表示为：`e:/data` 。

`async_ops` 是设置上传预转参数，一般上传的音视频如果需要转码，可以使用该参数。详情参考：[音视频上传预转 - asyncOps](/api/put.html#uploadToken-asyncOps)

`ignore_patterns` 参数是一个关于忽略文件或目录的匹配字符串数组，匹配规则类似`.gitignore`,参考[具体规则](http://kb.qiniu.com/53bld49u)

可以在 [七牛云存储开发者网站后台](https://portal.qiniu.com/) 进行相应的域名绑定操作，域名绑定成功后，若您将 bucket 设为公用（public）属性，则可以用如下方式对上传的文件进行访问：

    http://<绑定域名>/<key>

`key` 即是 `sync_dir` 里边文件名或文件的相对路径，`key` 可以包含斜杠但不能以斜杠开头。比如 `sync_dir` 存在文件 `a.txt` 和 `a/b/c.txt`，且绑定的域名为 `foo.qiniudn.com`，那么即可用如下路径访问：

    http://foo.qiniudn.com/a.txt
    http://foo.qiniudn.com/a/b/c.txt

在建立完 conf.json 配置文件后，就可以运行 qrsync 程序进行同步。

Unix/Linux/MacOS 系统可以用如下命令行：

    $ qrsync /path/to/your-conf.json


以上命令会将 `sync_dir` 目录中所有的文件包括软链接全部同步到 conf.json 配置文件指定的 `bucket` 中。也可以通过加上 `-skipsym` 选项来忽略软链接。

    $ qrsync -skipsym /path/to/your-conf.json

Windows 系统用户在 [开始] 菜单栏选择 [运行] 输入 `cmd` 回车即可打开 DOS 命令行窗口，然后切换到 qrsync.exe 的所在磁盘路径。假设你的 qrsync.exe 存放在 `d:/tools/qrsync.exe`，那么如下几行命令可以切换到 qrsync.exe 存放的目录：

    > d:
    > cd tools

进入到 qrsync.exe 所在目录后运行如下命令即可：

    > qrsync.exe /path/to/your-conf.json

需要注意的是，qrsync 是增量同步的，如果你上一次同步成功后修改了部分文件，那么再次运行 qrsync 时只同步新增的和被修改的文件。当然，如果上一次同步过程出错了，也可以重新运行 qrsync 程序继续同步。

