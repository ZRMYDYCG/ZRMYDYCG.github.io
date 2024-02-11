---
title: TypeScript【二】使用Webpack搭建环境
date: 2023-09-07 11:12:26
tags:
  - TypeScript 入门
categories:
  - TypeScript
cover: https://pic.imgdb.cn/item/65c5af439f345e8d03dbbd4f.jpg
---


## 前言

学习任何的开发，我们都需要对应的环境：包括TypeScript的编译环境和开发工具。

我们就来完成它们的搭建，后续就可以愉快的来写TypeScript代码了。

## 1. 环境搭建

### 1.1. TypeScript环境安装

TypeScript最终会被编译成JavaScript代码：

![](https://pic.imgdb.cn/item/65c464a09f345e8d03d51409.jpg)

那么我们必然需要对应的编译环境：

安装命令

```bash
npm install typescript -g
```

查看版本

```bash
tsc --version
```


### 1.2. tsc简单代码测试

打开VSCode，并且新建一个个文件：index.ts

index.ts 代码如下：

```typescript
// 定义一个变量
let message: string = "abc"
message = 123

// 定义一个函数
function sum(num1: number, num2: number): number {
    return num1 + num2
}

sum("abc", "cba")
```


我们会发现有两个地方都会报错：

错误一：不能将类型 “123” 分配给类型 “string”

![](https://pic.imgdb.cn/item/65c468789f345e8d03de79ae.jpg)

错误二：类型 "abc" 的参数不能赋给类型 “number” 的参数

![](https://pic.imgdb.cn/item/65c4689f9f345e8d03ded49c.jpg)

上面两个错误都是因为我们的代码已经增加了类型约束，不能随便赋值其他类型给我们的变量。

将代码修改正确如下：

```typescript
// 定义一个变量  
let message: string = "abc";  
message = "Hello World";  
  
// 定义一个函数  
function sum(num1: number, num2: number): number {  
	return num1 + num2;  
}  
  
sum(20, 30);
```

将代码编译为JavaScript的代码

```bash
tsc index.ts
```

![](https://pic.imgdb.cn/item/65c46a7b9f345e8d03e32e2d.jpg)

我们会发现，生成了一个index.js文件，并且其中的代码就是普通的JavaScript代码。

**问题：每次都这样测试会不会太麻烦了呢？**

如果每次我们写完一个TypeScript代码都需要像上面的步骤一样，一点点去完成测试就会过于麻烦，我们可以怎么做呢？

- 直接配置webpack，让webpack对我们编写的代码进行一个编译，并且自动引入编译后的js文件。
    
- 而且webpack可以在代码修改后重新帮助我们进行编译，并且自动刷新浏览器，不需要手动操作。

## 2. 项目环境

### 2.1. 项目环境的基础配置

为了之后的学习和使用方便，可以配置一个webpack的环境。

配置目的：

在环境中我们编写对应的TypeScript代码，让webpack自动帮助我们编译，并且在浏览器中查看结果。

注意：

这里需要对npm和webpack有一些简单的了解，不会非常复杂。

#### 2.1.1. 创建一个简单的项目目录结构

新建一个新的目录：LearnTypeScript，并且创建如下的目录结构

```bash
|- index.html
|- build
|  - webpack.config.js
|- src
|  - main.ts
```

目录和文件夹结构分析:

- index.html 是跑在浏览器上的模块文件
    
- build 文件夹中用于存放webpack的配置信息
    
- src 用于存放我们之后编写的所有TypeScript代码

#### 2.1.2. 使用npm管理项目的依赖

webpack 本身需要有很多的依赖，并且之后我们也需要启动 node 服务来快速浏览 index.html 模板以及编译后的 JavaScript 代码。

我们要使用 npm 来初始化 package.json 文件：

```bash
npm init -y
```

#### 2.1.3. 本地依赖 TypeScript

为什么需要本地依赖 TypeScript ?

- 因为我们之后是通过webpack进行编译我们的TypeScript代码的，并不是通过tsc来完成的。（tsc使用的是全局安装的TypeScript依赖）
- 那么webpack会在本地去查找TypeScript的依赖，所以我们是需要本地依赖TypeScript的；

安装本地TypeScript依赖

```bash
npm install typescript
```

#### 2.1.4. 初始化 tsconfig.json 文件

在进行 TypeScript 开发时，我们会针对 TypeScript 进行相关的配置，而这些配置信息是存放在一个 tsconfig.json 文件中的。

我们并不需要手动去创建它，可以通过命令行直接来生成这样的一个文件：

```bash
tsc --init
```


#### 2.1.5. 配置 tslint 来约束代码

为了按照严格的 TypeScript 风格学习代码，这里可以加入 tslint

全局安装tslint：

```bash
npm install tslint -g
```


在项目中初始化tslint的配置文件：tslint.json

```bash
tslint -i
```

### 2.2. 项目环境的Webpack

下面我们开始配置webpack相关的内容

#### 2.2.1. 安装 webpack 相关的依赖

使用 webpack 开发和打开：

需要依赖 webpack、webpack-cli、webpack-dev-server

```bash
npm install webpack webpack-cli webpack-dev-server -D
```

#### 2.2.2. 在 package.json 中添加启动命令

为了方便启动 webpack，我们在 package.json 中添加如下启动命令

```bash
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"serve": "cross-env NODE_ENV=development webpack-dev-server --mode=development --config build/webpack.config.js"
}
```

#### 2.2.3. 添加 webpack 的其他相关依赖

依赖一 ：`cross-env`

这里我们用到一个插件 `cross-env` ，这个插件的作用是可以在 webpack.config.js 中通过 `process.env.NODE_ENV` 来获取当前是开发还是生产环境，我们需要这个插件：`cross-env`

```bash
npm install cross-env -D
```

依赖二 ：`ts-loader`

因为我们需要解析.ts文件，所以需要依赖对应的loader：`ts-loader`

```bash
npm install ts-loader -D
```

依赖三 ：`html-webpack-plugin`

编译后的代码需要对应的 html 模块作为它的运行环境，所以我们需要使用 html-webpack-plugin 来将它插入到对应的模板中：

```bash
npm install html-webpack-plugin -D
```


#### 2.2.4. 配置 webpack.config.js 文件

将如下配置到webpack.config.js文件中：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "build.js"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    client: {
      logging: 'error'
    },
    compress: false,
    host: "localhost",
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
```

### 2.3. 项目环境下代码测试

下面我们就可以愉快的在main.ts中编写代码，之后只需要启动服务即可：

```TypeScript
let message: string = "Hello World"
console.log(message)
```


在终端中启动服务：


```bash
npm run serve
```

之后修改代码，直接可以看到修改后的效果，不需要手动进行任何刷新。

## 结语

学如逆水行舟，不进则退

---
谢谢款待

`2023` `09` `07`