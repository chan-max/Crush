# 应用

## 创建一个应用

### createApp

```
	let app = createApp()
```

该方法用于创建一个应用，参数为将要渲染的根组件


也可以在应用创建后指定将要渲染的根组件

```
 app.rootComponent = root
```

### 应用的实例方法

#### directive
注册全局指令

```
 app.directive('name',directive)
```

#### component
注册全局组件

```
 app.component('name',component)
```

#### mixin

全局混入

```js
 app.mixin({
	 created(){
		 // do something
	 },
	 mounted(){
		 // do something
	 }
 })
```


混入的钩子会注入到每一份组件实例上

#### install

使用插件

```
 app.use(plugin)
```

插件为一个函数时自身作为install方法，或是一个提供install方法的对象

第一个参数为 app 应用实例，第二个参数为框架本身，方便使用框架本身的方法，其余参数为安装时传入的参数

#### mount

挂载组件

```
	app.mount('#app')
```

参数为一个元素或者选择器