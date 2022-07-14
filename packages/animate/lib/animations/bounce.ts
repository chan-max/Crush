import { keyframe, scale3d, scaleX } from '@crush/renderer'

import { cubicBezier, translate3d, scaleY } from '@crush/renderer'

export const bounce = [
    keyframe([0, 20, 53, 100], {
        animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
        transform: translate3d(0, 0, 0)
    }),
    keyframe([40, 43], {
        animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
        transform: [translate3d(0, '-30px', 0), scaleY(1.1)]
    }),
    keyframe(70, {
        animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
        transform: [translate3d(0, '-15px', 0), scaleY(1.05)]
    }),
    keyframe(80, {
        animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
        transform: [translate3d(0, 0, 0), scaleY(0.95)]
    }),
    keyframe(90, {
        transform: [translate3d(0, '-4px', 0), scaleY(1.02)]
    })
]


export const bounceIn = [
    keyframe(['from', 20, 40, 60, 80, 100], {
        animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1)
    }),
    keyframe(0, { transform: scale3d(0.3, 0.3, 0.3) }),
    keyframe(20, { transform: scale3d(1.1, 1.1, 1.1) }),
    keyframe(40, { transform: scale3d(0.9, 0.9, 0.9) }),
    keyframe(60, { transform: scale3d(1.03, 1.03, 1.03) }),
    keyframe(80, { transform: scale3d(0.97, 0.97, 0.97) }),
    keyframe(100, { transform: scale3d(1, 1, 1) }),
]

export const bounceOut = [
    keyframe(20, { transform: scale3d(0.9, 0.9, 0.9) }),
    keyframe([50, 55], { opacity: 1, transform: scale3d(1.1, 1.1, 1.1) }),
    keyframe(100, { transform: scale3d(0.3, 0.3, 0.3), opacity: 0 })
]




export const bounceInDown = [
    keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
    keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
    keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
    keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
    keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
    keyframe(100, { transform: translate3d(0, 0, 0) }),
]

export const bounceInUp = [
    keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
    keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
    keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
    keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
    keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
    keyframe(100, { transform: translate3d(0, 0, 0) }),
]

export const bounceInLeft = [
    keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
    keyframe(0, { opacity: 0, transform: [translate3d('-3000px', 0, 0), scaleY(3)] }),
    keyframe(60, { opacity: 1, transform: [translate3d('25px', 0, 0), scaleY(0.9)] }),
    keyframe(75, { transform: [translate3d('-10px', 0, 0), scaleY(0.95)] }),
    keyframe(90, { transform: [translate3d('5px', 0, 0), scaleY(0.985)] }),
    keyframe(100, { transform: translate3d(0, 0, 0) }),
]


export const bounceInRight = [
    keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
    keyframe(0, { opacity: 0, transform: [translate3d('3000px', 0, 0), scaleY(3)] }),
    keyframe(60, { opacity: 1, transform: [translate3d('-25px', 0, 0), scaleY(0.9)] }),
    keyframe(75, { transform: [translate3d('10px', 0, 0), scaleY(0.95)] }),
    keyframe(90, { transform: [translate3d('-5px', 0, 0), scaleY(0.985)] }),
    keyframe(100, { transform: translate3d(0, 0, 0) }),
]

export const bounceOutDown = [
    keyframe(20, { transform: [translate3d(0, '10px', 0), scaleY(0.985)] }),
    keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '-20px', 0), scaleY(0.9)] }),
    keyframe(100, { opacity: 0, transform: [translate3d(0, '2000px', 0), scaleY(3)] }),
]

export const bounceOutUp = [
    keyframe(20, { transform: [translate3d(0, '-10px', 0), scaleY(0.985)] }),
    keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '20px', 0), scaleY(0.9)] }),
    keyframe(100, { opacity: 0, transform: [translate3d(0, '-2000px', 0), scaleY(3)] }),
]

export const bounceOutLeft = [
    keyframe(20, { opacity: 1, transform: [translate3d('20px', 0, 0), scaleX(2)] }),
    keyframe(100, { opacity: 0, transform: [translate3d('-2000px', 0, 0), scaleX(2)] })
]

export const bounceOutRight = [
    keyframe(20, { opacity: 1, transform: [translate3d('-20px', 0, 0), scaleX(2)] }),
    keyframe(100, { opacity: 0, transform: [translate3d('2000px', 0, 0), scaleX(2)] })
]