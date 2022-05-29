import { createKeyframe, createKeyframes } from "./css";

export function keyframes(name: any, keyframes: any) {
    return createKeyframes(name, keyframes)
}

export function keyframe(name: any, keyframes: any) {
    return createKeyframe(name, keyframes)
}
