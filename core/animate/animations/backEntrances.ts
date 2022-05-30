import {
    keyframes,
    keyframe
} from '../../renderer/vnode/h'

import {
    translateX,
    translateY,
    scale
} from '../../renderer/builtIn/cssFunction'

export const backInDown = keyframes('backInDown', [
    keyframe(0, {
        transform: [translateY('-1200px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
])





export const backInUp = keyframes('backInUp', [
    keyframe(0, {
        transform: [translateY('1200px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
])


export const backInLeft = keyframes('backInLeft', [
    keyframe(0, {
        transform: [translateX('-2000px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
])


export const backInRight = keyframes('backInRight', [
    keyframe(0, {
        transform: [translateX('2000px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
])