import {
    isNumber
} from '../../common/type'

export const insertNull = (arr: any[], index: number, length: number = 1) => arr.splice(index, 0, ...new Array(length).fill(null))

export const normalizeKeyframe = (keyframe: string) => isNumber(Number(keyframe)) ? `${keyframe}%` : keyframe

export const isReservedProp = (key: string) => key.startsWith(`_${key}`)
export const getReservedProp = (key: string) => key.slice(1)