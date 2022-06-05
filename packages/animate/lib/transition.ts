
export const enum Transition {
    PROPERTY = 'transitionProperty',
    DURATION = 'transitionDuration',
    DELAY = 'transitionDelay',
    TIMING_FUNCTION = 'transitionTimingFunction'
}


interface TransitionOptions {
    transitionProperty: string
    transitionDuration: string,
    transitionTimingFunction: string
    transitionDelay: string,
}


/*
    过渡动画逻辑
    使用transition , 先保留之前元素的tansition  , 设置新的 transtion ，然后设置新的样式
*/
export function setElementTranstion(el: HTMLElement) {

}

