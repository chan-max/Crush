import { keyframe, rotate3d, scale, translate3d } from "@crush/renderer"

export const wobble = [
    keyframe(0, {
        transform: translate3d(0, 0, 0)
    }),
    keyframe(15, {
        transform: [translate3d('-25%', 0, 0), rotate3d(0, 0, 1, '-5deg')]
    }),
    keyframe(30, {
        transform: [translate3d('25%', 0, 0), rotate3d(0, 0, 1, '3deg')]
    }),
    keyframe(45, {
        transform: [translate3d('-15%', 0, 0), rotate3d(0, 0, 1, '-3deg')]
    }),
    keyframe(60, {
        transform: [translate3d('10%', 0, 0), rotate3d(0, 0, 1, '2deg')]
    }),
    keyframe(75, {
        transform: [translate3d('-5%', 0, 0), rotate3d(0, 0, 1, '-1deg')]
    }),
    keyframe(100, {
        transform: translate3d(0, 0, 0)
    })
]