
export const swing = keyframes('swing', [
    keyframe(20, { transform: rotate3d(0, 0, 1, '15deg') }),
    keyframe(40, { transform: rotate3d(0, 0, 1, '-10deg') }),
    keyframe(60, { transform: rotate3d(0, 0, 1, '5deg') }),
    keyframe(80, { transform: rotate3d(0, 0, 1, '-5deg') }),
    keyframe(100, { transform: rotate3d(0, 0, 1, '0deg') }),
])