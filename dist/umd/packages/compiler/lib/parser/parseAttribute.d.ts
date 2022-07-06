export declare function parseAttribute(attribute: string, value: string): {
    isBooleanProperty: boolean;
    property: string;
    isDynamicProperty: boolean;
    isDynamicValue: boolean;
    value: string;
    flag: string;
    endFlag: string;
    left: string;
    right: string;
    _arguments: "" | string[];
    modifiers: "" | string[];
} | undefined;
