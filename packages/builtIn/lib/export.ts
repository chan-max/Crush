
import { modelText } from "./directiveFormModel"
import { showDirective } from "./show"
import { transitionComponent, transitionGroupComponent, transitionDirective } from "./transition"


export const builtInComponents: any = {
    transition: transitionComponent,
    transitionGroup: transitionGroupComponent
}

export const builtInDirectives = {
    show: showDirective,
    modelText,
    transition: transitionDirective,
    transitionGroup: transitionGroupComponent
}