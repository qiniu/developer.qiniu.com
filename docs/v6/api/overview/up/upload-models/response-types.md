---
layout: docs
title: 响应类型
order: 470
---

<a id="response-types"></a>
# 响应类型

- [简单反馈](#simple-response)
- [303重定向](#redirect)
- [回调通知（callback）](#callback)
    - [回调地址](#callback-url)
    - [回调内容](#callback-body) 
    - [安全性](#callback-security)
    - [常见问题](#FAQ)
- [异步数据预处理](#persistent-op)	

从结果响应的角度，上传模型支持几种不同的响应方式和通知目标。

- 简单反馈

	简单反馈是指最直接的HTTP响应方式。客户端发起一次上传请求，然后等待服务端返回结果。服务端在处理完该次上传请求后，将处理结果以HTTP响应的方式反馈给客户端。
	
	简单反馈的相关细节请参见[简单反馈](/docs/v6/api/overview/up/upload-models/response-types.html#simple-response)。
	
- 303重定向

	303重定向通常在浏览器上传的场景中使用。浏览器中的网页可以在发起上传请求的同时通知服务器，一旦上传成功，服务器应该返回HTTP 303状态码并带上一个重定向URL。浏览器在收到服务器返回的这个重定向指令后，将当前页面跳转到对应的重定向URL。
	
	303重定向的使用细节请参见[303重定向](/docs/v6/api/overview/up/upload-models/response-types.html#redirect)。
	
- 回调通知

	回调通知是指客户端在上传时指定服务端在处理完上传请求后，应该通知某个特定服务器，在该服务器确认接收了该回调后才将所有结果返回给客户端。
	
	因为加入了回调请求和响应的过程，相比简单上传，使用回调通知机制一般会导致客户端花费更多的等待时间。
	
	回调通知的使用细节请参见[回调通知（callback）](/docs/v6/api/overview/up/upload-models/response-types.html#callback)。
	
- 异步数据处理

	客户端可以要求服务端在资源上传完成后以异步的方式开始处理刚刚上传的资源。要达到这个目标，可以在上传时指定相应的数据处理操作和参数。所有七牛云存储已经支持的数据处理服务均可以作为该请求的设置目标。
	
	异步数据处理的使用细节请参见[异步数据处理](/docs/v6/api/overview/up/upload-models/response-types.html#persistent-op)。
	
<a id="simple-response"></a>
## 简单反馈

如果资源上传成功，服务端会响应HTTP 200返回码，且在响应内容中包含两个字段：

- `hash`：已上传资源的校验码，供用户核对使用。
- `key`：目标资源的最终名字，可由七牛云存储自动命名；

以下是一个典型的上传成功反馈：

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
    "key": "gogopher.jpg",
}
```

如果资源上传失败，服务端会反馈相应的错误信息。比如，HTTP 401代表验证失败。此时相应内容中会包含详细错误信息。错误信息同样为JSON格式：{"error":"\<reason\>"}

以下是一个典型的上传失败反馈：

```
HTTP/1.1 400 Bad Request
Date: Mon, 05 Aug 2013 13:56:34 GMT
Server: nginx/1.0.14
Content-Type: application/json
Access-Control-Allow-Origin: *
Content-Length: 28
X-Log: MC;SBD:10;RBD:11;BDT:12;FOPD/400;FOPG:63/400;IO:109/400
X-Reqid: -RIAAIAI8UjcgRcT
X-Via: 1.1 jssq179:8080 (Cdn Cache Server V2.0), 1.1 jsyc96:9080 (Cdn Cache Server V2.0)
Connection: close

{
    "error":"invalid argument"
}
```

这些返回的错误信息可以帮助开发者分析问题原因。完整的返回码信息请参见[HTTP状态码](/docs/v6/api/reference/codes.html)。

从上面的错误示例中可以看到，响应头中还包含了一些以`X-`为前缀的扩展字段，如`X-Reqid`和`X-Log`等。这些扩展信息非常有助于问题定位。我们建议开发者将所有接收到的错误信息写到日志中，以便于我们的技术支持人员在协助分析问题时有足够详细的线索。

关于这些扩展字段的详细描述，请参见[HTTP扩展字段](/docs/v6/api/reference/extended-headers.html)。

<a id="redirect"></a>
## 303重定向

HTTP 303重定向（参见[RFC 2616 - 10.3.4](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.4)）是HTTP 1.1规范的组成部分。  
服务器可以通过返回303状态码告诉客户端，本次请求的内容可以通过返回的跳转URL取到，因此客户端应该重定向到新的URL。  
该技术被广泛用于网页开发领域，如在文件上传完成后让客户端自动重定向到一个上传成功的结果页面。  

七牛云存储的资源上传后续动作也支持303重定向功能。

在构造[上传凭证](/docs/v6/api/reference/security/upload-token.html)时，开发者可以通过设置[上传策略（PutPolicy）](/docs/v6/api/reference/security/put-policy.html)中的`returnUrl`参数以激活303重定向功能。在成功完成上传后，服务端会向客户端返回HTTP 303状态码，并在`Location`字段中携带上传时指定的重定向地址。如下所示：

```
HTTP/1.1 303 See Other
Location: <returnUrl>
```

客户端收到这样的反馈后，应按HTTP 1.1标准将当前页面重定向到`Location`字段所指定的URL。  
主流浏览器都能正确的支持该跳转操作。  

如果上传策略中还设定了自定义返回内容`returnBody`，则到时服务端返回的303响应中的`Location`字段也会包含自定义返回内容。参数值采用[URL安全的Base64编码](/docs/v6/api/overview/appendix.html#urlsafe-base64)。此时的响应内容如下所示：

```
HTTP/1.1 303 See Other
Location: <returnUrl>?upload_ret=<encoded_return_body>
```

如果希望返回的自定义返回内容能得到正确处理，重定向URL所对应的服务器需支持请求参数`upload_ret`。 

<a id="callback"></a>
## 回调通知（callback）

开发者可以要求七牛云存储在某文件上传完成后向特定的URL发起一个回调请求。七牛云存储会将该回调的响应内容作为文件上传响应的一部分一并返回给客户端。回调的流程如下图所示：

![带回调的上传流程](img/upload-with-callback.png)

要启用回调功能，业务服务器在签发上传凭证时需要设置[上传策略（PutPolicy）](/docs/v6/api/reference/security/put-policy.html)中的`callbackUrl`字段,并且设置`callbackBody`字段。

<a id="callback-url"></a>
### 回调地址

通过设定上传策略中的`callbackUrl`字段为一个有效的地址，即可让七牛云存储在文件上传完成后向该地址发起回调请求。

该地址可以是一个HTTP或者HTTPS的URL，允许公网访问。

如果需要传递自定义的请求内容，开发者可以考虑配合使用上传策略中的`callbackBody`字段。如果只有`callbackUrl`而没有`callbackBody`，回调服务器收到的请求内容将为空。

<a id="callback-body"></a>
### 回调内容

同普通客户端直传和重定向上传一样，用户也可以控制回调中传递到客户回调服务器的反馈信息。`callbackBody`的格式如下：

```
<item>=(<magicvar>|<xvar>)[&<item>=(<magicvar>|<xvar>)...]
```

一个典型的`callbackBody`设置如下：

```
put_policy = '{
    ...
    "callbackBody" : "name=$(fname)&hash=$(etag)&location=$(x:location)\
	                  &price=$(x:price)&uid=123"
    ...
}'
```

上面的 `callbackBody` 示例中，混合使用了魔法变量（name,hash）、自定义变量(location,price)及自定义常量(uid)。
假设应用客户端发出了如下的上传请求：

```
<form method="post" action="http://upload.qiniu.com/" enctype="multipart/form-data">
    <input name="key" type="hidden" value="sunflower.jpg">
    <input name="x:location" value="Shanghai">
    <input name="x:price" value="1500.00">
    <input name="token" type="hidden" value="...">
    <input name="file" type="file" />
</form>
```

其中，客户端发送了自定义变量的值`x:location = Shanghai`和`x:price = 1500.00`，七牛云存储将根据上传资源的实际情况填写魔法变量`$(fname)`和`$(etag)`的值。

完成上传后，七牛云存储便会构造出如下的回调信息：

```
name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm- \
RlQx_4O2&location=Shanghai&price=1500.00&uid=123
```

七牛云存储将这组数据作为请求Body发送至用户指定的回调服务器,请求方式为POST。回调服务器将接收到以下格式的请求内容：


```
POST /callback  HTTP/1.1
Content-Type: application/x-www-form-urlencoded
User-Agent: qiniu go-sdk v6.0.0
Host: api.examples.com
Authorization: QBox iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV:tDK-3f5xF3SJYEAwsll5g=

name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm- \
RlQx_4O2&location=Shanghai&price=1500.00&uid=123
```

回调服务器接收到回调请求后，负责生成七牛返回给客户端的数据(json格式)，该数据作为此次回调请求的响应内容。如果回调成功，回调服务应对七牛云存储作出类似如下的响应（注意：回调响应内容由回调服务生成，以下仅作为示例）：

```
HTTP/1.1 200 OK
Server: nginx/1.1.19
Date: Thu, 19 Dec 2013 06:27:30 GMT
Content-Type: text/html
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
Pragma: no-cache


{"success":true,"name":"sunflowerb.jpg"}
```

七牛云存储将上面的回调结果返回给客户端，客户端接收到以下回应：

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Server: nginx/1.4.4
Date: Thu, 19 Dec 2013 08:04:56 GMT
Pragma: no-cache
X-Log: BDT:4;BDT:2;LBD:13;rs.put:1048;rs-upload.putFile:2514;UP.CB:3088;UP:5603
X-Reqid: iDYAAPBicOGXLUET

{"success":true,"name":"sunflowerb.jpg"}
```

如果回调失败，七牛云存储会将返回给应用客户端[HTTP状态码](/docs/v6/api/reference/codes.html)以及详细的失败信息。

<a id="callback-security"></a>
### 安全性

由于回调地址是公网可任意访问的，回调服务如何确认一次回调是合法的呢?

七牛云存储在回调时会对请求数据签名，并将结果包含在请求头Authorization字段中，示例如下：

```
 Authorization:QBox iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV:tDK-3f5xF3SJYEAwsll5g=
```

其中`QBox `为固定值，`iN7Ngw...dCV`为用户的Accesskey,`tDK-3f...5g=`为签名结果(encoded_data)

回调服务器可以通过以下方法验证其合法性：

- 获取AUTHORIZATION字段值中的签名结果部分encoded_data    

- 根据Accesskey选取正确的SecretKey

- 获取明文：data = Request.URL.Path +"\n" +Request.Body
    - 部分语言或框架无法直接获取请求body的原始数据，在自行拼接时应当注意，body中的数据是经过[URL编码][urlescapeHref]的

- 采用HMAC-SHA1签名算法，对明文data签名，秘钥为SecretKey，比较签名结果是否与Authorization中的encoded_data字段相同，如相同则表明这是一个合法的回调请求

以PHP语言为示例，验证代码如下：

``` php
/**
*C('accessKey')取得 AccessKey
*C('secretKey')取得 SecretKey  
*callback.php 为回调地址的Path部分  
*file_get_contents('php://input')获取RequestBody,其值形如:  
*name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm-RlQx_4O2\
*&location=Shanghai&price=1500.00&uid=123
*/
function IsQiniuCallback(){
	$authstr = $_SERVER['HTTP_AUTHORIZATION'];
	if(strpos($authstr,"QBox ")!=0){
		return false;
	}
	$auth = explode(":",substr($authstr,5));
	if(sizeof($auth)!=2||$auth[0]!=C('accessKey')){
		return false;
	}
	$data = "/callback.php\n".file_get_contents('php://input');
	return URLSafeBase64Encode(hash_hmac('sha1',$data,C("secretKey"), true)) == $auth[1];
}
```

注意：如果回调数据包含用户的敏感数据，建议回调地址使用HTTPS协议

[urlescapeHref]:            http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81

<a id="FAQ"></a>
### 常见问题

#### 本地调试问题 ####

 利用本地服务的调试工具：

- [ngrok](https://ngrok.com)
- [Runscope](https://www.runscope.com)


<a id="persistent-op"></a>
## 异步数据处理

在生成上传凭证时，开发者可以通过在[上传策略（PutPolicy）](/docs/v6/api/reference/security/put-policy.html)中指定`persistentOp`和`persistentNotifyUrl`字段来设置异步数据处理动作。当资源上传完成后，设置的数据处理动作就会被以异步方式启动。七牛云存储将立刻将响应内容返回给客户端，并不会等待数据处理动作完成。

关于数据处理结果持久化相关的详细内容，请参见[处理结果持久化](/docs/v6/api/overview/fop/fop/persistent-fop.html)中的相关描述。