---
layout: docs
title: 创建关联账号（agency/account）
order: 750
---

<a id="agency-account"></a>
# 创建关联账号（agency/account）

<a id="agency-account-description"></a>
## 描述

七牛云存储支持为第三方账号创建互相关联的账号。  
用户登录并获得账号管理凭证后，通过本接口创建新的关联账户。  

注意：本接口需要账号具备代理模式权限。如无权限请联系七牛商务经理洽谈或拨打400电话转商务线。  

<a id="agency-account-request-syntax"></a>
### 请求语法

```
POST /v6/agency/account HTTP/1.1
Host:           api.qiniu.com
Content-Type:   application/json
Authorization:  Bearer <AccessToken>

<AgenyAccountRequestParams>
```

<a id="agency-account-request-auth"></a>
### 访问权限

[账号管理凭证](../access-token.html#oauth-token-description)。

<a id="agency-account-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------
Host          | 是   | 固定为`api.qiniu.com`，必须以**HTTPS方式**访问。
Content-Type  | 是   | 固定为`application/json`。
Authorization | 是   | 账号管理凭证。<br>该参数应严格按照账号管理凭证格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`Bearer QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="agency-account-request-params"></a>
### 请求参数

请求参数以JSON格式组织，作为请求内容提交，格式如下：  

```
{
    "vid":      "<string>",
    "email":    "<string>",
    "password": "<string>"
}
```

参数名称      | 必填 | 说明
:------------ | :--- | :-----------------------------
vid           | 是   | 关联账号在第三方帐号系统中对应的唯一ID。
email         | 是   | 关联账号的注册邮箱。
password      | 是   | 关联账号的登录密码。建议第三方将用户密码加密后作为新注册帐号的密码。

<a id="agency-account-response"></a>
## 响应

<a id="agency-account-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type:   application/json
Cache-Control:  no-store

<AgencyAccountResponseContent>
```

<a id="agency-account-response-headers"></a>
### 头部信息

头部名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
Content-Type  | 是    | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。
Cache-Control | 是    | 正常情况下该值将被设为`no-store`，表示不缓存。

<a id="agency-account-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

1. 目标账号不存在的情况：  

```
{
    "success":           true,
    "data": {
        "uid":           <int64>,
        "access_key":   "<string>",
        "secret_key":   "<string>"
    },
    "message":          "用户创建成功"
}
```

字段名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
uid           | 是    | 关联账号在七牛账号系统中的UUID，纯数字。
access_key    | 是    | 关联账号的 Access Key 。
secret_key    | 是    | 关联账号的 Secret Key 。

2. 目标账号已存在的情况：

```
{
    "success":           false,
    "data": {
        "errno":         409,
        "error":        "conflict",
        "uid":           <int64>,
        "grant_url":    "<string>"
    },
    "message":          "用户已存在"
}
```

字段名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
errno         | 是    | 状态码，本情况固定为 409 。
error         | 是    | 状态说明信息。
uid           | 是    | 关联账号在七牛账号系统中的UUID，纯数字。
grant_url     | 是    | 关联账号的帐号授权跳转的 URL 。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "success":           false,
    "data": {
        "errno":         <int64>,
        "error":        "<string>"
    },
    "message":          "发生错误"
}
```

<a id="agency-account-errors"></a>

HTTP状态码 | error                   | 说明
:--------- | :---------------------- | :-----------------
403        | forbidden               | 未授权的请求。
404        | resource dose not exist | 资源不存在。
5xx	       | internal server error   | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="agency-account-remarks"></a>
## 附注

无。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
