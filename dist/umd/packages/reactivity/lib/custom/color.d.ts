import { Ref } from "../ref";
export declare const toHex: (num: number | string) => string;
export declare const toDec: (num: number | string) => number;
export declare function rgbToHex(): void;
export declare function hexToRgb(): void;
export declare const useColor: (color: string) => ColorRef;
declare class ColorRef extends Ref {
    constructor(color: string);
}
export {};
