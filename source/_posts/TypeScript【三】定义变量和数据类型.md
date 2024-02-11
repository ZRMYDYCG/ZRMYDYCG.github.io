---
title: TypeScript【三】定义变量和数据类型
date: 2023-09-08 10:34:03
tags:
  - TypeScript 入门
categories:
  - TypeScript
cover: https://pic.imgdb.cn/item/65c5af439f345e8d03dbbd4f.jpg
---

## 前言

学习如何在 TypeScript 中定义变量，以及 JavaScript 类型在 TypeScript 中的变化以及 TypeScript 中新增的类型。

## 1. 声明变量方式

### 1.1.  声明变量的格式

在 TypeScript 中定义变量需要指定 **标识符** 的类型。

所以完整的声明格式如下：

```TypeScript
var/let/const 标识符: 数据类型 = 赋值;
```

比如我们声明一个message，完整的写法如下：

```TypeScript
let message: string = "Hello World";
message = "Hello TypeScript"; // 正确的做法
message = 20; // 错误的做法，因为message是一个string类型
```

- 注意：这里的string是小写的，和String是有区别的
    
- string是 TypeScript 中定义的字符串类型，String 是 ECMAScript 中定义的一个类。

### 1.2. 声明变量的关键字

在TypeScript定义变量（标识符）和ES6之后一致，可以使用var、let、const来定义：

```TypeScript
var myname: string = "abc";
let myage: number = 20;
const myheight: number = 1.88;
```

但是，我们会发现使用var关键字会有一个警告：

:::warning
Forbidden 'var'keyword,use 'let'or 'const'instead
:::

可见，在 TypeScript 中并不建议再使用 var 关键字了，主要原因和 ES6 升级后 let 和 var 的区别是一样的，var是没有块级作用域的，会引起很多的问题。

所以，在之后的开发中，我们定义变量主要使用 let 和 const。

### 1.3. 变量的类型推断

在开发中，有时候为了方便起见我们并不会在声明每一个变量时都写上对应的数据类型，我们更希望可以通过TypeScript本身的特性帮助我们推断出对应的变量类型：


```TypeScript
let message = "Hello World";
```


上面的代码我们并没有指定类型，但是message实际上依然是一个字符串类型。

这是因为在一个变量第一次赋值时，会根据后面的赋值内容的类型，来推断出变量的类型：

上面的message就是因为后面赋值的是一个string类型，所以message虽然没有明确的说明，但是依然是一个string类型。

### 1.4. 声明 name 报错

我们在TypeScript的文件中声明一个name（很多其他的名字也会）时，会报错：

![](https://pic.imgdb.cn/item/65c4da989f345e8d032b61a5.jpg)

主要错误信息：

无法重新声明块范围变量 name

我们前面明明（明明说管我什么事）没有声明 name，但是却说我们重复声明了

- 这次是因为我们的`typescript` 将 `DOM typings` 作为全局的运行环境。
    
- 所以当我们声明 `name`时， 与 `DOM` 中的全局  `name` 属性出现了重名。

![](https://pic.imgdb.cn/item/65c4daf69f345e8d032caf0e.jpg)

如何解决这个问题呢？

- 有两种方案：去掉 DOM typings 的环境和声明模块

**方式一：删除DOM typings的环境**

但是这种办法对于我们来说并不合适，因为我们依然希望在DOM下编译我们的TypeScript代码。

**方式二：声明我们的ts文件为一个模块**

既然与全局的变量出现重名，那我们将脚本封装到模块（module）中，因为模块有属于自己的作用域，就不会和全局的产生冲突：

- 在 Typescript 中，我们可以使用ES6的export来导出一个对象，并且该文件被视为 module

```TypeScript
let name = "coderwhy";export {};
```

### 1.5. console.log报错

另外为了测试方便我们经常使用console.log来进行测试，但是使用时会报一个警告。

这个时候，我们可以配置：

`tslint.json`

```json
{
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {
        "no-console": false
    },
    "rulesDirectory": []
}
```

添加了：

```json
"rules": {
	"no-console": false
}
```


## 2. JavaScript 数据类型

### 2.1. number类型

数字类型是我们开发中经常使用的类型，TypeScript和JavaScript一样，不区分整数类型（int）和浮点型（double），统一为number类型。

```TypeScript
// 1.数字类型基本定义
let num = 100;
num = 20;
num = 6.66;
```

ES6新增了二进制和八进制的表示方法，而TypeScript也是支持二进制、八进制、十六进制的表示：

```TypeScript
// 2.其他进制表示  
num = 100; // 十进制  
num = 0b110; // 二进制  
num = 0o555; // 八进制  
num = 0xf23; // 十六进制
```

### 2.2. boolean类型

boolean类型只有两个取值：true和false，非常简单

```TypeScript
// boolean类型的表示
let flag: boolean = true;
flag = false;flag = 20 > 30;
```

### 2.3. string类型

string 类型是字符串类型，可以使用单引号或者双引号表示：

- 注意：如果打开了 TSLint，默认情况下推荐使用使用双引号

```TypeScript
// string类型表示
let message: string = "Hello World";
message = 'Hello TypeScript';
```

同时也支持ES6的模板字符串来拼接变量和字符串：

```TypeScript
const name = "why";
const age = 18;
const height = 1.88;
const info = `my name is ${name}, age is ${age}, height is ${height}`;
console.log(info);
```

### 2.4. array类型

数组类型的定义也非常简单，有两种方式：

- 但是TSLint会推荐我们使用上面这种方式

```TypeScript
const names1: string[] = ["why", "abc", "cba"];  
const names2: Array<string> = ["why", "abc", "cba"];
```

### 2.5. object类型

object对象类型可以用于描述一个对象：

```TypeScript
// object类型表示
const myinfo: object = {  
	name: "why",  
	age: 20,  
	height: 1.88
};
```

**属性是不可以访问的**

如果我们访问myinfo中的属性，会发现报错：

![](https://pic.imgdb.cn/item/65c4e2c29f345e8d034a1a33.jpg)

这是因为TypeScript并不知道某一个object类型上面就有一个name的属性。

但是如果我们让它是类型推断的写法，就可以正常的访问：

![](https://pic.imgdb.cn/item/65c4e3329f345e8d034b93d8.jpg)

还有一种方法是定义接口，TypeScript一个非常好用的特性就是接口interface。

### 2.6. symbol类型

在ES5中，如果我们是不可以在对象中添加相同的属性名称的，比如下面的做法：

```TypeScript
const person = {  
	identity: "程序员",  
	identity: "老师"
}
```

通常我们的做法是定义两个不同的属性名字：比如identity1和identity2。

但是我们也可以通过symbol来定义相同的名称，因为Symbol函数返回的是不同的值：

```TypeScript
const s1 = Symbol("identity");
const s2 = Symbol("identity");
const person = {  
	[s1]: "程序员",  
	[s2]: "老师"
};
```


### 2.7. null和undefined

在 JavaScript 中，undefined 和 null 是两个基本数据类型。

在TypeScript中，它们各自的类型也是undefined和null，也就意味着它们既是实际的值，也是自己的类型：

```TypeScript
const n: null = null;
const u: undefined = undefined;
```

## 3. TypeScript 引入的数据类型

TypeScript 在原有的 JavaScript 基础上引入了很多好用的类型：enum 枚举类型、tuple 元组类型、any 类型、void 类型、never 类型等。

### 3.1. enum 类型

#### 3.1.1. 枚举的基本定义

枚举类型在很多语言都有的类型，比如C++、Java等等，并且也非常好用，所以TypeScript引入了enum类型，让我们开发更好的方便和安全。

枚举类型通常是定义一组数据：

```TypeScript
enum Direction {
	EAST,
	WEST,
	NORTH,
	SOUTH
}

const d1 = Direction.EAST
const d2 = Direction.NORTH
```


#### 3.1.2. 枚举类型的值

枚举类型有自己的值，比如打印上面的d1和d2

```TypeScript
console.log(d1)
console.log(d2)
```

```bash
------ 控制台 ------
0
2
```

默认情况下，枚举中的数据是从0开始的，我们可以改变它的初始化值，比如下面的代码：

```TypeScript
enum Direction {  
	EAST = 10,  
	WEST,  
	NORTH,  
	SOUTH
}  
  
const d1 = Direction.EAST;  
const d2 = Direction.NORTH;  
  
console.log(d1); // 10  
console.log(d2); // 12
```

也可以全部自己来指定：

```TypeScript
enum Direction {  
	EAST = 10,  
	WEST = 20,  
	NORTH = 30,  
	SOUTH = 40
}  
  
const d1 = Direction.EAST;  
const d2 = Direction.NORTH;  
  
console.log(d1); // 10  
console.log(d2); // 30
```

我们也可以通过对应的值去获取对应的数据名称：

```TypeScript
console.log(Direction[10]); // EAST  
console.log(Direction[30]); // NORTH
```

### 3.2. tuple 类型

#### 3.2.1. tuple的基本使用

tuple是元组类型，很多语言中也有这种数据类型，比如Python、Swift等。

```TypeScript
const tInfo: [string, number, number] = ["why", 18, 1.88];  
const item1 = tInfo[0]; // why, 并且知道类型是string类型  
const item2 = tInfo[1]; // 18, 并且知道类型是number类型
```

#### 3.2.1. tuple 和数组类比

初学 tuple 会觉得它和数组非常相似

但是数组中通常会定义一组相同的数据，如果数据不同会造成类型的丢失：

```TypeScript
const aInfo: Array<string|number> = ["why", 18, 1.88];  
const itema = aInfo[0]; // why，但是并不知道itema是string类型还是number类型
```

### 3.3. any类型

在某些情况下，我们确实无法确定一个变量的类型，并且可能它会发生一些变化，这个时候我们可以使用any类型（类似于Dart语言中的dynamic类型）

```TypeScript
let a: any = "why";a = 123;a = true;const aArray: any[] = ["why", 18, 1.88];
```

### 3.4. void类型

void 类型通常用于函数没有返回值时来使用：

在 TypeScript 中函数也是有类型的

下面的函数，虽然我们没有指定它的类型，但是它会通过类型推导出来：

```TypeScript
const sum = (num1: number, num2: number) => {  
return num1 + num2;  
};  
  
// 相当于下面的写法  
const sum: (num1: number, num2: number) =>number = (num1: number, num2: number) => {  
return num1 + num2;  
};
```

![](https://pic.imgdb.cn/item/65c57f479f345e8d03872d00.jpg)

### 3.5. never类型

never类型表示一种从来不会存在的值的类型，有点绕，我们来这样理解：

如果一个函数中是一个死循环，那么这个函数会返回东西吗？不会，那么写void类型或者其他类型作为返回值类型都不合适，我们就可以使用never类型。

![](https://pic.imgdb.cn/item/65c583079f345e8d038d2564.jpg)

如果一个函数是抛出一个异常，那么这个函数是不是也没有返回值呢？这个时候我们也可以使用never类型。

![](https://pic.imgdb.cn/item/65c583639f345e8d038daf8c.jpg)


## 结语

学如逆水行舟，不进则退

---
谢谢款待

`2023` `09` `08`