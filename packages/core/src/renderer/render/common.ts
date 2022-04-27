import {
    isNumber
} from '@crush/common'

export const insertNull = (arr: any[], index: number, length: number = 1) => arr.splice(index, 0, ...new Array(length).fill(null))

export const normalizeKeyframe = (keyframe: string) => isNumber(Number(keyframe)) ? `${keyframe}%` : keyframe