
/*

*/

export function parseURL(url: string) {
    if (url.startsWith('#')) {
        url = url.slice(1)
    }

    if (!url.startsWith('/')) {
        url = '/' + url
    }

    const queryPosition = url.indexOf('?');
    const hashPosition = url.indexOf('#');

    let path, query, hash, pathTokens, queryString

    if (hashPosition > -1) {
        hash = url.slice(hashPosition + 1)
    }

    if (queryPosition > -1) {
        queryString = url.slice(queryPosition + 1, hash ? hashPosition : url.length)
        query = parseQuery(queryString)
    }

    path = url.slice(0, queryPosition > -1 ? queryPosition : hashPosition > -1 ? hashPosition : url.length)
    pathTokens = parsePath(path)
    return {
        path,
        query,
        hash,
        queryString,
        pathTokens
    }
}




function parsePath(path: string) {
    return path.split('/').filter((token: string) => token !== '/' && token !== '')
}

function parseQuery(queryString: string) {
    let query = null
    queryString.split('&').forEach((queryMapString: string) => {
        let queryMap = queryMapString.split('=');
        (query ||= {})[queryMap[0]] = queryMap[1]
    })
    return query
}


function getCurrentUrl(){

}