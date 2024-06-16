---
title: 基于原生js和node实现文件上传和大文件切片上传
date: 2024-06-16 19:56:58
tags: ''
---

## Axios 二次封装及前后端通信常用的数据格式

如下数据格式是在前后端通信过程中常用到的:

+ application/json:

这种格式将数据转换成JSON格式的字符串。

例如，如果有一个JavaScript对象{"name": "John", "age": 30}，它将被转换成字符串"{\"name\": \"John\", \"age\": 30}"。

这种格式通常用于API请求，其中前后端交换复杂的数据结构。

+ multipart/form-data:

这种格式将数据封装为一系列的部分（parts），每个部分可以是文本或文件。

每个部分都有自己的头部信息，包括内容类型（Content-Type）和内容长度（Content-Length）。

例如，上传文件时，文件内容会作为二进制数据包含在请求体中，同时请求体还会包含文件名和文件类型等信息。

+ application/x-www-form-urlencoded:

这种格式将数据转换成键值对的形式，并通过URL编码。

例如，表单数据name=John&age=30会被直接发送到服务器。

这种格式适合传输少量的文本数据，并且通常用于GET或POST请求。

+ Buffer:

在Node.js中，Buffer用于处理二进制数据。

当使用Buffer上传文件时，文件会被读取为二进制数据，然后作为请求的一部分发送。

Buffer通常与multipart/form-data一起使用，以支持文件上传。

每种格式都有其特定的编码方式和用途。application/json适合结构化数据的传输，multipart/form-data适合文件和二进制数据的传输，application/x-www-form-urlencoded适合简单的表单数据传输，而Buffer则用于处理二进制数据，尤其是在Node.js环境中。


如下是一个简单的二次封装:

```javascript
let instance = axios.create();
instance.defaults.baseURL = 'http://127.0.0.1:8888';
// 为该 axios 实例配置一个统一的请求头, 该 Content-Type 配置之后, 会使得该实例发出的请求都携带这个请求头, 如果使用该实例需要其它不同的请求头, 那么就可以单独配置进行覆盖即可。 
instance.defaults.headers['Content-Type'] = 'multipart/form-data';
// 本次发给服务的数据有 application/x-www-form-urlencoded、与其它请求的数据格式是有冲突的, 因此需要判断请求头, 来做对应的数据处理
instance.defaults.transformRequest = (data, headers) => {
    const contentType = headers['Content-Type'];
    // 如果请求头是 application/x-www-form-urlencoded, Qs 工具库: 将 data 数据处理成 "name=John&age=30" 格式
    if (contentType === "application/x-www-form-urlencoded") return Qs.stringify(data);
    // 否则直接发送即可
    return data;
};

// 响应拦截
instance.interceptors.response.use(response => {
    return response.data;
}, reason => {
    // 统一做失败的提示处理
    // ...
    return Promise.reject(reason)
});
```