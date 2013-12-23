---
layout: docs
title: 凭证算法
order: 990
---

<a id="token-algorithm"></a>
# 凭证算法

七牛云存储使用的凭证包含三种：上传凭证、下载凭证、管理凭证。这三种凭证的原始数据（我们称之为`data`）不同，但从原始数据生成相应凭证的算法则完全一致。此处详细描述该算法过程。

1. 构造凭证的原始数据

	不同凭证的原始数据非常不同。[上传凭证][uploadTokenHref]的原始数据是一个[上传策略][putPolicyHref]对应的JSON格式字符串，而[下载凭证][downloadTokenHref]和[管理凭证][accessTokenHref]的原始数据都是一个带参数的URL。
	
	请点击相应链接以查看对应凭证的原始数据规格。比如对于上传凭证而言，它的原始数据应该类似于如下的JSON字符串（不会有自动缩进和换行，已用单引号括起）：
	
	```
	'{"scope":"my-bucket:sunflower.jpg","deadline":1451491200,"returnUrl":"{\"name\":\"$(fname)\",\"size\":$(fsize),\"w\":$(imageInfo.width),\"h\":$(imageInfo.height),\"hash\":$(etag)}"}'
	```
	
2. 对原始数据进行URL安全的Base64编码
	
	各个平台上的开发库通常包含[URL安全的Base64编码][urlsafeBase64Href]函数。这个编码过程非常简单明了，关键在于开发者需要了解URL安全和URL不安全这两种方式的区别，避免调用错误的Base64编码函数。
	
	编码后的结果是一个类似如下的字符串，我们命名其为**`encoded_data`**：
	
	```
	eyJzY29wZSI6Im15LWJ1Y2tldDpzdW5mbG93ZXIuanBnIiwiZGVhZGxpbmUi
	OjE0NTE0OTEyMDAsInJldHVyblVybCI6IntcIm5hbWVcIjogJChmbmFtZSksX
	CJzaXplXCI6ICQoZnNpemUpLFwid1wiOiAkKGltYWdlSW5mby53aWR0aCksXCJ
	oXCI6ICQoaW1hZ2VJbmZvLmhlaWdodCksXCJoYXNoXCI6ICQoZXRhZyksfSJ9
	```
	
3. 对上一步生成的Base64字符串计算HMAC-SHA1签名

	这一步使用HMAC-SHA1来计算签名。计算过程中需要使用安全密钥（SecretKey）。
	
	我们称这一步的计算结果为**`signature`**。

4. 对HMAC-SHA1签名进行URL安全的Base64编码

	该步与以上第二步使用完全相同的[URL安全的Base64编码][urlsafeBase64Href]函数。这一步会得到类似于如下的结果，我们将结果命名为**`encoded_signature`**：
	
	```
	5Cr3Nrw0qkyYKfQicd_ejAdIrfs=
	```
	
以下PHP代码示范了上面的完整过程。如果希望了解其他语言的实现，请查看相应SDK的源代码（所有SDK均在[Github](https://github.com/qiniu)上完全开源）。

```
<?php

/**
 * urlsafe_base64_encode
 *
 * @desc URL安全的Base64编码
 * @param string $str
 * @return string
 */
function urlsafe_base64_encode($str){
    $find = array("+","/");
    $replace = array("-", "_");
    return str_replace($find, $replace, base64_encode($str));
}

/**
 * generate_token
 *
 * @desc 根据凭证原始数据生成凭证
 * @param string $access_key
 * @param string $secret_key
 * @param string $data
 * @return string
 */
function generate_token($access_key, $secret_key, $data){

    $digest = hash_hmac('sha1', $data, $secret_key, true);
    return $access_key.':'.urlsafe_base64_encode($digest);
}

/**
 * 测试代码
 */
$access_key = 'YOUR_ACCESS_KEY';
$secret_key = 'YOUR_SECRET_KEY';

// 组建个管理凭证的原始数据，是个带参数的URL
$url = 'http://rsf.qiniu.com/list';
$query = 'bucket=myTestBucket&marker=200&limit=100&prefix='
$url .= "?" . $query

// 生成管理凭证
$access_token = generate_token($access_key, $secret_key, $url);

var_dump($access_token);
```

[putPolicyHref]:            put-policy.html         "上传策略"
[uploadTokenHref]:          upload-token.html       "上传凭证"
[downloadTokenHref]:        download-token.html     "下载凭证"
[accessTokenHref]:          access-token.html       "管理凭证"

[urlsafeBase64Href]:        http://zh.wikipedia.org/wiki/Base64#.E5.9C.A8URL.E4.B8.AD.E7.9A.84.E5.BA.94.E7.94.A8 "URL安全的Base64编码"
