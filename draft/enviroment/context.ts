
const globalEnviroment = window

var builtinMethods:Record<string,any> = {}

builtinMethods.__proto__ = window

var context = Object.create(builtinMethods)

export default context