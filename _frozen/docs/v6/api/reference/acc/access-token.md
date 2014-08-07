---
layout: docs
title: 获取账户管理凭证（oauth/token）
order: 900
---

<a id="oauth-token"></a>
# 获取账户管理凭证（oauth/token）

<a id="oauth-token-description"></a>
## 描述

用户在访问或管理账户前，需要先向七牛云存储申请**账户管理凭证（AccessToken，下同）**。  
该凭证的鉴权与授权采用OAuth 2.0协议的[Resource Owner Password Credentials](http://tools.ietf.org/html/draft-ietf-oauth-v2-10#section-4.1.2)方式。  

<a id="oauth-token-request-syntax"></a>
### 请求语法

```
POST /oauth2/token HTTP/1.1
Host:           acc.qbox.me
Content-Type:   application/x-www-form-urlencoded

<OAuthTokenRequestParams>
```

<a id="oauth-token-request-auth"></a>
### 访问权限

无。

<a id="oauth-token-request-headers"></a>
### 头部信息

头部名称      | 必填 | 说明
:------------ | :--- | :-----------------------------------
Host          | 是   | 固定为`acc.qbox.me`，必须以**HTTPS方式**访问。
Content-Type  | 是   | 固定为`application/x-www-form-urlencoded`。

<a id="oauth-token-request-params"></a>
### 请求参数

请求参数以表单形式组织，作为请求内容提交，格式如下：  

```
grant_type=password&username=<UrlEncodedUserEmailAddress>&password=<UrlEncodedUserPassword>
```

参数名称      | 必填 | 需要[URL转义][urlescapeHref] | 说明
:------------ | :--- | :--------------------------- | :-----------------------------
grant_type    | 是   |                              | 固定为`password`。
username      | 是   | 是                           | 用户的账户名（即注册邮箱）。
password      | 是   | 是                           | 用户的登录密码。

<a id="oauth-token-response"></a>
## 响应

<a id="oauth-token-response-syntax"></a>
### 响应语法

```
HTTP/1.1 200 OK
Content-Type:   application/json
Cache-Control:  no-store

<OAuthTokenResponseContent>
```

<a id="oauth-token-response-headers"></a>
### 头部信息

头部名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
Content-Type  | 是    | 正常情况下该值将被设为`application/json`，表示返回JSON格式的文本信息。
Cache-Control | 是    | 正常情况下该值将被设为`no-store`，表示不缓存。

<a id="oauth-token-response-body"></a>
### 响应内容

■ 如果请求成功，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "access_token":     "<AccessToken           string>",
    "expires_in":        <AccessTokenDuration   int64>,
    "refresh_token":    "<RefreshToken          string>"
}
```

字段名称      | 必填  | 说明                              
:------------ | :---- | :----------------------------------------------------------------
access_token  | 是    | 即AccessToken，用于后续调用。
expires_in    | 是    | AccessToken的有效期，单位：秒，通常为3600秒。
refresh_token | 是    | 刷新AccessToken有效期的凭证，有效期30个自然日，参考[刷新账户管理凭证](refresh-token.html)。

■ 如果请求失败，返回包含如下内容的JSON字符串（已格式化，便于阅读）：  

```
{
    "error":                "<ErrTitle  string>",
    "error_code":            <ErrCode   int>,
    "error_description":    "<ErrMsg    string>"
}
```

<a id="oauth-token-errors"></a>

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

<a id="oauth-token-response-status"></a>
### 响应状态码

HTTP状态码 | 含义
:--------- | :--------------------------
200        | 授权成功。
4xx	       | 参考[错误消息表](#oauth-token-errors)。
599	       | 服务端操作失败。<br>如遇此错误，请将完整错误信息（包括所有HTTP响应头部）[通过邮件发送][sendBugReportHref]给我们。

<a id="oauth-token-remarks"></a>
## 附注

- AccessToken的有效期通常为3600秒（即1小时），如果过期可以重新调用本接口进行授权。
    - 还可以使用[RefreshToken](refresh-token.html)进行重新授权。

[sendBugReportHref]:    mailto:support@qiniu.com?subject=599错误日志     "发送错误报告"
[urlescapeHref]:        http://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
