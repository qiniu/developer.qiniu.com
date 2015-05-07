---
layout: docs
title: 图片鉴黄服务
order: 300
---

<a id="nrop"></a>
# 图片鉴黄服务(nrop)

<a id="nrop-description"></a>
## 描述

通过图片鉴黄服务(`nrop`)能够获得您保存在七牛云存储的空间([bucket](/docs/v6/api/overview/concepts.html#bucket "空间"))中的图片是属于色情、性感还是正常，并给出判断的分数，分数越高，判断为该类别的概率越大。根据第三方服务提供商评测的结果显示，鉴别的准确度超过99.5%，可以替代80%以上的人工审核，并且可以不断学习提高准确度，是对您存储在七牛的图片审核过滤的非常简单高效的解决方案。

本服务由`广州图普网络科技有限公司`提供。

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

 * 确定部分：准确度超过人工，无需review
 * 不确定部分：需要人工review，但根据返回的参考值排序可以大大降低工作量

<a id="nrop-pirce-example"></a>
## 计费举例

某公司2015年5月使用七牛图片鉴黄服务，共发起5000万次鉴黄请求，其中结果确定的次数为4500万次，结果不确定的次数为500万次，则当月使用七牛鉴黄服务产生的费用为：

确定的结果产生费用：0.25元/百次 * 300万次 + 0.23元/百次 * (1500万次 - 300万次) + 0.21元/百次 * (3000万次 - 1500万次) + 0.18元/百次 * (4500万次 - 3000万次) = 93600元

不确定的结果产生费用：0.0625元/百次 * 300万次 + 0.0575元/百次 * (500万次-300万次) = 3025元

总计费用：93600元 + 3025元 = 96625元

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
    // ...nrop Data...
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
	"callRecordId": "<RecordId   string>",
	"APIVersion": "<ApiVersion   string>",
	"reviewCount": <ReviewCount  int>,
	"nonce": "<Nonce             string>",
	"timestamp": "<Timestamp     string>"
}
```

字段名称        | 必填 | 说明                              
:------------ | :--- | :--------------------------------------------------------------------
`code`        | 是   | 处理状态(0：调用成功; 1：授权失败； 2：模型ID错误； 3：没有上传文件； 4：API版本号错误； 5：API版本已弃用； 6：secretId 错误； 7：任务Id错误，您的secretId不能调用该任务； 8：secretId状态异常； 9：尚未上传证书； 100：服务器错误； 101：未知错误)
`message`     | 是   | 与`code`对应的状态描述信息
`fileList`    | 否   | 鉴别的图片文件列表
`rate`        | 是   | 介于0-1间的浮点数，表示该图像被识别为某个分类的概率值，概率越高、机器越肯定；您可以根据您的需求确定需要人工复审的界限。
`label`       | 是   | 介于0-3间的整数，表示该图像被机器判定为哪个分类，分别对应： 0：真人正常； 1：真人色情； 2：动画正常； 3：动画色情
`name`        | 是   | 鉴别图片文件的文件名
`review`      | 是   | 是否需要人工复审该图片
`statistic`   | 否   | 图像机器判定结果统计数组，分别对应判定为0-3的数据总量
`callRecordId`| 否   | 调用的唯一标识符，用于后续的人工复审的结果反馈
`APIVersion`  | 是   | API的版本
`reviewCount` | 否   | 需要人工复审的图片数量
`nonce`       | 是   | 随机数
`timestamp`   | 是   | 当前的服务器的Unix时间，UTC格式时间字符串

■ 如果请求失败，请参考以上`code`和`message`字段的说明。

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
	"callRecordId": "5549c5e3545c4fe833642e24",
	"APIVersion": "v1",
	"reviewCount": 0,
	"nonce": "0.31666339887306094",
	"timestamp": "Wed, 06 May 2015 07:42:27 GMT"
}
```
