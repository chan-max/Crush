import {
    keyframes,
    keyframe
} from '@crush/renderer'

import {
    cubicBezier,
    translate3d,
    scaleY
} from '@crush/renderer'

export const bounce = keyframes(  
    'bounce',
    [
        keyframe(
            [0, 20, 53, 100], {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: translate3d(0, 0, 0)
        }),
        keyframe(
            [40, 43], {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-30px', 0), scaleY(1.1)]
        }),
        keyframe(
            70, {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-15px', 0), scaleY(1.05)]
        }),
        keyframe(
            80, {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: [translate3d(0, 0, 0), scaleY(0.95)]
        }),
        keyframe(
            90, {
            transform: [translate3d(0, '-4px', 0), scaleY(1.02)]
        })
    ]
)