import { createRouter,
    createWebHistory,
} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/homepage.vue'),
        children: [{
            path: '/Api',
            component: {
                template:'666'
            }
        },{
            // 其他匹配路径默认会寻找文档文档
            path: '/:chapters*',
            component: () => import('../views/docs'),
        }],
    },
    {
        path: '/examples',
        component: () => import('../views/examples'),
    },
]
export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router