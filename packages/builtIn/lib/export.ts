import { modelText, modelColor, modelRadio, modelCheckbox, modelSelectOne, modelSelectMultiple, modelRange } from "./model"
import { showDirective } from "./show"
import { transitionComponent, transitionGroupComponent, transitionDirective, transitionGroupDirective } from "./transition"
import { Teleport } from "./teleport"
import { RouterLink, RouterView } from '@crush/router'
import { keepAliveComponent } from "./keepAlive"

export const builtInComponents: any = {
    transition: transitionComponent,
    transitionGroup: transitionGroupComponent,
    keepAlive: keepAliveComponent,
    Teleport,
    RouterLink,
    RouterView
}

export const builtInDirectives = {
    modelText: modelText,
    modelTextarea: modelText,
    modelCheckbox: modelCheckbox,
    modelRadio: modelRadio,
    modelRange: modelRange,
    modelColor: modelColor,
    modelSelectOne: modelSelectOne,
    modelSelectMultiple: modelSelectMultiple,
    show: showDirective,
    transition: transitionDirective,
    transitionGroup: transitionGroupDirective,

}