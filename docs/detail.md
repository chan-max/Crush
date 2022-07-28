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

