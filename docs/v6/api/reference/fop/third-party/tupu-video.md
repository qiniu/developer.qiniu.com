---
layout: docs
title: 短视频鉴黄服务
order: 300
---

<a id="tupu-video"></a>
# 短视频鉴黄服务（tupu-video）

<a id="tupu-video-description"></a>
## 描述

短视频鉴黄服务(`tupu-video`)能够帮您有效判断保存在七牛云的视频是属于色情、性感还是正常。

本服务由`广州图普网络科技有限公司`（以下简称`图普科技`）提供。启用服务后，您存储在七牛云空间的文件将在您主动请求的情况下被提供给`图普科技`以供其计算使用。七牛不能保证鉴别结果的正确性，请您自行评估后选择是否启用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="tupu-video-open"></a>
## 如何开启

进入`https://portal.qiniu.com/service/market`, 找到短视频鉴黄服务点击开始使用。

<a id="tupu-video-request"></a>
## 请求

这里只介绍了实时请求的规格，但是考虑到如果鉴别10分钟以上的视频，转换时间会比较久，用http实时转换很容易出现超时，为达到更好的显示效果，需要使用[异步处理](http://developer.qiniu.com/docs/v6/api/overview/fop/persistent-fop.html)。

<a id="tupu-video-request-syntax"></a>
### 请求报文格式

```
GET <VideoDownloadURI>?tupu-video/nrop HTTP/1.1
Host: <VideoDownloadHost>
```


**注意：**当您下载私有空间的资源时，`VideoDownloadURI`的生成方法请参考七牛的[下载凭证][download-tokenHref]。

**示例：**
资源为`http://78re52.com1.z0.glb.clouddn.com/resource/sintel_trailer.mp4`，处理样式为`tupu-video/nrop`。

```
#构造下载URL
DownloadUrl = 'http://78re52.com1.z0.glb.clouddn.com/resource/sintel_trailer.mp4?tupu-video/nrop'
……
#最后得到
RealDownloadUrl = 'http://78re52.com1.z0.glb.clouddn.com/resource/sintel_trailer.mp4?tupu-video/nrop&e=×××&token=MY_ACCESS_KEY:×××'
```

<a id="tupu-video-request-header"></a>
### 请求头部

头部名称         | 必填 | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定](http://kb.qiniu.com/53a48154 "域名绑定")


<a id="tupu-video-response"></a>
## 响应

<a id="tupu-video-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{
    // ...tupu-video data...
}
```

<a id="tupu-video-response-header"></a>
### 响应头部

头部名称       | 必填 | 说明
:------------- | :--- | :------------------------------------------
Content-Type   | 是   | MIME类型，固定为application/json
Cache-Control  | 是   | 缓存控制，固定为no-store，不缓存

<a id="tupu-video-response-content"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    // 平均分反映一组图片的整体，示例这组图片：50.0%可能性是正常；25.53%可能性是色情；24.46%可能性是性感。
    avgScores: [
        {score: 0.5000619335640717, label: 2},   // "label:2 -> 正常"
        {score: 0.25529559658062695, label: 0},  // "label:0 -> 色情"
        {score: 0.24464247275246542, label: 1}], // "label:1 -> 性感"
 
    // 最高分反映的是某一分类图片出现时的最高分，max等于0说明没有判为该分类的图片
    // 主要用于对某一分类是否出现做监控判定，例如要监控是否是“色情视频”，那么就看：{max: n, label: 0}，
    // 假设n大于0，就说明这组视频截图出现了疑似色情图片（max越大，越确定），否则就是没有出现过色情图片
    maximums: [
        {max: 0.9999999220340654, label: 0},  // 判为色情的图片中，最高分是0.999999922，说明非常肯定出现了色情图片
        {max: 0.9999772906303406, label: 2},  // 判为正常的图片中，最高分是0.9999772906303406
        {max: 0.9784060716629028, label: 1}], // 判为性感的图片中，最高分是0.9784060716629028
 
    // 各分类出现图片数量的情况
    statistics: [
        {count: 2, label: 2},  // 判为正常的图片有2张
        {count: 1, label: 1},  // 判为性感的图片有1张
        {count: 1, label: 0}], // 判为色情的图片有1张
 
    // 最终整个视频被定性判为“色情”，因为出现了色情图片
    label: 0,
    // 对于上述label判定，是否需要人工review
    review: false,
    topN: 3,
 
    nonce: '0.809460110263899',
    timestamp: 1442636213,
    code: 0,
    message: 'success'
}
```

判定的最后结果在label、review两个字段中体现，想要更详细的分析，可以使用其他字段完成。视频鉴黄会在视频的每分钟选取10张截图来做鉴别。

■ 如果请求失败，请参考以上`code`和`message`字段的说明。

<a id="tupu-video-samples"></a>
## 示例

在Web浏览器中输入以下视频地址：  

```
http://78re52.com1.z0.glb.clouddn.com/resource/sintel_trailer.mp4?tupu-video/nrop
```

<a id="tupu-video-price"></a>
## 服务价格

以时长作为计费，0.01元/分钟，不满一分钟当做一分钟计算

<a id="tupu-video-pirce-example"></a>
## 计费示例

请求一个5分钟10秒的视频，本次请求会产生 `6*0.01 = 0.06元`的服务价格

[download-tokenHref]: http://developer.qiniu.com/docs/v6/api/reference/security/download-token.html  "下载凭证"
