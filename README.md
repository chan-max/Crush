# crush.js



### install 

```
    npm install crushed
```

### example

a simple counter example

```js
import { createApp , useRefState } from 'crushed'

let counter = {
    template: `
        <style>
            h1{
                $color:rgb(count*10,count*10,count*10);
                $background-color:rgb(255-count*10,255-count*10,255-count*10);
            }
        </style>
        <button @click="setCount(count + 1)"> + </button>
        <button @click="setCount(count - 1)"> - </button>
        <h1> count : {{count}} </h1>
    `,
    create() {
        // one line code for declare state, set state , watch state
        const { count, setCount, onCountChange } = useRefState(0)
        onCountChange(() => {
            console.log('count change !')
        })
    }
}

let app = createApp(counter).mount('#app')
```





