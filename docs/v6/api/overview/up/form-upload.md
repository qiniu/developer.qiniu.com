---
layout: docs
title: 表单上传
order: 540
---
<a id="form-upload"></a>
# 表单上传

表单上传功能适用于文件内容可以在一次HTTP请求即可传递完成的场景。该功能非常适合于在浏览器中使用HTML表单上传资源，或者在不需要处理复杂情况的客户端开发中使用。

开发者只要组装一个符合**HTML文件上传表单**规范（参见[RFC1867](http://www.ietf.org/rfc/rfc1867.txt)）的HTTP请求，并以POST方式向域名`up.qiniu.com`发起这个请求，即可将指定文件上传到服务端。业务逻辑非常简单明了。

<a id="form-upload-usage"></a>
## 使用方法

我们可以用如下的HTML表单来描述表单上传的基本用法：

```
<form method="post" action="http://up.qiniu.com/"
 enctype="multipart/form-data">
  <input name="key" type="hidden" value="<resource_key>">
  <input name="x:<custom_name>" type="hidden" value="<custom_value>">
  <input name="token" type="hidden" value="<upload_token>">
  <input name="file" type="file" />
</form>
```

HTML表单上传的几个关键参数说明如下：

名称        | 类型   | 必须 | 说明
------------|--------|------|-------------------------------------
token       | string | 是   | 必须是一个符合相应规格的[上传凭证](../../reference/security/upload-token.html)，否则会返回401表示权限认证失败。
file        | file   | 是   | 文件本身。
key         | string | 否   | 资源名，必须为UTF-8编码。
x:\<custom_field_name\> | string | 否 | [自定义变量](response/vars.html#xvar)，必须以 `x:` 开头命名，不限个数。里面的内容将在 `callbackBody` 参数中的 `$(x:custom_field_name)` 求值时使用。

上传过程在一个HTTP请求和响应中完成，因此该过程将阻塞直到文件传输成功完成或失败为止。如果文件较大，或者网络环境较差，可能会导致HTTP连接超时而上传失败。若发生这种情况，开发者需要考虑换用更安全但也相对复杂的[分片上传](chunked-upload.html)功能。

提交以上这个HTML表单而生成的HTTP请求内容大致如下所示：

```
POST http://up.qiniu.com/
Content-Type: multipart/form-data; boundary=<Boundary>
--<Boundary>

Content-Disposition: form-data; name="key"
<resource_key>
--<Boundary>

Content-Disposition: form-data; name="x:<custom_field_name>"
<custom_value>
--<Boundary>

Content-Disposition: form-data; name="token"
<upload_token>
--<Boundary>

Content-Disposition: form-data; name="file"; filename="[文件名]"
Content-Type: <MimeType>
[文件内容]
--<Boundary>--
```

在非网页开发的场景中，开发者完全可以自行组装这个HTML表单请求。考虑到各个平台上的网络库都已经对HTML文件上传表单有非常完整的支持，组装这个请求的过程将会非常轻松。

<a id="form-upload-response"></a>
## 后续动作

我们可以在生成上传凭证时指定一系列的参数，以控制服务器在文件上传完成后的后续动作。我们将在[上传后续动作](response/)中详细描述各种参数的用法和作用。

另外如果需要，我们可以在表单参数中增加一系列的[魔法变量](response/vars.html#magicvar)和[自定义变量](response/vars.html#xvar)。上述表单例子中的`<x:custom_field_name>`就是变量的使用方法示意。我们可以将其更换为一系列魔法变量或自定义变量。

变量将会在回调和自定义返回内容中起到极大的作用。具体用法请参见[回调](response/callback.html)和[自定义返回内容](response/response-body.html)对应的使用方法描述。

<a id="form-upload-example"></a>
## 完整示例

请参见<https://github.com/qiniu/form-upload>。