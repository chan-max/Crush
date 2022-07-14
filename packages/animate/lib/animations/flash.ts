import {
    keyframe
} from '@crush/renderer'

export const flash = [
    keyframe([0, 50, 100], {
        opacity: 1
    }),
    keyframe([25, 75], {
        opacity: 0
    })
]