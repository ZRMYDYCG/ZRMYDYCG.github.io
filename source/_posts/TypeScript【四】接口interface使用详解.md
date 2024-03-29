---
title: TypeScript【四】接口interface使用详解
date: 2023-09-09 12:30:47
tags:
  - TypeScript 入门
categories:
  - TypeScript
cover: https://pic.imgdb.cn/item/65c5af439f345e8d03dbbd4f.jpg
---

## 前言

接口是TypeScript中一个非常重要的概念，在其他很多语言中已经有了并且被大量使用。

## 1. 为什么要使用接口

### 1.1. JavaScript存在的问题

我们在JavaScript中定义一个函数，用于获取一个用户的姓名和年龄的字符串：

```JavaScript
const getUserInfo = function(user) {
	return `name: ${user.name}`, aage: ${user.age}`
}
```

正确的调用方法应该是下面的方式：

```JavaScript
getUserInfo({name: "coderwhy", age: 18})
```

但是当项目比较大，或者多人开发时，会出现错误的调用方法：

```JavaScript
// 错误的调用  
getUserInfo() // Uncaught TypeError: Cannot read property 'name' of undefined  
console.log(getUserInfo({name: "coderwhy"})) // name: coderwhy, age: undefined  
getUserInfo({name: "codewhy", height: 1.88}) // name: coderwhy, age: undefined
```

因为 JavaScript 是弱类型的语言，所以并不会对我们传入的代码进行任何的检测，但是在之前的 JavaScript 中确确实实会存在很多类似的安全隐患。

如何避免这样的问题呢？

当然是使用 TypeScript 来对代码进行重构

### 1.2. TypeScript代码重构（一）

我们可以使用TypeScript来对上面的代码进行改进：

```TypeScript
const getUserInfo = (user: {name: string, age: number}): string => {
	return `name: ${user.name} age: ${user.age}`;
};
```

正确的调用是如下的方式：

```TypeScript
getUserInfo({name: "coderwhy", age: 18});
```

如果调用者出现了错误的调用，那么TypeScript 会直接给出错误的提示信息：

```TypeScript
// 错误的调用  
getUserInfo(); // 错误信息：An argument for 'user' was not provided.  
getUserInfo({name: "coderwhy"}); // 错误信息：Property 'age' is missing in type '{ name: string; }'  
getUserInfo({name: "coderwhy", height: 1.88}); // 错误信息：类型不匹配
```


这样确实可以防止出现错误的调用，但是我们在定义函数的时候，参数的类型和函数的类型都是非常长的，代码非常**不便于阅读**。

所以，我们可以使用接口来对代码再次进行重构。

### 1.3. TypeScript 代码重构（二）

**接口重构一：参数类型使用接口定义**

我们先定义一个IUser接口：

```TypeScript
// 先定义一个接口  
interface IUser {  
	name: string;  
	age: number;  
}
```

接下来我们看一下函数如何来写：

```TypeScript
const getUserInfo = (user: IUser): string => {  
	return `name: ${user.name}, age: ${user.age}`;  
};  
  
// 正确的调用  
getUserInfo({name: "coderwhy", age: 18});  
  
// 错误的调用，其他也是一样  
getUserInfo();
```

**接口重构二：函数的类型使用接口定义（后面会详细讲解接口函数的定义）**

我们先定义两个接口：

- 第二个接口定义有一个警告，我们暂时忽略它，它的目的是如果一个函数接口只有一个方法，那么可以使用type来定义
    type IUserInfoFunc = (user: IUser) => string;

```TypeScript
interface IUser {
    name: string;
    age: number;
}

interface IUserInfoFunc {
    (user: IUser): string;
}
```

接着我们去定义函数和调用函数即可：

```TypeScript
const getUserInfo: IUserInfoFunc = (user) => {  
	return`name: ${user.name}, age: ${user.age}`;  
};  
  
// 正确的调用  
getUserInfo({name: "coderwhy", age: 18});  
  
// 错误的调用  
getUserInfo();
```

## 2. 接口的基本使用

### 2.1. 接口的定义方式

和其他很多的语言类似，TypeScript 中定义接口也是使用 interface 关键字来定义：

```TypeScript
interface IPerson {  
	name: string;  
}
```

你会发现我都在接口的前面加了一个 I，这是 tslint 要求的，否则会报一个警告

- 要不要加前缀是根据公司规范和个人习惯

```bash
interface name must start with a capitalized I
```

当然我们可以在 tslint 中关闭掉它：在 rules 中添加如下规则

```JavaScript
"interface-name" : [true, "never-prefix"]
```

### 2.2. 接口中定义方法

定义接口中不仅仅可以有属性，也可以有方法：

```TypeScript
interface Person {  
	name: string;  
	run(): void;  
	eat(): void;
}
```

如果我们有一个对象是该接口类型，那么必须包含对应的属性和方法：

```TypeScript
const p: Person = {  
	name: "why",  
	run() {    
	console.log("running");  
	},  
	eat() {    
	console.log("eating");  
	}
};
```

### 2.3. 可选属性的定义

默认情况下一个变量（对象）是对应的接口类型，那么这个变量（对象）必须实现接口中所有的属性和方法。

但是，开发中为了让接口更加的灵活，某些属性我们可能希望设计成可选的（想实现可以实现，不想实现也没有关系），这个时候就可以使用可选属性。

```TypeScript
interface Person {  
	name: string;  
	age?: number;  
	run(): void;  
	eat(): void;  
	study?(): void;
}
```

上面的代码中，我们增加了 age 属性和 study 方法，这两个都是可选的：

- 可选属性如果没有赋值，那么获取到的值是undefined；
    
- 对于可选方法，必须先进行判断，再调用，否则会报错；
    

```TypeScript
const p: Person = {  
	name: "why",  
	run() {  
	console.log("running");  
	},  
	eat() {  
	console.log("eating");  
	}
};  
  
console.log(p.age); // undefined  
p.study(); // 不能调用可能是“未定义”的对象。
```

正确的调用方式如下：

```TypeScript
if (p.study) {  
	p.study();
}
```

### 2.4. 只读属性的定义

默认情况下，接口中定义的属性可读可写：

```TypeScript
console.log(p.name);  
p.name = "流川枫";
```

如果一个属性，我们只是希望在定义的时候就定义值，之后不可以修改，那么可以在属性的前面加上一个关键字：readonly

```TypeScript
interface Person {  
	readonly name: string;  
	age?: number;  
	run(): void;  
	eat(): void;  
	study?(): void;  
}
```

当我在name前面加上readonly时，赋值语句就会报错：

```TypeScript
console.log(p.name);p.name = "流川枫"; // Cannot assign to 'name' because it is a read-only property.
```

## 3. 接口的高级使用

### 3.1. 函数类型的定义

接口不仅仅可以定义普通的对象类型，也可以定义**函数的类型**

```TypeScript
// 函数类型的定义
interface SumFunc {  
	(num1: number, num2: number): number;  
}  
  
// 定义具体的函数  
const sum: SumFunc = (num1, num2) => {  
	return num1 + num2;  
};  
  
// 调用函数  
console.log(sum(20, 30));
```

不过上面的接口中只有一个函数，TypeScript 会给我们一个建议，可以使用type来定义一个函数的类型：

```TypeScript
type SumFunc = (num1: number, num2: number) => number;
```

### 3.2. 可索引类型的定义

和使用接口描述函数的类型差不多，我们也可以使用接口来描述 **可索引类型**

- 比如一个变量可以这样访问：`a[3]`，`a["name"]`

可索引类型具有一个 **索引签名**，它描述了对象索引的类型，还有相应的索引返回值类型。

```TypeScript
// 定义可索引类型的接口  
interface RoleMap {  
	[index: number]: string;  
}  
  
// 赋值具体的值  
// 赋值方式一：  
const roleMap1: RoleMap = {  
	0: "学生",  
	1: "讲师",  
	2: "班主任",  
};  
  
// 赋值方式二：因为数组本身是可索引的值  
const roleMap2 = ["鲁班七号", "露娜", "李白"];  
  
// 取出对应的值  
console.log(roleMap1[0]); // 学生  
console.log(roleMap2[1]); // 露娜
```

上面的案例中，我们的索引签名是数字类型， TypeScript支持两种索引签名：**字符串和数字**。

我们来定义一个字符串的索引类型：

```TypeScript
interface RoleMap {  
	[name: string]: string;  
}  
  
const roleMap: RoleMap = {  
	aaa: "鲁班七号",  
	bbb: "露娜",  
	ccc: "李白",  
};  
  
console.log(roleMap.aaa);  
console.log(roleMap["aaa"]); // 警告：不推荐这样来取
```

可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型：

这是因为当使用 `number`来索引时，JavaScript 会将它转换成 `string` 然后再去索引对象。

```TypeScript
class Person {  
	private name: string = "";  
}  
  
class Student extends Person {  
	private sno: number = 0;  
}  
  
// 下面的代码会报错  
interface IndexSubject {  
	[index: number]: Person;  
	[name: string]: Student;  
}
```

代码会报如下错误：

```bash
数字索引类型“Person”不能赋给字符串索引类型“Student”。
```

修改为如下代码就可以了：

```TypeScript
interface IndexSubject {  
	[index: number]: Student;  
	[name: string]: Person;
}
```

下面的代码也会报错：

- letter 索引得到结果的类型，必须是 Person 类型或者它的子类型

```TypeScript
interface IndexSubject {  
	[index: number]: Student;  
	[name: string]: Person;  
	letter: string;
}
```

### 3.3. 接口的实现

接口除了定义某种类型规范之后，也可以和其他编程语言一样，让一个类去实现某个接口，那么这个类就必须明确去拥有这个接口中的属性和实现其方法：

```TypeScript
// 定义一个实体接口  
interface Entity {  
	title: string;  
	log(): void;  
}  
  
// 实现这样一个接口  
class Post implements Entity {
	title: string;  
	  
	constructor(title: string) {  
		this.title = title;  
	}  
	
	log(): void {
		console.log(this.title);  
	}  
}
```

**思考：我定义了一个接口，但是我在继承这个接口的类中还要写接口的实现方法，那我不如直接就在这个类中写实现方法岂不是更便捷，还省去了定义接口？这是一个初学者经常会有疑惑的地方。**

**从思考方式上，为什么需要接口?**

- 我们从生活出发理解接口
    
- 比如你去三亚/杭州旅游, 玩了一上午后饥饿难耐, 你放眼望去, 会注意什么? 饭店!!
    
- 你可能并不会太在意这家饭店叫什么名字, 但是你知道只要后面有饭店两个字, 就意味着这个地方必然有饭店的实现 – 做各种菜给你吃；
    
- 接口就好比饭店/酒店/棋牌室这些名词后面添加的附属词, 当我们看到这些附属词后就知道它们具备的功能
    

**从代码设计上，为什么需要接口?**

- 在代码设计中，接口是一种规范；
    
- 接口通常用于来定义某种规范, 类似于你必须遵守的协议, 有些语言直接就叫protocol；
    
- 站在程序角度上说接口只规定了类里必须提供的属性和方法，从而分离了规范和实现，增强了系统的可拓展性和可维护性；
    

当然，对于初次接触接口的人，还是很难理解它在实际的代码设计中的好处，这点慢慢体会，不用心急。

### 3.3. 接口的继承

和类相似，接口也是可以继承接口来提供复用性：

- 注意：继承使用extends关键字

```TypeScript
interface Barkable {  
	barking(): void;
}
interface Shakable {  
	shaking(): void;
}
interface Petable extends Barkable, Shakable {  
	eating(): void;
}
```

接口Petable继承自Barkable和Shakable，另外我们发现一个接口可以同时继承自多个接口

如果现在有一个类实现了Petable接口，那么不仅仅需要实现Petable的方法，也需要实现Petable继承自的接口中的方法：

- 注意：实现接口使用implements关键字

```TypeScript
class Dog implements Petable {  
	barking(): void {  
	console.log("汪汪叫");  
	}  
  
shaking(): void {  
	console.log("摇尾巴");  
	}  
  
eating(): void {  
	console.log("吃骨头");  
	}  
}
```

## 结语

学如逆水行舟，不进则退

---
谢谢款待

`2023` `09` `09`