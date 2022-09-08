import { emptyObject, isArray, isRegExp, isString } from "@crush/common"

const keepAliveCache: any = {}

/*
    cache => id => [{
        name,
        instance,
        els
    }]
*/

// 获取当前组件在父组件中定义的组件名称
function getVnodeComponentName(vnode: any) {
    let { type, instance } = vnode
    let components = instance.parent.components
    for (let name in vnode.instance.parent.components || emptyObject) {
        if (components[name] === type) {
            return name
        }
    }
    return null
}

export function getKeepAliveOptions(vnode: any) {
    // 暂时只有动态组件支持keepalive
    return vnode.isDynamicComponent ? vnode?.props?._keepAlive : null
}


export function useCachedKeepAliveComponent(vnode: any): any {
    if (!vnode.isDynamicComponent) {
        return
    }

    let keepAliveOptions = getKeepAliveOptions(vnode)

    if (!keepAliveOptions) {
        return
    }

    debugger
    return
}

// return true mean cache
export function cacheWillUnmountKeepAliveComponent(vnode: any): any {

    if (!vnode.isDynamicComponent) {
        return
    }

    let keepAliveOptions = getKeepAliveOptions(vnode)

    if (!keepAliveOptions) {
        return
    }

    let { includes, excludes, max } = keepAliveOptions

    max ||= Infinity

    let name: any = getVnodeComponentName(vnode)

    // 验证方式支持 逗号分割的字符串，数组，和正则表达式
    if (includes) {
        if (isString(includes) && !includes.split(',').includes(name)) {
            return
        } else if (isArray(includes) && !includes.includes(name)) {
            return
        } else if (isRegExp(includes) && !includes.test(name)) {
            return
        }
    }

    if (excludes) {
        if (isString(excludes) && excludes.split(',').includes(name)) {
            return
        } else if (isArray(excludes) && excludes.includes(name)) {
            return
        } else if (isRegExp(excludes) && excludes.test(name)) {
            return
        }
    }

    // 执行缓存

    // 缓存组件实例和元素

    let keepAliveId = vnode.key

    let cachedComponents = keepAliveCache[keepAliveId] ||= []

    if (cachedComponents.length >= max) {
        // 达到最大缓存数，清除最开始的缓存
        // 需要卸载组件
        debugger
        cachedComponents.shift()
    }

    let instance = vnode.instance
    let els = instance.scope.$el

    let componentCache = {
        els, instance, name
    }

    cachedComponents.push(componentCache)

    return true
}