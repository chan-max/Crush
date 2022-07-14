import { keyframe, scale } from "@crush/renderer";

export const heartBeat = [
    keyframe(0, {
        transform: scale(1)
    }),
    keyframe(14, {
        transform: scale(1.3)
    }),
    keyframe(28, {
        transform: scale(1)
    }),
    keyframe(42, {
        transform: scale(1.3)
    }),
    keyframe(70, {
        transform: scale(1)
    })
]