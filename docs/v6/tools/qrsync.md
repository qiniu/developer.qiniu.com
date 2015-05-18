---
layout: docs
title: qrsync 命令行同步工具
---


- [简介](#overview)
- [下载](#download)
- [用法](#usage)
- [常见故障排查][#faq]


<a id="overview"></a>
## 简介

qrsync 是一个根据七牛云存储API实现的简易命令行辅助上传同步工具，支持断点续上传，增量同步，它可将用户本地的某目录的文件同步到七牛云存储中，同步或上传几百GB甚至上TB的文件毫无鸭梨。

**注意：被同步的文件名和路径必须是utf8编码，非utf8的文件名和路径将会同步失败**

<a id="download"></a>
## 下载

qrsync 命令行辅助同步工具下载地址：

- Mac OS: <http://devtools.qiniu.io/qiniu-devtools-darwin_amd64-current.tar.gz>
- Linux 64bits: <http://devtools.qiniu.io/qiniu-devtools-linux_amd64-current.tar.gz>
- Linux 32bits: <http://devtools.qiniu.io/qiniu-devtools-linux_386-current.tar.gz>
- Linux ARMv6: <http://devtools.qiniu.io/qiniu-devtools-linux_arm-current.tar.gz>
- Windows 32bits: <http://devtools.qiniu.io/qiniu-devtools-windows_386-current.zip>
- Windows 64bits: <http://devtools.qiniu.io/qiniu-devtools-windows_amd64-current.zip>

<a id="usage"></a>
## 用法

先建立一个配置文件（[JSON格式](http://json.org/json-zh.html)），比如叫`conf.json`，内容如下：

```
{
    "src":          "/home/your/sync_dir",
    "dest":         "qiniu:access_key=<AccessKey>&secret_key=<SecretKey>&bucket=<Bucket>&key_prefix=<KeyPrefix>&threshold=<Threshold>",
    "deletable":    0,
    "debug_level":  1
}

```

其中，`AccessKey` 和 `SecretKey` 需要在七牛云存储平台上申请。步骤如下：

1. [开通七牛开发者帐号](https://portal.qiniu.com/signup)
2. [登录七牛管理控制台，查看 Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

参数名称   | 必填 | 说明
:--------- | :--- | :------
`src` | 是   | ● 本地源目录路径<br>是本地需要同步上传目录的完整的绝对路径。这个目录中的所有内容会被同步到指定的 `bucket` 中。<br>注意：Windows 平台上路径的表示格式为：`盘符:/目录`，比如 E 盘下的目录 data 表示为：`e:/data` 。
`bucket`   | 是   | ● 目标空间<br>是你在七牛云存储上希望保存数据的Bucket名称，选择一个合适的名字即可，要求是只能由字母、数字、下划线等组成。<br>可以先在[七牛管理控制台](https://portal.qiniu.com/)上创建。
`key_prefix` |  否    | ● 文件上传到七牛云存储后的给key添加的前缀。<br>例如，如果将 `key_prefix` 设为 `abc/`，在 `src` 中存在一个文件 `a.txt`， 则上传到七牛云存储后，此资源的key为 `abc/a.txt` 。
`threshold` | 否 | ● 进行分片上传的阈值。 <br> 单位为Byte, 默认值为1MB，当文件大小小于1MB时直传整个文件，当文件大于1MB时进行分片上传该文件。 你可以根据你的网络状况来决定该值的大小。
`deletable`           | 否   | ● 是否同步删除七牛云上的文件<br> 通常设置0，当本地文件删除时并不删除存储在七牛的对应文件。<br>如果你想删除本地文件的同时也删除存储在存储在七牛的文件,则设置为1。
`debug_level`           | 是   | ● 日志输出等级<br>通常设置1，只输出必要的日志。<br>当上传过程发生问题时，设置为0可以得到详细日志。

注意：切勿将配置文件保存在被同步的目录中，否则会带来泄露SecretKey的风险。

可以在 [七牛云存储开发者网站后台](https://portal.qiniu.com/) 进行相应的域名绑定操作，域名绑定成功后，若您将 bucket 设为公用（public）属性，则可以用如下方式对上传的文件进行访问：

    http://<绑定域名>/<key>

`key` 即是 `src` 里边文件名或文件的相对路径，`key` 可以包含斜杠但不能以斜杠开头。比如 `src` 存在文件 `a.txt` 和 `a/b/c.txt`，且绑定的域名为 `foo.qiniudn.com`，那么即可用如下路径访问：

    http://foo.qiniudn.com/a.txt
    http://foo.qiniudn.com/a/b/c.txt

在建立完 conf.json 配置文件后，就可以运行 qrsync 程序进行同步。

Unix/Linux/MacOS 系统可以用如下命令行：

    $ qrsync /path/to/your-conf.json

Windows 系统用户在 [开始] 菜单栏选择 [运行] 输入 `cmd` 回车即可打开 DOS 命令行窗口，然后切换到 qrsync.exe 的所在磁盘路径。假设你的 qrsync.exe 存放在 `d:/tools/qrsync.exe`，那么如下几行命令可以切换到 qrsync.exe 存放的目录：

    > d:
    > cd tools

进入到 qrsync.exe 所在目录后运行如下命令即可：

    > qrsync.exe /path/to/your-conf.json

需要注意的是，qrsync 是增量同步的，如果你上一次同步成功后修改了部分文件，那么再次运行 qrsync 时只同步新增的和被修改的文件。当然，如果上一次同步过程出错了，也可以重新运行 qrsync 程序继续同步。

<a id="faq"></a>
## 常见故障排查

1. 配置文件`<src>`设置错误：

**错误信息**

```
# Windows下
[WARN][qbox.us/shell/qrsync] qrsync.go:70: qrsync.Run failed failed:
 ==> FindNextFile <src>: The system cannot find the file specified. ~ qrsync.Run failed
```

或

```
# Linux或者Mac下
[WARN] qbox.us/shell/qrsync-v2/qrsync.go:70: qrsync.Run failed failed:
 ==> stat <src>: no such file or directory ~ qrsync.Run failed
 ==> qbox.us/qrsync/v2/sync/sync.go:36: stat <src>: no such file or directory ~ sync.Run: src.ListAll failed
```

**解决方案**

- Windows下配置如下：

```
{
    "src": "C:/Users/Username/Desktop/Test_Directory",
    ...
}
```

主要需要关注目录分隔符为`/`，另外文件夹路径如果包含中文需要为UTF-8编码;

- Linux或者Mac下

```
{
    "src": "/Users/Username/Documents/Test_Directory",
    ...
}
```

建议路径设置为待同步目录的绝对路径。
