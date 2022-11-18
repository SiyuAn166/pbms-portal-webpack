import Home from  '../../components/common/Home.vue'

const monitorCenter ={
    path: '/monitorCenter',
    component: Home,
    meta: {title: '全网监控', icon: 'el-icon-s-data', permission: 'monitorCenter'},
    children: [
        {
            path: 'map',
            component: resolve => require(['../../components/page/monitor/Map.vue'], resolve),
            meta: {title: '地图监控', icon: 'el-icon-data-analysis', permission: 'monitorCenter:map:view'},
        }
    ]
}

export default monitorCenter
