---
layout: docs
title: 错误格式
order: 100
---

<a id="err-format"></a>
# 错误格式

七牛云存储的各个接口在遇到执行错误时，将返回一个JSON格式组织的信息对象，描述出错原因。
具体格式如下：

```
{
	"code":     <HttpCode  int>, 
    "error":   "<ErrMsg    string>",
}
```

字段名称     | 必填 | 说明                              
:----------- | :--- | :--------------------------------------------------------------------
`code`       | 是   | HTTP状态码，请参考[响应状态码][codesHref]
`error`      | 是   | 与HTTP状态码对应的消息文本

[codesHref]: codes.html "响应状态码"
