import Vue from 'vue'
import store from '../store'

Vue.directive('hasPerm', {
    inserted: function (el, binding, vnode) {
        if (!Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
            // el.style.display= 'none'
        }
    }
})

Vue.prototype.$_has = function (value) {
    let hasPerm;
    let userPerms = store.state.user.perms
    // hasPerm = userPerms.includes(value);
    hasPerm = includes(userPerms,value)
    return hasPerm
}

function includes(arr1, arr2) {
    return arr2.some(val => arr1.includes(val));
}

