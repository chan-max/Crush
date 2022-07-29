# 响应式

## 响应式数据

### reactive

将数据变成响应式类型 ，支持的类型如下

- Object
- Array
- Map
- Set
- WeakMap
- WeakSet

```js
	let user = reactive({name:'tom',age:12})
```

### readonly

定义一个只读数据，接受类型与响应式数据相同

### shallowReactive

浅响应式数据

### shallowReadonly

浅只读式数据

### ref

接收一个任意值，并返回一份ref实例，ref身上的value属性执行传入的值，并会对访问和修改进行依赖收集

#### ref 的参数

ref除了传入需要响应式的值之外，还有个配置参数

##### shallow

默认情况下 ，shallow选项为false ， 如果ref的值是一个可代理的类型，那么也会变成响应式

##### sensitive

默认为false， 指定为true的情况下， ref的值只要改变了，即使前后的值完全相同，也会触发响应

### computed

computed 本质也是ref，需要通过 value来访问值 ， 参数为 一个引用了其他响应式数据的gettter，getter的返回值会作为computed的值，并且每次响应式的值改变后都会重新计算

## 数据侦测

### watchReactive

侦测一个响应式数据的变化 ， 参数为响应式数据和回调函数，该方法是深度侦测，即深层的数据改变也会出发触发响应，回调中拿到的参数有 

- 改变的目标
- 改变的key值
- 设置的新值
- 设置的旧值


### shallowWatchReactive

浅度侦测响应式数据 ，回调中的参数有所改变，少了第一个目标，因为是浅侦测目标只有一个


### watchTargetKey

侦听某一个响应式数据的key值

### watchRef

侦测一个ref值，回调中拿到新值与旧值

### watchComputed

侦测一个computed值，回调中拿到新值与旧值

## 工具方法

### isReactive

### isReadonly

### isRef

### isComputed

## 副作用

### effect 