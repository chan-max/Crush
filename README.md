# Crush (suspended)

crush is a `vue like` javascript framework 

Most APIs are similar to vue , but there also are something interesting features and vue doesnt have

  *but,this project is not finished yets,I'm try my best to develop it , and I'm especially willing to find some interesting partners , talk technology together or doing something interesting*

  #### contact me
  - wechat & phone : 18742539196
  - emali : 2651308363@qq.com
  - address : DaLian , LiaoNing , China
 - github : https://github.com/chan-max/Crush
---

##### what is crush ? 

*crush is an English word that can be understood as break up , press, push , compress and so on*
*There is another meaning: "to fall in love briefly, passionately, and shyly"*

## Introduction
 *make sure you are a vue user*

### install

    npm install crushed

*the name 'crush' is registered*

## API

#### html tempalte syntax

##### Text Interpolation
    <div> {{expression}} </div>

##### Attribute Binding
    <div $id="expression"> hello world </div>
##### Dynamic Attribute Binding
    <div $(expression)="expression"> hello world </div>

##### Event Binding
    <div @click="expression"> click me </div>
##### Dynamic Event Binding
    <div @(expression)="expression"> click me </div>

##### About class
class supports those types of data
- string  
- array
- object  
*the key name is the class name ,the value determines whether it is displayed or not*

##### About style
style supports those types of data
- string
- array
- object

#### css tempalte syntax
##### Style Binding
        body{
            $backgroundColor: expression ;
        }

##### Dynamic Style Binding
        body{
            $(expression): expression ;
        }
##### About Important
    body{
        background-color!: red;
        /* so we can do this , and its a important declaration */
        $background-color!: expression ;
    }
##### Dynamic Selector
    $(expression){
        /* some declaration */
    }
##### Nesting
    body{
        h1{
            color:red;
        }
    }

*same as*

    body h1{
            color:red;
    }


##### & 

    a{
        &:hover{
            color:red;
        }
    }

*same as*

    a:hover{
            color:red;
    }

##### Bubbling At-Rule
    body{
        @media (min-width:900x){
            background-color:red;
            h1{
                color:red;
            }
        }
    }

*same as*

    @media (min-width:900x){
        body{
            background-color:red;
        }
        h1{
            color:red;
        }
    }

##### Mixins
    body{
        ...myBodyStyle;
        /* 
            'myBodyStyle' is a javascript object, like 
            {
                backgroundColor:'blue',
                color:red;
            }
         */
    }

#### Directives

##### if

an element

    <div --if="expreession">now you see me now you dont</div>

elements 

    <if condition="expression">
        <h1>111</h1>
        <h2>222</h2>
    </if>

in css

    if(expression){
        body{
            background-color:red;
        }
    }

##### else-if
*refer to if*
##### else
*refer to if*

##### for

an element

    <li --for="i in 10"> {{i}} </li>

elements

    <for iterator="i in 10">
        <h1> {{i}} </h1>
        <h2> {{i}} </h2>
    </for>

in css

    for(i in 6){
        h$(i){
            /* use dynamic selector */
            color:red;
        }
    }

*same as*

    h1 { color:red; }
    h2 { color:red; }
    h3 { color:red; }
    h4 { color:red; }
    h5 { color:red; }
    h6 { color:red; }
    
##### Custom Directives

hooks :

- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

#### App

##### createApp

    var app = Crush.createApp(/*rootComponent*/)

##### mount

    app.mount('#app')

##### components register 

    app.component(componentName,ComponentOptionKeys)

##### directives register 

    app.direvtive(directiveName,directiveOptions)

#### component options

hooks :
- beforeCreate
- created
- beforeMount 
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

##### create

the `create` hook is the most important hook in crush , just like `setup` in vue

actually , we can do almost anything in create , just like 

    create(scope){
        scope.count = 0 // state
        scope.add = () => scope.count++ // methods

        onCreated(() => {
            // created
        })

        onBeforeMount(() => {
            // beforeMount
        })

        onMounted(() => {
            // mounted
        })

        onBeforeUpdate(() => {
            // beforeUpdate
        })

        onUpdated(() => {
            // updated
        })

        onBeforeUnmount(() => {
            // beforeUnmount
        })

        onUnmounted(() => {
            // unmounted
        })

        the special hooks , I haven't figured out how to name it

        const { num , setNum , onNumChange } = useNumber(0)

    }


### And more I'm doing !!!

#### todos 
- component
- router
- state management
- devtools

**Inspired by many excellent javascript frameworks , vue , react , sass ,less and so on**
