import {
    keyframes,
    keyframe
} from '@crush/renderer'

import {
    translateX,
    translateY,
    scale
} from '@crush/renderer'

export const backInDown = [
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
]


export const backInUp = [
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
]


export const backInLeft = [
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
]


export const backInRight = [
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
]



export const backOutDown = [
    keyframe(0, {
        transform: scale(1),
        opacity: 1
    }),
    keyframe(20, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: [translateY('700px'), scale(0.7)],
        opacity: 0.7
    }),
]


export const backOutUp = [
    keyframe(0, {
        transform: scale(1),
        opacity: 1
    }),
    keyframe(20, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: [translateY('-700px'), scale(0.7)],
        opacity: 0.7
    }),
]

export const backOutLeft = [
    keyframe(0, {
        transform: scale(1),
        opacity: 1
    }),
    keyframe(20, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: [translateX('-2000px'), scale(0.7)],
        opacity: 0.7
    }),
]

export const backOutRight = [
    keyframe(0, {
        transform: scale(1),
        opacity: 1
    }),
    keyframe(20, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: [translateX('2000px'), scale(0.7)],
        opacity: 0.7
    }),
]