---
layout: docs
title: 上传策略（PutPolicy）
order: 980
---

<a id="put-policy"></a>
# 上传策略（PutPolicy）

上传策略是资源上传时附带的一组配置设定。通过这组配置信息，七牛云存储可以了解用户上传的需求：它将上传什么资源，上传到哪个空间，上传结果是回调通知还是使用重定向跳转，是否需要设置反馈信息的内容，以及授权上传的截止时间等等。  

上传策略同时还参与请求验证。实际上，[上传凭证（UploadToken）][uploadTokenHref]就是上传策略的加密结果。通过对上传策略加密，可以确保用户对某个资源的上传请求是完全受到验证的。

<a id="put-policy-struct"></a>
## 格式

```
{
    "scope":               "<Bucket                   string>",
    "deadline":             <UnixTimestamp            int64>,
    "endUser":             "<EndUserId                string>",

    "returnUrl":           "<RedirectURL              string>",
    "returnBody":          "<ResponseBodyForAppClient string>",

    "callbackBody":        "<RequestBodyForAppServer  string>",
    "callbackUrl":         "<RequestUrlForAppServer   string>",

    "persistentOps":       "<persistentOpsCmds        string>",
    "persistentNotifyUrl": "<persistentNotifyUrl      string>"
}
```

字段名称              | 必填 | 说明
:-------------------- | :--- | :-----------------------------------------------
`scope`               | 是   | 指定上传的目标资源空间（Bucket）和资源名（Key），有两种格式：<p>`<bucket>`，“新增”语意，若已存在同名资源则会失败；<p>`<bucket>:<key>`，“覆盖”语意，若已存在同名资源则会覆盖
`deadline`            | 是   | 上传请求授权的截止时间，[Unix时间][unixTimeHref]，单位：秒
`endUser`             |      | 给资源添加唯一属主标识，特殊场景下非常有用，比如根据`App-Client`标识给图片或视频打水印
`returnUrl`           |      | 设置用于Web端文件上传成功后，浏览器执行301跳转的URL，通常用于`HTML Form`上传。<p>文件上传成功后会跳转到`<returnUrl>?<queryString>`, `<queryString>`包含`returnBody`内容<p>如不设置，则直接向上传端返回`returnBody`内容
`returnBody`          |      | 上传成功后，自定义七牛云存储最终返回給上传端的数据，支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]
`callbackUrl`         |      | 上传成功后，七牛云存储向`App-Server`发送POST请求的URL<p>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL
`callbackBody`        |      | 上传成功后，七牛云存储向`App-Server`发送POST请求的数据，支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]
`persistentOps`       |      | 音频/视频资源上传成功后异步执行的预转[云处理][fopHref]持久化指令。每个指令是一个API规格字符串，多个指令用“;”分隔
`persistentNotifyUrl` |      | 七牛云存储向`App-Server`发送预转云处理持久化结果的URL，必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL

<a id="put-policy-remarks"></a>
## 附注

- `Key`必须采用utf-8编码，使用非utf-8编码的资源名访问时会报错。  
- `callbackUrl`与`returnUrl`不可同时指定，两者只可选其一。
- `callbackBody`与`returnBody`不可同时指定，两者只可选其一。

<a id="upload-internal-resources"></a>
## 内部参考资源

- [上传凭证][uploadTokenHref]
- [魔法变量][magicVariablesHref]
- [自定义变量][xVariablesHref]

<a id="download-external-resources"></a>
## 外部参考资源

- [Unix时间][unixTimeHref]

[uploadTokenHref]:          upload-token.html                                            "上传凭证"
[magicVariablesHref]:       ../../overview/up/response/vars.html#magicvar                "魔法变量"
[xVariablesHref]:           ../../overview/up/response/vars.html#xvar                    "自定义变量"

[unixTimeHref]:             http://en.wikipedia.org/wiki/Unix_time                       "Unix时间"
