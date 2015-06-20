---
layout: docs
title: 图片鉴黄服务
order: 300
---

<a id="nrop"></a>
# 图片鉴黄服务(nrop)

<a id="nrop-description"></a>
## 描述

图片鉴黄服务(`nrop`)能够帮您有效判断保存在七牛云的图片是属于色情、性感还是正常。根据该服务提供商的评测结果显示，鉴别的准确度超过99.5%，可以替代80%以上的人工审核，并且机器可以通过不断学习提高鉴别的准确度。若您需要对存储在七牛云的图片进行审核过滤，那么本服务是非常简单高效的解决方案。

本服务由`广州图普网络科技有限公司`（以下简称`图普科技`）提供。启用服务后，您存储在七牛云空间的文件将被提供给`图普科技`以供其计算使用。七牛不能保证鉴别结果的正确性，请您自行评估后选择是否启用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="nrop-open"></a>
## 如何开启

进入`https://portal.qiniu.com/service/market`, 找到鉴黄服务点击开始使用。

<a id="nrop-request"></a>
## 请求

<a id="nrop-request-syntax"></a>
### 请求报文格式

```
GET <DownloadURI>?nrop HTTP/1.1
Host: <DownloadHost>
```

<a id="nrop-request-header"></a>
### 请求头部

头部名称         | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定](http://kb.qiniu.com/53a48154 "域名绑定")

---

<a id="nrop-response"></a>
## 响应

<a id="nrop-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    // ...nrop data...
}
```

<a id="nrop-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="nrop-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
	"code": "<ResultCode         int>",
	"message": "<ResultMessage   string>",
	"fileList": [
		{
			"rate": <Rate        float>,
			"label": <Category   int>,
			"name": "<FileName   string>",
			"review": <Review    boolean>
		}
	],
	"statistic": [
		<Statistics              int>,
		...
	],
	"reviewCount": <ReviewCount  int>,
	"nonce": "<Nonce             string>",
	"timestamp": "<Timestamp     string>"
}
```

字段名称        | 必填 | 说明                              
:------------ | :--- | :--------------------------------------------------------------------
`code`        | 是   | 处理状态(0：调用成功; 1：授权失败； 2：模型ID错误； 3：没有上传文件； 4：API版本号错误； 5：API版本已弃用； 6：secretId 错误； 7：任务Id错误，您的secretId不能调用该任务； 8：secretId状态异常； 9：尚未上传证书； 100：服务器错误； 101：未知错误)
`message`     | 是   | 与`code`对应的状态描述信息
`rate`        | 是   | 介于0-1间的浮点数，表示该图像被识别为某个分类的概率值，概率越高、机器越肯定；您可以根据您的需求确定需要人工复审的界限。
`label`       | 是   | 介于0-2间的整数，表示该图像被机器判定为哪个分类，分别对应： 0：色情； 1：性感； 2：正常；
`review`      | 是   | 是否需要人工复审该图片，鉴黄服务是否对结果确定(true：不确定，false：确定)

■ 如果请求失败，请参考以上`code`和`message`字段的说明。

■ 更多参数请参考[鉴黄服务接口协议](http://kb.qiniu.com/5qwcwawm "鉴黄服务接口协议")

<a id="nrop-samples"></a>
## 示例

在Web浏览器中输入以下图片地址：  

```
http://qiniuphotos.qiniudn.com/gogopher.jpg?nrop
```

返回结果（内容经过格式化以便阅读）  

```
{
	"code": 0,
	"message": "succeed.",
	"fileList": [
		{
			"rate": 0.9558794498443604,
			"label": 2,
			"name": "czfh1cATkoExQ_AMVyg1zw==.resize",
			"review": false
		}
	],
	"statistic": [
		0,
		0,
		1
	],
	"reviewCount": 0,
	"nonce": "0.31666339887306094",
	"timestamp": "Wed, 06 May 2015 07:42:27 GMT"
}
```

<a id="nrop-price"></a>
## 服务价格

|                 | 确定部分      | 不确定部分       |
:---------------- | :------------ | :------------ |
|      范围（张）   | 单价（元/百张） | 单价（元/百张）  |
| 0 - 300万        |     0.25     |    0.0625     |
| 300万 - 1500万   |     0.23     |   0.0575       |
| 1500万 - 3000万  |     0.21     |    0.0525      |
| > 3000万         |     0.18     |    0.045      |

说明：

 * 确定部分：准确度超过人工，无需review(返回数据中review为false)
 * 不确定部分：需要人工review，但根据返回的参考值排序可以大大降低工作量(返回数据中review为true)

<a id="nrop-pirce-example"></a>
## 计费示例

某公司2015年5月使用七牛图片鉴黄服务，共发起500万次鉴黄请求，其中结果确定的次数为480万次，结果不确定的次数为20万次，则当月使七牛鉴黄服务产生的费用为：

确定的结果产生费用：0.25元/百次 * 300万次 + 0.23元/百次 * (480万次 - 300万次) = 7500元 + 4140元 = 11640元

不确定的结果产生费用：0.0625元/百次 * 20万次 = 125元

总计费用：11640元 + 125元 = 11765元
