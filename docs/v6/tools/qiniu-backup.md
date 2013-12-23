---
layout: docs
title: 备份工具
---


## 用法

只需一行命令即可：

    ./qrsb <dir>

参数 `<dir>` 是用于存放备份文件的本地目录，必须是一个有效的路径；可以是相对路径，但推荐用绝对路径。

**注意：被同步的文件名和路径必须是utf8编码，非utf8的文件名和路径将会同步失败**

除指定的 `<dir>` 之外，还必须在该 `<dir>` 目录下存放一个名为 `qrsb.conf` 格式为 [JSON](http://json.org/) 的配置文件。

    {
        "access_key": "YOUR_APP_ACCESS_KEY",
        "secret_key": "YOUR_APP_SECRET_KEY",
        "bucket": "YOUR_APP_BUCKET_NAME",
        "start_time": 0,
        "max_size": 0,
        "encode_fname": 0,
        "rs_host": "http://rs.qbox.me",
        "rsf_host": "http://rsf.qbox.me",
        "prefix": "YOUR_DIR_PREFIX"
    }

其中，`access_key` 和 `secret_key` 在七牛云存储平台上申请。步骤如下：

1. [开通七牛开发者帐号](https://portal.qiniu.com/)
2. [登录七牛开发者自助平台，查看 Access Key 和 Secret Key](https://portal.qiniu.com/setting/key)

参数详解如下

名称         | 必须     | 缺省值             | 说明
-------------|----------|--------------------|---------------------------------------------------------------------------------------------------------
bucket       | YES      |                    | 空间名称
start_time   | NO       | 0                  | 启始时间, 单位: 百纳秒, 即当前UNIX时间戳的秒数乘以10的7次方。缺省值为0表示不限定起始时间。
max_size     | NO       | 0                  | 限定文件大小, 只有低于该指定大小的文件才会被导出; 单位是字节（Byte）。缺省值为0表示不限定导出的文件大小。
encode_fname | YES      | 0                  | 缺省值为0表示导出还原成静态目录结构，否则按密文方式导出。
rs_host      | YES      | http://rs.qbox.me  | API 入口地址, 不用改
rsf_host     | YES      | http://rsf.qbox.me | 备份服务器地址, 不用改
prefix       | NO       |                    | 指定文件前缀, 如`"prefix": "a/b/c"`, 将只备份以"a/b/c"开头的文件。缺省为备份根目录下的所有文件。

`encode_fname` 值为 0 表示导出还原成静态目录结构，否则按密文方式导出。注意：当一个`key`含有当前文件系统不支持的特殊字符时，该文件将按照原有的密文方式导出。

`rs_host` 和 `rsf_host` 字段是备份服务相关的主机地址，基本不用修改。

通常，只需设定该 `qrsb.conf` 配置文件中的前三项即可。


在指定 `<dir>` 建立完 `qrsb.conf` 文件后，就可以运行 qrsb 工具进行导出备份：

    ./qrsb <dir>

初次运行，会进行初始化相关的操作，比如先同步所有文件的key，然后第二次运行才开始导出备份文件的数据本身。所以，刚开始您需要运行两次，之后运行一次即可。
