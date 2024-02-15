---
layout: 前端框架开发【十一】composition（二）
title: API（二）
date: 2023-09-22 11:46:36
tags:
  - VUE 入门
categories:
  - VUE
cover: https://pic.imgdb.cn/item/65c839ff9f345e8d03c8fec9.jpg
---
## 一、computed

在前面我们讲解过计算属性computed：当我们的某些属性是依赖其他状态时，我们可以使用计算属性来处理

- 在前面的Options API中，我们是使用`computed选项`来完成。
    
- 在Composition API中，我们可以在 setup 函数中使用`computed函数`来编写一个计算属性。
    

如何使用computed函数呢？

- 方式一：接收一个getter函数，并根据 getter 的返回值返回一个不可变的响应式 ref 对象。
    
- 方式二：接收一个具有 get 和 set 方法的对象，返回一个可变的（可读写）ref 对象。

### 1.1. computed基本使用

下面我们来看看computed函数的基本使用：接收一个getter函数。

首先使用Vue CLI新建一个`01_composition_api`的Vue3项目，然后在`01_composition_api`项目的`src`目录下新建`07_computed使用`文件夹，然后在该文件夹下分别新建：`App.vue，ComputedAPI.vue`组件。

ComputedAPI.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<!-- 2.使用fullName计算属性 -->  
		<h4>{{fullName}}</h4>  
		<button @click="changeName">修改firstName</button>  
	</div>  
</template>  
  
<script>  
import { ref, computed } from 'vue';  
  
export default {  
	setup() {  
		const firstName = ref("Kobe");  
		const lastName = ref("Bryant");  
		  
		// 1.用法一: 传入一个getter函数。computed的返回值是一个ref对象  
		const fullName = computed(() => firstName.value + " " + lastName.value);  
		  
		const changeName = () => {  
			// 3.修改firstName  
			firstName.value = "James"  
		}  
		return {  
			fullName,  
			changeName  
		}  
	}  
}  
</script>
```

可以看到，我们使用了computed函数来定义了一个fullName计算属性，其中computed函数需要接收一个getter函数，我们在getter函数中对响应式的数据进行计算和返回。

App.vue根组件，代码如下所示（省略了组件注册的代码）：

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
		App组件  
		<ComputedAPI></ComputedAPI>  
	</div>  
</template>  
.....
```

然后我们修改main.js程序入口文件，将导入的App组件改为`07_computed使用/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-16所示。计算属性可以正常显示，当点击修改firstName按钮时也可以响应式刷新页面。

![ computed函数的基本使用](https://pic.imgdb.cn/item/65cd785e9f345e8d031c6927.jpg)


### 1.2. 计算属性的 get 和 set 方法

接着我们再来看看computed函数的get和set方法的使用：接收一个对象，里面包含 `set` 和 `get`方法。

修改ComputedAPI.vue子组件，代码如下所示：

```html
<script>  
import { ref, computed } from 'vue';  
export default {  
	setup() {  
		const firstName = ref("Kobe");  
		const lastName = ref("Bryant");  
		// const fullName = computed(() => firstName.value + " " + lastName.value);  
		  
		// 1.用法二: 传入一个对象, 对象包含getter/setter  
		const fullName = computed({  
		get: () => firstName.value + " " + lastName.value, // getter 方法  
		set(newValue) { // setter 方法  
		const names = newValue.split(" ");  
			firstName.value = names[0];  
			lastName.value = names[1];  
			}  
		});  
		  
		const changeName = () => {  
			// firstName.value = "James"  
			// 3.修改fullName计算属性  
			fullName.value = "James Bryant";  
		}  
		return {  
			fullName,  
			changeName  
		}  
	}  
}  
</script>
```

可以看到，我们使用了computed函数来定义了一个fullName计算属性，其中computed函数接收一个具有 get 和 set 方法的对象，我们在get方法中对响应式的数据进行计算和返回，在set方法中对传入的新值重新赋值给firstName和lastName响应式对象的值。

保存代码，运行在浏览器后。fullName计算属性可以正常显示，当点击修改firstName按钮时也可以响应式刷新页面。

## 二、watchEffect侦听

在前面的Options API中，我们可以通过`watch选项`来侦听data，props或者computed的数据变化，当数据变化时执行某一些操作。

在Composition API中，我们可以使用`watchEffect`和`watch`来完成响应式数据的侦听。

- watchEffect用于自动收集响应式数据的依赖。
    
- watch需要手动指定侦听的数据源。
    

下面我们先来看看watchEffect函数的基本使用。

### 2.1. watchEffect基本使用

当侦听到某些响应式数据变化时，我们希望执行某些操作，这个时候可以使用 `watchEffect`：

- 首先，watchEffect传入的函数会被立即执行一次，并且在执行的过程中会收集依赖。
    
- 其次，只有收集的依赖发生变化时，watchEffect传入的函数才会再次执行。
    

下面通过一个案例来学习watchEffect基本使用。我们在`01_composition_api`项目的`src`目录下新建`08_watch使用`文件夹，然后在该文件夹下分别新建：`App.vue，WatchEffectAPI.vue`组件。

WatchEffectAPI.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<h4>{{age}}</h4>  
		<button @click="changeAge">修改age</button>  
	</div>  
</template>  
  
<script>  
import { ref, watchEffect } from 'vue';  
export default {  
	setup() {  
		const age = ref(18);  
		// watchEffect: 1.自动收集响应式的依赖 2.默认会先执行一次 3.获取不到新值和旧值  
		watchEffect(() => {  
			console.log("age:", age.value); // 侦听age的改变, age发生变化后会再次执行  
		});  
		  
		const changeAge = () => age.value++  
		return {  
			age,  
			changeAge  
		}  
	}  
}  
</script>
```

可以看到，我们在setup函数中调用了watchEffect函数，并给该函数传递了一个回调函数，传入的回调函数会被立即执行一次，并且在执行的过程中会收集依赖（收集age的依赖）。当收集的依赖发生变化时，watchEffect传入的回调函数又会再次执行。

App.vue根组件，代码如下所示：

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
		App组件  
		<WatchEffectAPI></WatchEffectAPI>  
	</div>  
</template>  
.....
```


然后我们修改main.js程序入口文件，将导入的App组件改为`08_watch使用/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-17所示。可以看到，默认会先执行一次打印age:18，当点击修改age按钮来改变age时，watchEffect侦听到age发生改变后，回调函数又会再次执行，并打印age:19。

![watchEffect基本使用](https://pic.imgdb.cn/item/65cd7bb39f345e8d03246d74.jpg)

### 2.2. watchEffect停止侦听

如果在发生某些情况下，我们希望停止侦听，这个时候我们可以获取watchEffect的返回值函数，调用该函数即可。

比如在上面的案例中，我们age达到20的时候就停止侦听，WatchEffectAPI.vue子组件，代码如下所示：

```html
....  
<script>  
import { ref, watchEffect } from 'vue';  
export default {  
	setup() {  
		const age = ref(18);  
		// 1.stop是watchEffect返回值的函数，用来停止侦听  
		const stop = watchEffect(() => {  
			console.log("age:", age.value); // 侦听age的改变  
		});  
		  
		const changeAge = () => {  
			age.value++  
			if (age.value > 20) {  
				stop(); // 2.停止侦听age的变化  
			}  
		}  
		return {age, changeAge}  
	}  
}  
</script>
```

保存代码，运行在浏览器后，可以看到默认会先执行一次打印age:18，当点击修改age按钮来改变age时，当age大于20的时候，由于调用了watchEffect返回的stop函数，watchEffect将会取消对age变量的侦听。

### 2.3. watchEffect清除副作用

什么是清除副作用呢？

- 比如在开发中我们需要在侦听函数中执行网络请求，但是在网络请求还没有达到的时候，我们停止了侦听器，或者侦听器侦听函数被再次执行了。
    
- 那么上一次的网络请求应该被取消掉（类似前面讲的防抖），这个时候我们就可以清除上一次的副作用。
    

在我们给watchEffect传入的函数被回调时，其实可以获取到一个参数：onInvalidate

- 当**副作用即将再次重新执行** 或者 **侦听器被停止** 时会执行onInvalidate函数传入的回调函数。
    
- 我们可以在传入的回调函数中，执行一些清除的工作。
    

我们在`08_watch使用`文件夹下新建：`WatchEffectAPIClear.vue`组件。

WatchEffectAPIClear.vue子组件，代码如下所示（省略的template和上面案例一样）：

```html
......  
<script>  
import { ref, watchEffect } from 'vue';  
export default {  
	setup() {  
	const age = ref(18);  
	watchEffect((onInvalidate) => {  
		  
		const timer = setTimeout(() => {  
			console.log("模拟网络请求，网络请求成功~");  
		}, 2000)  
		  
		onInvalidate(() => {  
			// 当侦听到age发生变化和侦听停止时会执行该这里代码，并在该函数中清除额外的副作用  
			clearTimeout(timer); // age发生改变时，优先清除上一次定时器的副作用  
				console.log("onInvalidate");  
			})  
		console.log("age:", age.value); // 侦听age的改变  
	});  
	  
	const changeAge = () => age.value++  
	return {age,changeAge}  
	}  
}  
</script>
```

可以看到，watchEffect函数传入的回调函数接收一个onInvalidate参数，onInvalidate也是一个函数，并且该函数也需要接收一个回调函数作为参数。

App.vue根组件，代码如下所示：

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
		App组件  
		<!-- <WatchEffectAPI></WatchEffectAPI> -->  
		<WatchEffectAPIClear></WatchEffectAPIClear>  
	</div>  
</template>
```

保存代码，运行在浏览器的效果，如图10-18所示。刷新页面，立马连续点击3次修改age，我们可以看到watchEffect函数侦听到age改变了3次，并在每次将重新执行watchEffect函数的回调函数时先执行了onInvalidate函数中的回调函数来清除副作用（即把上一次的定时器给清除了，所以只有最后一次的定时器没有被清除）。

![watchEffect清除副作用](https://pic.imgdb.cn/item/65cd7d5f9f345e8d032879c5.jpg)

### 2.4. watchEffect执行时机

在讲解 watchEffect执行时机之前，我们先补充一个知识：在setup中如何使用ref或者元素或者组件？

- 其实非常简单，我们只需要定义一个前面讲的ref对象，绑定到元素或者组件的ref属性上即可。
    
我们在`08_watch使用`文件夹下新建：`WatchEffectAPIFlush.vue`组件。

WatchEffectAPIFlush.vue子组件，代码如下所示（省略的template和上面案例一样）：

```html
<template>  
	<div>  
		<h4 ref="titleRef">哈哈哈</h4>  
	</div>  
</template>  
  
<script>  
import { ref, watchEffect } from 'vue';  
  
export default {  
	setup() {  
		// 1.定义一个titleRef来拿到h4元素的DOM对象（组件对象也是一样）  
		const titleRef = ref(null);  
		// 2.h4元素挂载完成之后会自动赋值到titleRef变量上，这里监听titleRef变量被赋值，并打印出来看  
		watchEffect(() => {  
			console.log(titleRef.value); // 3.打印h4元素的DOM对象  
		})  
		return { titleRef }  
	}  
}  
</script>
```

可以看到，我们先用ref函数定义了一个titleRef响应式变量，接着该变量在setup函数中返回，并绑定到h4元素的ref属性上（注意：不需要用v-bind指令来绑定）。当h4元素挂载完成之后会自动赋值到titleRef变量上。为了观察titleRef变量被赋值，这里我们使用watchEffect函数来侦听titleRef变量的改变，并打印出来。最后我们在App.vue根组件中导入和使用WatchEffectAPIFlush组件（和前面的操作基本一样，这里不再贴代码）。

保存代码，运行在浏览器的效果，如图10-19所示。刷新页面，我们会发现打印结果打印了两次。

- 这是因为setup函数在执行时就会立即执行传入的副作用函数（watchEffect的回调函数），这个时候DOM并没有挂载，所以打印为null。
    
- 而当DOM挂载时，会给titleRef变量的ref对象赋值新的值，副作用函数会再次执行，打印出对应的元素。

![ref获取元素对象](https://pic.imgdb.cn/item/65cd7dc89f345e8d03297392.jpg)

如果我们希望在第一次的时候就打印出来对应的元素呢？

- 这个时候我们需要改变副作用函数的执行时机。
    
- 它的默认值是pre，它会在元素 `挂载` 或者 `更新` 之前执行。
    
- 所以我们会先打印出来一个空的，当依赖的titleRef发生改变时，就会再次执行一次，打印出元素。
    

我们可以设置副作用函数的执行时机，修改WatchEffectAPIFlush.vue子组件，代码如下所示：

```html
......  
<script>  
export default {  
	setup() {  
		......  
		watchEffect(() => {  
		console.log(titleRef.value);  
		},{  
		flush: "post" // 修改执行时机，支持 pre, post, sync  
		})  
		return { titleRef }  
	}  
}  
</script>
```

这里的`flush:"post"`是将推迟副作用的初始运行，直到组件的首次渲染完成才执行。当然`flush` 选项还接受 `sync`，这将强制效果始终同步触发。然而，这是低效的，应该很少需要。

保存代码，运行在浏览器后。刷新页面，我们会发现结果打印了1次（打印出元素）。

> 注意：Vue3.2+ 以后`watchPostEffect`是`watchEffect` 带有 `flush: 'post'` 选项的别名。`watchSyncEffect`是`watchEffect` 带有 `flush: 'sync'` 选项的别名。


## 三、watch侦听

watch的API完全等同于组件`watch选项`的Property：

- watch需要侦听特定的数据源，并在回调函数中执行副作用。
    
- 默认情况下它是惰性的，只有当被侦听的源发生变化时才会执行回调。
    

与watchEffect的比较，watch允许我们：

- 懒执行副作用（第一次不会直接执行）。
    
- 更具体的说明当哪些状态发生变化时，触发侦听器的执行。
    
- 访问侦听状态变化前后的值。

### 3.1. 侦听单个数据源

watch侦听函数的数据源有两种类型：

- 一个getter函数：但是该getter函数必须引用可响应式的对象（比如reactive或者ref）。
    
- 直接写入一个可响应式的对象，reactive或者ref（比较常用的是ref）。
    

下面通过几个案例来学习watch函数的使用。

**案例一：watch侦听的数据源为一个getter函数。**

我们在`08_watch使用`文件夹下新建：`WatchAPI.vue`组件。WatchAPI.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<h4 >{{info.name}}</h4>  
		<button @click="changeData">修改数据</button>  
	</div>  
</template>  
<script>  
import { reactive, watch } from 'vue';  
export default {  
	setup() {  
		const info = reactive({name: "coderwhy", age: 18});  
		  
		// 1.侦听watch时,传入一个getter函数(该函数引用可响应式的对象)  
		watch(() => info.name, (newValue, oldValue) => {  
			// 侦听info对象中name的改变  
			console.log("newValue:", newValue, "oldValue:", oldValue);  
		})  
		  
		const changeData = () => {  
			info.name = "kobe"; // 改变info对象中的name  
		}  
		  
		return {changeData,info}  
	}  
}  
</script>
```

可以看到，我们调用了watch函数来侦听info对象name属性的变化。其中watch函数需要接收两个参数，第一次参数是一个getter函数，该函数必须引用可响应式的对象。第二参数是侦听的回调函数，该函数会接收到一个新的值和一个旧的值，并在该函数中打印出新旧值。最后我们在App.vue根组件中导入和使用WatchAPI组件（不再贴代码）。

保存代码，运行在浏览器的效果，如图10-20所示。刷新页面，点击修改数据按钮来修改info中的name后，我们可以看到watch已经侦听到info中name发生了改变，并打印出新旧值。

![watch侦听的数据源为getter函数](https://pic.imgdb.cn/item/65cd7fe79f345e8d032f4faa.jpg)

**案例二：watch侦听的数据源为reactive对象。**

修改WatchAPI.vue子组件，代码如下所示：

```html
......  
<script>  
export default {  
setup() {  
	const info = reactive({name: "coderwhy", age: 18});  
	// 1.侦听watch时,传入一个getter函数  
	// watch(() => info.name, (newValue, oldValue) => {  
	// console.log("newValue:", newValue, "oldValue:", oldValue);  
	// })  
	  
	// 2.传入一个可响应式对象: reactive对象  
	watch(info, (newValue, oldValue) => {  
		// reactive对象获取到的newValue和oldValue本身都是reactive对象  
		console.log("newValue:", newValue, "oldValue:", oldValue);  
	})  
	const changeData = () => info.name = "kobe";  
		return {changeData,info}  
	}  
}  
</script>
```

保存代码，运行在浏览器后刷新页面，点击修改数据按钮后，我们可以看到watch已经侦听到info中name发生了改变，并打印出新旧值（都为reactive对象）。

如果希望newValue和oldValue是一个普通的对象的话，我们可以这样侦听，代码如下所示：

```html
<script>  
export default {  
	setup() {  
		.......  
		// 2.传入一个可响应式对象: reactive对象  
		// 如果希望newValue和oldValue是一个普通的对象，watch第一参数改成getter函数  
		watch(() => {  
			return {...info}  
		}, (newValue, oldValue) => {  
			console.log("newValue:", newValue, "oldValue:", oldValue);  
		})  
		......  
	}  
}  
</script>
```

保存代码，运行在浏览器后刷新页面，点击修改数据按钮后，我们可以看到watch已经侦听到info中name发生了改变，并打印出新旧值（都为普通对象）。

**案例三：watch侦听的数据源为ref对象。**

修改WatchAPI.vue子组件，代码如下所示：

```html
......  
<script>  
export default {  
	setup() {  
	.....  
	const name = ref("codeywhy");  
	// watch侦听ref对象，ref对象获取newValue和oldValue是value值的本身  
	watch(name, (newValue, oldValue) => {  
		console.log("newValue:", newValue, "oldValue:", oldValue);  
	})  
	const changeData = () => name.value = "kobe";  
		return {changeData,info,name}  
	}  
}  
</script>
```

保存代码，运行在浏览器后刷新页面，点击修改数据按钮后，我们可以看到watch已经侦听到name发生了改变，并打印出新旧值（都是name的value）。

### 3.2. 侦听多个数据源

侦听器还可以使用数组同时侦听多个源：

我们在`08_watch使用`文件夹下新建：`WatchAPIMult.vue`组件。WatchAPIMult.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<h4 >{{info.name}} - {{name}}</h4>  
		<button @click="changeData">修改数据</button>  
	</div>  
</template>  
<script>  
import { ref, reactive, watch } from 'vue';  
export default {  
	setup() {  
	// 1.定义可响应式的对象  
	const info = reactive({name: "coder", age: 18});  
	const name = ref("why");  
	const age = ref(20);  
		// 2.侦听多数据源，参数一是一个数组：数组中可以有getter函数，ref对象，reactive对象  
		watch([() => ({...info}), name, age],  
		([newInfo, newName, newAge], [oldInfo, oldName, oldAge]) => {  
		console.log(newInfo, newName, newAge);  
		console.log(oldInfo, oldName, oldAge);  
	})  
	const changeData = () => {  
		info.name = "kobe";  
		name.value = "jack"  
	}  
		return {changeData,info,name}  
	}  
}  
</script>
```

可以看到，我们调用了watch函数来侦听多个数据源。watch函数的第一个参数接收的是一个数组，该数组中是支持侦听getter函数，ref对象和reactive对象的数据源。接着我们给watch的第二个参数传入回调函数，该回调函数接收的新值和旧值都是数组类型，然后我们在该函数中分别打印了新值和旧值。最后我们在App.vue根组件中导入和使用WatchAPIMult组件（不再贴代码）。

保存代码，运行在浏览器的效果，如图10-21所示。刷新页面，点击修改数据按钮后，我们可以看到watch已经侦听到info中name和name都发生了改变，并打印出新旧值。

![watch侦听多数据源](https://pic.imgdb.cn/item/65cd80b09f345e8d0331232e.jpg)

### 3.3. 侦听响应式对象

如果我们希望侦听一个数组或者对象，那么可以使用一个getter函数，并且对可响应对象进行解构。

侦听响应式对象在上面的案例二中已经介绍过，下面看看侦听响应式数组，代码如下所示：

```JavaScript
const names = reactive(["abc", "cba", "nba"]);  
// 侦听响应式数组( 和对象的使用一样 )  
watch(() => [...names], (newValue, oldValue) => {  
  console.log(newValue, oldValue);  
})  
const changeName = () => {  
  names.push("why");  
}
```

如果是侦听对象时，我们希望侦听是一个深层的侦听，那么依然需要设置 `deep` 为true：

- 也可以传入 `immediate` 立即执行。
    

我们在`08_watch使用`文件夹下新建：`WatchAPIDeep.vue`组件。WatchAPIDeep.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<h4 >{{info.name}}</h4>  
		<button @click="changeData">修改数据</button>  
	</div>  
</template>  
  
<script>  
import { ref, reactive, watch } from 'vue';  
  
export default {  
	setup() {  
		// 1.定义可响应式的对象  
		const info = reactive({  
		name: "coderwhy",  
		age: 18,  
		friend: {  
		name: "kobe"  
		}  
		});  
		// 2.侦听响应式对象  
		watch(() => ({...info}), (newInfo, oldInfo) => {  
		console.log(newInfo, oldInfo);  
		}, {  
		deep: true,  
		immediate: true  
		})  
		  
		const changeData = () => info.friend.name = "james"  
		return {changeData,info}  
	}  
}  
</script>
```

可以看到，我们调用了watch函数来侦听一个对象。watch函数的第一个参数是一个getter函数，第二个参数传入回调函数，在该回调函数打印接收的新值和旧值，第三个参数一个watch的配置项。其中deep为true代表是一个深层的侦听，即当用户修改了info中friend对象的name也会被watch侦听到，如果为false则侦听不到。还有immediate为true代表watch的回调函数会先立即执行一次，当侦听到有数据变化时才再次执行该回调函数。最后我们在App.vue根组件中导入和使用WatchAPIDeep组件（不再贴代码）。

保存代码，运行在浏览器后。刷新页面，默认会先立即执行一次watch的回调函数，当点击修改数据按钮后，我们可以看到watch可以深层侦听info中firend对象的name发生了改变。

## 四、组件的生命周期钩子

我们前面说过 `setup` 可以用来替代 `data` 、 `methods` 、 `computed` 、`watch` 等等这些选项，也可以替代 `生命周期钩子`。

那么setup中如何使用生命周期函数呢？

- 可以使用直接导入的 `onXxx` 函数注册生命周期钩子。
    

我们在`01_composition_api`项目的`src`目录下新建`09_生命周期钩子`文件夹，然后在该文件夹下新建：`App.vue`组件。

App.vue根组件，代码如下所示：

```html
<template>  
	<div><button @click="increment">点击+1：{{counter}}</button></div>  
</template>  
<script>  
import { onMounted, onUpdated, onUnmounted, ref } from 'vue';  
export default {  
	setup() {  
	const counter = ref(0);  
	const increment = () => counter.value++  
	  
	// 生命周期钩子函数 （同一个生命周期函数可以存在多个）  
	onMounted(() => {  
	console.log("App Mounted1");  
	})  
	onMounted(() => {  
	console.log("App Mounted2");  
	})  
	onUpdated(() => {  
	console.log("App onUpdated");  
	})  
	onUnmounted(() => {  
	console.log("App onUnmounted");  
	})  
	return {counter,increment}  
	}  
}  
</script>
```

可以看到，在App组件中注册了`onBeforeMount、onMounted、onUpdated和onUnmounted`生命周期函数，其中`onMounted`生命周期函数我们注册了两次。

然后我们修改main.js程序入口文件，将导入的App组件改为`09_生命周期钩子/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-22所示。刷新页面，控制台会打印`App onBeforeMount、App Mounted1、App Mounted2`，每当点击一次按钮会打印一次`App onUpdated`。这里就不一一演示组件的销毁和其它的生命周期函数了。

![生命周期函数](https://pic.imgdb.cn/item/65cd815d9f345e8d0332c09b.jpg)

那么Compostion API提供了哪些生命周期函数呢？并且Compostion API的生命周期函数和Options API的生命周期函数有什么对应关系呢？请看下表：

|选项式 API|Hook inside `setup`|
|---|---|
|`beforeCreate`|Not needed*|
|`created`|Not needed*|
|`beforeMount`|`onBeforeMount`|
|`mounted`|`onMounted`|
|`beforeUpdate`|`onBeforeUpdate`|
|`updated`|`onUpdated`|
|`beforeUnmount`|`onBeforeUnmount`|
|`unmounted`|`onUnmounted`|
|`activated`|`onActivated`|
|`deactivated`|`onDeactivated`|
我们会发现`Compostion API`没有提供 `beforeCreate` 和 `created` 生命周期函数，而是直接使用`setup`函数来代替了（setup函数会在beforeCreate之前调用），如图10-23所示。

![setup代替了beforeCreate和created](https://pic.imgdb.cn/item/65cd81979f345e8d0333560f.jpg)

## 五、Provide / Inject

事实上我们之前还学习过`Provide`和`Inject`，Composition API也可以替代之前的 `Provide` 和 `Inject` 的选项。

### 5.1. Provide函数

我们可以通过 `provide`函数来给子组件或者子孙组件提供数据：

- 可以通过 `provide` 函数来定义每个 property。
    
- `provide`函数可以传入两个参数：
    

- name：提供的属性名称。
    
- value：提供的属性值。
    

下面我们来通过一个案例来学习一下Provide函数的使用。我们在`01_composition_api`项目的`src`目录下新建`10_Provide和Inject`文件夹，然后在该文件夹下新建：`App.vue`组件。

App.vue根组件，代码如下所示：

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
		App组件  
		<div>{{name}} - {{age}}</div>  
		<div>{{counter}}</div>  
		<button @click="increment">App组件+1</button>  
	</div>  
</template>  
  
<script>  
import { provide, ref } from 'vue';  
export default {  
	setup() {  
	// 1.定义普通数据  
	const name = "coderwhy";  
	const age = 18;  
	// 2.定义响应式数据  
	let counter = ref(100);  
	  
	// 3.给子组件或者子孙组件提供数据  
	provide("name", name);  
	provide("age", age); // 提供普通数据（只能读，不能修改）  
	provide("counter", counter); // 提供响应式数据  
	  
	const increment = () => counter.value++;  
	return {name,age,increment,counter}  
	}  
}  
</script>
```

可以看到，在setup函数中调用了provide函数来给子组件或者子孙组件提供了`name与age`普通数据和`counter`响应式数据。其中提供的普通数据是只读不能修改，提供的响应式数据默认是可读可修改，并且是响应式的。

然后我们修改main.js程序入口文件，将导入的App组件改为`10_Provide和Inject/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-24所示。可以看到在自己本组件中能正常显示，点击按钮也能实现响应式刷新页面。那有些同学会问provide不是给子组件或者子孙组件提供数据吗？那么子组件和子孙组件如何获取？那我们继续来学习下一小节的inject函数。

![provide函数的基本使用](https://pic.imgdb.cn/item/65cd820b9f345e8d03346fb4.jpg)

### 5.2. Inject 函数

在后代组件中可以通过 `inject` 来注入需要的属性和对应的值：

- 可以通过 `inject` 函数来注入需要的内容。
    
- `inject`可以传入两个参数：
    

- 要 inject 的 property 的 name。
    
- 默认值。
    

上面案例的App父组件已经完成数据的提供，那么它的子组件和孙子组件怎么获取提供的数据呢？要想获取父组件通过provide提供的数据，子组件或者孙子组件需要通过inject函数来获取。

接着我们在`10_Provide和Inject`文件夹下新建：`Home.vue`组件。

Home.vue子组件，代码如下所示：

```html
<template>  
	<div style="border:1px solid #ddd;margin:8px">  
		Home组件  
		<div>{{name}} - {{age}}</div>  
		<div>{{counter}}</div>  
		<button @click="homeIncrement">Home组件+1</button>  
	</div>  
</template>  
  
<script>  
import { inject } from 'vue';  
export default {  
	setup() {  
	// 1.获取父组件provide提供的数据( 子组件和孙子组件获取的代码是一模一样的)  
	const name = inject("name");  
	const age = inject("age");  
	const counter = inject("counter");  
	  
	const homeIncrement = () => counter.value++;  
	return {name,age, counter,homeIncrement}  
	}  
}  
</script>
```

可以看到，该组件在setup函数中通过inject函数来注入父组件或者祖父组件使用provide函数提供的数据。其中`name与age`是注入普通对象（只读不能修改），`counter`则是响应式对象（可读可修改）。接着当点击button时，我们在子组件中修改了父组件提供的counter值。

修改App组件，代码如下所示:

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
		App组件......  
		<home/>  
	</div>  
</template>  
<script>  
import Home from './Home.vue';  
export default {  
	components: { Home },  
	......  
}  
</script>
```

保存代码，运行在浏览器的效果，如图10-25所示。当我们点击App组件的按钮来在父组件修改counter时，App组件和Home组件的counter都同步变化，当我们点击Home组件的按钮来在子组件修改counter时，App组件和Home组件的counter也是同步变化。这就说明父组件提供的响应式数据，子组件不但能获取到，还保持了响应式。

![inject函数的基本使用](https://pic.imgdb.cn/item/65cd82749f345e8d03356d8e.jpg)
### 5.3. 共享响应式属性

**1.共享响应式的数据**

为了增加 provide 值和 inject 值之间的响应性，其实我们可以在 provide 值时使用 `ref` 和 `reactive`对象。其中`ref`对象上面已经演示了，这里再看一下如何提供reactive响应式数据，代码如下所示：

```JavaScript
// App父组件  
let counter = ref(100)  
let info = reactive({  
  name: "why",  
  age: 18  
})  
// 1.提供响应式数据  
provide("counter", counter)  
provide("info", info)  
// 2.修改响应式数据  
const changeInfo = () => {  
  info.name = "coderwhy"  
}  
  
// 子组件（孙子组件）注入父组件（祖父组件）提供的响应式数据  
const info = inject("counter");  
const info = inject("info");
```

**2.修改响应式Property**

因为父组件可以通过provide提供响应式数据给子组件，该响应式数据默认是可以在父组件被修改，也可以在子组件被修改。如果子组件也可以修改父组件提供的响应式数据，那么我们就很难追踪响应数据到底是在哪被修改的，为了保证单向数据流，我们一般建议：

- 如果我们需要修改响应的数据，那么最好是在数据提供的位置来修改（如上案例应在App中修改counter）
    
- 其实我们还可以将修改数据的方法进行共享，在后代组件中进行调用（如上案例不应在Home中直接修改counter）。
    
- 有时候为了避免子组件修该父组件提供的数据，我们可以借助`readonly`函数，如下代码所示。

```JavaScript
provide("info", readonly(info); // 子组件注入时只能读，不能修改  
provide("counter", readonly(counter); // 子组件注入时只能读，不能修改
```

## 六、Composition API综合练习

前面我们已经学习了`setup、reactive、ref、computed、watchEffect、watch、provide、inject`等等Composition API，那下面将通过一个Composition API的综合练习来巩固一下组合API的使用以及代码逻辑的封装（即Hook函数的封装）。其中该综合练习包含以下功能：

- 计数器案例的实现。
    
- 修改网页的标题。
    
- 完成一个监听界面滚动位置。
    

在使用Composition API之前，我们先看看用Options API是如何实现该功能。

我们在`01_composition_api`项目的`src`目录下新建`11_compositionAPI综合练习`文件夹，然后在该文件夹下分别新建：`App.vue，OptionsAPIExample.vue`组件。

OptionsAPIExample.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<!--1.计数器案例 -->  
		<div>当前计数: {{counter}}</div>  
		<div>当前计数*2: {{doubleCounter}}</div>  
		<button @click="increment">+1</button>  
		<button @click="decrement">-1</button>  
	</div>  
</template>  
  
<script>  
export default {  
	data() {  
		return{  
		// 1.2计数器案例的逻辑代码  
		counter:100  
		}  
	},  
	computed: {  
		// 1.3计数器案例的逻辑代码  
		doubleCounter() {  
		return this.counter * 2  
	}  
	},  
	methods: {  
		// 1.4计数器案例的逻辑代码  
		increment() {  
			this.counter++;  
		},  
		decrement() {  
			this.counter--;  
		}  
	}  
}  
</script>
```

可以看到，该案例我们仅实现了计数器的案例。为了保证代码的简洁易懂，其它修改网页标题和监听页面滚动的代码逻辑这里暂时先不实现（后面直接用组合API来实现）。最后我们在App.vue根组件中导入和使用OptionsAPIExample组件（不再贴代码）。

然后我们修改main.js程序入口文件，将导入的App组件改为`11_compositionAPI综合练习/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-26所示。

![ Options API实现的计数器](https://pic.imgdb.cn/item/65cd83449f345e8d033765a9.jpg)

下面我们再用Composition API来实现该功能。我们在`11_compositionAPI综合练习`文件夹下新建：`CompositionAPIExample.vue`组件。

CompositionAPIExample.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<!-- 1.计数器案例 -->  
		<div>当前计数: {{counter}}</div>  
		<div>当前计数*2: {{doubleCounter}}</div>  
		<button @click="increment">+1</button>  
		<button @click="decrement">-1</button>  
	</div>  
</template>  
<script>  
import { ref, computed } from 'vue';  
export default {  
	setup() {  
		// 1.1计数器案例的逻辑代码  
		const counter = ref(100);  
		const doubleCounter = computed(() => counter.value * 2);  
		  
		const increment = () => counter.value++;  
		const decrement = () => counter.value--;  
		return {  
			counter,  
			doubleCounter,  
			increment,  
			decrement  
		}  
	}  
}  
</script>
```

可以看到，该案例我们仅实现了计数器的案例。其它修改网页标题和监听页面滚动的代码逻辑这里也暂时先不实现。最后我们在App.vue根组件中导入和使用CompositionAPIExample组件（不再贴代码）。

保存代码，运行在浏览器的效果和Options API实现的效果一模一样。通过这两个案例，我们可以发现：

- Options API的特点就是在对应的属性中编写对应的功能模块
    
- 但Options API有一个很大的弊端是对应的代码逻辑被拆分到各个属性中，当组件变得更大、复杂时，同一个功能的逻辑会被拆分的很分散（如上面的计数器功能逻辑被拆分到各个选项中），不利于代码的阅读和理解。
    
- Composition API的特点是能将同一个逻辑关注点相关的代码收集在一起，方便代码的封装和复用，也更利于代码的阅读和理解。
    
- Composition API用了比较多的函数，用起来稍微比Options API复杂一点，但是函数式编程对TS支持更友好。
    

对比完Options API和Composition API编写计数器案例的优缺点之后，下面我们来看看如何对Composition API编写的代码逻辑进行封装和复用。在Options API编写方式中，我们已知道代码逻辑的封装和复用可以使用Mixin混入，那在Composition API中我们可以将关注点相关的代码逻辑封装到一个函数中，该函数我们一般会使用`useXx`来命名（社区默认准寻的规范），并且以`useXx`开头的函数我们称之为自定义Hook函数。

### 6.1. useCounter

认识Hook函数之后，下面我们来把上面计数器案例的代码逻辑封装到一个`useCounter`的Hook函数中。

我们在`11_compositionAPI综合练习`文件夹下新建：`hooks/useCounter.js`文件。

useCounter.js文件封装useCounter Hook函数，代码如下所示：

```JavaScript
import { ref, computed } from 'vue';  
  
export default function useCounter() {  
  // 1.1计数器案例的逻辑代码  
  const counter = ref(100);  
  const doubleCounter = computed(() => counter.value * 2);  
  
  const increment = () => counter.value++;  
  const decrement = () => counter.value--;  
  
  return {  
    counter,   
    doubleCounter,   
    increment,   
    decrement  
  }  
}
```

可以看到，我们在该文件中默认导出一个函数（也支持匿名函数），在该函数中我们把CompositionAPIExample组件实现计数器案例的代码逻辑全部抽取过来了。

接着修改CompositionAPIExample组件，代码如下所示：

```html
.....  
<script>  
import useCounter from './hooks/useCounter'  
export default {  
	setup() {  
		// 1.计数器案例的代码逻辑抽取到useCounter hook 中了  
		const {counter, doubleCounter, increment, decrement} = useCounter()  
		  
		return {counter, doubleCounter, increment, decrement}  
	}  
}  
</script>
```

可以看到，该组件之前实现计数器案例的逻辑代码已经抽取到了useCounter函数中，这时我们只要导入useCounter函数，并在setup中调用该函数便可以拿到返回的响应式数据和事件函数，然后直接返回给模板使用。保存代码，运行在浏览器的效果和没抽取前一模一样。

### 6.2. useTitle

实现完计数器案例之后，下面我们接着再CompositionAPIExample组件中来实现修改网页标题的功能。修改CompositionAPIExample组件，代码如下所示：

```html
<script>  
export default {  
	setup() {  
	.....  
	// 2.修改网页的标题案例  
	const titleRef = ref("coder");  
	document.title = titleRef.value// 更新网页标题  
	return {counter, doubleCounter, increment, decrement}  
	}  
}  
</script>
```

可以看到，只在CompositionAPIExample中的setup函数中添加两行代码即可以。保存代码，运行在浏览器的效果，如图10-27所示。已经将网页的标题修改为coder。

![修改网页的标题](https://pic.imgdb.cn/item/65cd840c9f345e8d0339520a.jpg)

像这种修改网页标题的代码逻辑可能在其它组件中还会再次使用到，那么我们就可以将该功能封装到一个Hook函数中。我们在`11_compositionAPI综合练习`文件夹下新建：`hooks/useTitle.js`文件。

useTitle.js文件封装useTitle Hook函数，代码如下所示：

```JavaScript
import { ref, watch } from 'vue';  
// 使用匿名函数，并该函数需接收一个参数  
export default function(title = "默认的title") {  
  const titleRef = ref(title);  
  // 侦听titleRef变化，一旦被修改就更新   
  watch(titleRef, (newValue) => {  
    document.title = newValue   
  }, {  
    immediate: true // 侦听的回调函数先执行一次  
  })  
  return titleRef  
}
```

修改CompositionAPIExample组件，代码如下所示：

```html
<script>  
.....  
import useTitle from './hooks/useTitle'  
export default {  
	setup() {  
	.....  
	// 2.修改网页的标题案例  
	const titleRef = useTitle("coder");  
	setTimeout(() => {  
	// 3秒后修改titleRef的值，useTitle函数的watch侦听到会修改标题  
	titleRef.value = "why  
	}, 3000);  
	return {counter, doubleCounter, increment, decrement}  
	}  
}  
</script>
```

可以看到，我们先导入useTitle函数，接着在setup中调用useTitle函数初始化标题为coder，然后过了2秒之后将标题修改为why。保存代码，运行在浏览器后。网页的标题在3秒后有coder修改为why。

### 6.3. useScrollPosition

实现完修改网页的标题之后，我们接着继续再CompositionAPIExample组件中来实现监听页面滚动位置的功能。修改CompositionAPIExample组件，代码如下所示：

```html
<template>  
	<div>  
		.....  
		<!-- 3.显示页面滚动位置 -->  
		<p style="width: 3000px;height: 5000px;">  
		width:3000px height:5000px的，模拟页面滚动  
		</p>  
		<div style="position: fixed;top:20px;right:20px">  
		<div >scrollX: {{scrollX}}</div>  
		<div >scrollY: {{scrollY}}</div>  
		</div>  
	</div>  
</template>  
  
<script>  
.....  
export default {  
	setup() {  
	......  
	// 3.监听页面滚动  
	const scrollX = ref(0);  
	const scrollY = ref(0);  
	document.addEventListener("scroll", () => {  
	scrollX.value = window.scrollX;  
	scrollY.value = window.scrollY;  
	});  
	return {counter, doubleCounter, increment, decrement, scrollX, scrollY}  
	}  
}  
</script>
```

可以看到，我们先在template中编写宽和高超出屏幕大小的p元素（模拟页面可滚动），接着在setup函数监听了页面的滚动，并在该回调函数中给scrollX和scrollY变量赋当前滚动的值。最后在return函数中返回scrollX和scrollY变量给temlpate来显示当前滚动的位置。保存代码，运行在浏览器的效果，如图10-28所示。上下滚动页面的时候，页面的右上角上能显示当前滚动位置值。

![](https://pic.imgdb.cn/item/65cd85449f345e8d033c54b3.jpg)

那如果该功能也会被再次使用到，我们依然可以将该功能封装到一个Hook函数中。我们在`11_compositionAPI综合练习`文件夹下新建：`hooks/useScrollPosition.js`文件。

useScrollPosition.js文件封装useScrollPosition Hook函数，代码如下所示：

```JavaScript
import { ref } from 'vue';  
// 自定义 useScrollPosition Hook函数  
export default function useScrollPosition() {  
  const scrollX = ref(0);  
  const scrollY = ref(0);  
  
  document.addEventListener("scroll", () => {  
    scrollX.value = window.scrollX;  
    scrollY.value = window.scrollY;  
  });  
  
  return {scrollX, scrollY} // 返回ref响应式数据  
}
```

修改CompositionAPIExample组件，代码如下所示：

```html
.......  
<script>  
import useCounter from './hooks/useCounter'  
import useTitle from './hooks/useTitle'  
import useScrollPosition from './hooks/useScrollPosition'  
export default {  
	setup() {  
	// 1.计数器案例(可直接解构，如果返回的是reactive对象则不能直接解构使用)  
	const {counter, doubleCounter, increment, decrement} = useCounter()  
	// 2.修改网页标题案例  
	const titleRef = useTitle("coder");  
	setTimeout(() => {  
	titleRef.value = "why"  
	}, 3000);  
	  
	// 3.监听页面滚动位置案例 (可直接解构，因为Hook函数返回对象属性是ref对象)  
	const { scrollX, scrollY } = useScrollPosition();  
	return {counter, doubleCounter, increment, decrement, scrollX, scrollY}  
	}  
}  
</script>
```

可以看到，我们先导入useScrollPosition函数，接着在setup中调用useScrollPosition函数来获取到当前滚动的值。如果滚动页面了，useScrollPosition函数里会监听到并修改scrollX和scrollY响应式变量的值，同时更新页面。保存代码，运行在浏览器后。滚动网页时可以发现页面上右上角的scrollX和scrollY能显示当前滚动的位置。

## 七、script setup语法

当我们在编写单文件组件（即.vue文件）的时候，除了 `<script>` 语法，其实Vue3还支持`<script setup>`语法，它方便我们在script顶层来编写setup相关的代码。`setup script`语法的代码看起来简单了很多，开发效率大大的提高。该语法是在2020-10-28号提出，在Vue3.2版本之前它还只是一个实验性功能，但是到了Vue3.2版本`<script setup>`语法已从实验状态毕业，现在被认为是稳定的了。

`<script setup>` 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。相比于普通的 `<script>` 语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
    
- 能够使用纯 Typescript 声明 props 和抛出事件。
    
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
    
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)。

### 7.1. 基本使用

我们来看一下用`<script setup>`语法是如何使用的：

- 要使用这个语法，需要将 `setup` attribute 添加到 `<script>` 代码块上。
    
- 里面的代码会被编译成组件 `setup()` 函数的内容。
    
- 这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在**每次组件实例被创建的时候执行**。
    
- 当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用。

下面我们使用`<script setup>`语法来编写计数器案例，我们在`01_composition_api`项目的`src`目录下新建`12_script_setup顶层编写方式`文件夹，然后在该文件夹下分别新建：`App.vue，ScriptSetupExample.vue`组件。

ScriptSetupExample.vue子组件，代码如下所示：

```html
<template>  
	<div>  
		<h4>当前计数: {{counter}}</h4>  
		<button @click="increment">+1</button>  
	</div>  
</template>  
// 1.script setup语法的顶层编写方式  
<script setup>  
	// 2.ref、counter、increment是在顶层绑定，所以都能在模板中直接使用  
	import { ref } from 'vue';  
	const counter = ref(0);  
	const increment = () => counter.value++;  
</script>
```

可以看到，该组件使用了`<script setup>`语法的顶层编写方式，在顶层绑定了`ref、counter、increment`，所以都能在模板中直接使用他们。最后我们在App.vue根组件中导入和使用ScriptSetupExample组件（不再贴代码）。

然后我们修改main.js程序入口文件，将导入的App组件改为`12_script_setup顶层编写方式/App.vue`路径下的App组件。

保存代码，运行在浏览器的效果，如图10-29所示。已实现计数器案例。

![script setup语法的基本使用](https://pic.imgdb.cn/item/65cd86029f345e8d033e278d.jpg)

当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定都能在模板中直接使用。例如：声明的普通变量，响应式变量，函数，import 引入的内容（包含函数，对象，组件，动态组件，指令等等）。当是响应式状态时需要明确使用响应式 APIs 来创建。和从 `setup()` 函数中返回值一样，ref 值在模板中使用的时候会自动解包，如下代码所示：

```html
<template>  
	<MyComponent />  
	<component :is="Foo" />  
	<h4 v-my-directive>This is a Heading</h1>  
	<div>{{ capitalize('hello') }}</div>  
	<button @click="count++">{{ count }}</button>  
	<div @click="log">{{ msg }}</div>  
</template>  
// script setup语法的顶层的绑定( 下面声明的绑定都可以直接在模板中使用 )  
<script setup>  
	import MyComponent from './MyComponent.vue' // 声明绑定组件  
	import Foo from './Foo.vue' // 声明绑定动态组件  
	import { myDirective as vMyDirective } from './MyDirective.js' // 声明绑定指令  
	import { capitalize } from './helpers' // 声明绑定工具函数  
	import { ref } from 'vue' // 声明绑定ref函数  
	const count = ref(0) // 声明绑定响应式变量  
	const msg = 'Hello!' // 声明绑定普通变量  
	function log() { // 声明绑定函数  
	console.log(msg)  
}  
</script>
```

上面代码列举了在 `<script setup>`中常用的顶层的绑定。上面代码所声明的组件，函数，指令等这里就不一一实现了。大家只要知道在`<script setup>`中顶层的绑定会被暴露给模板使用就可以了。

### 7.2. defineProps和defineEmits

上面我们已经学会了`<script setup>`语法的基本使用，那么在这种语法下，我们应该如何定义props和如何发出事件呢？在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` APIs 来声明 `props` 和 `emits` ，它们具备完整的类型推断并且在 `<script setup>` 中是直接可用的（Vue3.2版本以后不需要导入）。

我们在`12_script_setup顶层编写方式`文件夹下新建：`DefinePropsEmitAPI.vue`组件。

DefinePropsEmitAPI.vue子组件，代码如下所示：

```html
<template>  
	<div style="border:1px solid #ddd;margin:8px">  
		<div>DefinePropsEmitAPI组件</div>  
		<p>{{message}}</p>  
		<button @click="emitEvent">发射emit事件</button>  
	</div>  
</template>  
// Vue3.2以后defineProps和defineEmits不需要导入(当前项目Vue安装的版本是：3.2.29)  
<script setup>  
// 1.定义props属性（等同于Options API的props选项）  
const props = defineProps({  
	// message: String,  
	message: {  
	type: String,  
	default: "默认的message"  
	}  
})  
// 2.注册需要触发的emit事件  
const emit = defineEmits(["increment"]);  
// 3.点击 发射emit事件 按钮的回调  
const emitEvent = () => {  
	console.log('子组件拿到父组件传递进来的message:' + props.message)  
	emit('increment', 1) // 触发 increment 事件，传递参数：1  
}  
</script>
```

可以看到，我们使用`defineProps`函数来给组件定义了message属性，使用`defineEmits`函数来给组件注册了increment事件，并返回emit函数。当点击button时，先打印父组件传递进来的message，然后使用emit函数来触发事件。

> 如何查看当前项目依赖Vue的具体版本：可看node_modules/vue/package.json文件中的version属性。\

接着修改App组件，代码如下所示:

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">  
	App组件  
	<!-- <ScriptSetupExample></ScriptSetupExample> -->  
	<DefinePropsEmitAPI message="App传递过来的message" @increment="getCounter"/>  
	</div>  
</template>  
<script setup>  
	import { ref } from 'vue'  
	import ScriptSetupExample from './ScriptSetupExample.vue';  
	import DefinePropsEmitAPI from './DefinePropsEmitAPI.vue';  
	const getCounter = (number)=> console.log('App 组件拿到子组件传递过来的number：' + number)  
</script>
```

可以看到，我们先导入`DefinePropsEmitAPI`组件，接着在template中使用该组件时，给它传递了message属性和监听了increment事件 。

保存代码，运行在浏览器后点击`发射emit事件`按钮，便会调用emitEvent函数，控制台输出如图]所示：

![defineProps和defineEmits的使用](https://pic.imgdb.cn/item/65cd86ca9f345e8d03402191.jpg)

有关于`defineProps` 和 `defineEmits` 函数，我们还需要注意的是：

- `defineProps` 和 `defineEmits` APIs都是只在 `<script setup>` 中才能使用的**编译器宏**。他们不需要导入且会随着 `<script setup>` 处理过程一同被编译掉。
    
- `defineProps` 接收与 `props` 选项相同的值，`defineEmits` 也接收 `emits` 选项相同的值。
    
- `defineProps` 和 `defineEmits` 在选项传入后，会提供恰当的类型推断。
    
- 传入到 `defineProps` 和 `defineEmits` 的选项会从 setup 中提升到模块的范围。因此，传入的选项不能引用在 setup 范围中声明的局部变量。这样做会引起编译错误。但是，它_可以_引用导入的绑定，因为它们也在模块范围内。

### 7.3. defineExpose

使用 `<script setup>` 语法的组件是**默认关闭**的，即通过模板 ref 或者 `$parent` 链获取到的组件的公开实例，该实例是不会暴露任何在 `<script setup>` 中声明的绑定。所以为了在 `<script setup>` 语法组件中明确要暴露出去的属性，我们需要使用 `defineExpose` 编译器宏。

我们在`12_script_setup顶层编写方式`文件夹下新建：`DefineExposeAPI.vue`组件。

DefineExposeAPI.vue子组件，代码如下所示：

```html
<template>  
	<div style="border:1px solid #ddd;margin:8px">  
		DefineExposeAPI 组件  
	</div>  
</template>  
<script setup>  
import { ref } from 'vue'  
const age = 18 // 普通数据  
const name = ref('coderwhy') // 响应式数据  
const showMessage = ()=>{console.log('showMessage方法')} // 方法  
// 该组件暴露出去的属性（ age,name,showMessage ）  
defineExpose({age,name,showMessage})  
</script>
```

可以看到，我们在该组件中定义了age，name和showMessage方法，然后通过`defineExpose` API将这3个属性暴露出去。

接着修改App组件，代码如下所示（省略的代码已注释）:

```html
<template>  
	<div class="app" style="border:1px solid #ddd;margin:4px">App组件  
	.....  
		<DefineExposeAPI ref="defineExposeAPI"></DefineExposeAPI>  
	</div>  
</template>  
  
<script setup>  
	import { ref, watchEffect } from 'vue'  
	....  
	import DefineExposeAPI from './DefineExposeAPI.vue';  
	// 获取DefineExposeAPI组件的实例和该组件暴露的属性  
	const defineExposeAPI = ref(null)  
	watchEffect(()=>{  
	console.log(defineExposeAPI.value) // 组件的实例  
	console.log(defineExposeAPI.value.name) // 响应式数据  
	console.log(defineExposeAPI.value.age)  
	defineExposeAPI.value.showMessage()  
	}, {flush:"post"})  
	....  
</script>
```

可以看到，我们用ref定义了`defineExposeAPI`变量，并绑定到`DefineExposeAPI`组件的ref属性上来获取该组件的实例。然后在watchEffect函数中获取该组件实例和该组件暴露出来的：`name，age和showMessage`属性。

保存代码，运行在浏览器后，控制台输出如图10-31所示。即父组件App可以访问到子组件暴露出来的`name，age和showMessage`属性。

![defineExpose的使用](https://pic.imgdb.cn/item/65cd87c39f345e8d0342ad42.jpg)



### 7.4. useSlots和useAttrs

在学习setup函数时，该函数主要有两个参数：props和context，其中context里面包含`slots，attrs，emit`三个属性。那在 `<script setup>`中应该如何拿到`slots，attrs`属性？虽然在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很罕见的（因为可以在模板中通过 `$slots` 和 `$attrs` 来访问它们）。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数。代码如下所示：

```html
<script setup>  
	import { useSlots, useAttrs } from 'vue'  
	const slots = useSlots() // 拿到该组件的插槽，等于setup函数中的context.slots  
	const attrs = useAttrs() // 拿到该组件所有的属性，等于setup函数中的context.attrs  
</script>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数（需要导入后使用），它会返回与 `setupContext.slots` 和 `setupContext.attrs` 等价的值，同样也能在普通的组合式 API 中使用。

## 结语

学如逆水行舟，不进则退

`2023` `09` `22`