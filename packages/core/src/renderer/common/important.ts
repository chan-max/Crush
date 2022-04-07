
export const ImportantSymbol = Symbol('important')

export const important = (value: any) => ({
    value,
    [ImportantSymbol]: true
})