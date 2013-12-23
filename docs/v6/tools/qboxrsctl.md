---
layout: docs
title: qboxrsctl 命令行辅助工具
---

- [简介](#intro)
- [下载](#download)
- [授传操作](#oauth)
    - [登录](#login)
- [账号管理](#ak_sk)
    - [查看帐号信息](#info)
    - [生成密钥（AccessKey/SecretKey）](#newaccess)
    - [查看密钥（AccessKey/SecretKey）](#appinfo)
    - [删除密钥（AccessKey/SecretKey）](#delaccess)
- [空间管理](#bucketmgr)
    - [创建空间（Bucket）](#mkbucket)
    - [将空间设置为公开](#set-bucket-public)
    - [将空间设置为私有](#set-bucket-private)
    - [列出所有空间（Buckets）](#buckets)
    - [查看指定空间（Bucket）信息](#bucketinfo)
    - [删除空间（Bucket）](#drop)
    - [设置镜像存储（源站加速）](#img)
    - [取消镜像存储](#unimg)
    - [清除配置缓存](#refresh)
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


<a id="intro"></a>

## 简介

qboxrsctl 是根据七牛云存储API实现的一个简易命令行辅助工具。覆盖七牛云存储开发者网站包含的大部分甚至更高级的功能。开发者在对七牛云存储 API 有基本了解的情况下，此工具将会非常适用。

<a id="download"></a>

## 下载

qboxrsctl 命令行辅助工具下载地址：

- Mac OS: <http://devtools.qiniudn.com/qiniu-devtools-darwin_amd64-current.zip>
- Linux 64bits: <http://devtools.qiniudn.com/qiniu-devtools-linux_amd64-current.zip>
- Linux 32bits: <http://devtools.qiniudn.com/qiniu-devtools-linux_386-current.zip>
- Windows 32bits: <http://devtools.qiniudn.com/qiniu-devtools-windows_386-current.zip>
- Windows 64bits: <http://devtools.qiniudn.com/qiniu-devtools-windows_amd64-current.zip>

qboxrsctl 各个指令的用法可以在命令行直接输入 qboxrsctl 不带参数来获得。

<a id="oauth"></a>

## 授权操作

<a id="login"></a>

### 登录

    qboxrsctl login <User> <Passwd>

参数    | 说明
--------|------------------------------------------------
User    | 用户名，一般为注册邮箱
Passwd  | 登录密码

用您的开发者帐号登录七牛云存储，登录成功后，才能进行接下来所有其他指令操作。

登录成功后，会话的有效期是 3600 秒（一个小时），一个小时后需要重新登录。


<a id="ak_sk"></a>

## 账号管理

<a id="info"></a>

### 查看帐号信息

    qboxrsctl info

返回账号信息

<a id="newaccess"></a>

### 生成密钥（AccessKey/SecretKey）

    qboxrsctl newaccess <AppName>

参数    | 说明
--------|------------------------------------------------
AppName | 应用名称，网站上默认创建的应用名称是：`default`

<a id="appinfo"></a>

### 查看密钥（AccessKey/SecretKey）

    qboxrsctl appinfo <AppName>


参数    | 说明
--------|------------------------------------------------
AppName | 应用名称，网站上默认使用的应用名称是：`default`

<a id="delaccess"></a>

### 删除密钥（AccessKey/SecretKey）

    qboxrsctl delaccess <AppName> <AccessKey>

参数      | 说明
----------|------------------------------------------------
AppName   | 应用名称，网站上默认使用的应用名称是：`default`
AccessKey | 指定要删除掉的 AccessKey

<a id="bucketmgr"></a>

## 空间管理

<a id="mkbucket"></a>

### 创建空间（Bucket）

    qboxrsctl mkbucket <Bucket>

参数    | 说明
--------|------------------------------------------------
Bucket  | 空间名称，字母数字下划线组合。

<a id="set-bucket-public"></a>

### 3.2 将空间设置为公开

    qboxrsctl private <Bucket> 0

<a id="set-bucket-private"></a>

### 3.3 将空间设置为私有

    qboxrsctl private <Bucket> 1

<a id="buckets"></a>

### 3.4 列出所有空间（Buckets）

    qboxrsctl buckets

<a id="bucketinfo"></a>

### 3.5 查看指定空间（Bucket）信息

    qboxrsctl bucketinfo <Bucket>

<a id="drop"></a>

### 3.6 删除空间（Bucket）

    qboxrsctl drop -f <Bucket>

<a id="img"></a>

### 3.7 设置镜像存储（源站加速）

    qboxrsctl img <Bucket> <SrcUrl>[,<SrcUrl2>,...] [SrcHost]

参数    | 说明
--------|------------------------------------------------
Bucket  | 指定用于托管源站资源的存储空间名称，必填。
SrcUrl  | 源站地址，必填，可设置多个。格式：`http://domain:port/` 或者 `http://ip:port/`，其中 port 可选。
SrcHost | 源站域名，可选

<a id="unimg"></a>

### 3.8 取消镜像存储

    qboxrsctl unimg <Bucket>

<a id="refresh"></a>

### 3.9 清除配置缓存

    qboxrsctl refresh <Bucket>

<a id="foper"></a>

## 4. 云处理

<a id="style"></a>

### 4.1 设置API规格别名

    qboxrsctl style <Bucket> <aliasName> <fop>

参数      | 说明
----------|------------------------------------------------
Bucket    | 存储空间名称
aliasName | 别名名称
fop       | API规格定义，可使用 [图像处理接口](../api/reference/fop/image/index.html)、[音频 / 视频 / 流媒体处理接口](../api/reference/fop/av/index.html) 等。

友好URL访问形式：

    http://<Domain>/<Key><Sep><Name>

<a id="unstyle"></a>

### 4.2 取消API规格别名

    qboxrsctl unstyle <Bucket> <Name>

<a id="separator"></a>

### 4.3 设置友好URL分隔符

    qboxrsctl separator <Bucket> <Sep>

<a id="protected"></a>

### 4.4 设置源文件/原图保护

    qboxrsctl protected <Bucket> <Protected>

参数      | 说明
----------|------------------------------------------------
Protected | 可选值为 `0` 或者 `1` ，`0`表示不开启保护，`1`表示开启保护。

<a id="rsmgr"></a>

## 5. 文件操作

<a id="put"></a>

### 5.1 上传文件

    qboxrsctl put <Bucket> <Key> <SrcFile>

上传一个大文件（超过 4MB）

    qboxrsctl put -c <Bucket> <Key> <SrcFile>

加上选项 `c`　会启用切片并行上传一个超过大文件。（超过 4MB） 

<a id="get"></a>

### 5.2 下载文件

    qboxrsctl get <Bucket> <Key> <DestFile>

<a id="stat"></a>

### 5.3 查看文件

    qboxrsctl stat <Bucket> <Key>

<a id="cp"></a>

### 5.4 复制文件

将 `Bucket1` 中的 `KeySrc` 复制到 `Bucket2` 并命名为 `KeyDest`, `Bucket1` 和 `Bucket2` 可以是同一个。

    qboxrsctl cp <Bucket1:KeySrc> <Bucket2:KeyDest>

<a id="mv"></a>

### 5.5 移动文件

将 `Bucket1` 中的 `KeyOld` 移动到 `Bucket2` 并命名为 `KeyNew`, `Bucket1` 和 `Bucket2` 可以是同一个。

    qboxrsctl mv <Bucket1:KeyOld> <Bucket2:KeyNew>

<a id="del"></a>

### 5.6 删除文件

    qboxrsctl del <Bucket> <Key>
