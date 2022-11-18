import axios from 'axios'
import API from '@/interface/'
import {removeToken, removeLoginToken} from "../../utils/auth"

const state = {
    username: '',
    roles: [],
    perms: [],
    avatar: ''
}

const mutations = {
    SET_USERNAME(state, username) {
        state.username = username
    },
    SET_ROLES(state, roles) {
        state.roles = roles
        // sessionStorage.setItem("roles", roles)
    },
    SET_PERMS(state, perms) {  // 用户权限标识集合
        state.perms = perms;
        // sessionStorage.setItem("perms", perms)
    },
    SET_AVATAR(state, avatar) {
        state.avatar = avatar;
    },
    SET_EMPTY(state) {
        state.username = '';
        state.roles = [];
        state.perms = [];
        state.avatar = '';
        state.token = '';
    }
}

const actions = {
    setUsername: function ({commit}, username) {
        commit("SET_USERNAME", username)
    },
    setRoles: function ({commit}, roles) {
        commit("SET_ROLES", roles)
    },
    setPerms: function ({commit}, perms) {
        commit("SET_PERMS", perms)
    },
    setAvatar: function ({commit}, avatar) {
        commit("SET_PERMS", avatar)
    },
    login: function ({commit}, userInfo) {
        // const {username, password} = userInfo
        return axios.post(API.loginUrl, userInfo)
    },
    getInfo: function ({commit}, username) {
        //查询用户信息
        return new Promise((resolve, reject) => {
            axios.post(API.user.getInfo, {"username": username}).then(
                response => {
                    //data : {username,roles,perms}
                    const {data} = response
                    const {username, roles, perms, avatar} = data.msg
                    commit("SET_USERNAME", username)
                    commit("SET_ROLES", roles)
                    commit("SET_PERMS", perms)
                    commit("SET_AVATAR", avatar)
                    resolve(data.msg);
                }
            ).catch(error => {
                reject(error)
            })
        })
    },
    logout: function ({commit}) {
        return new Promise((resolve, reject) => {
            axios.post(API.logoutUrl).then(response => {
                commit("SET_EMPTY")
                removeToken()
                removeLoginToken()
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        });
    },
    modifyPassword: function ({commit}, data) {
        return new Promise((resolve, reject) => {
            axios.post(API.user.modifyPassword, data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error);
            });
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
