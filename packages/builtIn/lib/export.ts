import { show } from "./directiveShow"
import { modelText } from "./directiveFormModel"
import { showComponent } from "./componentShow"
import { transitionComponent, transitionGroupComponent } from "./transtion"


export const builtInComponents: any = {
    show: showComponent,
    transtion: transitionComponent,
    transitionGroup: transitionGroupComponent
}

export const builtInDirectives = {
    show,
    modelText,
}