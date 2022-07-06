import { Ref } from "../ref";
declare class ReactiveString extends Ref {
    constructor(value: string);
    concat(...values: any[]): any;
    padEnd(targetLength: number, padString: string): any;
}
export declare function useString(value?: string): ReactiveString;
export {};
