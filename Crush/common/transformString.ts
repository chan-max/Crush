import { cache } from "./cache/cache";



var camelize = (target: string) => target.replace(/-(\w)/, (_, l: string) => l.toLowerCase())



export {
    camelize
}