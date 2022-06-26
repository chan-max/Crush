import { keyframes, mount } from '@crush/renderer'
import { createStyleSheet } from '@crush/renderer'


import { slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp } from './animations/slide'
import { zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp } from './animations/zoom'

import { hinge, jackInTheBox, rollIn, rollOut } from './animations/specials'

const animationFrames = {
    // slide
    slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
    // zoom
    zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
    // specials
    hinge, jackInTheBox, rollIn, rollOut
}

export const transitionKeyframes = {
    roll: ['rollIn', 'rollOut']
}

// 这里可以控制 keyframes 的名称 ， 并没有直接生成完整的keyframes
const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames))

export const installAnimation = () => mount(createStyleSheet(null, animations), document.head)
