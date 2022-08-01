# 组件化

## 选项式组件

### 选项式组件配置

#### template

组件的模板，详细参考模板语法

#### render

无模板情况下手写渲染函数

#### mixins

混入其他选项配置

#### beforeCreate
#### create 
#### created
#### beforeMount
#### mounted
#### beforeUpdate
#### updated
#### beforeUnmount
#### unmounted
#### activated
#### deactivated
#### beforeRouteEnter
#### beforeRouteLeave
#### beforeRouteUpdate

#### name 
为当前组件定义名称，用于在自身模板中递归

## 函数式组件

函数式组件不会再创建组件实例，只会作把返回的结果作为将要渲染的vnode

函数组件参数

- props 模板传递过来的参数
- slots 模版传递的插槽


## 组件实例方法

### $self

指向作用于本身，适用于解构时

```js
	const root = {
		create(scope){
			scope === scope.$self // true
		}
	}

	const root = {
		create({$self}){
			$self.$self === $self // true 
		}
	}
```


### $instance

组件树实例，正常情况下不需要访问组件实例

### $refs

获取当前元素或组件的ref引用, 一定要在挂载完成之后

```js
let root = {

    template: /*html*/`

        <h1 ref="title"></h1>

    `,

    create({ $refs}: any) {

        onMounted(() => {

            console.log($refs.title.innerText = 'hello');

        })

    }

}
```

### $uid

组件级别的uid，在同一组件内，uid始终相同

### $uuid

每次访问均返回唯一的id

### $el

获取当前组件最外层元素

如果组件只有一个根元素，返回该元素
如果有多个元素，会返回一个数组
如果根接节点中存在组件，不管是有状态组件还是无状态组件，都会返回逐层向下寻找，直到找到dom元素，归根到底就是$el 返回的始终都是该组件最外层的元素

```js
let root = {

    components: {

        tom: { template: `<h6> 我是 tom </h6>` },

        jerry: { template: `<h6> 我是 jerry </h6>` },

    },

    template: /*html*/`

        <h1> 猫和老鼠 </h1>

        <tom>

        <jerry>

    `,

    create({ $self }: any) {

        onMounted(() => {

            console.log($self.$el);

        })

    }

}
```

### $root

返回根组件实例

### $props

$props 返回的是该组件接受的全部属性，包括定义的props，emits或是为接收的attrs

### $attrs

未定义props或emits的属性

### $slots

返回组件接收的插槽，一个对象形式

### $parent

返回父实例

### $nextTick

下一任务队列执行

### $querySelector

在当前组件内寻找元素

### $querySelectorAll

在当前组件内寻找所有元素

### $emit

触发组件事件

### $on

注册组件事件
### $off
解绑组件事件
### $once
注册一次性事件
