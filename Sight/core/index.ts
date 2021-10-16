import { createSightInstance } from "./createSightInstance";

const initInstanceHandler = {
    construct(initInstanceFunction:Function,options:any){
        
        //创建多个实例需调用多次

        let id = 0

        return createSightInstance(options)
    }
}

let inited = false

const initInstanceFunction = () => {

    // 确保整个程序启动只会调用一次，初始化通用的缓存
    
    if(inited){
        return '已经初始化了'
    }else{

    console.log('初始化缓存');

    console.log('初始化编译器');

    console.log('初始化渲染器');

    inited = true

    }

    return '首次初始化'
}


const Sight = new Proxy(initInstanceFunction,initInstanceHandler)


// Sight is created by new keywords, and if direct to call sight function ,it will return the sight status


export default Sight