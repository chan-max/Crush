import { addListener, removeListener } from "@crush/renderer"
import { getCurrentApp } from "../app/app"

export const responsiveLayoutMedia = {
    xs: '(max-width:768px)',
    sm: '(min-width:768px) and (max-width:992px)',
    md: '(min-width:992px) and (max-width:1200px)',
    lg: '(min-width:1200px) and (max-width:1920px)',
    xl: '(min-width:1920px)'
}


// 根据注册的 屏幕尺寸，会生成一个屏幕resize侦听器



export function getCustomScreensMedia(screen: string) {
    return getCurrentApp().customScreens[screen] || 'screen' // 默认屏幕 , 所有情况都生效
}

export function onWindowResize(cb: any) {
    let handler = () => {
        let info = {
            height: window.innerHeight,
            width: window.innerWidth
        }
        cb(info)
    }

    addListener(window, 'resize', handler)

    return () => removeListener(window, 'onresize', handler)
}