import { perspective, rotate3d, scale3d, translate3d } from "@crush/renderer";
import { keyframe, keyframes } from "@crush/renderer";

export const flip = [
    keyframe(0, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, -360)],
        animationTimingFunction: 'ease-out'
    }),
    keyframe(40, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -190)],
        animationTimingFunction: 'ease-out'
    }),
    keyframe(50, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -170)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(80, {
        transform: [perspective('400px'), scale3d(0.95, 0.95, 0.95), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(100, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
        animationTimingFunction: 'ease-in'
    })
]

export const flipInX = [
    keyframe(0, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
        animationTimingFunction: 'ease-in',
        opacity: 0
    }),
    keyframe(40, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(60, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 10)],
        animationTimingFunction: 'ease-in',
        opacity: 1
    }),
    keyframe(80, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -5)],
    }),
    keyframe(100, {
        transform: perspective('400px')
    })
]

export const flipInY = [
    keyframe(0, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
        animationTimingFunction: 'ease-in',
        opacity: 0
    }),
    keyframe(40, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(60, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 10)],
        animationTimingFunction: 'ease-in',
        opacity: 1
    }),
    keyframe(80, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -5)],
    }),
    keyframe(100, {
        transform: perspective('400px')
    })
]

export const flipOutX = [
    keyframe(0, {
        transform: perspective('400px')
    }),
    keyframe(30, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
        opcaity: 1
    }),
    keyframe(100, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
        opcaity: 0
    })
]

export const flipOutY = [
    keyframe(0, {
        transform: perspective('400px')
    }),
    keyframe(30, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
        opcaity: 1
    }),
    keyframe(100, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
        opcaity: 0
    })
]