<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu"
                 :default-active="onRoutes"
                 :collapse="collapse"
                 background-color="#324157"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 router
                 mode="vertical">
            <sidebar-item v-for="item in items" :item="item" :key="item.path" :base-path="item.path"></sidebar-item>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import SidebarItem from './SidebarItem'

    export default {
        components: {
            SidebarItem
        },
        data() {
            return {
                collapse: false
            }
        },
        props: {
            items: {
                type: Array,
                required: true
            }

        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                // console.log(msg)
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar {
        border: none;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-y: scroll;
        /*z-index: 100;*/
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
