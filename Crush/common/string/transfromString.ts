import { cache } from "../cache/cache";

const camelize = cache((str: string) => str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : ''
}));

export {
        camelize
}