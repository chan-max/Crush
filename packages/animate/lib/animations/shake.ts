import {
    keyframes,
    keyframe
} from '@crush/renderer'

import {
    translate3d
} from '@crush/renderer'

export const shakeX = [
    keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
    keyframe([10, 30, 50, 70, 90], { transform: translate3d('-10px', 0, 0) }),
    keyframe([20, 40, 60, 80], { transform: translate3d('10px', 0, 0) }),
]


export const shakeY = [
    keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
    keyframe([10, 30, 50, 70, 90], { transform: translate3d(0, '-10px', 0) }),
    keyframe([20, 40, 60, 80], { transform: translate3d(0, '10px', 0) }),
]