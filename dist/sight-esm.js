var id = 0;
function SightConstructor(options) {
    var st = this;
    st._options = options;
    st._parent = null;
    st._children = [];
    st._sid = id++;
}

var externalAccessHandler = {
    get: function (instance, key, receiver) {
        var target = instance;
        return Reflect.get(target, key, receiver);
    },
    set: function (instance, key, newValue, receiver) {
        var target = instance;
        return Reflect.set(target, key, newValue, receiver);
    }
};
var createSightInstance = function (options) {
    return new Proxy(Reflect.construct(SightConstructor, options), externalAccessHandler);
};

var initInstanceHandler = {
    construct: function (initInstanceFunction, options) {
        return createSightInstance(options);
    }
};
var inited = false;
var initInstanceFunction = function () {
    // 确保整个程序启动只会调用一次，初始化通用的缓存
    if (inited) {
        return '已经初始化了';
    }
    else {
        console.log('初始化缓存');
        console.log('初始化编译器');
        console.log('初始化渲染器');
        inited = true;
    }
    return '首次初始化';
};
var Sight = new Proxy(initInstanceFunction, initInstanceHandler);

//           _____                    _____                    _____                    _____                _____          
//          /\    \                  /\    \                  /\    \                  /\    \              /\    \         
//         /::\    \                /::\    \                /::\    \                /::\____\            /::\    \        
//        /::::\    \               \:::\    \              /::::\    \              /:::/    /            \:::\    \       
//       /::::::\    \               \:::\    \            /::::::\    \            /:::/    /              \:::\    \      
//      /:::/\:::\    \               \:::\    \          /:::/\:::\    \          /:::/    /                \:::\    \     
//     /:::/__\:::\    \               \:::\    \        /:::/  \:::\    \        /:::/____/                  \:::\    \    
//     \:::\   \:::\    \              /::::\    \      /:::/    \:::\    \      /::::\    \                  /::::\    \   
//   ___\:::\   \:::\    \    ____    /::::::\    \    /:::/    / \:::\    \    /::::::\    \   _____        /::::::\    \  
//  /\   \:::\   \:::\    \  /\   \  /:::/\:::\    \  /:::/    /   \:::\ ___\  /:::/\:::\    \ /\    \      /:::/\:::\    \ 
// /::\   \:::\   \:::\____\/::\   \/:::/  \:::\____\/:::/____/  ___\:::|    |/:::/  \:::\    /::\____\    /:::/  \:::\____\
// \:::\   \:::\   \::/    /\:::\  /:::/    \::/    /\:::\    \ /\  /:::|____|\::/    \:::\  /:::/    /   /:::/    \::/    /
//  \:::\   \:::\   \/____/  \:::\/:::/    / \/____/  \:::\    /::\ \::/    /  \/____/ \:::\/:::/    /   /:::/    / \/____/ 
//   \:::\   \:::\    \       \::::::/    /            \:::\   \:::\ \/____/            \::::::/    /   /:::/    /          
//    \:::\   \:::\____\       \::::/____/              \:::\   \:::\____\               \::::/    /   /:::/    /           
//     \:::\  /:::/    /        \:::\    \               \:::\  /:::/    /               /:::/    /    \::/    /            
//      \:::\/:::/    /          \:::\    \               \:::\/:::/    /               /:::/    /      \/____/             
//       \::::::/    /            \:::\    \               \::::::/    /               /:::/    /                           
//        \::::/    /              \:::\____\               \::::/    /               /:::/    /                            
//         \::/    /                \::/    /                \::/____/                \::/    /                             
//          \/____/                  \/____/                                           \/____/

export default Sight;
