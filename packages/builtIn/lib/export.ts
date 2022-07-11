
import { modelText, modelColor, modelRadio, modelCheckbox, modelSelectOne, modelSelectMultiple } from "./model"
import { showDirective } from "./show"
import { transitionComponent, transitionGroupComponent, transitionDirective, transitionGroupDirective } from "./transition"


export const builtInComponents: any = {
    transition: transitionComponent,
    transitionGroup: transitionGroupComponent
}

export const builtInDirectives = {
    modelText: modelText,
    modelTextarea: modelText,
    modelCheckbox: modelCheckbox,
    modelRadio: modelRadio,
    modelColor: modelColor,
    modelSelectOne: modelSelectOne,
    modelSelectMultiple: modelSelectMultiple,
    show: showDirective,
    transition: transitionDirective,
    transitionGroup: transitionGroupDirective
}