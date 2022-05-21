import {
    keyframes, keyframe
} from '../../renderer/vnode/h'

export const flash = keyframes(
    'flash',
    [
        keyframe([0, 50, 100], {
            opacity: 1
        }),
        keyframe([25, 75], {
            opacity: 0
        })
    ]
)