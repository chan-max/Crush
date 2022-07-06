declare function rgba(...rgba: number[]): string;
declare const rgb: typeof rgba;
declare function hsla(h: number, s: number | string, l: number | string, a?: number): string;
declare const hsl: typeof hsla;
declare function $var(variable: string): string;
declare function attr(attrName: string): string;
declare function calc(exp: string): string;
declare function cubicBezier(x1: number, y1: number, x2: number, y2: number): string;
declare function conicGradient(): void;
declare function linearGradient(): void;
declare function radialGradient(): void;
declare const max: (...items: string[]) => string;
declare const min: (...items: string[]) => string;
declare function rotateY(deg: number): string;
declare function translateX(t: string): string;
declare function translateY(t: string): string;
declare function translate3d(x: string | number, y: string | number, z: string | number): string;
declare function scale(sx: number, sy?: number): string;
declare function scale3d(sx: number, sy: number, sz: number): string;
declare function rotate3d(x: number, y: number, z: number, a: number | string): string;
declare function rotate(a: number | string): string;
declare function perspective(l: string): string;
declare function skewX(x: number | string): string;
declare function skewY(y: number | string): string;
declare function skew(x: number | string, y: number | string): string;
declare function scaleY(n: number): string;
export { rgba, rgb, hsl, hsla, $var, attr, calc, cubicBezier, max, min, translateX, translateY, scale, rotate3d, translate3d, rotate, perspective, scale3d, skew, skewX, skewY, scaleY, rotateY, conicGradient, linearGradient, radialGradient };
