import axios from 'axios'

type dirType = {
    type: 'directroy' | 'file',
    src: string,
    abstractSrc?:string,
    name: string,
    children?: dirType[]
}

function getZhDir() {
    return fetch('/api/zhDir', {
        method: 'GET',
    }).then((async (res) => res.text()))
}

function getEnDir() {
    return fetch('/api/enDir', {
        method: 'GET',
    }).then((async (res) => res.text()))
}

// not allowed to load local file 
// function getMd(url) {
//     debugger
//     return new Promise((resolve) => {
//         var xmlhttp = new XMLHttpRequest();
//         xmlhttp.onreadystatechange = function () {
//             if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//                 resolve(xmlhttp.responseText)
//             }
//         }
//         xmlhttp.open('GET', url, true);
//         xmlhttp.send();
//     })
// }

function getMd(url:string) {
    return axios.post('/api/getMd', {
        url
    })
}

export {
    getZhDir,
    getEnDir,
    dirType,
    getMd
}