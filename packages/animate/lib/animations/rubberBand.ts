import {
    keyframes,
    keyframe
} from '@crush/renderer'

import {
    scale3d
} from '@crush/renderer'

export const rubberBand = [
    keyframe(0, { transform: scale3d(1, 1, 1) }),
    keyframe(30, { transform: scale3d(1.25, 0.75, 1) }),
    keyframe(40, { transform: scale3d(0.75, 1.25, 1) }),
    keyframe(50, { transform: scale3d(1.15, 0.85, 1) }),
    keyframe(65, { transform: scale3d(0.95, 1.05, 1) }),
    keyframe(75, { transform: scale3d(1.05, 0.95, 1) }),
    keyframe(100, { transform: scale3d(1, 1, 1) }),
]