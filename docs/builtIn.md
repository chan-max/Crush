# 框架内置

## 内置标签

### if

必须传入唯一的condition属性，用于控制子节点是否渲染

### elseIf

配和if使用，也需要传入condition

### else

配合else-if使用，不需要传入任何属性


```js
let root = {
    template: /*html*/`
        <button @click="count++"> {{count}} </button>
        <if condition="count<10">
            <h1> 小于10 显示 </h1>
        </if>
        <else-if condition="count<20">
            <h3> 小于20大于10显示 </h3>
        </else-if>
        <else>
            <h5> 大于20显示 </h5>
        </else>
    `,
    create({ $self }: any) {
        $self.count = 0
    }
}
```

### for

用于循环所有的子元素，传入唯一的iterator属性，相比于for属性，好处在于支持多个根子节点

```js
let root = {
    template: /*html*/`
        <button @click="count++"> {{count}} </button>
        <for iterator="i in count">
            <h1> {{i}} </h1>
        </for>
    `,
    create({ $self }: any) {
        $self.count = 5
    }
}
```

### slot

用于使用父组件传递过来的插槽内容

name属性用来渲染指定的具名插槽 ，默认为default， 其他属性会作为插槽作用域

### template fragment

template 和 fragment作用完全相同

可以使用的属性有 if，else-if，else，for，slot


### element

用于生成动态的元素,  is属性代表将要渲染的标签，其他属性会作为元素的属性

```js
let root = {

    template: /*html*/`
        <button @click="count++"> 切换 </button>
        <element $is="count%2===0 ? 'h1' : 'h2'"> 
	        当前标签： {{count%2 ===0 ? 'h1' : 'h2'}} 
        </element>
    `,
    create({ $self }: any) {
        $self.count = 0
    }

}
```

### component
生成动态的组件，与element参数相同

```js
let root = {

    components: {
        tom: { template: `我是tom` },
        jerry: { template: `我是jerry` }

    },
    template: /*html*/`
        <button @click="count++"> 切换 </button>
        <component $is="count%2===0 ? 'tom' : 'jerry'"> 
        当前组件 {{count%2 ===0 ? 'tom' : 'jerry'}} 
        </component>

    `,
    create({ $self }: any) {
        $self.count = 0
    }

}
```

## 内置属性

### if
### elseIf
### else
### for
### slot
### show
### text
### html
### bind
用于绑定元素属性

## 内置组件

## 内置指令

## 表单双向绑定 --model

### text
适用于默认的input和textarea

```js
let root = {

    template: /*html*/`

        <h1> {{text}} </h1>
        <input --model="text">
        <textarea --model="text">

    `,

    create({ $self }: any) {

        $self.text = '只是一段文本'

    }

}
```

#### 修饰符

- lazy 侦听input还是change
- number 会尝试把输入的值转为数字
- trim 自动去除两端空白
- debounce 防抖  

### radio

```js
let root = {

    template: /*html*/`

        <h1>{{radio}} </h1>

        <input --model="radio" type="radio" name="hero" value="yasuo" >

        <input --model="radio" type="radio" name="hero" value="zed" >

        <input --model="radio" type="radio" name="hero" value="jax" >

    `,

    create({ $self }: any) {
        $self.radio = 'yasuo'

    }

}
```

使用循环更简洁

```js
let root = {

    template: /*html*/`

        <h1>{{radio}} </h1>

        <input  for="hero in heros" --model="radio" type="radio" name="hero" $value="hero" >

    `,

    create({ $self }: any) {

        $self.heros = ['yasuo', 'zed', 'jax']

        $self.radio = 'zed'

    }

}
```


### checkbox

checkbox 绑定的值必须是一个数组

```js
let root = {

    template: /*html*/`

        <h1>{{checkbox}} </h1>
        <input for="hero in heros" --model="checkbox" type="checkbox" name="hero" 
        $value="hero">

    `,

    create({ $self }: any) {

        $self.heros = ['yasuo', 'zed', 'jax']

        $self.checkbox = []

    }

}
```

### selectOne

```js
let root = {

    template: /*html*/`

        <h1>{{selected}} </h1>

        <select --model="selected">

            <option for="hero in heros">{{hero}}</option>

        </select>

    `,

    create({ $self }: any) {

        $self.heros = ['yasuo', 'zed', 'jax']

        $self.selected = ''

    }

}
```

### selectMultiple

多选的select绑定的值必须是一个数组

```js
let root = {

    template: /*html*/`

        <h1>{{selected}} </h1>

        <select --model="selected" multiple>

            <option for="hero in heros">{{hero}}</option>

        </select>

    `,

    create({ $self }: any) {

        $self.heros = ['yasuo', 'zed', 'jax']

        $self.selected = []

    }

}
```

### color

```js
let root = {

    template: /*html*/`

        <h1>{{color}} </h1>

        <input --model="color" type="color">

    `,

    create({ $self }: any) {

        $self.color = '#666666'

    }

}
```

目前只支持16进制

### range

```js
let root = {

    template: /*html*/`

        <h1>{{range}} </h1>

        <input --model="range" type="range">

    `,

    create({ $self }: any) {

        $self.range = 88

    }

}
```