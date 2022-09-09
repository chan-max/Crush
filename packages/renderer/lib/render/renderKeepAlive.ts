import { emptyObject, isArray, isRegExp, isString } from "@crush/common"
import { docCreateElementFragment, insertElement, removeElement } from "../dom"

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
    let components = vnode.parent.components
    for (let name in vnode.parent.components || emptyObject) {
        if (components[name] === vnode.type) {
            return name
        }
    }
    return null
}

export function getKeepAliveOptions(vnode: any) {
    // 暂时只有动态组件支持keepalive
    return vnode.isDynamicComponent ? vnode?.props?._keepAlive : null
}


// return true mean use cache
export function useCachedKeepAliveComponent(vnode: any, container: any, anchor: any): any {
    if (!vnode.isDynamicComponent) {
        return
    }

    let keepAliveOptions = getKeepAliveOptions(vnode)

    if (!keepAliveOptions) {
        return
    }

    let name = getVnodeComponentName(vnode)

    let keepAliveId = vnode.key

    let cachedComponents = keepAliveCache[keepAliveId] ||= []

    let cache = cachedComponents.find((cachedComponent: any) => cachedComponent.name === name)

    if (cache) {
        // 使用缓存的组件
        let { els, instance } = cache

        // 挂载元素

        let elsFragment = docCreateElementFragment(els)

        insertElement(elsFragment, container, anchor)
        vnode.instance = instance
        instance.componentVnode = vnode
        return instance
    } else {
        return
    }
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
        cachedComponents.shift()
    }

    let instance = vnode.instance

    let els = instance.scope.$el

    let componentCache = {
        els, instance, name
    }

    // 卸载元素

    if (els) {
        if (isArray(els)) {
            els.forEach(removeElement)
        } else {
            removeElement(els)
        }
    }

    cachedComponents.push(componentCache)

    return true
}