
export const shakeX = keyframes('shakeX', [
    keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
    keyframe([1, 3, 5, 7, 9], { transform: translate3d('-10px', 0, 0) }),
    keyframe([2, 4, 6, 8], { transform: translate3d('10px', 0, 0) }),
])