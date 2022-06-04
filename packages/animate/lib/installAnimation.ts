import { mount } from '@crush/renderer'
import { createStyleSheet } from '@crush/renderer'
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
import { bounce } from './animations/bounce'

var animations = {
    bounce,
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
}

export const checkBuiltInAnimations = () => Object.keys(animations)

export const installAnimation = () => mount(createStyleSheet(null, Object.values(animations)), document.head)
