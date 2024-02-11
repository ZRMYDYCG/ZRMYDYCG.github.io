---
title: 前端框架开发【三】VUE开发基础语法（上）
date: 2023-09-12 10:56:04
tags:
  - VUE 入门
categories:
  - VUE
cover: https://pic.imgdb.cn/item/65c839ff9f345e8d03c8fec9.jpg
---


:::details React与Vue的开发模式

React的开发模式：

- React使用的jsx，所以对应的代码都是编写的类似于js的一种语法。
    
- 之后通过Babel将jsx编译成 `React.createElement` 函数调用。

Vue也支持jsx的开发模式：

- 但是大多数情况下，使用基于HTML的模板语法。
    
- 在模板中，允许开发者以声明式的方式将DOM绑定到底层组件实例的数据。
    
- 在底层的实现中，Vue将模板编译成虚拟DOM渲染函数。

所以，对于学习Vue来说，学习模板语法是非常重要的。

:::

---------------------------------

## 1. 模板语法

### 1.1. 插值语法

#### 1.1.1. mustache 语法

如果我们希望把数据显示到模板（template）中，使用最多的语法是 “Mustache”语法 (双大括号) 的文本插值：

```html
<div>{{ message }}</div>
```

data返回的对象是有添加到Vue的响应式系统中，当data中的数据发生改变时，对应的内容也会发生更新。

```html
<body>
    <div id="app">
        <h2>{{ numberObj }}</h2>
        <button @click="change">BUTTON</button>
    </div>

    <script>
        const app = Vue.createApp({
            data() {
                return {
                    numberObj: {
                        a: 1,
                        b: 2,
                    }
                }
            },
            methods: {
                change() {
                    this.numberObj.a = 2
                }
            }
        })

        app.mount('#app');
    </script>
</body>
```

当然，Mustache中不仅仅可以是data中的属性，也可以是一个JavaScript的表达式：

```html
<body>
    <div id="app"></div>

    <template id="my-app">
      <div>
        <h2>{{ counter * 2}}</h2>
        <h2>{{ counter + 1 }}</h2>
        <h2>{{message.split(" ").reverse().join(" ")}}</h2>
        <h2>{{reverse(message)}}</h2>
        <h2>{{ a > b ? '1' : '2'}}</h2>
      </div>
    </template>

    <script>
      const App = {
        template: '#my-app',
        data() {
          return {
            message: "Welcome to vue",
            counter: 10,
            a: 1,
            b: 2
          }
        },
        methods: {
          reverse(msg) {
            return msg.split(" ").reverse().join(" ")
          }
        }
      }

      // 创建应用程序, 并且挂载
      Vue.createApp(App).mount('#app');
     </script>
</body>
```


但如下是错误的：


```html
<!-- 这是一个赋值语句, 不是表达式 -->
<h2>{{var name = "Hello"}}</h2>
<!-- 控制流的if语句也是不支持的, 可以使用三元运算符 -->
<h2>{{ if (true) { return message } }}</h2>
```

#### 1.1.2. v-once

用于指定元素或者组件只渲染一次：

当数据发生变化时，元素或者组件以及其所有的自己诶单将视为静态内容并且跳过
    
该指令可以用于性能优化

```html
<h2 v-once>当前计数: {{counter}}</h2>  
<button @click="increment">+1</button>
```

如果是子节点，也是只会渲染一次：

```html
<div v-once>  
  <h2>当前计数: {{counter}}</h2>  
  <button @click="increment">+1</button>  
</div>
```

#### 1.1.3. v-text

用于更新元素的 textContent：

```html
<span v-text="msg"></span>  

<!-- 等价于 -->  

<span>{{msg}}</span>
```

#### 1.1.4. v-html

默认情况下，如果我们展示的内容本身是 html 的，那么vue并不会对其进行特殊的解析。

如果我们希望这个内容被Vue可以解析出来，那么可以使用 v-html 来展示：

```html
<body>  
  <div id="app"></div>  
  
  <template id="my-app">  
    <div v-html='info'></div>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    const App = {  
      template: '#my-app',  
      data() {  
        return {  
          info: `<span style='color: red; font-size: 30px'>哈哈哈</span>`  
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  </script>  
</body>
```

#### 1.1.5. v-pre

v-pre用于跳过元素和它的子元素的编译过程，显示原始的Mustache标签

跳过不需要编译的节点，加快编译的速度

```html
<div v-pre>{{message}}</div>
```

#### 1.1.6. v-cloak

这个指令保持在元素上直到关联组件实例结束编译。

和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到组件实例准备完毕。

```css
[v-cloak] {  
  display: none;  
}
```

```html
<div v-cloak>  
  {{ message }}  
</div>
```

`<div>` 不会显示，直到编译结束。

#### 1.1.7. v-bind

元素除了内容之外还会有各种各样的属性。

绑定属性我们使用v-bind：

- **缩写**：`:`
    
- **预期**：`any (with argument) | Object (without argument)`
    
- **参数**：`attrOrProp (optional)`
    
- **修饰符**：
    

- `.camel` - 将 kebab-case attribute 名转换为 camelCase。
    

- **用法**：动态地绑定一个或多个 attribute，或一个组件 prop 到表达式。

##### 绑定基本属性

Mustache等语法主要是将内容插入到 `innerHTML` 中。

很多时候，元素的属性也是动态的：

比如a元素的href属性、img元素的src属性

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <div>{{message}}</div>  
    <img v-bind:src="src" alt="">  
    <!-- 语法糖写法 -->  
    <img :src="src" alt="">  
    <!-- 注意这两种写法的不同 -->  
    <img src="src" alt="">  
  
    <!-- 绑定a元素 -->  
    <a :href="href"></a>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    const App = {  
      template: '#my-app',  
      data() {  
        return {  
          message: "Hello World",  
          src: "https://avatars.githubusercontent.com/u/10335230?v=4",  
          href: "http://www.baidu.com"  
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  
  </script>
```

##### 绑定class属性

:::details 对象语法

我们可以传给 `:class` (`v-bind:class` 的简写) 一个对象，以动态地切换 class

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <!-- 1.普通的绑定方式 -->  
    <div :class="className">{{message}}</div>  
    <!-- 2.对象绑定 -->  
    <!-- 动态切换class是否加入: {类(变量): boolean(true/false)} -->  
    <div class="why" :class="{nba: true, 'james': true}"></div>  
    <!-- 案例练习 -->  
    <div :class="{'active': isActive}">哈哈哈</div>  
    <button @click="toggle">切换</button>  
    <!-- 绑定对象 -->  
    <div :class="classObj">哈哈哈</div>  
    <!-- 从methods中获取 -->  
    <div :class="getClassObj()">呵呵呵</div>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    
  const App = {  
      template: '#my-app',  
      data() {  
        return {  
          message: "Hello World",  
          className: "why",  
          nba: 'kobe',  
          isActive: false,  
          classObj: {  
            why: true,  
            kobe: true,  
            james: false  
          }  
        }  
      },  
      methods: {  
        toggle() {  
          this.isActive = !this.isActive;  
        },  
        getClassObj() {  
          return {  
            why: true,  
            kobe: true,  
            james: false  
          }  
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  
  </script>
```

:::

---------------------------------

:::details 数组语法

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <div :class="['why', nba]">哈哈哈</div>  
    <div :class="['why', nba, isActive? 'active': '']">呵呵呵</div>  
    <div :class="['why', nba, {'actvie': isActive}]">嘻嘻嘻</div>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    
  const App = {  
      template: '#my-app',  
      data() {  
        return {  
          message: "Hello World",  
          nba: 'kobe',  
          isActive: true  
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  
   </script>
```

:::

---------------------------------

##### 绑定style属性

:::details 对象语法

`:style` 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。

CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名

:::

---------------------------------

:::details 数组语法

`:style` 的数组语法可以将多个样式对象应用到同一个元素上。

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <div :style="[styleObj1, styleObj2]">{{message}}</div>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    
  const App = {  
      template: '#my-app',  
      data() {  
        return {  
          message: "Hello World",  
          size: 50,  
          styleObj1: {  
            color: 'red',   
            fontSize: '50px',   
            'background-color': 'blue'  
          },  
          styleObj2: {  
            textDecoration: 'underline',  
            fontWeight: 700  
          }   
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  
   </script>
```

:::

---------------------------------

##### 动态绑定属性

:::details 属性的名称和值都是动态的

```html
  <template id="my-app">  
    <!-- 属性的名称是动态的 -->  
    <div :[name]="value">{{message}}</div>  
  </template>
```

:::

---------------------------------

##### 绑定一个对象

:::details 对象会被拆解成各个小属性

```html
  <template id="my-app">  
    <div v-bind="info">{{message}}</div>  
  </template>
```
:::

---------------------------------

#### 1.1.8. v-on

前面我们绑定了元素的内容和属性，在前端开发中另外一个非常重要的特性就是交互。

在前端开发中，我们需要经常和用户进行各种各样的交互：

这个时候，我们就必须监听用户发生的时间，比如点击、拖拽、键盘事件等等

在Vue中如何监听事件呢？

使用v-on指令


:::details v-on 的使用

- **缩写**：`@`
    
- **预期**：`Function | Inline Statement | Object`
    
- **参数**：`event`
    
- **修饰符**：
    
	- `.stop` - 调用 `event.stopPropagation()`。
    
	- `.prevent` - 调用 `event.preventDefault()`。
    
	- `.capture` - 添加事件侦听器时使用 capture 模式。
    
	- `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
    
	- `.{keyAlias}` - 仅当事件是从特定键触发时才触发回调。
    
	- `.once` - 只触发一次回调。
    
	- `.left` - 只当点击鼠标左键时触发。
    
	- `.right` - 只当点击鼠标右键时触发。
    
	- `.middle` - 只当点击鼠标中键时触发。
    
	- `.passive` - `{ passive: true }` 模式添加侦听器
- **用法**：绑定事件监听

:::

---------------------------------

案例演练

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <div>{{message}}</div>  
    <!-- 基本使用 -->  
    <!-- 1.绑定函数 -->  
    <button v-on:click="btnClick">按钮1</button>  
    <button @click="btnClick">按钮2</button>  
    <div v-on:mousemove="mouseMove">div的区域</div>  
  
    <!-- 2.绑定对象 -->  
    <button v-on="{click: btnClick, mousemove: mouseMove}">特殊按钮3</button>  
  
    <!-- 3.内联语句 -->  
    <!-- 默认会把event对象传入 -->  
    <button @click="btn4Click">按钮4</button>  
    <!-- 内联语句传入其他属性 -->  
    <button @click="btn4Click($event, 'why')">按钮5</button>  
  
    <!-- 4.修饰符 -->  
    <div @click="divClick">  
      <button @click.stop="btnClick">按钮6</button>  
    </div>  
    <input type="text" @keyup.enter="onEnter">  
  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    const App = {  
      template: '#my-app',  
      data() {  
        return {  
          message: "Hello World"  
        }  
      },  
      methods: {  
        btnClick() {  
          console.log("按钮被点击了");  
        },  
        btn4Click(event) {  
          console.log(event);  
        },  
        btn4Click(event, message) {  
          console.log(event, message);  
        },  
        mouseMove() {  
          console.log("鼠标移动");  
        },  
        divClick() {  
          console.log("divClick");  
        },  
        onEnter(event) {  
          console.log(event.target.value);  
        }  
      }  
    }  
  
    Vue.createApp(App).mount('#app');  
  </script>
```

#### 1.1.9. 条件渲染

在某些情况下，我们需要根据当前的条件决定某些元素或组件是否渲染，这个时候我们就需要进行条件判断了。

Vue提供了下面的指令来进行条件判断：

- v-if
    
- v-else
    
- v-else-if
    
- v-show

##### v-if、v-else、v-else-if

v-if、v-else、v-else-if用于根据条件来渲染某一块的内容：

- 这些内容只有在条件为true时，才会被渲染出来。
    
- 这三个指令与JavaScript的条件语句if、else、else if类似。

```html
<!-- vue3中, template不再要求必须只有一个根元素 -->  
<template id="my-app">  
  <input type="text" v-model.number="score">  
  <h2 v-if="score > 90">优秀</h2>  
  <h2 v-else-if="score > 80">良好</h2>  
  <h2 v-else-if="score > 60">普通</h2>  
  <h2 v-else>不及格</h2>  
</template>
```

v-if的渲染原理：

- v-if是惰性的。
    
- 当条件为false时，其判断的内容完全不会被渲染或者会被销毁掉。
    
- 当条件为true时，才会真正渲染条件块中的内容。


##### template 元素

因为v-if是一个指令，所以必须将其添加到一个元素上：

- 但是如果我们希望切换的是多个元素呢？
    
- 此时我们渲染div，但是我们并不希望div这种元素被渲染；
    
- 这个时候，我们可以选择使用template；
    

template元素可以当做不可见的包裹元素，并且在v-if上使用，但是最终template不会被渲染出来：

有些类似于小程序中的 block

```html
  <template id="my-app">  
    <template v-if="showHa">  
      <h2>哈哈哈哈</h2>  
      <h2>哈哈哈哈</h2>  
      <h2>哈哈哈哈</h2>  
    </template>  
    <template v-else>  
      <h2>呵呵呵呵</h2>  
      <h2>呵呵呵呵</h2>  
      <h2>呵呵呵呵</h2>  
    </template>  
    <button @click="toggle">切换</button>  
  </template>
```


##### v-show

v-show和v-if的用法看起来是一致的：

```html
  <template id="my-app">  
    <h2 v-show="isShow">哈哈哈哈</h2>  
  </template>
```


##### v-show 和 v-if 区别

首先，在用法上的区别：

- v-show 是不支持 template。
    
- v-show 不可以和 v-else 一起使用。
    

其次，本质的区别：

- v-show元素无论是否需要显示到浏览器上，它的DOM实际都是有渲染的，只是通过CSS的display属性来进行切换。
    
- v-if当条件为false时，其对应的原生压根不会被渲染到DOM中。
    

开发中如何进行选择呢？

- 如果我们的原生需要在显示和隐藏之间频繁的切换，那么使用v-show。
    
- 如果不会频繁的发生切换，那么使用v-if。

#### 1.1.10. 列表渲染

在真实开发中，我们往往会从服务器拿到一组数据，并且需要对其进行渲染。

- 这个时候我们可以使用v-for来完成。
    
- v-for类似于JavaScript的for循环，可以用于遍历一组数据。

##### v-for 基本使用

v-for 的基本格式是 `"item in 数组"`：

- 数组通常是来自data或者prop，也可以是其他方式。
    
- item是我们给每项元素起的一个别名，这个别名可以自定来定义。

```html
  <template id="my-app">  
    <h2>电影列表</h2>  
    <ul>  
      <li v-for="item in movies">{{item}}</li>  
    </ul>  
  </template>
```

我们知道，在遍历一个数组的时候会经常需要拿到数组的索引：

- 如果我们需要索引，可以使用格式：`"(item, index) in 数组"`。
    
- 注意上面的顺序：数组元素项item是在前面的，索引项index是在后面的。

##### v-for支持类型

v-for也支持遍历对象，并且支持有一二三个参数：

- 一个参数：`"value in object"`
    
- 二个参数：`"(value, key) in object"`
    
- 三个参数：`"(value, key, index) in object"`

```html
  <template id="my-app">  
    <h2>遍历对象</h2>  
    <ul>  
      <li v-for="(value, key, index) in info">  
        {{index}} - {{key}} - {{value}}  
      </li>  
    </ul>  
  </template>
```

v-for同时也支持数字的遍历：

```html
  <template id="my-app">  
    <h2>遍历数字</h2>  
    <ul>  
		<li v-for="num in 5" :key="num">
		  {{ num }}
		</li>
    </ul>  
  </template>
```


##### template元素

类似于v-if，你可以使用 `template` 元素来循环渲染一段包含多个元素的内容：

我们使用template来对多个元素进行包裹，而不是使用div来完成

```html
  <div id="app"></div>  
  
  <template id="my-app">  
    <ul>  
      <template v-for="(value, key) in info">  
        <li>{{key}}</li>  
        <li>{{value}}</li>  
        <hr>  
      </template>  
    </ul>  
  </template>  
  
  <script src="../js/vue.js"></script>  
  <script>    
	  const App = {  
	      template: '#my-app',  
	      data() {  
	        return {  
	          info: {  
	            name: 'why',  
	            age: 18,  
	            height: 1.88  
	          }  
	        }  
	      }  
	    }  
	    Vue.createApp(App).mount('#app');  
  </script>
```


##### 数组更新检测

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

- `push()`
    
- `pop()`
    
- `shift()`
    
- `unshift()`
    
- `splice()`
    
- `sort()`
    
- `reverse()`

上面的方法会直接修改原来的数组，但是某些方法不会替换原来的数组，而是会生成新的数组，比如 `filter()`、`concat()` 和 `slice()`。

```js
const nums = [10, 21, 34, 6];  
const newNums = nums.filter(num => num % 2 === 0);  
console.log(newNums);
```

#### 1.1.11. key和diff算法

##### 认识 VNode 和 VDOM

在使用v-for进行列表渲染时，我们通常会给元素或者组件绑定一个key属性。

这个key属性有什么作用呢？

:::details 官方的解释

- key属性主要用在Vue的虚拟DOM算法，在新旧nodes对比时辨识VNodes。
    
- 如果不使用key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。
    
- 而使用key时，它会基于key的变化重新排列元素顺序，并且会移除/销毁key不存在的元素。

:::

---------------------------------

官方的解释对于初学者来说并不好理解，比如下面的问题：

- 什么是新旧nodes，什么是VNode？
    
- 没有key的时候，如何尝试修改和复用的？
    
- 有key的时候，如何基于key重新排列的？

我们先来解释一下VNode的概念：

- 因为目前我们还没有比较完整的学习组件的概念，所以目前我们先理解HTML元素创建出来的VNode。
    
- VNode的全称是Virtual Node，也就是**虚拟节点**。
    
- 事实上，无论是组件还是元素，它们最终在Vue中表示出来的都是一个个VNode。
    
- VNode的本质是一个JavaScript的对象。

举个例子

```html
<div class="title" style="font-size: 30px; color: red;">哈哈哈</div>
```

这在Vue中会被转化创建出一个VNode对象：

```JavaScript
const vnode = {  
  type: 'div',  
  props: {   
    'class': 'title',  
    style: {  
      'font-size': '30px',  
      color: 'red'  
    }  
  },  
  children: '哈哈哈'  
}
```

Vue内部在拿到VNode对象后，会对VNode进行处理，渲染成真实的DOM。

![](https://pic.imgdb.cn/item/65c5ef359f345e8d03673dd1.jpg)

如果我们不只是一个简单的div，而是有一大堆的元素，那么它们应该会形成一个VNode Tree：

```html
<div>  
  <p>  
    <i>哈哈哈哈</i>  
    <i>哈哈哈哈</i>  
  </p>  
  <span>嘻嘻嘻嘻</span>  
  <strong>呵呵呵呵</strong>  
</div>
```

![](https://pic.imgdb.cn/item/65c5ef849f345e8d0367e3b1.jpg)

这个和我们的key有什么关系呢？

##### key 作用和 diff 算法

我们先来看一个例子：

这个例子是当我点击按钮时会在中间插入一个 f

```html
<div id="app"></div>  

<template id="my-app">  
<ul>  
  <li v-for="item in letters">{{item}}</li>  
</ul>  
<button @click="insertF">insert f</button>  
</template>  

<script>    
  const App = {  
	  template: '#my-app',  
	  data() {  
		return {  
		  letters: ['a', 'b', 'c', 'd']  
		}  
	  },  
	  methods: {  
		insertF() {  
		  this.letters.splice(2, 0, 'f');  
		}  
	  }  
	}  
  
	Vue.createApp(App).mount('#app');  
</script>
```

我们可以确定的是，这次更新对于ul和button是不需要进行更新，需要更新的是我们li的列表：

- 在Vue中，对于相同父元素的子元素节点并不会重新渲染整个列表。
    
- 因为对于列表中 a、b、c、d它们都是没有变化的。
    
- 在操作真实DOM的时候，我们只需要在中间插入一个f的li即可。

那么Vue中对于列表的更新究竟是如何操作的呢？

- Vue事实上会对于有key和没有key会调用两个不同的方法。
    
- 有key，那么就使用 `patchKeyedChildren`方法。
    
- 没有key，那么就使用 `patchUnkeyedChildren`方法。

![有key和没有key的操作](https://pic.imgdb.cn/item/65c5f2449f345e8d036d83e4.jpg)

##### 没有 key 执行操作

没有key对应的源代码如下：

![patchUnkeyedChildren](https://pic.imgdb.cn/item/65c5f3789f345e8d036ff5cc.jpg)

它的过程画图就是如下的操作：

![](https://pic.imgdb.cn/item/65c5f3ed9f345e8d0370df55.jpg)

我们会发现上面的diff算法效率并不高：

- c和d来说它们事实上并不需要有任何的改动。
    
- 但是因为我们的c被f所使用了，所有后续所有的内容都要一次进行改动，并且最后进行新增。

##### 有 key 执行操作

如果有key，那么会执行什么样的操作呢？

![](https://pic.imgdb.cn/item/65c5f47c9f345e8d0371fca0.jpg)

第一步的操作是从头开始进行遍历、比较：

- a和b是一致的会继续进行比较
    
- c和f因为key不一致，所以就会break跳出循环

![](https://pic.imgdb.cn/item/65c5f4b59f345e8d03727396.jpg)

第二步的操作是从尾部开始进行遍历、比较：

![](https://pic.imgdb.cn/item/65c5f4d39f345e8d0372aecf.jpg)

第三步是如果旧节点遍历完毕，但是依然有新的节点，那么就新增节点：

![](https://pic.imgdb.cn/item/65c5f5049f345e8d03731281.jpg)

第四步是如果新的节点遍历完毕，但是依然有旧的节点，那么就移除旧节点：

![](https://pic.imgdb.cn/item/65c5f5209f345e8d03734d2d.jpg)

第五步是最特色的情况，中间还有很多未知的或者乱序的节点：

![](https://pic.imgdb.cn/item/65c5f5449f345e8d03739a71.jpg)

所以我们可以发现，Vue在进行diff算法的时候，会尽量利用我们的key来进行优化操作：

- 在没有key的时候我们的效率是非常低效的。
    
- 在进行插入或者重置顺序的时候，保持相同的key可以让diff算法更加的高效。

## 2. methods中的this

### 不能使用箭头函数

我们在methods中要使用data返回对象中的数据，那么这个this是必须有值的，并且应该可以通过this获取到data返回对象中的数据。

那么我们这个this能不能是window呢？

- 不可以是window，因为window中我们无法获取到data返回对象中的数据；
    
- 但是如果我们使用箭头函数，那么这个this就会是window了；
    

我们来看下面的代码：

- 我将increment换成了箭头函数，那么它其中的this进行打印时就是window；

```js
const App = {  
  template: "#my-app",  
  data() {  
    return {  
      counter: 0  
    }  
  },  
  methods: {  
    increment: () => {  
      // this.counter++;  
      console.log(this);  
    },  
    decrement() {  
      this.counter--;  
    }  
  }  
}
```

为什么是window呢？

- 这里涉及到箭头函数使用this的查找规则，它会在自己的上层作用域中来查找this；
    
- 最终刚好找到的是script作用域中的this，所以就是window；
    
this到底是如何查找和绑定的呢？
    
- https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA；
    
- 认真学习之后你绝对对this的绑定一清二楚；

### this到底指向什么

事实上Vue的源码当中就是对methods中的所有函数进行了遍历，并且通过bind绑定了this：

![vue3源码的this绑定过程](https://pic.imgdb.cn/item/65c60f439f345e8d03aca6e2.jpg)

---

## 结语

学如逆水行舟，不进则退

`2023` 9` `12`