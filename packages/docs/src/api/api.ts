function getArticleList() {
    return fetch('/api/list', {
        method: 'GET',
    }).then((async (res) => res.text()))
}

export {
    getArticleList,
}