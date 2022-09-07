import { keyframes, mount } from '@crush/renderer'
import { createStyleSheet } from '@crush/renderer'
import { Nodes } from '@crush/const'
import { onBeforeClassMount, mountStyleRule, createStyle } from '@crush/renderer'

export const fuck = Nodes.FOR

import { slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp } from './animations/slide'
import { zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp } from './animations/zoom'
import { hinge, jackInTheBox, rollIn, rollOut } from './animations/specials'
import { bounce, bounceIn, bounceInDown, bounceInLeft, bounceInRight, bounceInUp, bounceOut, bounceOutDown, bounceOutLeft, bounceOutRight, bounceOutUp } from './animations/bounce'
import { swing } from './animations/swing'
import { flash } from './animations/flash'
import { shakeX, shakeY } from './animations/shake'
import { pulse } from './animations/pulse'
import { backInDown, backInLeft, backInRight, backInUp, backOutDown, backOutLeft, backOutRight, backOutUp } from './animations/back'
import { flip, flipInX, flipInY, flipOutX, flipOutY } from './animations/flippers'
import { headShake } from './animations/headShake'
import { lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt } from './animations/lightsspeed'
import { rubberBand } from './animations/rubberBand'
import { heartBeat } from './animations/heartBeat'
import { wobble } from './animations/wobble'
import { rotateIn, rotateInDownLeft, rotateInDownRight, rotateInUpLeft, rotateInUpRight, rotateOut, rotateOutDownLeft, rotateOutDownRight, rotateOutUpLeft, rotateOutUpRight } from './animations/rotate'
import { fadeIn, fadeInBottomLeft, fadeInBottomRight, fadeInDown, fadeInDownBig, fadeInLeft, fadeInLeftBig, fadeInRight, fadeInRightBig, fadeInTopLeft, fadeInTopRight, fadeInUp, fadeInUpBig, fadeOut, fadeOutBottomLeft, fadeOutBottomRight, fadeOutDown, fadeOutDownBig, fadeOutLeft, fadeOutLeftBig, fadeOutRight, fadeOutRightBig, fadeOutTopLeft, fadeOutTopRight, fadeOutUp, fadeOutUpBig, } from './animations/fade'


const animationFrames = {
    // slide 滑动
    slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
    // zoom 缩放
    zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
    // specials 特殊动画
    hinge, jackInTheBox, rollIn, rollOut,
    // 弹跳
    bounce, bounceIn, bounceInDown, bounceInLeft, bounceInRight, bounceInUp, bounceOut, bounceOutDown, bounceOutLeft, bounceOutRight, bounceOutUp,
    // 摇摆
    swing,
    // 闪烁
    flash,
    // 抖动
    shakeX, shakeY,
    // 脉搏
    pulse,
    // 出场
    backInDown, backInLeft, backInRight, backInUp, backOutDown, backOutLeft, backOutRight, backOutUp,
    // 翻动
    flip, flipInX, flipInY, flipOutX, flipOutY,
    // 摇头
    headShake,
    // 光速
    lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt,
    // 橡皮筋
    rubberBand,
    // 心跳
    heartBeat,
    // 摇晃
    wobble,
    // 旋转
    rotateIn, rotateInDownLeft, rotateInDownRight, rotateInUpLeft, rotateInUpRight, rotateOut, rotateOutDownLeft, rotateOutDownRight, rotateOutUpLeft, rotateOutUpRight,
    // 淡入淡出
    fadeIn, fadeInBottomLeft, fadeInBottomRight, fadeInDown, fadeInDownBig, fadeInLeft, fadeInLeftBig, fadeInRight, fadeInRightBig, fadeInTopLeft,
    fadeInTopRight, fadeInUp, fadeInUpBig, fadeOut, fadeOutBottomLeft, fadeOutBottomRight, fadeOutDown, fadeOutDownBig, fadeOutLeft, fadeOutLeftBig,
    fadeOutRight, fadeOutRightBig, fadeOutTopLeft, fadeOutTopRight, fadeOutUp, fadeOutUpBig,
}

// transition 简写形式 , 用于transtion指令的动画帧
export const transitionKeyframes = {
    roll: ['rollIn', 'rollOut'],
    slideUp: ['slideInUp', 'slideOutUp'],
    slideDown: ['slideInDown', 'slideOutDown'],
    slideLeft: ['slideInLeft', 'slideOutLeft'],
    slideRight: ['slideInRight', 'slideOutRight'],
    zoom: ['zoomIn', 'zoomOut'],
    zoomUp: ['zoomInUp', 'zoomOutUp'],
    zoomDown: ['zoomInDown', 'zoomOutDown'],
    zoomLeft: ['zoomInLeft', 'zoomOutLeft'],
    zoomRight: ['zoomInRight', 'zoomOutRight'],
    bounce: ['bounceIn', 'bounceOut'],
    bounceUp: ['bounceInUp', 'bounceOutUp'],
    bounceDown: ['bounceInDown', 'bounceOutDown'],
    bounceLeft: ['bounceInLeft', 'bounceOutLeft'],
    bounceRight: ['bounceInRight', 'bounceOutRight'],
    backUp: ['backInUp', 'backOutUp'],
    backDown: ['backInDown', 'backOutDown'],
    backLeft: ['backInLeft', 'backOutLeft'],
    backRight: ['backInRight', 'backOutRight'],
    flip: ['flip', 'flip'],
    flipX: ['flipInX', 'flipOutX'],
    flipY: ['flipInY', 'flipOutY'],
    lightSpeedLeft: ['lightSpeedInLeft', 'lightSpeedOutLeft'],
    lightSpeedRight: ['lightSpeedInRight', 'lightSpeedOutRight'],
    fade: ['fadeIn', 'fadeOut']
}

// 这里可以控制 keyframes 的名称 ， 并没有直接生成完整的keyframes
export const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames))

// 关于 animate的class
let animationClassStyleSheet, animationClassRecord: any = {}
function initAnimationClass(className: any) {
    if (!className.startsWith('animate_') || animationClassRecord[className]) {
        return
    }
    let targetSheet = animationClassStyleSheet ||= mount(createStyleSheet(null, animations), document.head)
    let declaration = className.split('animate_')[1].split('_')
    mountStyleRule(targetSheet, createStyle('.' + className, { animation: declaration }))
}



export const installAnimation = (app: any) => {
    // 内置
    app.builtInAnimationKeyframes = Object.keys(animationFrames)
    app.transitionKeyframes = transitionKeyframes

    mount(createStyleSheet(null, animations), document.head)
    onBeforeClassMount(initAnimationClass)
}
