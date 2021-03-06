import { keyframes, mount } from '@crush/renderer'
import { createStyleSheet } from '@crush/renderer'
import { Nodes } from '@crush/const'



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
    // slide ??????
    slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
    // zoom ??????
    zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
    // specials ????????????
    hinge, jackInTheBox, rollIn, rollOut,
    // ??????
    bounce, bounceIn, bounceInDown, bounceInLeft, bounceInRight, bounceInUp, bounceOut, bounceOutDown, bounceOutLeft, bounceOutRight, bounceOutUp,
    // ??????
    swing,
    // ??????
    flash,
    // ??????
    shakeX, shakeY,
    // ??????
    pulse,
    // ??????
    backInDown, backInLeft, backInRight, backInUp, backOutDown, backOutLeft, backOutRight, backOutUp,
    // ??????
    flip, flipInX, flipInY, flipOutX, flipOutY,
    // ??????
    headShake,
    // ??????
    lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt,
    // ?????????
    rubberBand,
    // ??????
    heartBeat,
    // ??????
    wobble,
    // ??????
    rotateIn, rotateInDownLeft, rotateInDownRight, rotateInUpLeft, rotateInUpRight, rotateOut, rotateOutDownLeft, rotateOutDownRight, rotateOutUpLeft, rotateOutUpRight,
    // ????????????
    fadeIn, fadeInBottomLeft, fadeInBottomRight, fadeInDown, fadeInDownBig, fadeInLeft, fadeInLeftBig, fadeInRight, fadeInRightBig, fadeInTopLeft,
    fadeInTopRight, fadeInUp, fadeInUpBig, fadeOut, fadeOutBottomLeft, fadeOutBottomRight, fadeOutDown, fadeOutDownBig, fadeOutLeft, fadeOutLeftBig,
    fadeOutRight, fadeOutRightBig, fadeOutTopLeft, fadeOutTopRight, fadeOutUp, fadeOutUpBig,
}


// ?????????????????? keyframes ????????? ??? ??????????????????????????????keyframes
const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames))

export const installAnimation = () => mount(createStyleSheet(null, animations), document.head)
