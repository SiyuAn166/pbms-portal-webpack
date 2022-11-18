const getters = {
    sidebar: state => state.app.sidebar,
    roles: state => state.user.roles,
    perms: state => state.user.perms,
    avatar: state => state.user.avatar,
    permission_routes: state => state.permission.routes
}

export default getters
