
import { modelText, modelColor } from "./directiveFormModel"
import { showDirective } from "./show"
import { transitionComponent, transitionGroupComponent, transitionDirective, transitionGroupDirective } from "./transition"


export const builtInComponents: any = {
    transition: transitionComponent,
    transitionGroup: transitionGroupComponent
}

export const builtInDirectives = {
    modelText: modelText,
    modelTextarea: modelText,
    modelColor,
    show: showDirective,
    transition: transitionDirective,
    transitionGroup: transitionGroupDirective
}