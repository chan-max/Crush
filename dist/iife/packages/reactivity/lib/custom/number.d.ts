import { Ref } from "../ref";
declare class ReactiveNumber extends Ref {
    constructor(value: number);
    plus(value?: number): any;
    minus(value?: number): number;
    multiply(value?: number): number;
    devide(value?: number): number;
}
export declare function useNumber(value: number): ReactiveNumber;
export {};
