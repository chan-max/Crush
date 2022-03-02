import { createRouter,
    createWebHistory,
} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/homepage.vue'),
        children: [{
            path: '/docs',
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