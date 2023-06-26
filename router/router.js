import {
    createRouter,
    createWebHashHistory
} from 'vue-router'; // 

import pinia from '/main.js'
import {
    useUserStore
} from '/stores/user.js'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'home',
        component: () =>
            import ('/pages/home/home.vue'),
    }, {
        path: '/link',
        name: 'link',
        component: () =>
            import ('/pages/link/link.vue'),
    }, {
        path: '/guestbook',
        name: 'guestbook',
        component: () =>
            import ('/pages/guestbook/guestbook.vue'),
    }, {
        path: '/user',
        name: 'user',
        component: () =>
            import ('/pages/user/user.vue'),
        meta: {
            isLogin: true
        },
    }, {
        path: '/blog',
        name: 'blog',
        component: () =>
            import ('/pages/blog/blog.vue'),
    }, {
        path: '/development-log',
        name: 'development-log',
        component: () =>
            import ('/pages/developmentLog/developmentLog.vue'),
    }, {
        path: '/console',
        component: () =>
            import ('/pages/console/console.vue'),
        meta: {
            isAdmin: true
        },
        children: [{
            path: '',
            name: 'console',
            component: () =>
                import ('/pages/console/webInfo/webInfo.vue')
        }, {
            path: 'article-editor',
            component: () =>
                import ('/pages/console/articleEditor/articleEditor.vue')
        }, {
            path: 'log-writing',
            component: () =>
                import ('/pages/console/logWriting/logWriting.vue')
        }, {
            path: 'link-audit',
            component: () =>
                import ('/pages/console/linkAudit/linkAudit.vue')
        }, {
            path: 'messages-manage',
            component: () =>
                import ('/pages/console/messagesManage/messagesManage.vue')
        }, {
            path: 'users-manage',
            component: () =>
                import ('/pages/console/usersManage/usersManage.vue')
        }]
    }, {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () =>
            import ('/pages/notFound/developmentLog.vue')
    }]
});

router.beforeEach((to, from) => {
    const user = useUserStore(pinia)
    if (to.meta.isLogin && !user.isLogin) {
        return {
            name: 'home'
        }
    }
    if (to.meta.isAdmin && !user.isAdmin) {
        return {
            name: 'home'
        }
    }
})

export { // 
    router
}