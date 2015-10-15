---
layout: docs
title: 管理操作
order: 298
---

<a id="rs-manage"></a>
# 管理操作

用户可以对存储在七牛云存储的资源进行管理和操作。与文件管理类似，七牛云存储资源管理的主要操作有：查看、移动、复制、删除、抓取、列举及其对应的批量操作，另外还有修改元信息和更新镜像资源操作。

- [查看资源信息 (stat)](#stat)
- [移动资源 (move)](#move)
- [复制资源 (copy)](#copy)
- [删除资源 (delete)](#delete)
- [抓取资源 (fetch)](#fetch)
- [列举资源 (list)](#list)
- [批量操作 (batch)](#batch)
- [修改元信息 (chgm)](#chgm)
- [更新镜像资源（prefetch）](#prefetch)


<a id="stat"></a>
## 查看资源信息 (stat)

查看资源信息操作查看的基本信息，包含：文件哈希值、文件大小、媒体类型及上传时间。具体参考[查看资源信息（stat）](/docs/v6/api/reference/rs/stat.html)。


<a id="move"></a>
## 移动资源 (move)

移动资源操作允许将一个资源在同一个Bucket或者不同的Bucket之间移动。例如，在bucket1下面有一个名为key1的资源，可以将这个资源key1移动到bucket1下面的key2，也可以将其移动到bucket2下的key2。通过移动操作可以实现文件重命名。具体参考[移动资源（move）](/docs/v6/api/reference/rs/move.html)。

<a id="copy"></a>
## 复制资源 (copy)

复制资源操作操作允许在同一个bucket进行，也可以在两个不同的bucket之间进行。与资源的移动操作相比，复制资源操作保留原文件，因此会增加用户的存储空间。具体参考[复制资源（copy）](/docs/v6/api/reference/rs/copy.html)。

<a id="delete"></a>
## 删除资源 (delete)

删除资源与删除文件类似，但是七牛云存储不提供回收站的功能，因此在删除前请确认待删除的资源确实不再需要。具体参考[删除资源（delete）](/docs/v6/api/reference/rs/delete.html)。

<a id="fetch"></a>
## 抓取资源 (fetch)

抓取资源操作用于从指定的URL抓取资源，并将该资源存储到指定空间中。具体参考[抓取资源（fetch）](/docs/v6/api/reference/rs/fetch.html)。

<a id="list"></a>
## 列举资源 (list)
列举资源操作用于将指定空间内的资源分批列出。具体参考[列举资源（list）](/docs/v6/api/reference/rs/list.html)。

<a id="batch"></a>
## 批量操作 (batch)

除了对单一资源进行操作，还可以在一次请求中对多个资源进行批量的查看、移动、复制及删除操作。具体参考[批量操作（batch）](/docs/v6/api/reference/rs/batch.html)。

<a id="chgm"></a>
## 修改元信息 (chgm)

修改元信息操作用于修改资源的mimeType，可以在七牛服务器自动识别文件类型错误或者是类型描述不够详细的情况下，自定义的对空间已有资源的类型进行修改。具体参考[修改元信息 (chgm) ](/docs/v6/api/reference/rs/chgm.html)。


<a id="prefetch"></a>
## 更新镜像资源（prefetch）

对于设置了镜像存储的空间，从镜像源站抓取指定名称的资源并存储到该空间中。如果该空间中已存在该名称的资源，则将镜像源站的资源覆盖空间的资源。具体参考[更新镜像资源（prefetch）](/docs/v6/api/reference/rs/prefetch.html)。

