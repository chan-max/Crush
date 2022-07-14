import {
    keyframe
} from '@crush/renderer'

import {
    translateX,
    rotateY
} from '@crush/renderer'

export const headShake = [
    keyframe(0, { transform: translateX('0px') }),
    keyframe(6.5, { transform: [translateX('-6px'), rotateY(-9)] }),
    keyframe(18.5, { transform: [translateX('5px'), rotateY(7)] }),
    keyframe(31.5, { transform: [translateX('-3px'), rotateY(-5)] }),
    keyframe(43.5, { transform: [translateX('2px'), rotateY(3)] }),
    keyframe(50, { transform: translateX('0px') }),
]