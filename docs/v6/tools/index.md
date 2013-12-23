---
layout: default
title: 七牛云存储工具使用指南
---

七牛云存储为用户提供了一套命令行工具，可以用来上传数据、同步文件，以及管理帐号和空间（Bucket）。这些工具包括：

1. [qrsync](http://docs.qiniu.com/tools/qrsync.html)

    同步工具。用于文件上传，支持断点续上传、增量同步，支持超过几百GB的大文件上传，亦可同步整个目录内的文件。

1. [qboxrsctl](http://docs.qiniu.com/tools/qboxrsctl.html)

    管理工具。可以管理用户帐号、空间，进行文件操作和云处理。

1. [qiniu-autosync](http://docs.qiniu.com/tools/qiniu-autosync.html)

    同步工具。用于监控文件夹的变化，自动将数据同步至七牛云存储。该工具目前只支持Linux。

这些工具帮助用户方便地进行数据上传、存档、备份，并且提供更完整强大的帐号、空间管理功能。新用户可以用这些工具快速体验和测试七牛云存储的服务，老用户则可以将这些工具用于自己的产品或系统，简单可靠地实现自己的需求。