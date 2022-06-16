import { keyframe, keyframes } from "@crush/renderer";
import {
    rotate,
    rotate3d, scale, translate3d
} from '@crush/renderer'

export const hinge = keyframes('hinge', [
    keyframe(0, {
        animationTimingFunction: 'ease-in-out'
    }),
    keyframe([20, 60], {
        animationTimingFunction: 'ease-in-out',
        transform: rotate3d(0, 0, 1, 80)
    }),
    keyframe([40, 80], {
        animationTimingFunction: 'ease-in-out',
        transform: rotate3d(0, 0, 1, 60),
        opacity: 1
    }),

    keyframe(100, {
        transform: translate3d(0, '700px', 0),
        opacity: 0
    })
])

export const jackInTheBox = keyframes('jackInTheBox', [
    keyframe(0, {
        opacity: 0,
        transform: [scale(0.1), rotate(30)],
        transformOrigin: ['center', 'bottom']
    }),
    keyframe(50, {
        transform: rotate(-10),
    }),
    keyframe(70, {
        transform: rotate(3),
    }),
    keyframe(100, {
        opacity: 1,
        transform: scale(1),
    })
])



export const rollIn = keyframes('rollIn', [
    keyframe(0, {
        opacity: 0,
        transform: [translate3d('-100%', 0, 0), rotate3d(0, 0, 1, -120)]
    }),
    keyframe(100, {
        opacity: 1,
        transform: translate3d(0, 0, 0)
    })
])

export const rollOut = keyframes('rollOut', [
    keyframe(0, {
        opacity: 1,
    }),
    keyframe(100, {
        opacity: 0,
        transform:  [translate3d('100%', 0, 0), rotate3d(0, 0, 1, 120)]
    })
])