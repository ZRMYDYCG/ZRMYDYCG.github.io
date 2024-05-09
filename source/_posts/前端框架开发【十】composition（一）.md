---
title: 前端框架开发【十】composition（一）
date: 2023-09-21 11:46:16
tags:
  - VUE 入门
categories:
  - VUE
cover: https://pic.imgdb.cn/item/65c839ff9f345e8d03c8fec9.jpg
---

## 一、认识Composition API

在Vue2中，我们编写组件的方式是Options API：

- Options API的一大特点就是在对应的属性中编写对应的功能模块；
    
- 比如data定义数据、methods中定义方法、computed中定义计算属性、watch中监听属性改变，也包括生命周期钩子；
    

但是这种代码有一个很大的弊端：

- 当我们实现某一个功能时，这个功能对应的代码逻辑会被拆分到各个属性中
    
- 当我们组件变得更大、更复杂时，逻辑关注点的列表就会增长，那么同一个功能的逻辑就会被拆分的很分散
    
- 尤其对于那些一开始没有编写这些组件的人来说，这个组件的代码是难以阅读和理解的（阅读组件的其他人）
    

下面我们来看一个非常大的组件，其中的逻辑功能按照颜色进行了划分：

- 这种碎片化的代码使用理解和维护这个复杂的组件变得异常困难，并且隐藏了潜在的逻辑问题
    
- 并且当我们处理单个逻辑关注点时，需要不断的 `跳转` 到响应的代码块中
    

  

如果我们能将同一个逻辑关注点相关的代码收集在一起会更好，这就是Composition API想要做的事情，以及可以帮助我们完成的事情。

那么既然知道Composition API想要帮助我们做什么事情，接下来看一下到底是怎么做呢？

- 为了开始使用Composition API，我们需要有一个可以实际使用它（编写代码）的地方
    
- 在Vue组件中，这个位置就是 `setup` 函数

## 二、setup 函数基本使用

setup其实就是组件的另外一个选项：

- 只不过这个选项强大到我们可以用它来替代之前所编写的大部分其他选项
    
- 比如methods、computed、watch、data、生命周期等等

### 2.1. setup函数的参数

我们先来研究一个setup函数的参数，它主要有两个参数：

- 第一个参数：props
    
- 第二个参数：context
    

props非常好理解，它其实就是父组件传递过来的属性会被放到props对象中，我们在setup中如果需要使用，那么就可以直接通过props参数获取。

我们来看一个ShowMessage.vue的组件：

- 这个组件接受一个message的props；
    
- 对于定义props的类型，我们还是和之前的规则是一样的，在props选项中定义；
    
- 并且在template中依然是可以正常去使用props中的message的；
    
- 如果我们在setup函数中想要使用props，那么不可以通过 `this` 去获取（后面我会讲到为什么）；
    
- 因为props有直接作为参数传递到setup函数中，所以我们可以直接通过参数来使用即可

```html
<template>  
	<div>  
		<h2>{{message}}</h2>  
	</div>  
</template>  
  
<script>  
	export default {  
		props: {  
			message: String  
		},  
		setup(props) {  
			console.log(props.message);  
		}  
	}  
</script>
```

另外一个参数是context，我们也称之为是一个SetupContext，它里面包含三个属性：

- attrs：所有的非prop的attribute
    
- slots：父组件传递过来的插槽（这个在以渲染函数返回时会有作用，后面会讲到）
    
- emit：当我们组件内部需要发出事件时会用到emit（因为我们不能访问this，所以不可以通过 `this.$emit`发出事件）
    

在App.vue中按照如下方式使用 ShowMessage.vue 组件：

```html
<template>  
	<div>  
		<show-message message="Hello World" id="why" class="kobe">  
			<template #default>  
				<span>哈哈哈</span>  
			</template>  
			<template #content>  
				<span>呵呵呵</span>  
			</template>  
		</show-message>  
	</div>  
</template>
```

我们在ShowMessage.vue中获取传递过来的内容：

```JavaScript
export default {  
	props: {  
		message: String  
	},  
	setup(props, context) {  
		console.log(props.message);  
		// 获取attrs  
		console.log(context.attrs.id, context.attrs.class);  
		console.log(context.slots.default);  
		console.log(context.slots.content);  
		console.log(context.emit);  
	}  
}
```

当然，目前我们并没有具体演示slots和emit的用法：

- slots会在render函数时使用
    
- emit会在组件内发出事件时使用

### 2.2. setup函数的返回值

setup既然是一个函数，那么它也可以有返回值，它的返回值用来做什么呢？

- setup的返回值可以在模板template中被使用
    
- 也就是说我们可以通过setup的返回值来替代data选项

```html
<template>  
	<div>  
		<h2>{{name}}</h2>  
		<h2>当前计数: {{counter}}</h2>  
	</div>  
</template>  
  
<script>  
export default {  
	props: {  
		message: String  
	},  
	setup(props, context) {  
		const name = "coderwhy";  
		let counter = 100;  
		  
		return {  
		name,  
		counter  
		}  
	}  
}  
</script>
```

甚至是我们可以返回一个执行函数来代替在methods中定义的方法：

```html
<template>  
	<div>  
		<h2>{{name}}</h2>  
		<h2>当前计数: {{counter}}</h2>  
		<button @click="increment">+1</button>  
		<button @click="decrement">-1</button>  
	</div>  
</template>  
  
<script>  
export default {  
	props: {  
		message: String  
	},  
	setup(props, context) {  
		const name = "coderwhy";  
		let counter = 100;  
		  
		const increment = () => {  
			console.log("increment");  
		}  
		const decrement = () => {  
			console.log("decrement");  
		}  
		  
		return {  
			name,  
			counter,  
			increment,  
			decrement  
		}  
	}  
}  
</script>
```

但是，如果我们将 `counter` 在 `increment` 或者 `decrement`进行操作时，是否可以实现界面的响应式呢？

- 答案是不可以
    
- 这是因为对于一个定义的变量来说，默认情况下，Vue并不会跟踪它的变化，来引擎界面的响应式操作
    

那么我们应该怎么做呢？接下来我们就学习一下setup中数据的响应式。

### 2.3. setup函数的this

官方关于this有这样一段描述（这段描述是王老师给官方提交了PR之后的一段描述）：

- 表达的含义是this并没有指向当前组件实例
    
- 并且在setup被调用之前，data、computed、methods等都没有被解析
    
- 所以无法在setup中获取this

![](https://pic.imgdb.cn/item/65cce56a9f345e8d03f25c62.jpg)

其实在之前的这段描述是和源码有出入的（王老师向官方提交了PR，做出了描述的修改）：

- 之前的描述大概含义是不可以使用this是因为组件实例还没有被创建出来
    
- 后来王老师的PR也有被合并到官方文档中

## 三、setup数据的响应式

### 3.1. reactive API

如果想为在setup中定义的数据提供响应式的特性，那么我们可以使用reactive的函数：

```html
<template>  
	<div>  
		<h2>{{state.name}}</h2>  
		<h2>当前计数: {{state.counter}}</h2>  
		<button @click="increment">+1</button>  
		<button @click="decrement">-1</button>  
	</div>  
</template>  
  
<script>  
import { reactive } from 'vue';  
  
export default {  
	setup() {  
		const state = reactive({  
			name: "coderwhy",  
			counter: 100  
		})  
		  
		const increment = () => state.counter++;  
		const decrement = () => state.counter--;  
		  
		return {  
			state,  
			increment,  
			decrement  
		}  
	}  
}  
</script>
```


也就是我们按照如下的方式在setup中使用数据，就可以让数据变成响应式的了：

```JavaScript
import { reactive } from 'vue'  
  
// 响应式状态  
const state = reactive({  
  count: 0  
})
```

那么这是什么原因呢？为什么就可以变成响应式的呢？

- 这是因为当我们使用reactive函数处理我们的数据之后，数据再次被使用时就会进行依赖收集
    
- 当数据发生改变时，所有收集到的依赖都是进行对应的响应式操作（比如更新界面）
    
- 事实上，我们编写的data选项，也是在内部交给了reactive函数将其编程响应式对象的

### 3.2. ref API

reactive API对传入的类型是有限制的，它要求我们必须传入的是一个对象或者数组类型：

- 如果我们传入一个基本数据类型（String、Number、Boolean）会报一个警告

![reactive传入基本数据类型](https://pic.imgdb.cn/item/65cd55d19f345e8d03d0817f.jpg)

这个时候Vue3给我们提供了另外一个API：ref API

- ref 会返回一个可变的额响应式对象，该对象作为一个 **响应式的引用** 维护着它内部的值，这就是ref名称的来源
    
- 它内部的值是在ref的 `value`  的属性中被维护的

接下来我们看一下Ref的API是如何使用的：

```html
<template>  
	<div>  
		<h2>{{message}}</h2>  
		<button @click="changeMessage">changeMessage</button>  
	</div>  
</template>  
  
<script>  
import { ref } from 'vue';  
  
export default {  
	setup() {  
		const message = ref("Hello World");  
		const changeMessage = () => message.value = "你好啊, 李银河";  
		  
		return {  
			message,  
			changeMessage  
			}  
		}  
}  
</script>
```

这里有两个注意事项：

- 在模板中引入ref的值时，Vue会自动帮助我们进行解包操作，所以我们并不需要在模板中通过 `ref.value` 的方式来使用
    
- 但是在 `setup` 函数内部，它依然是一个 `ref引用`， 所以对其进行操作时，我们依然需要使用 `ref.value`的方式

但是，模板中的解包是浅层的解包，如果我们的代码是下面的方式：

![深层对象不会解包](https://pic.imgdb.cn/item/65cd56819f345e8d03d1bb55.jpg)

但是，如果我们将ref放到一个reactive的属性当中，那么它会自动解包：

![reactive对象会解包](https://pic.imgdb.cn/item/65cd56b39f345e8d03d215e7.jpg)

## 四、reactive知识点补充

### 4.1 readonly

我们通过reactive或者ref可以获取到一个响应式的对象，但是某些情况下，我们传入给其他地方的这个响应式对象希望在另外一个地方被使用，但是不能被修改，这个时候如何防止这种情况的出现呢？

- Vue3为我们提供了readonly的方法；
    
- readonly会返回原生对象的只读代理（也就是它依然是一个Proxy，这是一个proxy的set方法被劫持，并且不需要对其进行修改）；
    

在开发中常见的readonly方法会传入三个类型的参数：

- 类型一：普通对象
    
- 类型二：reactive返回的对象
    
- 类型三：ref的对象
    

在readonly的使用过程中，有如下规则：

- readonly返回的对象都是不允许修改的
    
- 但是经过readonly处理的原来的对象是允许被修改的
    
比如 `const info = readonly(obj)`，info对象是不允许被修改的，当obj被修改时，readonly返回的对象也会被修改，但是我们不能去修改readonly返回的对象。

- 其实本质上就是readonly返回的对象的setter方法被劫持了而已

```html
<script>  
export default {  
	setup() {  
		// readonly通常会传入三个类型的数据  
		// 1.传入一个普通对象  
		const info = {  
			name: "why",  
			age: 18  
		}  
		const state1 = readonly(info)  
		  
		console.log(state1);  
		  
		// 2.传入reactive对象  
		const state = reactive({  
			name: "why",  
			age: 18  
		})  
		const state2 = readonly(state);  
		  
		// 3.传入ref对象  
		const nameRef = ref("why");  
		const state3 = readonly(nameRef);  
		  
		return {  
			state2,  
			changeName  
		}  
	}  
}  
</script>
```

那么这个readonly有什么用呢？

- 在我们传递给其他组件数据时，往往希望其他组件使用我们传递的内容，但是不允许它们修改时，就可以使用readonly了

![Home中修改App的info](https://pic.imgdb.cn/item/65cd63c49f345e8d03ec836c.jpg)

这个时候我们可以传递给子组件时，使用一个readonly数据：

- 子组件在修改readonly数据的时候就无法进行修改了

![传递readonly数据](https://pic.imgdb.cn/item/65cd63ef9f345e8d03ecdcb3.jpg)

### 4.2 isProxy

检查对象是否是由 `reactive` 或 `readonly`创建的 proxy。

### 4.3 isReactive

检查对象是否是由 `reactive`创建的响应式代理：

```JavaScript
import { reactive, isReactive } from 'vue'  
export default {  
  setup() {  
    const state = reactive({  
      name: 'John'  
    })  
    console.log(isReactive(state)) // -> true  
  }  
}
```

如果该代理是 `readonly` 创建的，但包裹了由 `reactive` 创建的另一个代理，它也会返回 true：

```JavaScript
import { reactive, isReactive, readonly } from 'vue'  
export default {  
  setup() {  
    const state = reactive({  
      name: 'John'  
    })  
    // 从普通对象创建的只读 proxy  
    const plain = readonly({  
      name: 'Mary'  
    })  
    console.log(isReactive(plain)) // -> false  
  
    // 从响应式 proxy 创建的只读 proxy  
    const stateCopy = readonly(state)  
    console.log(isReactive(stateCopy)) // -> true  
  }  
}
```

### 4.4 isReadonly

检查对象是否是由 `readonly` 创建的只读代理。

### 4.5 toRaw

返回 `reactive` 或 `readonly` 代理的原始对象。

- **不**建议保留对原始对象的持久引用。请谨慎使用。

```JavaScript
const info = {name: "why"}  
const reactiveInfo = reactive(info)  

console.log(toRaw(reactiveInfo) === info) // true
```

### 4.6 shallowReactive

创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (深层还是原生对象)。

```JavaScript
const state = shallowReactive({  
  foo: 1,  
  nested: {  
    bar: 2  
  }  
})  
  
// 改变 state 本身的性质是响应式的  
state.foo++  
// ...但是不转换嵌套对象  
isReactive(state.nested) // false  
state.nested.bar++ // 非响应式
```

### 4.7 shallowReadonly

创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换（深层还是可读、可写的）。

```JavaScript
const state = shallowReadonly({  
  foo: 1,  
  nested: {  
    bar: 2  
  }  
})  
  
// 改变 state 本身的 property 将失败  
state.foo++  
// ...但适用于嵌套对象  
isReadonly(state.nested) // false  
state.nested.bar++ // 可用
```

## 五、ref知识点补充

### 5.1 toRefs

如果我们使用ES6的解构语法，对reactive返回的对象进行解构获取值，那么之后无论是修改解构后的变量，还是修改reactive返回的state对象，数据都不再是响应式的：

```JavaScript
<script>  
import { ref, reactive } from 'vue';  
  
export default {  
	setup() {  
		const state = reactive({  
			name: "why",  
			age: 18  
		});  
		  
		const { name, age } = state;  
		  
		const changeName = () => state.name = "coderwhy";  
		  
		return {  
			name,  
			age,  
			changeName  
		}  
	}  
}  
</script>
```

那么有没有办法让我们解构出来的属性是响应式的呢？

- Vue为我们提供了一个toRefs的函数，可以将reactive返回的对象中的属性都转成ref
    
- 那么我们再次进行解构出来的 `name` 和 `age` 本身都是 ref的

```JavaScript
// 当我们这样来做的时候, 会返回两个ref对象, 它们是响应式的  
const { name, age } = toRefs(state);  
  
// 下面两种方式来修改name都是可以的  
const changeName = () => name.value = "coderwhy";  
const changeName = () => state.name = "coderwhy";
```

这种做法相当于已经在state.name和ref.value之间建立了 `链接`，任何一个修改都会引起另外一个变化。

### 5.2 toRef

如果我们只希望转换一个 reactive 对象中的属性为 ref，那么可以使用 toRef 的方法

```JavaScript
const name = toRef(state, 'name');   
const { age } = state;  
const changeName = () => state.name = "coderwhy";
```

### 5.3 unref

如果我们想要获取一个ref引用中的value，那么也可以通过unref方法：

- 如果参数是一个 `ref`，则返回内部值，否则返回参数本身
    
- 这是 `val = isRef(val) ? val.value : val` 的语法糖函数

```JavaScript
import { ref, unref } from 'vue';  
  
const name = ref("why");  
console.log(unref(name)); // why
```

### 5.4 isRef

判断值是否是一个 ref 对象

### 5.5 customRef

创建一个自定义的ref，并对其依赖项跟踪和更新触发进行显示控制：

- 它需要一个工厂函数，该函数接受 `track` 和 `trigger` 函数作为参数；
    
- 并且应该返回一个带有 `get` 和 `set` 的对象；
    

这里我们使用一个官方的案例：

- 对双向绑定的属性进行debounce(节流)的操作；
    

封装useDebouncedRef的工具Hook：

```JavaScript
import { customRef } from 'vue';  
  
export function useDebouncedRef(value, delay = 200) {  
  let timeout;  
  return customRef((track, trigger) => {  
    return {  
      get() {  
        track();  
        return value;  
      },  
      set(newValue) {  
        clearTimeout(timeout);  
        timeout = setTimeout(() => {  
          value = newValue;  
          trigger();  
        }, delay);  
      }  
    }  
  })  
}
```

在组件界面中使用：
```html
<template>  
	<div>  
		<input v-model="message">  
		<h2>{{message}}</h2>  
	</div>  
</template>  
  
<script>  
import { useDebouncedRef } from '../hooks/useDebounceRef';  
  
export default {  
	setup() {  
		const message = useDebouncedRef("Hello World");  
		return {  
			message  
		}  
	}  
}  
</script>
```

### 5.6 shallowRef

创建一个浅层的ref对象：

```JavaScript
const info = shallowRef({name: "why"});  
  
// 下面的修改不是响应式的  
const changeInfo = () => info.value.name = "coderwhy";
```

### 5.7 triggerRef

手动触发和 `shallowRef` 相关联的副作用：

```JavaScript
const info = shallowRef({name: "why"});  
  
// 下面的修改不是响应式的  
const changeInfo = () => {  
  info.value.name = "coderwhy"  
  // 手动触发  
  triggerRef(info);  
};
```

## 结语

学如逆水行舟，不进则退

`2023` `09` `21`