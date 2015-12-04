---
layout: docs
title: 广告过滤服务
order: 300
---

<a id="ad"></a>
# 广告过滤服务（ad）

<a id="ad-description"></a>
## 描述

广告过滤服务(`ad`)能够帮您有效判断保存在七牛云的图片是否属于广告。若您需要对存储在七牛云的图片进行审核过滤，那么本服务是非常简单高效的解决方案。

本服务由`广州图普网络科技有限公司`（以下简称`图普科技`）提供。启用服务后，您存储在七牛云空间的文件将被提供给`图普科技`以供其计算使用。七牛不能保证鉴别结果的正确性，请您自行评估后选择是否启用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="ad-open"></a>
## 开启服务

进入`https://portal.qiniu.com/service/market`, 找到广告过滤服务点击开始使用。

<a id="ad-request"></a>
## 请求

<a id="ad-request-syntax"></a>
### 请求报文格式

```
GET <ImageDownloadURI>?ad HTTP/1.1
Host: <ImageDownloadHost>
```

**注意：**当您下载私有空间的资源时，`ImageDownloadURI`的生成方法请参考七牛的[下载凭证][download-tokenHref]。

**示例：**
资源为`http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg`，处理样式为`ad`。

```
#构造下载URL
DownloadUrl = 'http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg?ad'
……
#最后得到
RealDownloadUrl = 'http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg?ad&e=×××&token=MY_ACCESS_KEY:×××'
```

<a id="ad-request-header"></a>
### 请求头部

头部名称         | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[七牛自定义域名绑定流程](http://kb.qiniu.com/53a48154 "域名绑定")

<a id="ad-response"></a>
## 响应

<a id="ad-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    // ...ad data...
}
```

<a id="ad-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="ad-response-content"></a>
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
`label`       | 是   | 表示该图像被机器判定为哪个分类，分别对应：0：正常；1：二维码；2：带文字图片；
`review`      | 是   | 是否需要人工复审该图片(true：需要，false：不需要)

■ 关于“带文字图片”：目前机器识别无法理解文字内容，也就无法判定正常文字与小广告的文字，所以我们将所有带有文字的图片给您过滤出来，具体哪些是小广告哪些不是，需要您去审核区分。

■ 如果请求失败，请参考以上`code`和`message`字段的说明。

<a id="ad-samples"></a>
## 示例

在Web浏览器中输入以下图片地址：  

```
http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg?ad
```

返回结果（内容经过格式化以便阅读）  

```
{"statistic":[1,0,0],
"reviewCount":0,
"fileList":
  [{"rate":0.9999996423721313,
    "label":0,
    "name":"1449209299089_gogopher.jpg.jpg",
    "review":false}],
  "nonce":"0.6648837602697313",
  "timestamp":1449209336,
  "code":0,
  "message":"success"
}
```
<a id="ad-price"></a>
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

<a id="ad-pirce-example"></a>
## 计费示例

某公司2015年5月使用七牛广告过滤服务，共发起500万次广告过滤请求，其中结果确定的次数为480万次，结果不确定的次数为20万次，则当月使七牛广告过滤服务产生的费用为：

确定的结果产生费用：0.25元/百次 * 300万次 + 0.23元/百次 * (480万次 - 300万次) = 7500元 + 4140元 = 11640元

不确定的结果产生费用：0.0625元/百次 * 20万次 = 125元

总计费用：11640元 + 125元 = 11765元

[download-tokenHref]: http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html  "下载凭证"