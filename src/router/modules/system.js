import Home from  '../../components/common/Home.vue'

const systemRouter = {
    path: '/system',
    component: Home,
    meta: {title: '系统管理', icon: 'el-icon-s-platform'},
    children: [
        {
            path: 'user',
            component: resolve => require(['../../components/page/system/UserPage.vue'], resolve),
            meta: {title: '用户管理', icon: 'el-icon-user-solid', permission: 'system:user:view'}
        },
        {
            path: 'role',
            component: resolve => require(['../../components/page/system/RolePage.vue'], resolve),
            meta: {title: '角色管理', icon: 'el-icon-user', permission: 'system:role:view'}
        },
        {
            path: 'resource',
            component: resolve => require(['../../components/page/system/ResourcePage.vue'], resolve),
            meta: {title: '资源管理', icon: 'el-icon-folder-opened', permission: 'system:resource:view'}
        },
        {
            path: 'job',
            component: resolve => require(['../../components/page/job/Job.vue'], resolve),
            meta: {title: '定时任务', icon: 'el-icon-tickets', permission: 'system:job:view'}
        },
        {
            path: 'log',
            component: resolve => require(['../../components/page/system/LogPage.vue'], resolve),
            meta: {title: '日志管理', icon: 'el-icon-document-copy', permission: 'system:log:view'}
        }
    ]
}

export default systemRouter
