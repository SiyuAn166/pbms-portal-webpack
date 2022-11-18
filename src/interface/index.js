let prefix = '/api'
let online_url = {
    //login
    loginUrl: prefix + '/doLogin',
    logoutUrl: prefix + '/doLogout',
    vCodeUrl: prefix + '/captcha',
    vCodeCheckUrl: prefix + '/checkCode',

    //user
    user: {
        list: prefix + '/system/user/list',
        listAll: prefix + '/system/user/listAll',
        find: prefix + '/system/user/find',
        update: prefix + '/system/user/update',
        updateProfile: prefix + '/system/user/updateProfile',
        save: prefix + '/system/user/save',
        delete: prefix + '/system/user/delete',
        deleteBatch: prefix + '/system/user/deleteBatch',
        getInfo: prefix + '/system/user/getInfo',
        getSession: prefix + '/system/user/getSession',
        checkSession: prefix + '/system/user/checkSession',
        modifyPassword: prefix + '/system/user/modifyPassword',
        avatar: prefix + '/system/user/avatar'
    },

    role: {
        list: prefix + '/system/role/list',
        listRemarksByUsername: prefix + '/system/role/listRemarksByUsername',
        listAll: prefix + '/system/role/listAll',
        find: prefix + '/system/role/find',
        update: prefix + '/system/role/update',
        save: prefix + '/system/role/save',
        delete: prefix + '/system/role/delete',
        deleteBatch: prefix + '/system/role/deleteBatch'
    },
    resource: {
        list: prefix + '/system/resource/list',
        listAll: prefix + '/system/resource/listAll',
        find: prefix + '/system/resource/find',
        update: prefix + '/system/resource/update',
        save: prefix + '/system/resource/save',
        delete: prefix + '/system/resource/delete',
        deleteBatch: prefix + '/system/resource/deleteBatch',
        getTree: prefix + '/system/resource/getTree',
        getTreeByUsername: prefix + '/system/resource/getTreeByUsername',
    },
    job: {
        checkCron: prefix + '/job/checkCron',
        listAll: prefix + '/job/list',
        find: prefix + '/job/find',
        update: prefix + '/job/update',
        save: prefix + '/job/save',
        delete: prefix + '/job/delete',
        run: prefix + '/job/run',
        pause: prefix + '/job/pause',
        resume: prefix + '/job/resume'
    },
    log: {
        list: prefix + '/system/log/list'
    },
    upload: {
        file: prefix + '/system/upload/file',
        image: prefix + '/system/upload/image'
    },
    device:{
        save: prefix + "/devicemgr/device/save",
        update: prefix + "/devicemgr/device/update",
        delete: prefix + "/devicemgr/device/delete",
        deleteBatch: prefix + "/devicemgr/device/deleteBatch",
        find: prefix + "/devicemgr/device/find",
        list: prefix + "/devicemgr/device/list",
        listAll: prefix + "/devicemgr/device/listAll"
    }


}

export default online_url
