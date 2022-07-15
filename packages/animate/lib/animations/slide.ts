import { keyframe, translate3d } from "@crush/renderer";
import { Nodes } from "@crush/const";


export const slideInDown = [keyframe('from', {
    transform: translate3d(0, '-100%', 0),
    visibility: 'visible'
}),
keyframe('to', {
    transform: translate3d(0, 0, 0)
})]

export const slideInUp = [keyframe('from', {
    transform: translate3d(0, '100%', 0),
    visibility: 'visible'
}),
keyframe('to', {
    transform: translate3d(0, 0, 0)
})]

export const slideInLeft = [keyframe('from', {
    transform: translate3d('-100%', 0, 0),
    visibility: 'visible'
}),
keyframe('to', {
    transform: translate3d(0, 0, 0)
})]

export const slideInRight = [keyframe('from', {
    transform: translate3d('100%', 0, 0),
    visibility: 'visible'
}),
keyframe('to', {
    transform: translate3d(0, 0, 0)
})]

export const slideOutDown = [keyframe('from', {
    transform: translate3d(0, 0, 0)

}),
keyframe('to', {
    transform: translate3d(0, '100%', 0),
    visibility: 'hidden'
})]

export const slideOutUp = [keyframe('from', {
    transform: translate3d(0, 0, 0)
}),
keyframe('to', {
    transform: translate3d(0, '-100%', 0),
    visibility: 'hidden'
})]

export const slideOutLeft = [keyframe('from', {
    transform: translate3d(0, 0, 0)
}),
keyframe('to', {
    transform: translate3d('-100%', 0, 0),
    visibility: 'hidden'
})]

export const slideOutRight = [keyframe('from', {
    transform: translate3d(0, 0, 0)
}),
keyframe('to', {
    transform: translate3d('100%', 0, 0),
    visibility: 'hidden'
})]