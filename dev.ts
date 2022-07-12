import { createApp } from "./packages/core";

import { withScope } from "./packages/core";


let str = `${`${`${666}`}`}`


let x = withScope(str)

console.log(x);
