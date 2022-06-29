import { createApp, doKeyframesAnimation, getElementStyle, h, hasOwn, important, isReactive, isRef, mountDeclaration, onCreated, onMounted, onSet, removeElement, setElementStyleDeclaration } from "./packages/core";
import { reactive, readonly } from "./packages/reactivity/lib/reactive";
import { computed } from "./packages/reactivity/lib/computed";
import { ref } from "./packages/reactivity/lib/ref";
import { effect } from "./packages/core";

import { useDate, dateFormatRE } from "@crush/reactivity/lib/custom/date";
import { useNumber } from "@crush/reactivity/lib/custom/number";
import { watchRef } from "@crush/reactivity/lib/watchRef";
import { shallowWatchReactive, watchReactive } from "@crush/reactivity/lib/watchReactive";
import { useBoolean } from "@crush/reactivity/lib/custom/boolean";
import { useRefState } from "@crush/core/lib/instance/refState";

var root = {

    template: /*html*/`
        <button @click="setTitle(title+'!')" > {{title}} </button>
    `,
    create() {
        let { title, setTitle, onTitleChange } = useRefState('title')
        onTitleChange((newValue,oldValue) => {
            document.title = newValue
            console.log(newValue,oldValue);
        })
    },
}


var app = createApp(root)

console.log('app', app);
var instance = app.mount('#app')


