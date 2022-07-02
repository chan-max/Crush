import { App, defineScopeProperty } from "@crush/core";



export function createRouter(options: any) {
    return new HashRouter(options)
}

class HashRouter {
    constructor(options: any) {
        window.addEventListener(
            'hashchange',
            function (event) {
                const oldURL = event.oldURL; // 上一个URL
                const newURL = event.newURL; // 当前的URL
                console.log(newURL, oldURL);
            }
        );
    }


    install(app: App) {
        defineScopeProperty('$router', () => this)
    }
}

function createRoutesMap(routes: any) {
    
}