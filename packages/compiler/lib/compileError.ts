
export function compilerWithErrorCapture(compiler: any) {
    return (...args: any) => {
        try {
            return compiler(...args)
        } catch (e) {
            debugger
        }
    }
}


