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
    "insertOnly":           <AllowFileUpdating        int>,

    "saveKey":             "<KeyFomart                string>",

    "endUser":             "<EndUserId                string>",

    "returnUrl":           "<RedirectURL              string>",
    "returnBody":          "<ResponseBodyForAppClient string>",

    "callbackUrl":         "<RequestUrlForAppServer   string>",
    "callbackBody":        "<RequestBodyForAppServer  string>",

    "persistentOps":       "<persistentOpsCmds        string>",
    "persistentNotifyUrl": "<persistentNotifyUrl      string>",

    "fsizeLimit":           <FileSizeLimit            int64>,

    "detectMime":           <AutoDetectMimeType       int>,
    "mimeLimit":           "<MimeLimit                string>",
}
```

字段名称              | 必填 | 说明
:-------------------- | :--- | :-----------------------------------------------
<a id="put-policy-scope"></a>`scope`               | 是   | ● 指定上传的目标资源空间（Bucket）和资源名（Key）<br>有两种格式：<br>1. `<bucket>`，表示允许用户上传文件到指定的 bucket。在这种模式下文件只能“新增”，若已存在同名资源则会失败；<br>2. `<bucket>:<key>`，表示只允许用户上传指定key的文件。在这种模型下文件默认允许“修改”，已存在同名资源则会本次覆盖。如果希望只能上传指定key的文件，并且不允许修改，那么可以将下面的 `insertOnly` 属性值设为 `1`。
<a id="put-policy-deadline"></a>`deadline`            | 是   | ● 上传请求授权的截止时间<br>[UNIX时间戳][unixTimeHref]，单位：秒。
<a id="put-policy-insert-only"></a>`insertOnly`          |      | ● 限定为“新增”语意<br>如果设置为非0值，则无论scope设置为什么形式，仅能以`新增`模式上传文件。
<a id="put-policy-end-user"></a>`endUser`             |      | ● 唯一属主标识<br>特殊场景下非常有用，比如根据`App-Client`标识给图片或视频打水印。
<a id="put-policy-return-url"></a>`returnUrl`           |      | ● Web端文件上传成功后，浏览器执行303跳转的URL<br>通常用于`HTML Form`上传。<br>文件上传成功后会跳转到`<returnUrl>?upload_ret=<queryString>`, `<queryString>`包含`returnBody`内容。<br>如不设置`returnUrl`，则直接将`returnBody`的内容返回给客户端。
<a id="put-policy-return-body"></a>`returnBody`          |      | ● 上传成功后，自定义七牛云最终返回給上传端（在指定`returnUrl`时是携带在跳转路径参数中）的数据<br>支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]。`returnBody` 要求是合法的 JSON 文本。如：`{"key": $(key), "hash": $(etag), "w": $(imageInfo.width), "h": $(imageInfo.height)}`。
<a id="put-policy-callback-url"></a>`callbackUrl`         |      | ● 上传成功后，七牛云向`App-Server`发送POST请求的URL<br>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL。另外，为了给客户端有一致的体验，我们要求 `callbackUrl` 返回包 `Content-Type` 为 `"application/json"`，即返回的内容必须是合法的 JSON 文本。
<a id="put-policy-callback-body"></a>`callbackBody`        |      | ● 上传成功后，七牛云向`App-Server`发送POST请求的数据<br>支持[魔法变量][magicVariablesHref]和[自定义变量][xVariablesHref]。`callbackBody` 要求是合法的 url query string。如：`key=$(key)&hash=$(etag)&w=$(imageInfo.width)&h=$(imageInfo.height)`。
<a id="put-policy-persistent-ops"></a>`persistentOps`       |      | ● 资源上传成功后触发执行的预转持久化处理指令列表<br>每个指令是一个API规格字符串，多个指令用“;”分隔。<br>请参看[详解](#put-policy-persistent-ops-explanation)与[示例](#put-policy-samples-persisntent-ops)。
<a id="put-policy-persisten-notify-url"></a>`persistentNotifyUrl` |      | ● 接收预转持久化结果通知的URL<br>必须是公网上可以正常进行POST请求并能响应`HTTP/1.1 200 OK`的有效URL。如设置`persistenOps`字段，则本字段必须同时设置（未来可能转为可选项）。
<a id="put-policy-save-key"></a>`saveKey`             |      | ● 自定义资源名<br>支持[魔法变量][magicVariablesHref]及[自定义变量][xVariablesHref]。这个字段仅当用户上传的时候没有主动指定key的时候起作用。
<a id="put-policy-fsize-limit"></a>`fsizeLimit`          |      | ● 限定上传文件的大小，单位：字节（Byte）<br>超过限制的上传内容会被判为上传失败，返回413状态码。
<a id="put-policy-detect-mime"></a>`detectMime`          |      | ● 开启MimeType侦测功能<br>设为非0值，则忽略上传端传递的文件MimeType信息，使用七牛服务器侦测内容后的判断结果<br>默认设为0值，如上传端指定了MimeType则直接使用该值，否则按如下顺序侦测MimeType值：<br>1. 检查文件扩展名<br>2. 检查Key扩展名<br>3. 侦测内容。
<a id="put-policy-mime-limit"></a>`mimeLimit`           |      | ● 限定用户上传的文件类型<br>指定本字段值，七牛服务器会侦测文件内容以判断MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败返回403状态码<br>● 示例<br>1. "image/*"表示只允许上传图片类型；<br>2. "image/jpeg;image/png"表示只允许上传`jpg`和`png`类型的图片；<br>3. "!application/json;text/plain"表示禁止上传`json`文本和纯文本（注意最前面的感叹号）。


<a id="put-policy-persistent-ops-explanation"></a>
### persistentOps详解

`persistentOps`字段用于指定预转数据处理命令和保存处理结果的存储空间与资源名。  

为此字段指定非空值，则在成功上传一个文件后，会启动一个异步数据处理任务。  
同时客户端收到的响应内容中会有`persistentId`字段，唯一标示此任务。  

1. 使用默认存储空间和资源名：

	当只指定了数据处理命令时，服务端会选择上传文件的`Bucket`作为数据处理结果的存储空间，`Key`由七牛服务器自动生成。

2. 使用指定存储空间和资源名：

	当在数据处理命令后用管道连接`saveas/<encodedEntryURI>`时，七牛服务器会从指定的[EntryURI][encodedEntryURIHref]中取得处理结果的存储空间与资源名。  
	例如`avthumb/flv|saveas/cWJ1Y2tldDpxa2V5`，是将上传的视频文件转码成`flv`格式后存储为`qbucket:qkey`，其中**cWJ1Y2tldDpxa2V5**是**qbucket:qkey**的[UrlSafe-Base64编码][urlsafeBase64Href]结果。  
	以上方式可以同时作用于多个数据处理命令，用“;”分隔，例如`avthumb/mp4|saveas/cWJ1Y2tldDpxa2V5;avthumb/flv|saveas/cWJ1Y2tldDpxa2V5Mg==`。

<a id="put-policy-remarks"></a>
## 附注

- `Key`必须采用utf-8编码，使用非utf-8编码的资源名访问时会报错。  
- `callbackUrl`与`callbackBody`配合使用。
- `returnUrl`与`returnBody`配合使用。
- `callbackXXX`与`returnXXX`不可混用。
- 文件上传后的命名将遵循以下规则：
    1. 客户端已指定`Key`，以`Key`命名；
    2. 客户端未指定`Key`，上传策略中设置了`saveKey`，以`saveKey`的格式命名；
    3. 客户端未指定`Key`，上传策略中未设置`saveKey`，以文件hash（etag）命名。

<a id="put-policy-samples"></a>
## 示例

<a id="put-policy-samples-persisntent-ops"></a>
### persistentOps与persistentNotifyUrl字段

1. 上传一个视频资源，并在成功后触发两个预转处理（转成mp4资源和对原资源进行HLS切片）：

```
{
    "scope":                "qiniu-ts-demo",
    "deadline":             1390528576,
    "persistentOps":        "avthumb/mp4;avthumb/m3u8/segtime/15/preset/video_440k",
    "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
}
```

<a id="upload-internal-resources"></a>
## 内部参考资源

- [上传凭证][uploadTokenHref]
- [魔法变量][magicVariablesHref]
- [自定义变量][xVariablesHref]
- [EncodedEntryURI格式][encodedEntryURIHref]
- [URL安全的Base64编码][urlsafeBase64Href]

<a id="download-external-resources"></a>
## 外部参考资源

- [Unix时间][unixTimeHref]

[uploadTokenHref]:          upload-token.html                                            "上传凭证"
[magicVariablesHref]:       ../../overview/up/response/vars.html#magicvar                "魔法变量"
[xVariablesHref]:           ../../overview/up/response/vars.html#xvar                    "自定义变量"
[fopHref]:                  ../../overview/up/response/persistent-op.html                "预转持久化处理"
[encodedEntryURIHref]:          ../data-formats.html#data-format-encoded-entry-uri "EncodedEntryURI格式"
[urlsafeBase64Href]: ../overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"

[unixTimeHref]:             http://en.wikipedia.org/wiki/Unix_time                       "Unix时间"
