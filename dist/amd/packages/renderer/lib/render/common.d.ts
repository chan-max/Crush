export declare const insertNull: (arr: any[], index: number, length?: number) => any[];
export declare const isReservedProp: (key: string) => boolean;
export declare const getReservedProp: (key: string) => string;
export declare function unionkeys(...maps: Record<string, any>[]): string[];
export declare function createMapEntries<T>(...maps: (Record<string, T> | null)[]): Record<string, T[]>;
