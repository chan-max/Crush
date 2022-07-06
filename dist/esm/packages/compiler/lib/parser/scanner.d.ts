export declare const createScanner: (source: string) => Scanner;
declare class Scanner {
    source: string;
    constructor(source: string);
    move(step: number): void;
    at(index: number): string;
    expect(expect: string, index?: number): boolean;
    startsWith(expect: any): boolean;
    exec(extractor: RegExp): string[] | null;
}
export {};
