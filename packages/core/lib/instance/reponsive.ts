import { hyphenate, isNumber, isString } from "@crush/common"
import { addListener, max, removeListener } from "@crush/renderer"
import { getCurrentApp } from "../app/app"


export const customScreens = {
    default: null,
    xs: {
        maxWidth: 768
    },
    sm: {
        maxWidth: 992,
        minWidth: 768
    },
    md: {
        maxWidth: 1200,
        minWidth: 992
    },
    lg: {
        maxWidth: 1920,
        minWidth: 1200
    },
    xl: {
        minWidth: 1920
    }
}

export function getMediaStringKeyValue(mediaString: any, mediaKey: any) {
    let position = mediaString.indexOf(mediaKey)
    if (position < 0) {
        return null
    }
    let end = mediaString.indexOf(')', position)

    let value = mediaString.slice(position + mediaKey.length + 1, end)

    return value
}

// return maxWidth and minWidth
export function parseMediaString(mediaString: any) {
    let minWidth = getMediaStringKeyValue(mediaString, 'min-width')
    let maxWidth = getMediaStringKeyValue(mediaString, 'max-width')
    let minHeight = getMediaStringKeyValue(mediaString, 'min-height')
    let maxHeight = getMediaStringKeyValue(mediaString, 'max-height')
    return {
        minWidth,
        maxWidth,
        minHeight,
        maxHeight
    }
}


// 默认为 px
function toMediaConditionString(key: any, value: any) {
    key = hyphenate(key)
    return `(${key}:${isNumber(value) ? value + 'px' : value})`
}

export function getCustomScreensMediaString(screen: string) {
    let app = getCurrentApp()

    let screenConfig = app.customScreens[screen]

    if (!screenConfig) {
        return ''
    }

    if (isString(screenConfig)) {
        return screenConfig
    }


    let mediaCondition = Object.entries(screenConfig).map(([key, value]: any) => {
        return toMediaConditionString(key, value)
    }).join(' and ')

    return mediaCondition
}



function onWindowResize(cb: any) {
    addListener(window, 'resize', cb)
    return () => removeListener(window, 'onresize', cb)
}

// 获取当前屏幕所处的尺寸
function getCurrentAppScreen() {

    let app = getCurrentApp()

    if (!app) {
        return
    }

    let customScreens = app.customScreens

    let screens = Object.keys(customScreens)

    let wdith = window.innerWidth
    let height = window.innerHeight
    // 匹配适当的屏幕 ， 优先匹配优先结束

    let matchedScreen = screens.find((screen: any) => {
        let config = customScreens[screen]
        if (!config) {
            return false
        }
        let { maxWidth, maxHeight, minWidth, minHeight } = config

        // 四个条件必须同时匹配

        if (maxWidth && wdith > maxWidth) {
            return false
        }

        if (maxHeight && height > maxHeight) {
            return false
        }

        if (minWidth && wdith < minWidth) {
            return false
        }

        if (minHeight && height < minHeight) {
            return false
        }

        return true
    })

    return matchedScreen
}

// 单例
export function createAppOnScreenChange() {

    let screenChangeCallbacks = new Set()

    // 保存之前的屏幕尺寸
    let previouscreen = getCurrentAppScreen()

    onWindowResize(() => {
        
        let currentScreen = getCurrentAppScreen()

        if (currentScreen !== previouscreen) {
            // 屏幕尺寸改变
            previouscreen = currentScreen

            screenChangeCallbacks.forEach((cb: any) => {
                cb(currentScreen)
            })

        }

    })

    return (cb: any) => {
        screenChangeCallbacks.add(cb)
        return () => screenChangeCallbacks.delete(cb)
    }
}