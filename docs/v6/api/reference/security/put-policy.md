---
layout: docs
title: 上传策略（PutPolicy）
order: 980
---

<a id="put-policy"></a>
# 上传策略（PutPolicy）

上传策略是资源上传时附带的一组配置设定。通过这组配置信息，七牛云存储可以了解用户上传的需求：它将上传什么资源，上传到哪个空间，上传结果是回调通知还是使用重定向跳转，是否需要设置反馈信息的内容，以及授权上传的截止时间等等。  

上传策略同时还参与请求验证。实际上，[上传凭证（UploadToken）][uploadTokenHref]就是上传策略的签名结果。通过对上传策略签名，可以确保用户对某个资源的上传请求是完全受到验证的。

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
    "persistentNotifyUrl": "<persistentNotifyUrl      string>",

    "insertOnly":          "<AllowFileUpdating        uint16>",
    "detectMime":          "<AutoDetectMimeType       uint16>",
    "fsizeLimit":          "<FileSizeLimit            int64>",
    "saveKey":             "<KeyFomart                string>",

    "mimeLimit":           "<MimeLimit                string>"
}
```

字段名称              | 必填 | 说明
:-------------------- | :--- | :-----------------------------------------------
<a id="put-policy-scope"></a>`scope`               | 是   | ● 指定上传的目标资源空间（Bucket）和资源名（Key）<br>有两种格式：<br>1. `<bucket>`，“新增”语意，若已存在同名资源则会失败；<br>2. `<bucket>:<key>`，“覆盖”语意，若已存在同名资源则会覆盖。
<a id="put-policy-deadline"></a>`deadline`            | 是   | ● 上传请求授权的截止时间<br>[UNIX时间戳][unixTimeHref]，单位：秒。
<a id="put-policy-end-user"></a>`endUser`             |      | ● 唯一属主标识<br>特殊场景下非常有用，比如根据`App-Client`标识给图片或视频打水印。
<a id="put-policy-return-url"></a>`returnUrl`           |      | ● Web端文件上传成功后，浏览器执行303跳转的URL<br>通常用于`HTML Form`上传。<br>文件上传成功后会跳转到`<returnUrl>?<queryString>`, `<queryString>`包含`returnBody`内容。<br>如不设置，则直接向上传端返回`returnBody`内容。
<a id="put-policy-return-body"></a>`returnBody`          |      | ● 上传成功后，自定义七牛云最终返回給上传端的数据<br>支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]。
<a id="put-policy-callback-url"></a>`callbackUrl`         |      | ● 上传成功后，七牛云向`App-Server`发送POST请求的URL<br>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL。
<a id="put-policy-callback-body"></a>`callbackBody`        |      | ● 上传成功后，七牛云向`App-Server`发送POST请求的数据<br>支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]。
<a id="put-policy-persistent-ops"></a>`persistentOps`       |      | ● 资源上传成功后触发执行的[预转持久化处理][fopHref]指令<br>每个指令是一个API规格字符串，多个指令用“;”分隔。
<a id="put-policy-persisten-notify-url"></a>`persistentNotifyUrl` |      | ● 接收预转持久化结果通知的URL<br>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL。如设置`persistenOps`字段，则本字段必须同时设置（未来可能转为可选项）。
<a id="put-policy-insert-only"></a>`insertOnly`          |      | ● 限定为“新增”语意<br>如果设置为非0值，则无论scope设置为什么形式，仅能以`新增`模式上传文件。
<a id="put-policy-save-key"></a>`saveKey`             |      | ● 自定义资源名格式<br>支持[魔法变量][magicVariablesHref]及[自定义变量][xVariablesHref]。
<a id="put-policy-fsize-limit"></a>`fsizeLimit`          |      | ● 限定上传文件的大小，单位：字节（Byte）<br>超过限制的上传内容会被判为上传失败，返回413状态码。
<a id="put-policy-detect-mime"></a>`detectMime`          |      | ● 开启MimeType侦测功能<br>设为非0值，则忽略上传端传递的文件MimeType信息，使用七牛服务器侦测内容后的判断结果<br>默认设为0值，如上传端指定了MimeType则直接使用该值，否则按如下顺序侦测MimeType值：<br>1. 检查文件扩展名<br>2. 检查Key扩展名<br>3. 侦测内容。
<a id="put-policy-mime-limit"></a>`mimeLimit`           |      | ● 限定用户上传的文件类型<br>指定本字段值，七牛服务器会侦测文件内容以判断MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败返回403状态码<br>● 示例<br>1. "image/*"表示只允许上传图片类型<br>2. "image/jpeg;image/png"表示只允许上传`jpg`和`png`类型的图片。

<a id="put-policy-remarks"></a>
## 附注

- `Key`必须采用utf-8编码，使用非utf-8编码的资源名访问时会报错。  
- `callbackUrl`与`callbackBody`配合使用。
- `returnUrl`与`returnBody`配合使用。
- `callbackXXX`与`returnXXX`不可混用。
- 文件上传后的命名将遵循以下规则：

    - 客户端已指定`Key`，以`Key`命名
    - 客户端未指定`Key`，上传策略中设置了`saveKey`，以`saveKey`的格式命名
    - 客户端未指定`Key`，上传策略中未设置`saveKey`，以文件hash（etag）命名


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
[fopHref]:                  ../../overview/up/response/persistent-op.html                "预转持久化处理"

[unixTimeHref]:             http://en.wikipedia.org/wiki/Unix_time                       "Unix时间"
