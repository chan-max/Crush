import { onMounted, useProps, useParent, onBeforePatch, useScope, computed } from '@crush/core'

export const crButtonGroup = {
    template: /*html*/`
        <div>
            <slot>
        </div>
    `,
    create() {
        let scope = useScope()
        scope.crButtonCount = 0 // 记录有多少个button
        scope.current = 0 // 记录当前挂载的
        onBeforePatch((vnode: any) => {
            scope.crButtonCount = vnode.filter((_vnode: any) => _vnode.type === crButton).length
        })
    }
}

export const crButton = {
    props: {
        color: {
            default: 'green',
        },
        type: {
            default: 'primary',
            validator(type: string) {
                return ['primary', 'cicle', 'round', 'plain'].includes(type)
            }
        },
        disabled: {
            default: false
        }
    },
    template: /*html*/`
        <style scoped>
            button{
                transition:all 0.3s;
                color:#fff;
                padding: 7px 15px;
                border:none;
                $box-shadow: ['5px','5px','20px',opacity(color,0.25)];
                $cursor: disabled ?  'not-allowed' : 'pointer';
                $background-color:color;
                border-radius:3px;
                &:hover{
                    $background-color:darken(color,7);
                }
                &:focus{
                    outline:0;
                    $box-shadow:[0, 0, 0 ,'0.25rem', opacity(color,0.25)];
                }
            }
            .cr-button-group-header{
                border-top-right-radius:0;
                border-bottom-right-radius: 0;
            }
            .cr-button-group-body{
                border-radius:0;
            }
            .cr-button-group-footer{
                border-top-left-radius:0;
                border-bottom-left-radius: 0;
            }

            .cr-button-primary{
                
            }

            .cr-button-plain{
                background-color:transparent;
                $color:color;
                $border:['1px','solid',color];
                box-shadow:none;
                &:hover{
                    $background-color:color;
                    color:white;
                }
            }
        </style>
        <button   $class="['cr-button-' + type,buttonGroupClass]">
            <slot>
        </button>
    `,
    create() {
        let parentScope = useParent().scope
        parentScope.current++
        let scope = useScope()

        if (parentScope.current === 1) {
            scope.buttonGroupClass = 'cr-button-group-header'
        } else if (parentScope.current === 3) {
            scope.buttonGroupClass = 'cr-button-group-footer'
        } else if (parentScope.current < 3 && parentScope.current > 0) {
            scope.buttonGroupClass = 'cr-button-group-body'
        }
    }
}
