import { keyframes, mount } from '@crush/renderer'
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

import { slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp } from './animations/sliding'

const animationFrames = {
    slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp
}

const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames))


export const installAnimation = () => mount(createStyleSheet(null, animations), document.head)
