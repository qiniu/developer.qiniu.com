---
title: 视频采样缩略图（vsample）
order: 144
---

<a id="video-sample-video-sample"></a>
# 视频采样缩略图

<a id="video-sample-description"></a>
## 描述

从视频文件中截取多帧画面并按指定大小缩放成图片。  

<a id="video-sample-specification"></a>
## 接口规格

```
vsample/<Format>
       /ss/<StartTime>
       /t/<Duration>
       /s/<Resolution>
       /rotate/<Degree>
       /interval/<Interval>
       /pattern/<Pattern>
```

参数名称           | 必填 | 说明
:----------------- | :--- | :------------------------------------------------------------------
<a id="video-sample-format"></a>`<Format>`         | 是   | 输出的目标截图格式，支持jpg、png等。
<a id="video-sample-starttime"></a>`/ss/<Second>`     | 是   | 指定截取视频的开始时刻，单位：秒。
<a id="video-sample-duration"></a>`/t/<Duration>`    | 是   | 采样总时长，单位：秒。
<a id="video-sample-resolution"></a>`/s/<Resolution>`  |      | 缩略图分辨率，单位：像素（px），格式：\<Width\>x\<Height\>，宽度取值范围为1-1920，高度取值范围为1-1080。<br>默认为原始视频分辨率。
<a id="video-sample-rotate"></a>`/rotate/<Degree>` |      | 指定顺时针旋转的度数，可取值为`90`、`180`、`270`、`auto`。<br>默认为不旋转。
<a id="video-sample-interval"></a>`/interval/<Interval>` |      | 指定采样间隔，单元：秒。<br>默认为5秒。
<a id="video-sample-pattern"></a>`/pattern/<Pattern>` | 是    | 指定各张截图的资源名格式，支持如下魔法变量：<br>1. $(count) ：六个占位符的数字串，不足位的填充前导零（即`%06d`），如 `000001`。<br>注意：需要对设定值做[URL安全的Base64编码][urlsafeBase64Href]。

<a id="video-sample-request"></a>
## 请求

<a id="video-sample-request-syntax"></a>
### 请求语法

可以通过[上传预转](/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops)或者[触发持久化处理](/docs/v6/api/reference/fop/pfop/pfop.html)的方式来调用

<a id="video-sample-samples"></a>
## 示例

1. 取视频第7秒到第607秒之间，以5秒为间隔的截图（即第7秒、第12秒、第17秒……依此类推），图片格式为jpg，宽度为480px，高度为360px，文件命名模板为`vframe-$(count)`：

	[上传预转](/docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops)上传的`token`中指定`persistentOps`:

	```
	    {
	        "scope":                "qiniu-ts-demo:thinking-in-go.mp4",
	        "deadline":             1390528576,
	        "persistentOps":        "vsample/jpg/ss/7/t/600/s/480x360/pattern/dmZyYW1lLSQoY291bnQp",
	        "persistentNotifyUrl":  "http://fake.com/qiniu/notify"
	    }
	```

	[触发持久化处理](/docs/v6/api/reference/fop/pfop/pfop.html):

	```
	    POST /pfop/ HTTP/1.1
	    Host: api.qiniu.com  
	    Content-Type: application/x-www-form-urlencoded  
	    Authorization: QBox <AccessToken>  

	    bucket=qiniu-ts-demo&key=thinking-in-go.mp4&fops=vsample%2Fjpg%2Fss%2F7%2Ft%2F600%2Fs%2F480x360%2Fpattern%2FdmZyYW1lLSQoY291bnQp
	```

[sendBugReportHref]: mailto:support@qiniu.com?subject=599错误日志    "发送错误报告"
[urlsafeBase64Href]: /docs/v6/api/overview/appendix.html#urlsafe-base64 "URL安全的Base64编码"
