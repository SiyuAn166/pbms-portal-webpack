<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChange">
            <i v-if="collapse" class="el-icon-s-unfold"></i>
            <i v-if="!collapse" class="el-icon-s-fold"></i>
        </div>
        <div class="header-right">
            <div class="header-user-con">
<!--                &lt;!&ndash; 全屏显示 &ndash;&gt;-->
<!--                <div class="btn-fullscreen" @click="handleFullScreen">-->
<!--                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">-->
<!--                        <i class="el-icon-rank"></i>-->
<!--                    </el-tooltip>-->
<!--                </div>-->
<!--                &lt;!&ndash; 消息中心 &ndash;&gt;-->
<!--                <div class="btn-bell">-->
<!--                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">-->
<!--                        <router-link to="/tabs">-->
<!--                            <i class="el-icon-bell"></i>-->
<!--                        </router-link>-->
<!--                    </el-tooltip>-->
<!--                    <span class="btn-bell-badge" v-if="message"></span>-->
<!--                </div>-->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img v-if="avatar" :src="avatar">
                    <img v-else src="../../assets/img/default_avatar.jpg">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="settings">个人设置</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2
            }
        },
        computed: {
            ...mapGetters({
                avatar: "avatar"
            }),
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'logout') {
                    this.handleLogout();
                }
                if (command == 'settings') {
                    this.handleSettings();
                }
            },
            // 侧边栏折叠
            collapseChange() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
                // this.$store.dispatch('app/toggleSideBar')
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            handleLogout: function () {
                localStorage.removeItem('ms_username')
                this.$store.dispatch("user/logout").then(response => {
                    this.$router.push('/login');
                });
            },
            handleSettings: function () {
                this.$router.push('/user-settings')
            }
        }
        ,
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChange();
            }
        }
    }
</script>


<style scoped>
    .header {
        position: relative;
        width: 100%;
        height: 50px;
        font-size: 16px;
        box-sizing: border-box;
        box-shadow: 0 1px 15px rgba(0,21,41,.08)
    }

    .collapse-btn {
        float: left;
        padding: 0 10px;
        cursor: pointer;
        line-height: 50px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 50px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 50px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell, .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }


    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #000;
    }

    .btn-bell .el-icon-bell {
        color: #000;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #000;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
