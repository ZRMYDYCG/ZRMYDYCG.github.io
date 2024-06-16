---
title: vue中封装组件利器：$attrs、$listeners的使用
date: 2024-02-13 17:51:58
tags: Vue开发心得
categories:
  - Vue提升小册
cover: https://pic.imgdb.cn/item/65cb3bef9f345e8d03c7b663.jpg
---
## 前言

多级组件嵌套需要传递数据时，通常使用的方法是通过`vuex`。但仅仅是传递数据，不做中间处理，使用 `vuex` 处理，未免有些大材小用了。所以就有了 `$attrs` 、 `$listeners`两个属性 ，通常配合 inheritAttrs 一起使用。

**说白了就是为了父子组件深层嵌套的方便传值。**
## $attrs

- 从父组件传给自定义子组件的属性，如果没有 `prop` 接收会自动设置到子组件内部的最外层标签上，如果是 `class` 和 `style` 的话，会合并最外层标签的 `class` 和 `style`。
- 如果子组件中不想继承父组件传入的非 `prop` 属性，可以使用 `inheritAttrs` 禁用继承，然后通过 `v-bind="$attrs"` 把外部传入的 非 `prop` 属性设置给希望的标签上，但是这不会改变 `class` 和 `style`。

## inheritAttrs 属性 [官网链接](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fapi%2F%23inheritAttrs "https://cn.vuejs.org/v2/api/#inheritAttrs")

> 2.4.0 新增

- **类型**：`boolean`
    
- **默认值**：`true`
    
- **详细**：
    
    默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 `inheritAttrs` 到 `false`，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例 property `$attrs` 可以让这些 attribute 生效，且可以通过 `v-bind` 显性的绑定到非根元素上。
    
    注意：这个选项**不影响** `class` 和 `style` 绑定。

例子：

> 父组件

```html
<template>
  <my-input
      required
      placeholder="请输入内容"
      type="text"
      class="theme-dark"
  />
</template>

<script>
import MyInput from './child'
export default {
  name: 'parent',
  components: {
    MyInput
  }
}
</script>
```

> 子组件

```html
<template>
  <div>
    <input
        v-bind="this.$attrs"
        class="form-control"
    />
  </div>
</template>

<script>
export default {
  name: 'MyInput',
  inheritAttrs: false
}
</script>
```

子组件中没有接受父组件中传过来的值，也没有绑定，但是有`v-bind="$attrs"`这个属性，他会自动接受并绑定，

如下，除了 `style` 、`class` 外，就可以看到 `v-bind="$attrs"` 可以指定非 `props` 的绑定位置，当结合 `inheritAttrs: false` 使用时，就可以禁止非 `props` 绑定到根组件上了。

inheritAttrs: false

![](https://pic.imgdb.cn/item/65ca0a5f9f345e8d0394bec6.jpg)

inheritAttrs: true

![](https://pic.imgdb.cn/item/65ca0a809f345e8d0395343d.jpg)


## $listeners

- **listeners**: 包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。它可以通过 `v-on="this.$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。

**父组件**

```html
<template>
  <div>
    father
    <Son 
      @med1="med1"
      @med2="med2"
      @med3="med3" 
    />
  </div>
</template>

<script>
import Son from "./Son.vue";
export default {
  name: "father",
  components: { Son },
  methods: {
    med1() {
      console.log(1);
    },
    med2() {
      console.log(2);
    },
    med3() {
      console.log(3);
    },
  },
};
</script>
```

**子组件**

```diff
<template>
  <div>
    son
+    <Grandson v-on="$listeners" />
     %% 如果一个一个绑定就太麻烦了 %%
-    <Grandson   
-      @med1="() => this.$emit('med1')"   
-      @med2="() => this.$emit('med2')"   
-      @med3="() => this.$emit('med3')"   
-    />
  </div>
</template>
```

**孙子组件**

```JavaScript
export default {
  name: "Grandson",
  inheritAttrs: false,
  created() {
    this.$emit("med1");
    this.$emit("med2");
    this.$emit("med3");
  },
};
```

如上我们可以看到子组件就起到了一个很好的过渡作用了。