---
layout: docs
title: 人脸裁剪服务
order: 300
---

<a id="facecrop2"></a>
# 人脸剪裁服务

<a id="facecrop2-descrition"></a>
## 描述

人脸裁剪服务(`facecrop2`)能够帮您将保存在七牛云的图片中人脸部位裁剪出来。本服务由`Face++`提供，`FDDB` 给出了最新的人脸检测数据集基准，加入了`Face++` 人脸检测。FDDB是麻省大学阿姆赫斯特校区给出的无约束条件下的人脸检测的人脸区域数据集研究。`Face++`检测器在人脸误检数为30左右的时候就已经达到0.8的检出率，之后的表现和`Olaworks`公司给出的检测器几乎平分秋色，优于其他公司。而在连续情况下`Face++`的优势更加明显，比其检测器表现都要好。若您需要对一张图片中的人脸区域裁剪出需要的合理宽高图片，那么本服务是非常简单高效的解决方案。

启用服务后，您存储在七牛云空间的文件将被提供给`Face++`以供其计算使用。七牛不能保证裁剪结果的正确性，请您自行评估后选择是否启用。服务价格请您参考具体的价格表及计费举例，您使用本服务产生的费用由七牛代收。启用服务则表示您知晓并同意以上内容。

<a id="facecrop2-open"></a>
## 如何开启

进入`https://portal.qiniu.com/service/market`, 找到人脸剪裁服务点击开始使用。

<a id="facecrop2-request"></a>
## 请求

<a id="facecrop2-interface"></a>
### 接口规格

```
facecrop2/<width>x<height>
		 /ignore-error/<ifIgnore>

```
参数           	   | 必填  | 说明
:----------------- | :--- | :------------------------------------------
`<width>x<height>`   |  是   | 设置裁剪结果的宽高（int型），两个值必填<br>注：若裁剪的宽高范围超出原图会提示错误
`ifIgnore` 	       |      | 是否忽略出错信息，默认为false，返回错误信息；若设为1，则返回原图

<a id="facecrop2-request-syntax"></a>
### 请求报文格式

```
GET <DownloadURI>?<接口规格> HTTP/1.1 
Host: <DownloadHost> 
```

<a id="facecrop2-request-header"></a>
### 请求头部

头部名称         |  必填  | 说明
:------------- | :--- | :------------------------------------------
Host           | 是   | 下载服务器域名，可为七牛三级域名或自定义二级域名，参考[域名绑定](http://kb.qiniu.com/53a48154)

<a id="facecrop2-response"></a>
## 响应

<a id="facecrop2-response-syntax"></a>
### 响应报文格式

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
```

<a id="facecrop2-response-header"></a>
### 响应头部  

头部名称         |  必填  | 说明
:------------- | :--- | :------------------------------------------
`Content-Type`   | 是   | MIME类型，为`image/jpeg`(如果失败则是`为application/json`)

<a id="facecrop2-response-body"></a>
### 响应内容

+ 如果请求成功，返回图片的二进制数据
+ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：
```
{ 
	"error": "<ErrMsg string>"
}
```

<a id="facecrop2-example"></a>
## 示例

在Web浏览器中输入以下地址：
```
正常：
http://needkane.qiniudn.com/East.jpg?facecrop2/200x200 
出错：
http://needkane.qiniudn.com/East.jpg?facecrop2/800x200
出错但忽略错误：
http://needkane.qiniudn.com/East.jpg?facecrop2/800x200/ignore-error/1
```
<a id="sequickimage-price"></a>

## 服务价格

第一个月免费试用
