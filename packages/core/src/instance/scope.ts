import cssFunctions from '../renderer/built-in/cssFunction'


var proto = {
    ...cssFunctions
}

export var initScope = () => Object.create(proto)