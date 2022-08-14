import { computed, createApp, usePromise, watchRef, warn, error } from "./packages/core";

import { setSelectorAttribute } from "./packages/core";





let root = {
    template: /*html*/`
    `,
    create({ $self }: any) {
        $self.count = 0
        $self.toggle = () => {
            $self.count++
        }
    }
}



const app = createApp(root)


app.mount('#app')




