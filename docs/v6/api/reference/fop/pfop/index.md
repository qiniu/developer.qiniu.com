---
layout: docs
title: 持久化处理
order: 180
---

<a id="pfop"></a>
# 持久化处理



持久化处理是一组经过缜密设计的接口功能，用于将计算密集型数据处理任务与访问请求分离开来，避免同步的实时计算带来高延迟。  

基本思路是在上传文件成功后立即触发异步数据处理，或为既存资源单独触发，并将结果作为资源持久地存储起来。  
接到访问请求时，直接返回已经处理好的资源即可，无须再等待计算。

持久化处理支持所有类型的数据处理规格。  
建议音视频类的资源处理任务都以本方式进行，可以极大地改善用户体验。  


本节描述对持久化处理的各个接口规格，涵盖以下内容：  

* [触发持久化处理（pfop）][pfopHref]
* [持久化处理状态查询（prefop）][prefopHref]
* [预转持久化处理（persistentOps）][persistentOpsHref]
* [持久化处理结果通知][pfopNotificationHref]

[persistentOpsHref]:        /docs/v6/api/reference/security/put-policy.html#put-policy-persistent-ops "预转持久化处理"

[pfopHref]:                 /docs/v6/api/reference/fop/pfop/pfop.html                   "触发持久化处理"
[pfopNotificationHref]:     /docs/v6/api/reference/fop/pfop/pfop.html#pfop-notification "持久化处理结果通知"
[prefopHref]:               /docs/v6/api/reference/fop/pfop/prefop.html                 "查询持久化处理状态"
