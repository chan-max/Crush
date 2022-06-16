
/*
    transition for single element , single component
    transition 
    properties , duration , timingFunction , delay

    ---------------------------------------
    --transition.fast.slow.normal=""
    
*/

/*
    动画过渡，使用动画库中自带的 keyframes进行过渡 ， 或者自己定义 keyframes (需要进入和离开，如果只有一个使用同一个)
    --transition:animate="['rollIn','rollOut']"

    <transition type="">

    </transition>

*/


export const transition = {
    beforeCreate(_: any, { value }: any, vnode: any) {
        vnode.transition = {
            type: 'css',

        }
    },
    beforeUpdate(el: any, bindings: any, vnode: any, pvnode: any) {
    },
}