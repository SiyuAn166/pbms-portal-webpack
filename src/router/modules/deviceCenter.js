import Home from '../../components/common/Home.vue'

const deviceCenter = {
    path: '/deviceCenter',
    component: Home,
    meta: {title: '设备中心', icon: 'el-icon-menu'},
    children: [
        {
            path: 'device',
            component: resolve => require(['../../components/page/device/Device.vue'], resolve),
            meta: {title: '设备管理', icon: 'el-icon-monitor', permission: 'devicemgr:device:view'},
        }
    ]
}

export default deviceCenter
