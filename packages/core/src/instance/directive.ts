
import { error } from '@crush/common'
import { isFunction, isObject } from '@crush/common/src/dataType'
import { callFn } from '../../../compiler/src/generator/stringify'
import {
    callHook,
    injectHook, LifecycleHooks
} from './lifecycle'

export function injectDirectives(target: any, directives: any[]) {
    for (let directive of directives) {
        injectDirective(target, directive)
    }
    return target
}

export function injectDirective(target: any, [rawDirective, info]: any) {
    // 指令会携带信息 值 参数 修饰符

    // 保存指令与指令携带信息之间的关系 ， 用于传递新旧节点的指令信息
    var dirInfos = target.dirInfos ||= new Map()
    dirInfos.set(rawDirective, info)

    let directiveOptions = rawDirective

    if (isFunction(rawDirective)) {
        directiveOptions = {
            [LifecycleHooks.MOUNTED]: rawDirective,
            [LifecycleHooks.UPDATED]: rawDirective
        }
    }

    for (let key in directiveOptions) {
        var hook = directiveOptions[key]

        // save the raw directive on this hook , so while the hook is calling , we can know the hook belong which directive
        hook.directive = rawDirective
        // !hook.dirInfo = info 不应该在指令上钩子上直接保存指令信息，会存在覆盖问题

        injectHook(key as LifecycleHooks, target, hook)
    }
    // ! 
    return target
}


export function callElementHook(type: LifecycleHooks, p: any, n: any) {
    // 不存在两个节点都不存在

    if (p && n) {
        // ! 只有更新时指令才能拿到 oldValue
        // update 包括普通更新和假卸载和挂载的更新
        var samePatchKey = p.patchKey === n.patchKey
        if (samePatchKey) {

            // just update , beforeUpdate , updated 
            callHook(type, n, {
                scheduler(hook: any) {
                    var dirArgs = [
                        n.ref
                    ]

                    if (hook.directive) {
                        // dirInfo 存在的话一定有 dirInfos
                        var dirInfo = n.dirInfos.get(hook.directive)
                        dirInfo.oldValue = p.dirInfos.get(hook.directive).value
                        dirArgs.push(dirInfo)
                    }

                    // 这里需要拿到旧的指令值

                    hook.apply(null, dirArgs)
                }
            })
        } else {
            // 假挂载和假卸载 , 假卸载旧节点 ， 假挂载新节点 , 不需要指令旧值
            callHook(type === LifecycleHooks.BEFORE_UPDATE ? LifecycleHooks.BEFORE_UNMOUNT : LifecycleHooks.UNMOUNTED, p, {
                scheduler(hook: any) {
                    hook.call(null, p.ref, p.dirInfos?.get(hook.directive))
                }
            })
            callHook(type === LifecycleHooks.UPDATED ? LifecycleHooks.MOUNTED : LifecycleHooks.BEFORE_MOUNT, n, {
                scheduler(hook: any) {
                    hook.call(null, n.ref, n.dirInfos?.get(hook.directive))
                }
            })
        }

    } else {
        //  卸载和挂载
        var target = p || n
        callHook(type, target, {
            scheduler(hook: any) {
                // 挂载时不存在旧值
                hook.call(null, target.ref, target.dirInfos?.get(hook.directive))
            }
        })
    }
}

