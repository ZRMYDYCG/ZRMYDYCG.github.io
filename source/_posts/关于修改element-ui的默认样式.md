---
title: 关于修改element-ui的默认样式
date: 2024-02-13 18:10:59
tags: Vue开发心得
categories:
  - Vue提升小册
cover: https://pic.imgdb.cn/item/65cb3bef9f345e8d03c7b663.jpg
---
## 前言
修改 `element-ui` 组件的默认样式一直是一个老生长谈的话题，在做完公司的一整个项目后，我总结了以下 `4` 种修改 `element-ui` 默认样式的方法。

## 1. 使用全局统一覆盖

针对一些通用的、样式固定的组件，可以全局处理，其方法是新建一个 `css` 或者 `scss` 文件，覆盖 `element` 原有的 `class`
你可以在 `src` / `styles` 目录下新建一个 `element-ui-reset.scss`，根据 `UI` 的需要，修改原有的 `class` 名称
使用 `scss` 的好处是可以使用变量，来应对 `UI` 的不同变化
比如我们常用的按钮、分页、复选框等组件，在 `UI` 中基本都是同样的设计，那么我们就可以统一修改这些样式

`element-ui-reset.scss`

```css

$danger-btn-color: #F25454;
$primary-btn-color:#3d66e4;
$success-btn-color:#12A763;


//修改默认按钮颜色
.el-button--primary{
	background-color: $primary-btn-color;
	border-radius: 4px;
	//border: 1px solid $primary-btn-color;
	font-size: 16px;
	border: 0;
	
}

//修改危险按钮的颜色
.el-button--danger{
	background-color: $danger-btn-color;
	border-radius: 4px;
	//border: 1px solid $danger-btn-color;
	font-size: 16px;
	border: 0;
}

//修改成功按钮的颜色
.el-button--success{
	background-color: $success-btn-color;
	border-radius: 4px;
	//border: 1px solid $success-btn-color;
	font-size: 16px;
	border: 0;
	
}

//修改默认按钮的颜色
.el-button--default{
	font-size: 16px;
	border-radius: 4px;
}


//修改成功按钮的颜色
.el-button--warning{
	//background-color: $success-btn-color;
	border-radius: 4px;
	//border: 1px solid $success-btn-color;
	font-size: 16px;
	border: 0;
	
}


//修改分页颜色
.el-pagination{
	position: absolute;
	display: inline-block;
	margin: 0 auto;
	left:50%;
	transform: translateX(-50%);
	background-color: #fafafa;
	border: solid 1px #dfe8eb;
	padding: 0 !important;
	.el-pager{
		margin: 0 !important;
		.number{
			color: #3d66e4 !important;
			border-left: 1px solid #dfe8eb;
			border-right: 1px solid #dfe8eb;
			background-color: #fafafa !important;
			&.active{
				color: #fff !important;
				//border: 1px  solid  #3d66e4;
				background-color: #3d66e4 !important;
				border: 1px solid #3d66e4 !important;
			}
		}
		
	}
	
}	

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
	margin: 0 !important;
	background-color: #fafafa !important;
}


//修改checkbox
.el-checkbox__inner{
	  border: 1px solid #C0C0C0 ;
	  width: 16px;
	  height: 16px;
	  border-radius: 0;
}
```

然后在你的 `main.js` 中引入

```js
import './src/styles/element-ui-reset.scss' 
```


优点

- 全局覆盖，省事
- 使用scss更加灵活
- 可以随时删除样式的覆盖

缺点

- 局部修改时需要重新覆盖
- 所有被修改的组件样式都是一样的

## 2. 在.vue文件中修改

这种方法是在vue文件中新加一个style标签，用于修改一些特定的组件样式，但不会全局应用，比如，某个.vue文件中需要一个特别定制的table组件，而其它文件则需要用原来的样式，这样，我们最好的处理方式就是在.vue文件中新加一个style标签。

在这里修改table的默认样式

```html
<template>
	<div class="my-class">
            <el-table>
            </el-table>
        </div>
</template>

<script>
</script>

<style scoped="scoped" lang="scss">
</style>

<style>
	
    /* 修改element-ui中table组件的样式 */

    .my-class__expand-column .cell {
            display: none;
    }

    .my-class .el-table tbody tr:hover>td {
            cursor: pointer;
    }


    .my-class .el-form .el-form-item  .el-input__inner:focus{
             border: 1px solid #3D66E4;
       }

   
</style>
```

但请注意，一定要加上唯一的作用域 即最外层的 `class` 名，比如我上面的 `my-class`。 它限定了当前 `table` 的修改样式只能在该 `class` 以及其子元素中生效。

否则，`table` 的样式仍会全局覆盖

当然，如果你愿意，可以将 `class` 换成 `id`，这样保证了 `class` 名不会冲突

```html
<template>
	<div id="my-class">
            <el-table>
            </el-table>
        </div>
</template>

<style>
	
    /* 修改element-ui中table组件的样式 */

    #my-class__expand-column .cell {
            display: none;
    }

    #my-class .el-table tbody tr:hover>td {
            cursor: pointer;
    }


    #my-class .el-form .el-form-item  .el-input__inner:focus{
             border: 1px solid #3D66E4;
       }

  
</style>
```

这种方式的好处在于你可以动态的绑定某些 `class`

```html
 <template>
	<div id="my-class">
            <el-table :class="my-table">
            </el-table>
        </div>
</template>

<style scoped="scoped" lang="scss">
</style>

<style>
	
    /* 修改element-ui中table组件的样式 */

    #my-class__expand-column .cell {
            display: none;
    }

    #my-class .el-table tbody tr:hover>td {
            cursor: pointer;
    }


    #my-class .el-form .el-form-item  .el-input__inner:focus{
             border: 1px solid #3D66E4;
       }

    #my-class .my-table {
    
    }

</style>
```

优点

- 灵活自定义,可以动态绑定

- 不会全局修改

缺点

- 需要指定唯一的 `class` 作用域


## 3. 修改组件的style样式
这种方法我不是很推荐，抛开冗余不说，其实不敢保证其生效(依赖element-ui源码的支持程度)。

但是，对于某些**使用频率很低但需要动态绑定属性的组件**，你可以使用它

比如这个`<el-backtop>`组件，我可能需要给它绑定一些动态的样式属性

这样你就可给它绑定style

```html
<el-backtop target="" :bottom="100" >
	  <div :style="{
       height: 100%;
       width: _width;
       background-color: #f2f5f6;
       box-shadow: 0 0 6px rgba(0,0,0, .12);
       text-align: center;
       line-height: 40px;
       color: #1989fa;
       border-radius: 50%;
   }">

      <i class="el-icon-caret-top"></i>
    </div>
</el-backtop>
        
        
  data() {
   return{
     _width: 50%
   }
  }
```

优点

- 灵活方便

- 动态绑定

缺点

- 冗余

- 耦合性高

## 4. 参考element-ui官方文档的api

有些组件官网给了修改样式的api，你可以按照api来指定组件的样式。


优点

- 官方

缺点

- 支持组件较少


## 疑问

- 为何要新加一个style标签 ?

因为在实际使用过程中，我发现写在带有 `scoped` 属性的某些 `class` 并不对 `element-ui` 的组件生效

这造成有的修改样式可以用，有的不可以，所有就索性重新写了了 `style` 标签

- 为何不用 `!important` 属性

这家伙太霸道了，比全局修改还要强制。况且写起来很麻烦

- 为何不用 `::v-deep` 穿透

首先，抛开写法恶心来说，其耦合性太高

假如在你不需要样式覆盖的时候，你只需要删除新的 `style` 标签
而用 `::v-deep` 的话，逐行去改谁受得了

## 总结

上面的方法并不是很官方的做法，而是我日常开发中踩坑后，总结出来的方法

虽说不太完美，但很大程度上解决我的问题

如果你有好的方法或者觉得我有什么错误和遗漏，欢迎评论区指出一下

评论区

`最新` | `最热`


![](https://pic.imgdb.cn/item/65cb41209f345e8d03d7023b.jpg)


![](https://pic.imgdb.cn/item/65cb41389f345e8d03d7402a.jpg)


![](https://pic.imgdb.cn/item/65cb41529f345e8d03d784eb.jpg)


![](https://pic.imgdb.cn/item/65cb41649f345e8d03d7bbdf.jpg)



![](https://pic.imgdb.cn/item/65cb417c9f345e8d03d7fc4e.jpg)
