import {_createElement,_createTextNode} from './vnode'

var nodeTree = _createElement('div',null,[
    _createElement('header',null,[
        _createElement('h1',null,[
            _createTextNode('这是h1标签'),
        ]),
        _createElement('h2',null,[
            _createTextNode('这是h2标签')
        ]),
    ]),
    _createElement('main',null,[
        _createTextNode('这是main标签')
    ]),
    _createElement('footer',null,[
        _createTextNode('这是footer标签')
    ]),
])



const contanier = document.querySelector('#app')

function render(container:any,nodeTree:any) {
    const childNodes = container.childNodes
    
    const nodeType = nodeTree.type

    switch(nodeType){
        case 'ELEMENT':
            console.log(123);
        break;
    }
}



// render(contanier,nodeTree);

// (window as any).nodeTree = nodeTree

export default ''
