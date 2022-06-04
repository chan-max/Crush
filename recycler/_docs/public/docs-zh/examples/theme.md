## style组件

###### 当一个组件只包含style元素时，它就变成了一个样式组件

例如，通过样式组件封装一个拥有夜间模式架子

```
    var theme = {
        template:`
            <style>
                
            </style>
        `,
        props:{
            theme:String
        }
    }
```
