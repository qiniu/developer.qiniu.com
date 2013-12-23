---
layout: docs
title: qiniu-autosync 自动同步工具
---

## 简介

qiniu-autosync 是一段 bash shell script，可用于监控 Linux/Unix 上指定的文件夹，并将此文件夹内的新增或改动文件自动同步到七牛云存储，可设定同步删除。

**注意：被同步的文件名和路径必须是utf8编码，非utf8的文件名和路径将会同步失败**

## 安装

1. 需先安装 inotify-tools - <https://github.com/rvoicilas/inotify-tools/wiki>
2. 然后下载 [qboxrsctl](qboxrsctl.html)
3. 下载脚本 qiniu-autosync.sh

Linux 下可以使用如下命令:

    $ curl -fsSkL https://raw.github.com/why404/qiniu-autosync/master/qiniu-autosync.sh -o qiniu-autosync.sh

    $ chmod +x ./qiniu-autosync.sh

## 使用

获取七牛云存储 ACCESS_KEY 和 SECRET_KEY 以及 BUCKET_NAME (空间名称) 请登录：<https://portal.qiniu.com/>

用法（反斜杠用于排版换行需要，实际情况下可忽略）:

    ./qiniu-autosync.sh -a /PATH/TO/appkey.json \
                        -b BUCKET_NAME \
                        -c /PATH/TO/qboxrsctl \
                        -d /PATH/TO/WATCH_DIR \
                        -e ALLOW_DELETE_TrueOrFalse \
                        -f FILE_BLOCK_SIZE \
                        -g INOTIFY_IGNORE_PATTERN

选项 | 必须 | 说明
-----|------|-------------------------------------------------------------------------
a    | 是   | 指定 `/PATH/to/appkey.json` (密钥文件存放路径)
b    | 是   | 用于存储文件的七牛空间名称
c    | 是   | qboxrsctl 可执行命令所在路径
d    | 是   | 要监控的目录，绝对路径
e    | 否   | 是否允许自动删除，缺省为 `false`
f    | 否   | 文件切片分块大小，超过这个大小启用并行断点续上传，缺省为 `4194304` (4MB)
g    | 否   | 忽略列表(正则)

appkey.json 内如如下：

    {
        "access_key": "YOUR_ACCESS_KEY",
        "secret_key": "YOUR_SECRET_KEY"
    }

