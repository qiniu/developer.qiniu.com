---
layout: docs
title: MD转HTML
order: 109
---

<a id="md2html"></a>
# MD转HTML（md2html）

<a id="description"></a>
## 描述

七牛云存储支持直接将Markdown类型的资源转为HTML文件并返回。  

<a id="specification"></a>
## 接口规格

```
md2html/<Mode>/css/<EncodedCSSURL>
```

参数名称          | 类型   | 说明                                                                          | 必填 
:---------------- | :----- | :---------------------------------------------------------------------------- | :---
`<Mode>`          | int    | `0`表示转为完整的 HTML(Head+Body) 输出<p>`1`表示只转为HTML Body<p>默认值为`0` |
`<EncodedCSSURL>` | string | CSS 样式的URL，`EncodedCSSURL` = urlsafe_base64_encode(`CSSURL`)                |
