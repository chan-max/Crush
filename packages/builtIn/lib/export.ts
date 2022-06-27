import { show } from "./directiveShow"
import { modelText } from "./directiveFormModel"
import { showComponent } from "./componentShow"
import { transitionComponent, transitionGroupComponent } from "./transition"


export const builtInComponents: any = {
    show: showComponent,
    transition: transitionComponent,
    transitionGroup: transitionGroupComponent
}

export const builtInDirectives = {
    show,
    modelText,
}