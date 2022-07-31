# 细节功能

## 寻找元素

### $querySelector

实例方法，用于寻找当前组件中的元素或者组件

与document.querySelector不同的是 , 该方法只会在当前组件中寻找元素，并且可以寻找组件实例

### $querySelectorAll

寻找所有元素

---

支持的选择器

- id
- class
- 标签

```js

const app = {
	template:`
	<div>
		<h1 #title></h1>
	</div>
	`,
	create({$querySelector}){
		onMounted(() => {
			// 挂载后才能获取到元素
			let title = $querySelector('#title')
		})
	}
}

```

配合id和class简写使用起来特别方便


## ref

ref 也是在组件中获取元素的一种方式

## 组件递归

组件允许在自身模板中递归组件，并提供了一下三种方法，它们作用是相同的，你可以选择你最喜欢的方法

### 选项式配置 name

在选项式组件中定义一个name属性

```js
	let root = {
		name:'hello',
	    props: {
	        count: {
	            type: Number,
	            default: 20
	        }
	    },
    template: `
        <h1> {{count}} </h1>
        <hello if="count" $count>
    `,
    create({ $self }: any) {
        $self.count--
	   }
	}
```

### create方法 defineSelfName
这是在create中提供的一个方法，与上述作用相同

```js
let root = {
	    props: {
	        count: {
	            type: Number,
	            default: 20
	        }
	    },
    template: `
        <h1> {{count}} </h1>
        <hello if="count" $count>
    `,
    create({ $self }: any) {
	    defineSelfName('hello')	
	    $self.count--
	}

}
```

### 内置标签 self

```js
	let root = {
	    props: {
	        count: {
	            type: Number,
	            default: 20
	        }
	    },
    template: `
        <h1> {{count}} </h1>
        <self if="count" $count>
    `,
    create({ $self }: any) {
        $self.count--
    }

}
```


## 防抖与节流 debounce & throttle

内部提供了防抖与节流方法,并且直接挂载在作用域上，使用如下

```js
let root = {
    template: /*html*/`
        <button @click="add"> {{count}} </button>
    `,
    create({ $self, debounce }: any) {
        $self.count = 5
        $self.add = debounce(() => {
            $self.count++
        }, 2000)
    }
}
```

还有一种是在模板中直接使用，相比与正常的方法有些不同，在模板中使用时为了使其能够正常工作框架内部做了特殊的处理，但用户不需要特殊关注，使用如下

```js
let root = {
    template: /*html*/`
        <button @click="debounce(add,2000)"> {{count}} </button>
    `,
    create({ $self}: any) {
        $self.count = 5
        $self.add = () => {
            $self.count++
        }
    }
}
```


### 异步组件

#### defineAsyncComponent

