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






