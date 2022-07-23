# 模板语法
---
## html 拓展

crush的模板语法是基于html的拓展上手简单，语法简洁

### 插值

```
    <div> {{name}} </div>
```

### 属性绑定

```
    <div $id="uid"></div>
```

### 属性简写

```
    <div id></div>
        等同于
    <div id="id"></div>

    <div $id></div>
        等同于
    <div $id="id"></div>

    <div @event></div>
        等同于
    <div @event="event"></div>
```

### 事件绑定
```
    <button @click="login"></button>
```

### 指令

```
    <input --focus>
```

### 动态属性

支持属性，事件，指令

```
    <div @(event)="" $(attr)="" --(dir)="" > </div>
```

### 条件渲染

框架内置了 if，else-if，else 标签与指令
指令适用于

如下

指令适用于单个元素，标签适用于多个元素

```
    <h6 if="isAdmin"> 管理员 </h6>
    <h6 else-if="isUser"> 用户 </h6>
    <h6 else> 游客 </h6>
    <if condition="isLoign">
        <h1> 111 </h1>
        <h2> 222 </h2>
    </if>
```

### 循环渲染

```
    <li for="i in 6"> {{i}} </li>
    
    <for iterator="i in 6">
        <li> {{i}} </li>
    </for>
```

### id 和 class 

### id 简写

```
    <div #app></div>
    等同于
    <div id="app"></div>

    支持动态
    <div #(exp)></div>
    等同于
    <div $id="exp"></div>
```

### class 简写

```
    <div .box></div>
    等同于
    <div class="box"></div>

    支持动态
    <div .(exp)></div>
    等同于
    <div $class="exp"></div>


    支持多个
    <div .x .y .z></div>
    等同于
    <div class="x y z"></div>
```

### class 数据形式
    
- object （值为真值时采用key）
- array
- string
- function （采用返回值）

### 行内样式

- object
- array
- string
- function （采用返回值）


## css拓展

crush提供的css模板是基于原生css的一种拓展，目标是对原生css的功能拓展，但目前无法（或者说以后也不会）兼容全部原生css语法，因为总有一些语法对crush自身是无价值的，但会尽可能兼容大部分语法。


---

### 动态属性值绑定

```
	div{
		$background-color: 'red' ;
	}
```

与html模板中相同，使用  $ 来绑定动态的属性值，至可以为任意的 js 表达式

关于属性值的类型，图中是一段字符串，可以直接用于设置css的属性，但对于具有多个属性的样式，可以用一个数组里表达，如下

```
	div{
		$border:[ '1px' , 'solid' , 'green'];
	}
	
	相当于
	
	div{
		border: 1px solid green;
	}
```

最终值都会转成字符串进行渲染


### 关于 important

想要设置一个important的属性正常情况应该是这样,直接在后面添加 **!important**

```
	div{
		border: 1px solid green !important;
	}
```

但当使用动态绑定时，我们使用的是一段js表达式，在保证值是字符串的情况下，我们可以动态拼接上去

```
	div{
		background: 'yellow' + '!important';
	}
```

但对于其他情况，有一种更加简洁简便推荐的写法

```
	div{
		background!: 'yellow';
	}
```

直接在属性名称后添加感叹号  ! 


### 动态的属性名称

```
	div{
		(property):  ;
	}
```

属性小括号内可以包含表达式，根据不同的内容渲染出不同的css样式


### 样式混入

对于普通的css多条样式，我们可以用一个对象结构来表达，例如

```
	cosnt divStyle = 
	{
		color:'red',
		backgroundColor:'yellow',
	}
```


并且使用mixin语法在css模板中使用，并且不影响其它的属性，但是注意，下面的样式具有更高的优先级，重复的属性会覆盖，如下面的 background 最终会是黑色。

```
	div{
		...divStyle;
		background-color:black;
	}
```

混入是一种 css in js 特别重要的一个特性，后面章节我们会用更多例子进行探讨。

### js 中的 important

如果我们使用 动态值绑定 ，或者样式混入等，当我们想设置属性的优先级时（important），一种方法时在字符串后面加上 **!important** ，但模板语法中的在属性值后面感叹号并不适用，我们内部提供了一个 important 方法 ，入下

```
	import {important} from 'crush'
	
	{
		color: important('red') ,
	}
```

这样的话渲染器就会帮我们渲染一个高优先级的color属性，并且我们建议需要设置高优先级的的属性，始终使用 important 方法 ， 但不代表建议使用 important 


### 动态的选择器

之前的部分我们介绍了动态的属性值，动态的属性名称等，对于选择器我们也提供了动态语法，
如下

```
	$(...):hover
```

使用 $() 包裹的内容会被视为 js表达式，并在渲染时替换相应的内容，   这样可能不太直观，之后我们会创建出更多抽象的例子


### css 嵌套 

如果之前使用过sass，less等预处理语言的话，我们会发现其中一个重要的特性，就是css规则嵌套，能帮助我们大量减少代码量，增加代码可读性，

我们看一个最基本的例子

```
	body {
		h1{
			color:red;
		}
	}
```

相当于

```
	body h1{
		color:red;
	}
```

内层的样式会基层外部的选择器作为父选择器，这是一种默认的合并策略。


### 嵌套中的父选择器 & 

对于基本的嵌套，会采用父子选择器的形式，但我们提供了一种新的合并策略 ，在子选择器中使用 & ， 所有出现的 & 都会被替换为父选择器的内容 

```
	a{
		&:hover{
			color:yellow;
		}
	}
```

相当于 

```
	a:hover{
		color:yellow;
	}
```


### css中的逻辑语句

### if

### else-if

### else

与模板语法中的条件渲染相同，根据值来决定是否渲染当中的内容

```
	if(?){
		h1{
			color:red;
		}
	}
	
	else-if(?){
		h2{
			color:red;
		}
	}
	
	else{
		h3{
			color:red;
		}
	}

```

需要注意的是 同时使用 if else 时 ，需要保证一定要在同级下，并且内部可以任意包含任何内容，
最小的单元为 一条样式


### for

重复渲染对于css也一样重要

```
	for(i in 6){
		h$(i){
			color:red;
		}
	}
```

相当于

```
	h1{
		color:red;
	}
	h2{
		color:red;
	}
	h3{
		color:red;
	}
	h4{
		color:red;
	}
	h5{
		color:red;
	}
	h6{
		color:red;
	}
```

上面的例子我们通过重复渲染配合动态的选择器，实现了h1 - h6的样式设置

