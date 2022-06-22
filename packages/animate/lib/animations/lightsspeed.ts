import { skewX, translate3d } from "@crush/renderer"
import { keyframe, keyframes } from "@crush/renderer"



export const lightSpeedInRight = keyframes('lightSpeedInRight', [
    keyframe(0, {
        transform: [translate3d('100%', 0, 0), skewX(-30)],
        opacity: 0
    }),
    keyframe(60, {
        transform: skewX(20),
        opacity: 1
    }),
    keyframe(80, {
        transform: skewX(-5)
    }),
    keyframe(100, {
        transform: translate3d(0, 0, 0)
    }),
])



export const lightSpeedInLeft = keyframes('lightSpeedInLeft', [
    keyframe(0, {
        transform: [translate3d('-100%', 0, 0), skewX(30)],
        opacity: 0
    }),
    keyframe(60, {
        transform: skewX(-20),
        opacity: 1
    }),
    keyframe(80, {
        transform: skewX(5)
    }),
    keyframe(100, {
        transform: translate3d(0, 0, 0)
    }),
])



export const lightSpeedOutRigt = keyframes('lightSpeedOutRight', [
    keyframe(0, {
        opacity: 1
    }),
    keyframe(100, {
        transform: [translate3d('100%', 0, 0), skewX(30)],
        opacity: 0
    }),
])
export const lightSpeedOutLeft = keyframes('lightSpeedOutLeft', [
    keyframe(0, {
        opacity: 1
    }),
    keyframe(100, {
        transform: [translate3d('-100%', 0, 0), skewX(-30)],
        opacity: 0
    }),
])