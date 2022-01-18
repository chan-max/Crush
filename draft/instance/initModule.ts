import {createComponent} from './createComponent'

class CrushApp{
    mount = createComponent
}

function createApp() {
    return new CrushApp()
}

export {
    createApp
}