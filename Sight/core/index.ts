import { createSightInstance } from "./createSightInstance";



const initInstanceHandler = {
    construct(initInstanceFunction:Function,options:any){
        
        //创建多个实例需调用多次

        return createSightInstance(options)
    }
}



const initInstanceFunction = () => {

    // 确保整个程序启动只会调用一次，初始化通用的缓存
}


const Sight = new Proxy(initInstanceFunction,initInstanceHandler)


// Sight is created by new keywords, and if direct to call sight function ,it will return the sight status


export default Sight