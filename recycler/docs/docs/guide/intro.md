# 介绍

::: tip 提示
crush 是一个类vue的框架，确保你足够的了解vue，这样能方便快速上手crush，
并且还有一些其他库的使用经验，如vue-router，vuex，
sass或less等css预处理语言
:::

## crush 是什么 ？

>1.crush是一个英语单词，可以用作名词和动词，可以翻译为压破、压碎，等等。
>
>2.crush作为名词，还有一层意思：就是 “短暂地、热烈地但又是羞涩地爱恋” 。


*以上来源百度百科*

## 计数器例子

下面是一个简单的计数器案例，我们可以看到绝大部分语法和vue相同，但我们并没有提供data和methods这种声明状态和方法的api，
而是直接提供了一个与setup对应的初始化方法（create），并且传入的形参作为组件的作用域

我们可以直接在其身上挂载状态，方法，或者是使用props，并且作用域身上还提供了一系列方法函数等（会陆续讲解）


```html
<div id="app">
    <button @click="count++"> {{ count }} </button>
</div>
<script>

    Crush.createApp({
        create($){
            $.count = 0 
        }
    }).mount('#app')

</script>
```

*看到这可能会有疑惑，这不就是vue吗，接着看*

crush最重要的是提供了style的处理方案，试想一下如何让上面的例子变得更花哨，比如点击按钮变色之类的，

例如：当count为奇数时，按钮为红色，双数时，按钮为蓝色，我们可以这样做

```html
<div id="app">
    <style>
        button{
            $background-color: count%2 === 0 ? 'blue' : 'red' ; 
        }
    </style>
    <button @click="count++"> {{ count }} </button>
</div>
<script>

    Crush.createApp({
        create($){
            $.count = 0 
        }
    }).mount('#app')

</script>
```

我们为css也提供了一种使用javascript的能力，其中$符号代表动态绑定的一条属性，灵感来源 （sass）

只不过我们声明或操作时，均是在js中进行，相比于其他框架，crush为css赋予了javascript的能力，
这还是只冰山一角，想了解更多请进入教程来学习吧！
