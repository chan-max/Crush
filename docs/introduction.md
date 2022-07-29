# 入门

确保你已经安装或引用了crush ,下面让我们来创建一个应用

文件内容大概如下

```html
	<html>
		<body>
			<div id="app">
				<button @click="count++"> {{count}} </button>
			</div>
		</body>
		<script>
			let { createApp } = crush
			let rootComponent = {
				create(scope){
					scope.count = 0
				}
			}
			let app = createApp(rootComponent)
			app.mount('#app')
		</script>
	</html>
```

这是一个简单的计数器例子，下面我们来逐一分析

### createApp

我们接触到了第一个api，createApp，用于创建一个应用

参数为一个根组件，作为我们将要渲染的内容，

也可以不直接传入，通过

```
	app.rootComponent = rootComponent
```

来定义将要挂载的根组件，结果是相同的

应用创建后，我们使用了 app的mount方法，将组件挂载到页面中

正常情况下，所有组件都需要一个 template 属性来定义组件的模板，但对于根组件，如果没定义模板的情况下，会采用挂载点，上例中  *#app*   的innerHTML来替代 , 上面例子相当于

```html
		<div id="app"></div>
```

```js
		let { createApp } = crush
		let rootComponent = {
			template:`
				<button @click="count++"> {{count}} </button>
			`,
			create(scope){
				scope.count = 0
			}
		}
		let app = createApp(rootComponent)
		app.mount('#app')
```

后续出现的例子中我们会只保留核心代码

上面的例子是一个简单的计数器，只有一个按钮，每点击一次按钮会+1 , 上面的我们定义的是一个选项式组件，即一个对象形式，我们接触到了一个 template 用于定义模板和create

### 组件生命周期

#### beforeCeate  
组件初始化之前，此时刚刚创建组件实例，即将进入初始化过程

#### create
组件初始化钩子，此时能够拿到上层传来的属性，插槽等信息

create 是组件中最为重要的生命周期钩子，这个方法更像是一个初始化过程，我们虽然在选项式组件中提供了大量的配置，但在create中我们能实现几乎全部功能，后续大部分内容都会围绕该方法来讲解


#### created
组件创建完毕，所有状态，方法，侦听器等初始化完毕，即将进入挂载阶段

#### beforeMount
组件的模板挂载前
#### mounted
模板挂载后
#### beforeUpdate
组件更新前
#### updated
组件更新后
#### beforeUnmount
 组件卸载前
#### unmounted
组件卸载后


---

上述钩子中都有一个特别重要的参数  ，即 **scope**，当然作为形参你也可以任意命名，

它是当前组件的作用域，所有状态声明，方法，模板渲染都，它本质是一个响应式的对象，关于响应式我们会在后述仔细介绍

上面计数器的例子中，我们使用如下方法来定义状态

```
	scope.count = 0
```

这种写法就像设置一个对象的key值一样简单直观，设置的内容最终会供给模板使用

可以定义值，包括方法，见上述例子更改一下

```js
		let { createApp } = crush
		let rootComponent = {
			template:`
				<button @click="add"> {{count}} </button>
			`,
			create(scope){
				scope.count = 0
				scope.add = () => scope.count++
			}
		}
		let app = createApp(rootComponent)
		app.mount('#app')
```

我们双大括号的形式 绑定了作用域中的值 ， 用@绑定了事件，更多关于模板写法细节可以参考[模板语法](./template)


### 添加样式

想为组件添加样式也特别简单，我们来丰富一下上面的代码

```js
		let rootComponent = {
			template:`
				<style>
					button{
						$color: count%2 === 0 ? 'red' : 'blue' ;	
					}
				</style>
				<button @click="add"> {{count}} </button>
			`,
			create(scope){
				scope.count = 0
				scope.add = () => scope.count++
			}
		}
```

直接在模板中使用style标签即可，但这与普通的style有些区别，crush为css提供了语法拓展，
可以像绑定一个动态属性一样，为css绑定动态的js表达式 , 如上述例子中，随着count的值一直增加，按钮文字的颜色也会在red和blue之前来回切换 , 关于所有的css模板，也可以在[模板语法](./template)深入了解。