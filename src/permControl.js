import {getToken, checkLoginToken} from './utils/auth'
import router from './router'
import store from './store/index'
//使用钩子函数对路由进行权限跳转
router.beforeEach(async (to, from, next) => {

  let token = getToken();  //token就是username
  let loginSession = await checkLoginToken()  //验证是否登录token已过期。
  // let loginSession = {code: 202}
  // console.log(loginSession.code ===200)
  // console.log(loginSession)
  //登录有效
  if (loginSession.code === 200 && loginSession.msg) {
    if (to.path === '/login') {  //如果已登录，则不允许进登录页，定向到主页
      next({path: '/'})
    } else {
      let hasPerms = store.getters.perms && store.getters.perms.length > 0;
      // console.log(hasPerms)
      if (hasPerms) {
        next();
      } else {
        try {
          const {perms} = await store.dispatch("user/getInfo", token);
          if (!perms || perms.length <= 0) {
            next()
          }
          const accessRoutes = await store.dispatch("permission/generateRoutes", perms);//获取权限路由, await后边是promise对象，接受的值是resolve（data）的data
          router.addRoutes(accessRoutes)//动态添加路由

          next({...to, replace: true}) //跳转到刷新时的路由地址
        } catch (e) {
          console.log(e)
          next(`/login?redirect=${to.path}`)
        }
      }
    }

  } else {
    //未登录，转去登录页,或被其他用户挤掉线
    if (to.path === '/login') {
      next();
    } else {
      next('/login')
    }
  }
})
