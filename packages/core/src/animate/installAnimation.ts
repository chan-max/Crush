import { mount } from '../renderer/render/mount'
import { createStyleSheet } from '../renderer/vnode/vnode'
import { flash } from './animations/flash'
import {
    backInUp,
    backInDown,
    backInLeft,
    backInRight,
} from './animations/backEntrances'
import {
    hinge,
    jackInTheBox
} from './animations/specials'

export function installAnimation() {
    mount(
        createStyleSheet(null,
            [
                jackInTheBox,
                hinge,
                flash,
                backInUp,
                backInDown,
                backInLeft,
                backInRight,
            ]),
        document.head,
    )
}
