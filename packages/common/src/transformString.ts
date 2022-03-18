import {
    cache
} from '@crush/common'


const camelizeRE = /-(\w)/g;
const camelize = cache((str: string) => str.replace(camelizeRE, (_, $) => $.toUpperCase()))

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cache((str:string) => str.replace(hyphenateRE, '-$1').toLowerCase());

export {
    camelize,
    hyphenate
}
