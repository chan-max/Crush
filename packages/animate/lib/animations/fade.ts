import { keyframe, translate3d } from "@crush/renderer"



export const fadeIn = [
    keyframe(0, { opacity: 0 }),
    keyframe(100, { opacity: 1 })
]
export const fadeInDown = [
    keyframe(0, { opacity: 0, transform: translate3d(0, '-100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInDownBig = [
    keyframe(0, { opacity: 0, transform: translate3d(0, '-2000px', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInLeft = [
    keyframe(0, { opacity: 0, transform: translate3d('-100%', 0, 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]
export const fadeInLeftBig = [
    keyframe(0, { opacity: 0, transform: translate3d('-2000px', 0, 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInRight = [
    keyframe(0, { opacity: 0, transform: translate3d('100%', 0, 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]
export const fadeInRightBig = [
    keyframe(0, { opacity: 0, transform: translate3d('2000px', 0, 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInUp = [
    keyframe(0, { opacity: 0, transform: translate3d(0, '100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]


export const fadeInUpBig = [
    keyframe(0, { opacity: 0, transform: translate3d(0, '2000px', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInTopLeft = [
    keyframe(0, { opacity: 0, transform: translate3d('-100%', '-100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeInTopRight = [
    keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]
export const fadeInBottomLeft = [
    keyframe(0, { opacity: 0, transform: translate3d('-100%', '100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]
export const fadeInBottomRight = [
    keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
    keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
]

export const fadeOut = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0 })
]

export const fadeOutDown = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d(0, '100%', 0) })
]
export const fadeOutDownBig = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d(0, '2000px', 0) })
]
export const fadeOutLeft = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d('-100%', 0, 0) })
]
export const fadeOutLeftBig = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d('-2000px', 0, 0) })
]
export const fadeOutRight = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d('100%', 0, 0) })
]
export const fadeOutRightBig = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d('2000px', 0, 0) })
]
export const fadeOutUp = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d(0, '-100%', 0) })
]
export const fadeOutUpBig = [
    keyframe(0, { opacity: 1 }),
    keyframe(100, { opacity: 0, transform: translate3d(0, '-2000px', 0) })
]

export const fadeOutTopLeft = [
    keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
    keyframe(100, { opacity: 0, transform: translate3d('-100%', '-100%', 0) })
]
export const fadeOutTopRight = [
    keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
    keyframe(100, { opacity: 0, transform: translate3d('100%', '-100%', 0) })
]
export const fadeOutBottomRight = [
    keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
    keyframe(100, { opacity: 0, transform: translate3d('100%', '100%', 0) })
]
export const fadeOutBottomLeft = [
    keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
    keyframe(100, { opacity: 0, transform: translate3d('-100%', '100%', 0) })
]