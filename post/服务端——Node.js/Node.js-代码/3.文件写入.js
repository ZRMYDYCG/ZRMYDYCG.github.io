/**
* 新建一个文件：座右铭.txt，写入内容，三人行，则必有我师焉
**/
// require 是 Node.js 环境中的 '全局' 变量，用来导入模块

// 1. 异步写入

const fs = require('fs')

// 将【三人行，则必有我师焉。】写入当前文件夹下的【座右铭.txt】文件中
fs.writeFile('./座右铭.txt', '三人行，则必有我师焉', err => {
    // 如果写入失败，则回调函数调用时，会传入错误对象，如写入成功，会传入 null
    if (err) {
        console.log('写入失败')
        return
    }
    console.log('写入成功')
})

// 2. 同步写入

fs.writeFileSync('./data.txt', 'test')



