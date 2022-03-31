import {
    getUid
} from '@crush/common'

import {
    initOptions
} from '../../instance/options'

function createComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }
    console.log(options);

}

export const mountComponent = (container: Element, options: any) => {
    var instance = createComponentInstance(options)

    return instance
}