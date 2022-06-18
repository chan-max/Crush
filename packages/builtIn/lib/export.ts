import { show } from "./directiveShow"
import { model } from "./directiveFormModel"
import { transition } from "./directiveTransition"
import { showComponent } from "./componentShow"

export const builtInComponents = {
    show: showComponent
}

export const builtInDirectives = {
    show,
    model,
    transition
}