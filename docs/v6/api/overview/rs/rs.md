---
layout: docs
title: 管理操作
order: 340
---

<a id="rs-manage"></a>
# 管理操作

用户可以对存储在七牛云存储的资源进行管理和操作。与文件管理类似，七牛云存储资源管理的主要操作有：查看、移动、复制、删除及其对应的批量操作。

<a id="stat"></a>
## 查看 (stat)

查看操作用于查看资源的基本信息，包含：文件哈希值、文件大小、媒体类型及上传时间。具体参考[获取资源信息（stat）](/docs/v6/api/reference/rs/stat.html)。

<a id="move"></a>
## 移动 (move)

移动操作允许将一个资源在同一个Bucket或者不同的Bucket之间移动。例如，在bucket1下面有一个名为key1的资源，可以将这个资源key1移动到bucket1下面的key2，也可以将其移动到bucket2下的key2。通过移动操作可以实现文件重命名。具体参考[移动资源（move）](/docs/v6/api/reference/rs/move.html)。

<a id="copy"></a>
## 复制 (copy)

复制操作允许在同一个bucket进行，也可以在两个不同的bucket之间进行。与资源的移动操作相比，复制操作保留原文件，因此会增加用户的存储空间。具体参考[复制资源（copy）](/docs/v6/api/reference/rs/copy.html)。

<a id="delete"></a>
## 删除 (delete)

删除资源与删除文件类似，但是七牛云存储不提供回收站的功能，因此在删除前请确认待删除的资源确实不再需要。具体参考[删除资源（delete）](/docs/v6/api/reference/rs/delete.html)。

<a id="batch"></a>
## 批量操作 (batch)

除了对单一资源进行操作，还可以在一次请求中对多个资源进行批量的查看、移动、复制及删除操作。具体参考[批量操作（batch）](/docs/v6/api/reference/rs/batch.html)。
