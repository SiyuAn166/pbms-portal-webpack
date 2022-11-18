import {asyncRoutes, constantRoutes} from '../../router'

const state = {
    routes: []
    // routes: constantRoutes.concat(asyncRoutes)//测试用
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({commit}, perms) {
        return new Promise(resolve => {
            let accessedRoutes;
            accessedRoutes = filterAsyncRoutes(asyncRoutes, perms)
            // console.log(accessedRoutes)
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes)
        })
    }
}

function hasPermission(perms, route) {
    if (route.meta && route.meta.permission) {
        return perms.includes(route.meta.permission)
    } else {
        return true
        // return false
    }
}

export function filterAsyncRoutes(routes, perms) {
    const res = []
    routes.forEach(route => {
        let tmp = {...route}
        if (hasPermission(perms, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, perms);
            }
            //如果children中没有有权限的菜单，则隐藏该目录
            if (tmp.children && tmp.children.length === 0) {
                // console.log(tmp.children.length + "-" + tmp.path)
                tmp = {...tmp, hidden: true}
            }
            res.push(tmp);
        }
    })
    // console.log(res)
    return res
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}
