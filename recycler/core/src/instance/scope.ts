import cssFunctions from '../renderer/built-in/cssFunctionExport'


var proto = {
    ...cssFunctions
}

export var initScope = () => Object.create(proto)