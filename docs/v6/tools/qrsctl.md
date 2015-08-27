---
layout: docs
title: qrsctl 命令行辅助工具
---

- [简介](#intro)
- [下载](#download)
- [登录](#login)
- [账号管理](#ak_sk)
    - [查看帐号信息](#info)
    - [查看密钥（AccessKey/SecretKey）](#appinfo)
- [空间管理](#bucketmgr)
    - [创建空间（Bucket）](#mkbucket2)
    - [将空间设置为公开](#set-bucket-public)
    - [将空间设置为私有](#set-bucket-private)
    - [列出所有空间（Buckets）](#buckets)
    - [查看指定空间（Bucket）信息](#bucketinfo)
    - [设置镜像存储（源站加速）](#img)
    - [取消镜像存储](#unimg)
    - [设置镜像存储回源容错属性](#imgsft)
    - [清除cdn缓存](#refresh)
- [云处理](#foper)
    - [设置API规格别名](#style)
    - [取消API规格别名](#unstyle)
    - [设置友好URL分隔符](#separator)
    - [设置源文件/原图保护](#protected)
- [文件操作](#rsmgr)
    - [上传文件](#put)
    - [下载文件](#get)
    - [查看文件](#stat)
    - [复制文件](#cp)
    - [移动文件](#mv)
    - [删除文件](#del)
- [使用技巧](#skills)


<a id="intro"></a>

## 简介

qrsctl 是根据七牛云存储API实现的一个简易命令行辅助工具。覆盖七牛云存储开发者网站包含的大部分甚至更高级的功能。开发者在对七牛云存储 API 有基本了解的情况下，此工具将会非常适用。

<a id="download"></a>

## 下载

qrsctl 命令行辅助工具下载地址：

- Mac OS: <http://devtools.qiniu.com/qiniu-devtools-darwin_amd64-current.tar.gz>
- Linux 64bits: <http://devtools.qiniu.com/qiniu-devtools-linux_amd64-current.tar.gz>
- Linux 32bits: <http://devtools.qiniu.com/qiniu-devtools-linux_386-current.tar.gz>
- Linux ARMv6: <http://devtools.qiniu.com/qiniu-devtools-linux_arm-current.tar.gz>
- Windows 32bits: <http://devtools.qiniu.com/qiniu-devtools-windows_386-current.zip>
- Windows 64bits: <http://devtools.qiniu.com/qiniu-devtools-windows_amd64-current.zip>

qrsctl 各个指令的用法可以在命令行直接输入 qrsctl 不带参数来获得。

<a id="login"></a>
## 登录

    qrsctl login <User> <Passwd>

参数    | 说明
--------|------------------------------------------------
User    | 用户名，一般为注册邮箱
Passwd  | 登录密码

用您的开发者帐号登录七牛云存储，登录成功后，才能进行接下来所有其他指令操作。

登录成功后，会话的有效期是 3600 秒（一个小时），一个小时后需要重新登录。


<a id="ak_sk"></a>

## 账号管理

<a id="info"></a>

**查看帐号信息**

    qrsctl info

返回账号信息


<a id="appinfo"></a>

**查看密钥（AccessKey/SecretKey）**

    qrsctl appinfo <AppName>


参数    | 说明
--------|------------------------------------------------
AppName | 应用名称，网站上默认使用的应用名称是：`default`

<a id="bucketmgr"></a>

## 空间管理

<a id="mkbucket2"></a>

**创建空间（Bucket）**

    qrsctl mkbucket2 <Bucket>

参数    | 说明
--------|------------------------------------------------
Bucket  | 空间名称，字母数字下划线组合。

<a id="set-bucket-public"></a>

**将空间设置为公开**

    qrsctl private <Bucket> 0

<a id="set-bucket-private"></a>

**将空间设置为私有**

    qrsctl private <Bucket> 1

<a id="buckets"></a>

**列出所有空间（Buckets）**

    qrsctl buckets

<a id="bucketinfo"></a>

**查看指定空间（Bucket）信息**

    qrsctl bucketinfo <Bucket>

<a id="img"></a>

**设置镜像存储（源站加速）**

    qrsctl img <Bucket> <SrcUrl>[,<SrcUrl2>,...] [SrcHost]

参数    | 说明
--------|------------------------------------------------
Bucket  | 指定用于托管源站资源的存储空间名称，必填。
SrcUrl  | 源站地址，必填，可设置多个。格式：`http://domain:port/` 或者 `http://ip:port/`，其中 port 可选。
SrcHost | 源站域名，可选

<a id="unimg"></a>

**取消镜像存储**

    qrsctl unimg <Bucket>


<a id="imgsft"></a>
**设置镜像存储回源容错属性**

    qrsctl imgsft <Bucket> <imgsft> 
    说明：
    1.开启该属性时，如果 url 的后缀是典型的图片、音视频文件（比如 *.jpg, *.jpeg, *.png, *.gif, *.mp3, *.mp4, etc），然后源站返回了的 mimeType 为 textml，则认为源站有可能出错，不缓存该文件。
    2.如果 url 的后缀是典型的图片、音视频文件（比如 *.jpg, *.jpeg, *.png, *.gif, *.mp3, *.mp4, etc）, 
    当返回码是200并且content-length=0的时候，不要返回200，因为客户端会缓存，改为返回 478，然后 error 是 "zero content from source"
    3.<imgsft>为0表示不启用镜像存储回源容错属性，为1表示启用镜像存储回源容错属性

<a id="refresh"></a>
**清除cdn缓存**

    qrsctl cdn/refresh <Bucket> <Url1>,<Url2>...<UrlN>

<a id="foper"></a>

## 云处理

<a id="style"></a>

**设置API规格别名**

    qrsctl style <Bucket> <aliasName> <fop>

参数      | 说明
----------|------------------------------------------------
Bucket    | 存储空间名称
aliasName | 别名名称
fop       | API规格定义，可使用 [图像处理接口](../api/reference/fop/image/index.html)、[音频 / 视频 / 流媒体处理接口](../api/reference/fop/av/index.html) 等。

友好URL访问形式：

    http://<Domain>/<Key><Sep><Name>

<a id="unstyle"></a>

**取消API规格别名**

    qrsctl unstyle <Bucket> <Name>

<a id="separator"></a>

**设置友好URL分隔符**

    qrsctl separator <Bucket> <Sep>

<a id="protected"></a>

**设置源文件/原图保护**

    qrsctl protected <Bucket> <Protected>

参数      | 说明
----------|------------------------------------------------
Protected | 可选值为 `0` 或者 `1` ，`0`表示不开启保护，`1`表示开启保护。

<a id="rsmgr"></a>

## 文件操作

<a id="put"></a>

**上传文件**

    qrsctl put <Bucket> <Key> <SrcFile>

上传一个大文件（超过 4MB）

    qrsctl put -c <Bucket> <Key> <SrcFile>

加上选项 `c`　会启用切片并行上传一个超过大文件。（超过 4MB）

<a id="get"></a>

**下载文件**

    qrsctl get <Bucket> <Key> <DestFile>

<a id="stat"></a>

**查看文件**

    qrsctl stat <Bucket> <Key>

<a id="cp"></a>

**复制文件**

将 `Bucket1` 中的 `KeySrc` 复制到 `Bucket2` 并命名为 `KeyDest`, `Bucket1` 和 `Bucket2` 可以是同一个。

    qrsctl cp <Bucket1:KeySrc> <Bucket2:KeyDest>

<a id="mv"></a>

**移动文件**

将 `Bucket1` 中的 `KeyOld` 移动到 `Bucket2` 并命名为 `KeyNew`, `Bucket1` 和 `Bucket2` 可以是同一个。

    qrsctl mv <Bucket1:KeyOld> <Bucket2:KeyNew>

<a id="del"></a>

**删除文件**

    qrsctl del <Bucket> <Key>

<a id="skills"></a>

## 使用技巧

qrsctl 遵循标准Linux工作方式，无出错则无提示，只打印必要的操作信息。  
如想知道执行过程是否出错，可以使用下列技巧：  

    qrsctl command [arguments] && echo 'OK'

如执行过程中无错误，则会在屏幕上输出`OK`字样。  
