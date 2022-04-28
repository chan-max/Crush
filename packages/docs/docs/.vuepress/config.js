module.exports = {
    title: 'Crush',
    description: 'a vue like javascript framework',
    base: '/CrushDocs/',

    themeConfig: {
        locales: {
            '/': {
                nav: [],
                sidebar: [{
                        title: '引导',
                        path: '/guide/',
                        children: ['/guide/intro', '/guide/install']
                    },
                    {
                        title: '教程',
                        path: '/tutorial/',
                        children: [ '/tutorial/app','/tutorial/test'],
                    },
                    {
                        title: 'API参考',
                        path:'/api/',
                        children: ['/api/app','/api/cssBuiltInFunction','/api/builtInTag','/api/builtInDirective','/api/builtInComponent',],
                    },
                    {
                        title: '路由',
                        children: [ /* ... */ ],
                    },
                    {
                        title: '状态管理',
                        children: [ /* ... */ ],
                    },
                    {
                        title: '最佳实践',
                        children: [ /* ... */ ],
                    },
                ]
            },
            '/zh/': {
                sidebar: [{
                        title: 'guide',
                        path: '/guide/',
                        children: []
                    },
                    {
                        title: 'api',
                        children: [ /* ... */ ],
                    }
                ]
            }
        }
    },




    locales: {
        '/': {
            lang: '中文',
        },
        '/en/': {
            lang: 'English', // 将会被设置为 <html> 的 lang 属性
        },
    }
}