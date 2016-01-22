---
layout: docs
title: qrsync 命令行同步工具
---


- [简介](#overview)
- [下载](#download)
- [使用方法](#usage)
- [常见故障排查](#faq)


<a id="overview"></a>
## 简介

qrsync 是一个根据七牛云存储API实现的简易命令行辅助上传同步工具，支持断点续上传，增量同步，它可将用户本地的某目录的文件同步到七牛云存储中，同步或上传几百GB甚至上TB的文件毫无鸭梨。<br>
<span style="color: red;">**注意：**</span>被同步的文件名和路径必须是utf8编码，非utf8的文件名和路径将会同步失败。

<a id="download"></a>
## 下载

qrsync 命令行辅助同步工具下载地址：

- Mac OS: <http://devtools.qiniu.com/qiniu-devtools-darwin_amd64-current.tar.gz>
- Linux 64bits: <http://devtools.qiniu.com/qiniu-devtools-linux_amd64-current.tar.gz>
- Linux 32bits: <http://devtools.qiniu.com/qiniu-devtools-linux_386-current.tar.gz>
- Linux ARMv6: <http://devtools.qiniu.com/qiniu-devtools-linux_arm-current.tar.gz>
- Windows 32bits: <http://devtools.qiniu.com/qiniu-devtools-windows_386-current.zip>
- Windows 64bits: <http://devtools.qiniu.com/qiniu-devtools-windows_amd64-current.zip>

<a id="usage"></a>
## 使用方法
<span style="color: red;">**注意：**</span>Windows 系统用户在 [开始] 菜单栏选择 [运行] 输入 `cmd` 回车即可打开 DOS 命令行窗口，然后切换到 qrsync.exe 的所在磁盘路径。假设你的 qrsync.exe 存放在 `F:\tools\qrsync.exe`，那么如下几行命令可以切换到 qrsync.exe 存放的目录：

    > F:
    > cd tools
如图：

![image](http://78re52.com1.z0.glb.clouddn.com/qrsync.jpg)

**先建立一个配置文件（[JSON格式](http://json.org/json-zh.html)），比如叫`conf.json`，内容如下：**

```
{
    "src": "/home/your/sync_dir",
    "dest": "qiniu:access_key=<AccessKey>
                    &secret_key=<SecretKey>
                    &bucket=<Bucket>
                    &key_prefix=<KeyPrefix>
                    &persistent_ops=<PersistentOps>
                    &persistent_pipeline=<PersistentPipeline>
                    &persistent_notify_url=<PersistentNotifyUrl>
                    &...
                ",
    "debug_level": 1
}
```

其中，`AccessKey` 和 `SecretKey` 需要在七牛开发者平台上申请。步骤如下：

1. 开通[七牛开发者帐号](https://portal.qiniu.com/signup)。
2. 登录七牛管理控制台，查看[ Access Key ](https://portal.qiniu.com/setting/key)和 [Secret Key](https://portal.qiniu.com/setting/key)。

参数名称   | 必填 | 说明
:--------- | :--- | :------
`src` | 是   | ● 本地源目录路径<br>是本地需要同步上传目录的完整的绝对路径。这个目录中的所有内容会被同步到指定的 `bucket` 中。<br>注意：Windows 平台上路径的表示格式为：`盘符:/目录`，比如 E 盘下的目录 data 表示为：`e:/data` 。
`Bucket`   | 是   | ● 目标空间<br>是你在七牛云存储上希望保存数据的Bucket名称，选择一个合适的名字即可，要求是只能由字母、数字、下划线等组成。<br>可以先在[七牛管理控制台](https://portal.qiniu.com/)上创建。
`KeyPrefix` |  否    | ● 文件上传到七牛云存储后给key添加的前缀。<br>例如，如果将 `key_prefix` 设为 `abc/`，在 `src` 中存在一个文件 `a.txt`， 则上传到七牛云存储后，此资源的key为 `abc/a.txt` 。
<a id="put-policy-persistent-ops"></a>`PersistentOps`       |  否    | 资源成功上传后执行的持久化指令列表,每个指令是一个API规格字符串，多个指令用“;”分隔。<br>同时添加`PersistentPipeline`字段，使用专用队列处理,请参考[PersistentPipeline](#put-policy-persistentPipeline)字段说明。
<a id="put-policy-persistentPipeline">`PersistentPipeline`|   否  |  转码队列名,资源上传成功后，触发转码时指定独立的队列进行转码。建议使用[专用队列][mpsHref]。
<a id="put-policy-persisten-notify-url"></a>`PersistentNotifyUrl` |   否  | 接收预转持久化结果通知的URL。<br>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL。<br> 该URL获取的内容和[持久化处理状态查询](http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/prefop.html)的处理结果一致。<br> 发送body格式为`Content-Type`为`"application/json"`的POST请求，需要按照读取流的形式读取请求的body才能获取。
`debug_level`           | 是   | ● 日志输出等级，取值`0`和`1`。<br>通常设置1，只输出必要的日志。<br>当上传过程发生问题时，设置0可以得到详细日志。

<span style="color: red;">**注意：**</span>切勿将配置文件保存在被同步的目录中，否则会带来泄露`SecretKey`的风险。

可以在 [七牛开发者平台](https://portal.qiniu.com/) 进行相应的域名绑定操作，域名绑定成功后，若您将 bucket 设为公用（public）属性，则可以用如下方式对上传的文件进行访问：

    http://<绑定域名>/<key>

`key` 即是 `src` 里边文件名或文件的相对路径，`key` 可以包含斜杠但不能以斜杠开头。比如 `src` 存在文件 `a.txt` 和 `a/b/c.txt`，且绑定的域名为 `foo.qiniudn.com`，那么即可用如下路径访问：

    http://foo.qiniudn.com/a.txt
    http://foo.qiniudn.com/a/b/c.txt

**在建立完 conf.json 配置文件后，就可以运行 qrsync 程序进行同步。**

Unix/Linux/MacOS 系统可以用如下命令行：

    $ qrsync /path/to/your-conf.json

Windows用户进入到 qrsync.exe 所在目录后运行如下命令即可：

    > qrsync.exe /path/to/your-conf.json

需要注意的是，qrsync 是增量同步的，如果你上一次同步成功后修改了部分文件，那么再次运行 qrsync 时只同步新增的和被修改的文件。当然，如果上一次同步过程出错了，也可以重新运行 qrsync 程序继续同步。

<a id="faq"></a>
## 常见故障排查

**配置文件`<src>`设置错误：**

错误信息

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

主要需要关注目录分隔符为`/`，另外文件夹路径如果包含中文需要为UTF-8编码。

- Linux或者Mac下配置如下：

```
{
    "src": "/Users/Username/Documents/Test_Directory",
    ...
}
```

建议路径设置为待同步目录的绝对路径。

[mpsHref]:                 https://portal.qiniu.com/mps/pipeline  "专用队列"
