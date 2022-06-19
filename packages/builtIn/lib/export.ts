import { show } from "./directiveShow"
import { modelText } from "./directiveFormModel"
import { transition } from "./directiveTransition"
import { showComponent } from "./componentShow"


export const builtInComponents:any = {
    show: showComponent
}

export const builtInDirectives = {
    show,
    modelText,
    transition
}