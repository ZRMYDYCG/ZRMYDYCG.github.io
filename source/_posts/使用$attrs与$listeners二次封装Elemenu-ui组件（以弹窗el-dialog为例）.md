---
title: 使用$attrs与$listeners二次封装Elemenu-ui组件（以弹窗el-dialog为例）
date: 2024-02-13 17:41:50
tags: 组件封装
categories:
  - Element-Ui
cover: https://pic.imgdb.cn/item/65cb3a3e9f345e8d03c2c026.jpg
---

## 前言

element-ui提供了很多方便的UI组件，但是使用的时候，特别是频繁使用到一个模块时候，经常需要进行二次包装，比如弹窗，很多弹窗需要加一些确定，取消按钮需要一些固定的模板套路，这些都可以利用二次封装实现。


## 一、二次封装基本套路

实现二次封装功能的模板：子组件

```html
<template>
  <el-dialog :visible.sync="visibleDialog">
    <!--内容区域的默认插槽-->
    <slot></slot>
    <!--使用弹框的footer插槽添加按钮-->
    <template #footer>
      <!--对外继续暴露footer插槽，有个别弹框按钮需要自定义-->
      <slot name="footer">
        <!--将取消与确定按钮集成到内部-->
        <span>
          <el-button @click="$_handleCancel">取 消</el-button>
          <el-button type="primary" @click="$_handleConfirm">
            确 定
          </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 对外暴露visible属性，用于显示隐藏弹框
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 通过计算属性，对.sync进行转换，外部也可以直接使用visible.sync
    visibleDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible",val);
      }
    }
  },
  methods: {
    // 对外抛出cancel事件
    $_handleCancel() {
      this.$emit("cancel");
    },
    // 对外抛出 confirm事件
    $_handleConfirm() {
      this.$emit("confirm");
    }
  }
};
</script>
```

父组件调用

```html
<!--外部使用方式 confirm cancel 是自定义的事件 opened是包装el-dialog的事件，通过$listeners传入到el-dialog里面-->
<custom-dialog 
:visible.sync="visibleDialog"
@opened="$_handleOpened"
@confirm="$_handleConfirm" 
@cancel="$_handleCancel"
>
	这是一段内容
</custom-dialog>
```

## 二、利用$attrs 与 $listeners二次改造

上面一般的套路有个问题，dialog 自身的属性和事件无法暴露在外面，只能通过`props`和 `$emit`一个个添加，这时候可以使用`$attrs`与`$listeners`。

1、`$attrs`与`$listeners`介绍

:::details $attrs

当组件在调用时传入的属性没有在props里面定义时，传入的属性将被绑定到$attrs属性内（class与style除外，他们会挂载到组件最外层元素上）。

并可通过v-bind="$attrs"传入到内部组件中

:::

---------------------------------

:::details $listeners

$listeners: 
当组件被调用时，外部监听的这个组件的所有事件都可以通过`$listeners`获取到。并可通过`v-on="$listeners"`传入到内部组件中。
:::

---------------------------------

2、修改弹框代码

```html
<!---使用了v-bind与v-on监听属性与事件-->
<template>
    <el-dialog :visible.sync="visibleDialog" v-bind="$attrs" v-on="$listeners">
    <!--其他代码不变-->
    </el-dialog>
</template>
<script>
  export default {
    //默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 
    //将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
    //通过设置 inheritAttrs 到 false，这些默认行为将会被去掉
    inheritAttrs: false
 }
</script>
```

3、外部调用

```html
<!---外部使用方式-->
<custom-dialog
  :visible.sync="visibleDialog"
  title="测试弹框"
  @opened="$_handleOpened"
>
  这是一段内容
</custom-dialog>
```


## 结语

学如逆水行舟，不进则退

`2024` `2` `13`