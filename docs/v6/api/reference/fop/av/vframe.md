---
title: 视频截图（vframe）
order: 149
---

<a id="video-thumbnail"></a>
# 视频帧缩略图

<a id="description"></a>
## 描述

从视频流中截取指定时刻的单帧画面并按指定大小缩放成图片。  

<a id="specification"></a>
## 接口规格（vframeSpec）  

```
vframe/<Format>
      /offset/<Second>
      /w/<Width>
      /h/<Height>
      /rotate/<Degree>
```

参数名称           | 必填 | 说明
:----------------- | :--- | :------------------------------------------------------------------
`<Format>`         | 是   | 输出的目标截图格式，支持jpg、png等。
`/offset/<Second>` | 是   | 指定截取视频的时刻，单位：秒。
`/w/<Width>`       | 是   | 缩略图宽度，单位：像素（px），取值范围为1-1920。
`/h/<Height>`      | 是   | 缩略图高度，单位：像素（px），取值范围为1-1080。
<a id="rotate"></a>`/rotate/<Degree>` |      | 指定顺时针旋转的度数，可取值为`90`、`180`、`270`、`auto`，默认为不旋转。

<a id="request"></a>
## 请求

<a id="request-syntax"></a>
### 请求语法

可以通过[上传预转](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops)或者[触发持久化处理](http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html)的方式来调用




<a id="samples"></a>
## 示例

1. 取视频第7秒的截图，图片格式为jpg，宽度为480px，高度为360px：

[上传预转](http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops)上传的`token`中指定`persistentOps`:

```
    {
        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
        "deadline":             1390528576,
        "persistentOps":        "vframe/jpg/offset/7/w/480/h/360",
        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
    }
```


[触发持久化处理](http://developer.qiniu.com/docs/v6/api/reference/fop/pfop/pfop.html):

```
    POST /pfop/ HTTP/1.1
    Host: api.qiniu.com  
    Content-Type: application/x-www-form-urlencoded  
    Authorization: QBox <AccessToken>  

    bucket=qiniu-ts-demo
    &key=thinking-in-go.mp4
    &fops=vframe%2fjpg%2foffset%2f7%2fw%2f480%2fh%2f360
```


[thumbnailHref]:                ../../list/thumbnail.html                       "缩略图文档列表"
[sendBugReportHref]:            mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
