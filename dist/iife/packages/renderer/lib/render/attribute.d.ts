export declare function updateClass(el: Element, pClass: any, nClass: any): void;
export declare function mountClass(el: Element, _class: any): void;
export declare function unmountClass(el: Element): void;
import { ComponentInstance } from "@crush/core";
export declare function mountAttributes(el: any, props: any, instance: ComponentInstance, isSVG: boolean): void;
export declare function updateAttributes(el: any, pProps: any, nProps: any, instance: ComponentInstance, isSVG?: boolean): void;
