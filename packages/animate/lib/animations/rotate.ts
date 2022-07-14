import { keyframe, rotate3d, translate3d } from "@crush/renderer"


export const rotateIn = [
    keyframe(0, { transform: rotate3d(0, 0, 1, '-200deg'), opacity: 0 }),
    keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
]

export const rotateInDownLeft = [
    keyframe(0, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
    keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
]

export const rotateInDownRight = [
    keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
    keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
]

export const rotateInUpLeft = [
    keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
    keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
]
export const rotateInUpRight = [
    keyframe(0, { transform: rotate3d(0, 0, 1, '-90deg'), opacity: 0 }),
    keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
]

export const rotateOut = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '200deg'), opacity: 0 }),
]


export const rotateOutDownLeft = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
]
export const rotateOutDownRight = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
]


export const rotateOutUpLeft = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
]
export const rotateOutUpRight = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
]
