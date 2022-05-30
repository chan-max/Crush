import {
    keyframes,
    keyframe
} from '../../renderer/vnode/h'

import {
    scale3d
} from '../../renderer/builtIn/cssFunction'


export const pulse = keyframes(
    'pulse',
    [
        keyframe(0, {
            transform: scale3d(1, 1, 1)
        }),
        keyframe(50, {
            transform: scale3d(1.05, 1.05, 1.05)
        }),
        keyframe(100, {
            transform: scale3d(1, 1, 1)
        }),
    ]
)