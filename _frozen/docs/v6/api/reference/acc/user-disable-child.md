---
layout: docs
title: 禁用子账号（user/disable_child）
order: 700
---

<a id="user-disable-child"></a>
# 禁用子账号（user/disable_child）

<a id="user-disable-child-description"></a>
## 描述

用户登录父账号后，通过本接口禁用指定子账户。  

<font style="color:red;">仅限于父账号使用。</font>

<a id="user-disable-child-request-syntax"></a>
### 请求语法

```
POST /user/disable_child HTTP/1.1
Host:           acc.qbox.me
Content-Type:   application/x-www-form-urlencoded
Authorization:  Bearer <AccessToken>

<UserDisableChildRequestParams>
```

<a id="user-disable-child-request-auth"></a>
### 访问权限

[账号管理凭证](access-token.html#oauth-token-description)。

<a id="user-disable-child-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------
Host          | 是   | 固定为`acc.qbox.me`，必须以**HTTPS方式**访问。
Content-Type  | 是   | 固定为`application/x-www-form-urlencoded`。
Authorization | 是   | 账号管理凭证。<br>该参数应严格按照账号管理凭证格式进行填充，否则会返回401错误码<p>一个合法的Authorization值应类似于：`Bearer QNJi_bYJlmO5LeY08FfoNj9w_r7...`

<a id="user-disable-child-request-params"></a>
### 请求参数

请求参数以表单形式组织，作为请求内容提交，格式如下：  

```
uid=<uid>&reason=<UrlEncodedReason>
```

参数名称      | 必填 | 需要[URL转义][urlescapeHref] | 说明
:------------ | :--- | :--------------------------- | :-----------------------------
uid           | 是   |                              | 禁用对象子账号的数字UUID。
reason        | 是   | 是                           | 禁用理由，注意七牛服务器仅保存最后一次禁用的理由。

<a id="user-disable-child-response"></a>
## 响应

<a id="user-disable-child-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type:   application/json
Cache-Control:  no-store

<UserDisableChildResponseContent>
```

<a id="user-disable-child-response-headers"></a>
### 头部信息

头部名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
Content-Type  | 是    | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。
Cache-Control | 是    | 正常情况下该值将被设为`no-store`，表示不缓存。

<a id="user-disable-child-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "userid":       "<UserId    string>",
    "uid":           <UserUuid  int64>,
    "parent_uid":   "<ParentId  int64>",
    "email":        "<UserEmail string>"
}
```

字段名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
userid        | 是    | 用户注册名，通常是注册邮箱。
uid           | 是    | 用户UUID，纯数字。
parent_uid    | 是    | 父账号的用户UUID，纯数字。
email         | 是    | 用户注册邮箱。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":                "<ErrTitle  string>",
    "error_code":            <ErrCode   int>,
    "error_description":    "<ErrMsg    string>"
}
```

<a id="user-disable-child-errors"></a>

HTTP状态码 | error_code | error                  | error_description
:--------- | :--------- | :--------------------- | :-----------------
405        | 1          | invalid_request_method | 请求方式错误，非预期的POST请求。
400        | 2          | invalid_client         | client_id, client_secret 参数无效。
400        | 3          | invalid_token          | 错误的、非预期的 AccessToken 或 RefreshToken。
400        | 4          | invalid_email          | E-Mail地址格式不正确。
400        | 5          | invalid_grant_type     | grant_type参数值错误或不在服务端所支持的列表中。
400        | 6          | invalid_without_params | 缺少相应的必要参数。
400        | 7          | invalid_empty_params   | 参数的值不能为空。
400        | 8          | invalid_bad_request    | 错误的请求。
401        | 9          | expired_token          | 提供的 AccessToken 或 RefreshToken 已过期(视具体情况而定)。
409        | 10         | record_exists          | 记录已经存在。
401        | 11         | failed_authentication  | 验证失败, 比如用户名或密码错误。
417        | 12         | failed_request         | 请求失败。
403        | 13         | unauthorized_client    | 应用未授权。
400        | 14         | record_not_found       | 记录不存在，比如email未注册等等。
401        | 15         | permission_denied      | 缺少操作权限，跟用户类型有关。

<a id="user-disable-child-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 授权成功。
4xx	       | 参考[错误消息表](#user-disable-child-errors)。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="user-disable-child-remarks"></a>
## 附注

无。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[urlescapeHref]:        http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
