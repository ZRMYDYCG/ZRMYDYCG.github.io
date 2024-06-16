---
title: Vue项目关于样式的一些开发心得
date: 2024-02-13 17:47:57
tags: Vue开发心得
categories:
  - Vue提升小册
cover: https://pic.imgdb.cn/item/65cb3bef9f345e8d03c7b663.jpg
---

## 一、动态使用样式

使用场景：根据不同的值使用不同的样式，或者给样式某个属性设置一个变量值

使用方法：

**动态的 class**

```css
:class="[isState==true?'text':'text1']"   // isState 是 true 样式是 text，是 false 这是 text1
```

**动态的 style**

```css
<span :style="{color: scope.row.useFlag === 'Y' ? '#289C38' : '#F04646'}">
```

```css
<el-button :style="{width: buttonWidth}"></el-button>
```

```JavaScript
<script>
    computed: {
        buttonWidth: function() {
            return getLang() == 'zh_CN' ? 80 + 'px' : 90 + 'px';
        }
    }
</script>
```

**使用style设置某个变量的/值**

```css
:style="{'width':widthLength+'px'}"   // 给 width 一个变量值 widthLength
```

**使用计算属性calc(100% - 100px)**

一般只能计算宽度高度，注意中间的减号“-”，**前后一定要加空格**，并且父级的高度宽度一定要有，可以100%，否则使用无效。

**使用函数绑定样式**

```css
:style="{'color':formateTitleColor(val)}"
```

```JavaScript
//格式化标题颜色
formateTitleColor(val){
	if(val<24 && val>=0){
		return '#f7b13f'
	}
	if(val>=24){
		return '#000'
	}
	if(val<0 ){
		return '#f5616f'
	}
}
```
## 二、全局公共css样式文件

**提醒：vue工程中css文件和js文件最好都放在static文件夹下面，可以降低报错的概率。**

### 2.1 main.js中引入

在入口js文件main.js文件中引入

```JavaScript
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import '../common/mainStyle.css'   //引入全局样式
 
Vue.config.productionTip = false
Vue.use(ElementUi);
/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
```

### 2.2 index.html引入

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>styletest</title>
    <link rel="stylesheet" href="./static/css/global.css"> /*引入公共样式*/
 
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

## 三、单个vue文件中引入样式

vue文件style标签中import引入样式：

```javascript
@import "../assets/common/common.css";//自定义.css的样式路径
```

## 四、样式作用范围控制

很多时候，我们希望样式只在当前组件生效，样式可以私有化，避免影响其他的组件，造成全局的样式污染。

### 4.1 scoped私有作用域

在style标签中添加scoped属性，可以使样式只在当前的组件中生效，样式私有化。

```css
<style scoped>
.example {
  color: red;
}
</style>
```

原理：

![](https://pic.imgdb.cn/item/65ca1d1a9f345e8d03e3fc9f.jpg)


### 4.2 混合使用

在一个组件中同时使用scoped和非scoped样式。特别是对第三方组件样式的修改，想修改第三方组件的样式，又不想去掉scoped属性，影响别的组件。

**注意：组件的最外层定义唯一类，在团队开发的时候，要约定好**

```css
<style>
/* 全局样式 */
/* 将修改第三方组件的样式写在这里 */
/* 组件的最外层标签定义一个唯一类，最好将样式都写在这个类名下，以防组件间互相影响 */
</style>
 
<style scoped>
/* 本地样式 */
</style>
```

### 4.3 深度作用选择器

如果希望scoped样式中的一个选择器能够作用的更深，例如影响子组件，可以使用 >>> 操作符。

```css
<style scoped>
    .a >>> .b { /* ... */ }
</style>
```

**备注1：别名**

/deep/是>>>的别名

像[sass](https://so.csdn.net/so/search?q=sass&spm=1001.2101.3001.7020)之类的预处理器无法正确解析>>>。可以使用/deep/替代

```css
<style scoped>
    .a /deep/ .b { /* ... */ }
</style>
```

**备注2：深度选择器修改第三方组件样式**

**在第三方组件内部类外面套个类**，再利用深度选择器这样可以修改样式，且不影响其他组件

```css
<style scoped>
    外层组件类 >>> 第三方组件内部类 {
        样式
    }
</style>
```

### 4.4 动态生成的dom的样式

通过v-html创建的DOM内容不受scoped样式影响，但是仍然可以通过深度作用选择器来设置样式。

---
## 结语

学如逆水行舟，不进则退

`2024` `2` `12`