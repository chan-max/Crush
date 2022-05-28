import { nextTick } from "./nextTick"

var currentWork: any = null

export function nextTickSingleWork(work: Function) {
    if (!currentWork) {
        currentWork = work
        nextTick(() => {
            currentWork()
            currentWork = null
        })
    }
}