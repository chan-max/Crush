import { parseCascadingStyleSheet } from './parseCascadingStyleSheet'
import { generateRules, generateRenderString } from './generateRenderString'

function compileCascadingStyleSheet(template: string) {
    return new Function('renderContext',`with(renderContext){return ${generateRenderString(generateRules(parseCascadingStyleSheet(template)))}}`)
}






export {
    compileCascadingStyleSheet
}
