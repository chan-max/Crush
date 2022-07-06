declare type EventHandler = Function | undefined | EventHandler[];
export declare function getInstanceEvents(instance: any): any;
export declare function getInstancetEventListeners(instance: any, event: string): any;
export declare function createInstanceEventEmitter(instance: any): (event: string, ...args: any[]) => void;
export declare function arrayHandler(handler: any): any;
export declare function updateInstanceListeners(instance: any, event: any, pHandler: EventHandler, nHandler: EventHandler): void;
export declare function addInstanceListener(instance: any, event: string, handler: EventHandler): void;
export declare function removeInstanceListener(instance: any, event: string, handler: EventHandler): void;
export declare function onceInstanceListener(instance: any, event: string, handler: EventHandler): void;
export {};
