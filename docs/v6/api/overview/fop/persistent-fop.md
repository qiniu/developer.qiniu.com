---
title: 处理结果持久化
order: 270
---
<a id="pfop"></a>
# 处理结果持久化

之前我们介绍了常规的访问时数据处理机制，那种机制很适合像图片缩略图之类的访问，但无法应用数据处理过程较长的资源，比如花费时间超过一分钟的音频转码，更不用说可能处理时间超过一小时的视频转码。

**处理结果持久化机制（pfop）**用于满足这种处理时间较长的场景。

> 开发者可使用该功能对音视频进行异步转码，并将转码结果永久存储于空间中，从而大幅提升访问体验。
> 
> 处理结果持久化功能还提供即时的处理状态通知和查询功能，因此开发者在开始执行音视频转码后还能随时获取转码进度信息。

处理结果持久化功能可以在两种场景下触发：

1. 在资源上传完成后自动触发处理流程；
1. 针对已存在空间中的资源手动触发处理流程；

下面分别描述这两种详细用法。

<a id="pfop-upload"></a>
## 上传后自动触发数据处理

开发者如果希望在上传文件后自动触发数据处理过程，需要在构造[上传凭证][uploadTokenHref]时在[上传策略][putPolicyHref]中设置`persistentOps`和`persistentNotifyUrl`两个字段。  

字段                   | 类型    | 含义
--------------------- | ------ | -------------
`persistentOps`       | string | 需要进行的数据处理命令,可以指定多个命令，以`;`分隔。<p>每一个数据处理命令都应遵循标准格式，参见[数据处理（fop）][fopHref]。
`persistentNotifyUrl` | string | 用户接收视频处理结果的接口URL。<p>该设置项为可选，如果未设置，则开发者只能使用返回的`persistentId`主动查询处理进度。

用户使用指定了`persistentOps`和`persistentNotifyUrl`的上传凭证上传一个文件之后，服务端返回的响应内容中会包含此次异步处理的进程ID`persistentId`，该ID可用于获取处理的进度和结果。

针对用户上传策略的不同，返回的`persistentId`字段会出现在不同的位置：

1.  设置`returnUrl`或`callbackUrl`，响应内容中直接带有`persistentId`字段；
1.  设置了`returnUrl`但没有设置`returnBody`，跳转过程附带的upload_ret参数解码后获得的结果中默认带有`persistentId`字段；  
1.  设置了callbackUrl，但没有设置callbackBody，和之前一样，这种情况下上传会失败；  
1.  设置了returnUrl或callbackUrl，且根据需求自定义了相应的Body（`returnBody` 或 `callbackBody`），要在Body中使用魔法变量`$(persistentId)` 来得到。  

<a id="pfop-existing-resource"></a>
## 对已有资源手动触发数据处理

如果需要对已存在于空间中的资源进行处理并持久化处理结果，可按以下方式使用我们的异步处理接口：  

```
POST /pfop HTTP/1.1
Host: api.qiniu.com  
Content-Type: application/x-www-form-urlencoded  
Authorization: <AccessToken>  

bucket=<bucket>&key=<key>&fops=<fop1>;<fop2>...<fopN>&notifyURL=<persistentNotifyUrl>
```

其中的`AccessToken`的生成算法可参见[管理凭证规格][accessTokenHref]。
  
正常情况下获得的返回：

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: <length>

{"persistentId": <persistentId>}
```

处理完成后会向用户指定的`notifyURL`发送处理结果，用户也可以根据`persistentId`来主动查询。详情可以参考：[处理状态通知和查询](#pfop-status)。

<a id="pfop-download"></a>
## 下载处理结果
数据处理完成后，用户即可通过：

```
http://<domain>/<key>?p/1/<fop>
```

这样形式的URL访问处理结果。如果访问的处理结果不存在则返回404。  

<a id="pfop-status"></a>
## 状态通知和查询

处理过程的状态可通过两种方式获取：

1. 上传时设定`persistentNotifyUrl`字段，则该URL会收到主动的通知。

	服务端完成所有的数据处理后，会以 HTTP POST 的方式将处理状态发送给用户指定的通知URL。

1. 随时手动发起一个查询请求。

	开发者可以使用上传时返回的`persistentId`来随时查询数据处理的状态。查询的接口为：  

	```
	[GET] http://api.qiniu.com/status/get/prefop?id=<persistentId>  
	```

用户获得的数据处理状态是一个JSON字符串，内容格式如下：  

```
{
    "id": "<persistentId>",
    "code": <overall_result>,
    "desc": "<overall_result_description>",
    "items": [
    	...
    	{
    		"cmd": "<fop_cmd>",
    		"code": <result>,
    		"desc": "<result_description>",
    		"error": "<error_description>",
    		"hash": "<result_hash>",
    		"key": "<result_key>"
    	}
    	...
    ]
}
```

状态内容中每个字段的详细含义如下：

字段     | 类型    | 含义
------- | ------ | ---------------------
id    | string | 数据处理的进程ID，即前文中的`persistentId`。
code  | int    | 状态码，0 表示成功，1 表示等待处理，2 表示正在处理，3 表示处理失败，4 表示回调失败。
desc  | string | 状态码对应的详细描述。
items | \<array\> | JSON数组。包含每个数据处理操作的进度信息。
cmd   | string | 对应一个特定的数据处理命令。
error | string | 如果处理失败，这个字段会给出详细的失败原因。
hash  | string | 数据处理结果的哈希值。
key   | string | 数据处理结果的唯一资源ID。数据处理结果可通过`http://<domain>/<key>`访问。

<a id="pfop-example"></a>
## 示例

上传一个音频文件persistent.mp3，并设置上传策略中的`persistentOp`字段为这两个命令：`avthumb/mp3/aq/6/ar/16000`、`avthumb/mp3/ar/44100/ab/32k`。  

通知接口或主动查询收到的处理状态内容将如下所示：  

```
{  
    'code': 0,  
    'id': '168739cd2fn1g76f13',   
    'desc': 'The fop was completed successfully',  
    'items': [  
        {
            'code': 0, 
            'hash': 'FvvxM7gMI6WfiuXlBgKbkzU67Tpa', 
            'cmd': 'avthumb/mp3/ar/44100/ab/32k', 
            'key': 'sFhZ4dSjB1zvL3De1UBX2qZ_VR0=/lgxucMCQso_KOW_YDM-_KVIeX6o5', 
            'error': '', 
            'desc': 'The fop was completed successfully'
        },   
        {
            'code': 0, 
            'hash': 'FpSzDMYJtP_UY_6EMIyaBe4awXp3', 
            'cmd': 'avthumb/mp3/aq/6/ar/16000', 
            'key': '1G8-OWwP3jPLvi7O3qOf7yCl4YI=/lgxucMCQso_KOW_YDM-_KVIeX6o5', 
            'error': '', 
            'desc': 'The fop was completed successfully'
        }  
    ]  
}
```

3. 访问链接：  
[原文件](http://t-test.qiniudn.com/persistent.mp3)  
[处理1(avthumb/mp3/aq/6/ar/16000)结果](http://t-test.qiniudn.com/persistent.mp3?p/1/avthumb/mp3/aq/6/ar/16000)  
[处理2(avthumb/mp3/ar/44100/ab/32k)结果](http://t-test.qiniudn.com/persistent.mp3?p/1/avthumb/mp3/ar/44100/ab/32k)   

[putPolicyHref]:			../../reference/security/put-policy.html "上传策略"
[uploadTokenHref]:			../../reference/security/upload-token.html "上传凭证"
[fopHref]:					fop.html "数据处理"