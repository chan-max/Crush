import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import(''),             
    },
    {
        path: '/test1',
        name: 'test1',
        component: () => import(''),   
    },
    {
        path: '/test2',
        name: 'test2',
        component: () => import(''),   
    },
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router