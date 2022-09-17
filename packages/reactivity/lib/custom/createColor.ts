import { Ref } from "../ref";
import { parseColor } from "./color";


class Color extends Ref {

    constructor(value: any) {

        let x = parseColor(value)
        debugger
        super(value)
    }
}

export function createColor(value: any) {
    return new Color(value)
}

