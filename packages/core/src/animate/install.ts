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
    jackInTheBox,
    rollIn,
    rollOut
} from './animations/specials'
import { flip, flipInX, flipInY, flipOutX, flipOutY } from './animations/flippers'
import { lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt } from './animations/lightsspeed'

var animations = [
    jackInTheBox,
    hinge,
    flash,
    backInUp,
    backInDown,
    backInLeft,
    backInRight,
    rollIn,
    rollOut,
    flip,
    flipInX,
    flipInY,
    flipOutX,
    flipOutY,
    lightSpeedInLeft,
    lightSpeedInRight,
    lightSpeedOutLeft,
    lightSpeedOutRigt
]

export function installAnimation() {
    mount(createStyleSheet(null, animations), document.head,)
}
