

function addClass(el: Element, className: string) {
    el.classList.add(className)
}

function removeClass(el: Element, className: string) {
    el.classList.remove(className)
}

/*  think ? 

*/

export const enum Animation {
    NAME = 'animationName',
    DURATION = 'animationDuration',
    TIMING_FUNCTION = 'animationTimingFunction',
    DELAY = 'animationDelay',
    PLAY_STATE = 'animationPlayState',
    ITERATION_COUNT = 'animationIterationCount',
    FILL_MODE = 'animationFillMode',
    DIRECTION = 'animationDirection'
}

function doAnimation(el: Element) {

}