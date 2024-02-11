---
title: 前端框架开发【二】邂逅Vue3开发
date: 2023-09-11 10:55:49
tags:
  - VUE 入门
categories:
  - VUE
cover: https://pic.imgdb.cn/item/65c839ff9f345e8d03c8fec9.jpg
---

## 1. 认识Vue.js

### 1.1. 认识Vue

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。

什么是渐进式框架呢？

表示我们可以在项目中一点点来引入和使用Vue，而不一定需要全部使用Vue来开发整个项目### 1.2. Vue的安装

Vue是一个JavaScript的库，刚开始我们不需要把它想象的非常复杂，我们就把它理解成一个已经帮助我们封装好的库，在项目中可以引入并且使用它即可。

那么安装和使用Vue这个JavaScript库有哪些方式呢？

- 方式一：在页面中通过CDN的方式来引入；
    
- 方式二：下载Vue的JavaScript文件，并且自己手动引入；
    
- 方式三：通过npm包管理工具安装使用它（webpack再讲）；
    
- 方式四：直接通过Vue CLI创建项目，并且使用它；

### 1.2. Vue的安装

Vue是一个JavaScript的库，刚开始我们不需要把它想象的非常复杂，我们就把它理解成一个已经帮助我们封装好的库，在项目中可以引入并且使用它即可。

那么安装和使用Vue这个JavaScript库有哪些方式呢？

- 方式一：在页面中通过CDN的方式来引入；
    
- 方式二：下载Vue的JavaScript文件，并且自己手动引入；
    
- 方式三：通过npm包管理工具安装使用它（结合webpack）；
    
- 方式四：直接通过Vue CLI创建项目，并且使用它；

#### 1.2.1. CDN方式引入

什么是CDN呢？

CDN称之为内容分发网络（**C**ontent **D**elivery **N**etwork或**C**ontent **D**istribution **N**etwork，缩写：**CDN**）

- 它是指通过相互连接的网络系统，利用最靠近每个用户的服务器；
    
- 更快、更可靠地将音乐、图片、视频、应用程序及其他文件发送给用户；
    
- 来提供高性能、可扩展性及低成本的网络内容传递给用户；

![](https://pic.imgdb.cn/item/65c5c3159f345e8d03044dbe.jpg)

常用的CDN服务器可以大致分为两种：

- 自己的CDN服务器：需要购买自己的CDN服务器，目前阿里、腾讯、亚马逊、Google等都可以购买CDN服务器；
    
- 开源的CDN服务器：国际上使用比较多的是unpkg、JSDelivr、cdnjs；

Vue 的 CDN 引入

注意：后期咱们所有的代码的 `CDN` 引入的都是 `Vue 3`，`Vue 3` 是支持 `Vue 2` 的 ，有一点不同就是 `Vue 3` 中不再支持 `Vue 2` 的挂载方式了。在 `Vue 3` 中，需要使用 `createApp` 方法来创建 `Vue` 实例，并使用 `mount` 方法将其挂载到指定的元素上

![](https://pic.imgdb.cn/item/65c5c46e9f345e8d0306f47c.jpg)

`Vue 2`

```js
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"></script>
```

`Vue 3`

```bash
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

#### 1.2.2. 两种不同的挂载方式

1. `Vue 2` 的挂载方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue 2 挂载方式示例</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <h2>{{ message }}</h2>
    </div>

    <script>
        new Vue({
            el: '#app',
            data: {
                message: 'Hello, Vue 2!'
            }
        });
    </script>
</body>
</html>
```

2. `Vue 3` 的挂载方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue 3 挂载方式示例</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <h2>{{ message }}</h2>
    </div>

    <script>
        const app = Vue.createApp({
            data() {
                return {
                    message: 'Hello, Vue 3!'
                }
            }
        });

        app.mount('#app');
    </script>
</body>
</html>
```


## 2. 声明式和命令式的区分

### 2.1 命令式

每完成一个操作，都需要通过`JavaScript`编写一条代码，来给浏览器一个指令，这样的编写代码的过程，我们称之为命令式编程：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>计数器</title>
</head>
<body>
    <div id="app">
        <h2 id="counter"></h2>
        <button id="addBtn">+1</button>
        <button id="decBtn">-1</button>
    </div>

    <script>
        const counterElement = document.getElementById('counter')
        const addBtn = document.getElementById('addBtn')
        const decBtn = document.getElementById('decBtn')

        let counter = 0

        const updateCounter = () => {
            counterElement.textContent = counter
        }

        const add = () => {
            counter++
            updateCounter()
        }

        const dec = () => {
            counter--
            updateCounter()
        }

        addBtn.addEventListener('click', add)
        decBtn.addEventListener('click', dec)
    </script>
</body>
</html>
```


### 2.2 声明式

在createApp传入的对象中声明需要的内容，模板template、数据data、方法methods，这样的编写代码的过程，我们称之为是声明式编程。

声明式之 Options API

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>计数器</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app"></div>

    <script>
      const App = {
        template: `
          <div>
            <h2>{{counter}}</h2>
            <button @click='add'>+1</button>
            <button @click='dec'>-1</button>
          </div>
        `,
        data() {
          return {
            counter: 0
          }
        },
        methods: {
          add() {
            this.counter++
          },
          dec() {
            this.counter--
          }
        }
      }

      Vue.createApp(App).mount('#app')
    </script>
  </body>
</html>
```

声明式之 Composable API

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>计数器</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app"></div>

    <script>
      const App = {
        template: `
          <div>
            <h2>{{ counter }}</h2>
            <button @click="add">+1</button>
            <button @click="dec">-1</button>
          </div>
        `,
        setup() {
          const counter = Vue.ref(0);

          const add = () => {
            counter.value++;
          }

          const dec = () => {
            counter.value--;
          }

          return {
            counter,
            add,
            dec
          }
        }
      }

      Vue.createApp(App).mount('#app')
    </script>
</body>
</html>
```


## 3. MVVM 开发模式

通常情况下，我们也经常称Vue是一个MVVM的框架。

什么是MVVM吗？

MVVM是一种软件的体系结构，是Model-View-ViewModel的简称；

![](https://pic.imgdb.cn/item/65c5c5ef9f345e8d030a00e3.jpg)

Vue官方其实有说明，Vue虽然并没有完全遵守MVVM的模型，但是整个设计是受到它的启发的。

![](https://pic.imgdb.cn/item/65c5c6479f345e8d030ac2bd.jpg)

## 4. createApp 对象参数

在使用createApp的时候，我们传入了一个对象，接下来我们详细解析一其中的一部分传入的属性。

### 4.1 template属性

template表示的是Vue需要帮助我们渲染的模板信息：

目前我们看到它里面有很多的HTML标签，这些标签会替换掉我们挂载到的元素（比如id为app的div）的innerHTML。

但是这个模板的写法有点过于 `别扭` 了，并且IDE很有可能没有任何提示，阻碍我们开发的效率。

![别扭的写法](https://pic.imgdb.cn/item/65c5cc9f9f345e8d0318d4d9.jpg)


因此，Vue提供了两种方式

方式一：

使用script标签，并且标记它的类型为 `x-template`。

```html
 <body>
	 <div id="app"></div>
	 <script type="x-template" id="my-app">    
	    <div>  
	      <h2>{{counter}}</h2>  
	      <button @click='increment'>+1</button>  
	      <button @click='decrement'>-1</button>  
	    </div>
	 </script>
	 <script>
		 const APP = {
			 data() {
				 return {
					 counter: 10
				 }
			 },
			 methods: {
				 increment() {
					 this.counter++
				 },
				 decrement() {
					 this.counter--
				 }
			 }
		 }
		Vue.createApp(APP).mount('#app')
	 </script>
 </body>
```

方式二：使用任意标签

通常使用template标签，因为不会被浏览器渲染，并为其设置id。

- template元素是一种用于保存客户端内容的机制，该内容在加载页面时不会被呈现，但随后可以在运行时使用JavaScript实例化。

```html
<body>
    <div id="app"></div>
    <template id="my-app">
      <div>
        <h2>{{ counter}}</h2>
      </div>
    </template>

    <script>
      const App = {
        template: '#my-app',
        data() {
          return {
            counter: 10,
          }
        }
      }
      // 创建应用程序, 并且挂载
      Vue.createApp(App).mount('#app');
    </script>
</body>
```

在createApp的对象中

:::details 我们需要传入的template属性值要以 `#` 开头

如果tempalte属性的值是以 `#` 开始，那么它将被用作 `querySelector`，并且使用匹配元素的 `innerHTML` 作为模板字符串。

:::

---------------------------------

### 4.2 data 属性

data 属性是传入一个函数，并且该函数需要返回一个对象：

- 在Vue2.x的时候，也可以传入一个对象（虽然官方推荐是一个函数）

- 在Vue3.x的时候，比如传入一个函数，否则就会直接在浏览器中报错

data 中返回的对象会被 Vue 的响应式系统劫持，之后对该对象的修改或者访问都会在劫持中被处理：

- 所以我们在 template 中通过 `{{counter}}` 访问 counter，可以从对象中获取到数据

- 所以我们修改 counter 的值时，template 中的  `{{counter}}` 也会发生改变

### 4.3 methods 属性

methods属性是一个对象，通常我们会在这个对象中定义很多的方法：

- 这些方法可以被绑定到 template 模板中。
    
- 在该方法中，我们可以使用this关键字来直接访问到data中返回的对象的属性。

![](https://pic.imgdb.cn/item/65c5e1359f345e8d034841a7.jpg)

### 4.4 其它属性

:::details 这里还可以定义很多其他的属性

Vue2

- `el`: 指定 Vue 实例挂载的元素，可以是 CSS 选择器字符串或 DOM 元素。
- `data`: Vue 实例的初始数据对象。
- `props`: 组件的属性列表，用于接收父组件传递的数据。
- `computed`: 计算属性对象，用于定义基于响应式数据计算的属性。
- `methods`: 方法对象，用于定义 Vue 实例的方法。
- `watch`: 监听属性对象，用于监听数据的变化。
- `template`: Vue 实例的模板字符串。
- `render`: 渲染函数，用于生成 Vue 实例的虚拟 DOM。
- `components`: 组件对象，用于注册局部组件。
- `directives`: 指令对象，用于注册局部指令。
- `filters`: 过滤器对象，用于注册局部过滤器。
- `beforeCreate`: Vue 实例创建之前调用的钩子函数。
- `created`: Vue 实例创建完成后调用的钩子函数。
- `beforeMount`: Vue 实例挂载到 DOM 之前调用的钩子函数。
- `mounted`: Vue 实例挂载到 DOM 后调用的钩子函数。
- `beforeUpdate`: Vue 实例更新之前调用的钩子函数。
- `updated`: Vue 实例更新完成后调用的钩子函数。
- `beforeDestroy`: Vue 实例销毁之前调用的钩子函数。
- `destroyed`: Vue 实例销毁完成后调用的钩子函数。

Vue3

- `data`: Vue 实例的初始数据对象。
- `props`: 组件的属性列表，用于接收父组件传递的数据。
- `computed`: 计算属性对象，用于定义基于响应式数据计算的属性。
- `methods`: 方法对象，用于定义 Vue 实例的方法。
- `watch`: 监听属性对象，用于监听数据的变化。
- `template`: Vue 实例的模板字符串。
- `render`: 渲染函数，用于生成 Vue 实例的虚拟 DOM。
- `components`: 组件对象，用于注册局部组件。
- `directives`: 指令对象，用于注册局部指令。
- `beforeCreate`: Vue 实例创建之前调用的钩子函数。
- `created`: Vue 实例创建完成后调用的钩子函数。
- `beforeMount`: Vue 实例挂载到 DOM 之前调用的钩子函数。
- `mounted`: Vue 实例挂载到 DOM 后调用的钩子函数。
- `beforeUpdate`: Vue 实例更新之前调用的钩子函数。
- `updated`: Vue 实例更新完成后调用的钩子函数。
- `beforeUnmount`: Vue 实例卸载之前调用的钩子函数。
- `unmounted`: Vue 实例卸载完成后调用的钩子函数。

:::

---------------------------------

---

## 结语

学如逆水行舟，不进则退

`2023` `09` `11`