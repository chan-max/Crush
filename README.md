# Crush

crush is a `vue like` javascript framework 

Most APIs are similar to vue , but there also are something interesting features and vue doesnt have

  *but,this project is not finished yets,I'm try my best to develop it , and I'm especially willing to find some interesting partners , talk technology together or doing something interesting*

  #### contact me
  - wechat & phone : 18742539196
  - emali : 2651308363@qq.com
  - twitter : MaxChanNotBad
  - address : DaLian , LiaoNing , China

---

##### what is crush ? 

*crush is an English word that can be understood as break up , press, push , compress and so on*
*There is another meaning: "to fall in love briefly, passionately, and shyly*

## Introduction
 *make sure you are a vue user*
## API

#### html tempalte syntax

###### Text Interpolation
    <div> {{expression}} </div>

###### Attribute Binding
    <div $id="expression"> hello world </div>
###### Dynamic Attribute Binding
    <div $(expression)="expression"> hello world </div>

###### Event Binding
    <div @click="expression"> click me </div>
###### Dynamic Event Binding
    <div $(expression)="expression"> click me </div>

#### css tempalte syntax
###### Style Binding
        body{
            $backgroundColor: expression ;
        }

###### Dynamic Style Binding
        body{
            $(expression): expression ;
        }
###### About Important
    body{
        background-color!: red;
        /* so we can do this , and its a important declaration */
        $background-color!: expression ;
    }
###### Dynamic Selector
    $(expression){
        /* some declaration */
    }
###### Nesting
    body{
        h1{
            color:red;
        }
    }

*same as*

    body h1{
            color:red;
    }


###### & 

    a{
        &:hover{
            color:red;
        }
    }

*same as*

    a:hover{
            color:red;
    }

###### Bubbling At-Rule
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

###### Mixins
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

