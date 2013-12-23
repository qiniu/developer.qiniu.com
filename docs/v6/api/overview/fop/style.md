---
layout: docs
title: 样式
order: 255
---
<a id="style"></a>
# 样式

如果觉得 `url?<fop1>|<fop2>|<fop3>|<fopN>` 这样的形式够冗长，还可以为这些串行的 `<fop>` 集合定义一个友好别名。如此一来，就可以用友好URL风格进行访问。

我们先来熟悉 [qboxrsctl](../../../tools/qboxrsctl.html) 的两个命令行，

    // 定义 url 和 fop 之间的分隔符为 separator 
    qboxrsctl separator <bucket> <separator>

    // 定义 fop 的别名为 aliasName
    qboxrsctl style <bucket> <aliasName> <fop>

例如:

    qboxrsctl separator <bucket> "."
    qboxrsctl style <bucket> "jpg" "vframe/jpg/offset/7/w/480/h/360|watermark/1/image/aHR0cDovL3d3dy5iMS5xaW5pdWRuLmNvbS9pbWFnZXMvbG9nby0yLnBuZw=="

那么，以下两个 URL 则等价:

原始URL:

- <http://open.qiniudn.com/thinking-in-go.mp4?vframe/jpg/offset/7/w/480/h/360|watermark/1/image/aHR0cDovL3d3dy5iMS5xaW5pdWRuLmNvbS9pbWFnZXMvbG9nby0yLnBuZw==>

友好风格URL:

- <http://open.qiniudn.com/thinking-in-go.mp4.jpg>

