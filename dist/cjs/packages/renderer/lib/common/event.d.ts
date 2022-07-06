export declare const isEvent: (key: string) => boolean;
export declare function toNativeEventName(eventName: string, _arguments?: string[]): string;
export declare const parseNativeEventName: (name: string) => {
    event: string;
    options: Record<string, any>;
};
export declare function toEventName(event: string, _arguments?: string[], modifiers?: string[]): string;
export declare function getEventName(name: string): string;
export declare function parseEventName(name: string): {
    event: any;
    _arguments: any;
    modifiers: any;
};
export declare function withEventModifiers(fn: any, modifiers: any): (event: any, ...args: any) => any;
