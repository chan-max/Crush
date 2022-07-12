import { ComponentType } from "../instance/component";
import { DirectiveType } from "../instance/directive";
import { MixinType } from "../instance/mixin";
import { PluginType } from "../instance/plugin";
export declare function getCurrentApp(): App;
export interface AppOptions {
    container: string | HTMLElement;
}
export declare class App {
    isMounted: boolean;
    inlineTemplate: string;
    container: Element;
    startTime: any;
    constructor(appOptions: AppOptions);
    components: Record<string, ComponentType>;
    component(name: string, component: ComponentType): void;
    directives: Record<string, DirectiveType>;
    directive(name: string, directive: DirectiveType): void;
    mixins: MixinType[];
    mixin(mixin: MixinType): void;
    plugins: Set<PluginType>;
    use(plugin: PluginType, ...options: any[]): void;
    mount(component: any): void;
    record: any;
    time(key: string): number;
    timeEnd(key: string): number;
}
