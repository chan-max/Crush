import { cache } from "./cache";

function camelize(target: string){
    return target.replace(/-(\w)/, (_, l: string) => l.toUpperCase())
}

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = (str) => str.replace(hyphenateRE, '-$1').toLowerCase()


export {
    camelize
}