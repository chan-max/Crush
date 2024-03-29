import { cache } from "./cache";

const camelizeRE = /-(\w)/g;
const camelize = cache((str:string) => {
    return str && str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
})

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cache((str: string) => str.replace(hyphenateRE, '-$1').toLowerCase());
const initialUpperCase = cache((str: any) => str.charAt(0).toUpperCase() + str.slice(1));
const initialLowerCase =  cache((str: any) => str.charAt(0).toLowerCase() + str.slice(1));

export {
    camelize,
    hyphenate,
    initialLowerCase,
    initialUpperCase
}