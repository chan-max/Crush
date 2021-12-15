import {getCommonComponentnistance} from './instance'

class App {
    constructor(rootComponent: any) {
        this.rootComponent = rootComponent
    }

    rootComponent

    mount(target:HTMLElement) {
        return createComponent(this.rootComponent,target)
    }
}



function createComponent(options:any,target:HTMLElement) {
    var instance = getCommonComponentnistance()

    console.log(instance);


    
    

    return instance
    
}



function createApp(rootComponent: any) {
    return new App(rootComponent)
}

export {
    createApp
}