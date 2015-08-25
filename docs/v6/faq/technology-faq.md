---
layout: docs
title: 技术问题
order: 30
---



### 1. 七牛云存储支持目录或文件夹概念么？

```
七牛云存储的服务端是一个 key-value 系统，而非树形结构，因此也没有“目录”或者“文件夹”的概念。

其中，value 是用户上传到七牛云存储的文件，key 是一个用户自定义的字符串，用于在服务端标识这个 value 这个文件。一个 key 对应一个 value，因此，在每个空间（Bucket）中，key 必须是唯一的。

key 中可以包含斜杠“/”，让你感觉起来像目录结构，比如 “a/b/c/d.txt” 这个 key，在服务端只对应一个文件，但它看起来像 a 目录下的 b 目录下的 c 目录下的文件 d.txt。实际上，服务端是不存在 a、b、c 三个目录的，也没法创建目录。
```

### 2. 七牛回调（callback）在本地如何调试？

  [本地调试问题](http://developer.qiniu.com/docs/v6/api/overview/up/upload-models/response-types.html#FAQ)
