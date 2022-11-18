<template>
    <div class="wrapper">
        <v-sidebar :items="permission_routes"></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-head></v-head>
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    import {mapGetters} from 'vuex';

    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';
    import {getLoginToken} from "../../utils/auth";


    export default {
        data() {
            return {
                tagsList: [],
                collapse: false,
            }
        },
        components: {
            vHead, vSidebar, vTags
        },
        computed: {
            ...mapGetters({
                permission_routes: 'permission_routes'
            })
        },
        methods: {
            initWebSocket() {
                this.connection();
                let that = this;
                // 断开重连机制,尝试发送消息,捕获异常发生时重连
                this.timer = setInterval(() => {
                    try {
                        // that.stompClient.send("test");
                    } catch (err) {
                        console.log("断线了: " + err);
                        that.connection();
                    }
                }, 5000);
            },
            connection() {
                // 建立连接对象
                // let serverUrl;
                // if (process.env.NODE_ENV === 'development') {
                //     serverUrl = 'http://192.168.50.69:8802/ws'   //开发环境
                // }else if (process.env.NODE_ENV === 'production') {
                //     serverUrl = 'http://39.104.78.213:8802/ws'   //正式环境
                // }
                let serverUrl = process.env.SOCKJS_SERVER
                let socket = new SockJS(serverUrl);
                let sessionId = getLoginToken();    //获取sessionID
                // 获取STOMP子协议的客户端对象
                this.stompClient = Stomp.over(socket);
                this.stompClient.debug = function (msg) {   //去掉控制台的打印
                };
                // 定义客户端的认证信息,按需求配置
                let headers = {
                    Authorization: ''
                }
                // 向服务器发起websocket连接
                this.stompClient.connect(headers, () => {
                    //用户重复登录提示
                    this.stompClient.subscribe('/user/' + sessionId + '/duplicateLogin',
                        (msg) => {
                            // console.log("收到消息：")
                            // console.log(msg.body);
                            this.$notify({
                                title: '您已被强制下线',
                                message: msg.body,
                                type: 'warning'
                            });
                        }, headers);

                }, (err) => {
                    // 连接发生错误时的处理函数
                    console.log('失败')
                    console.log(err);
                });
            },    //连接 后台
            disconnect() {
                if (this.stompClient) {
                    this.stompClient.disconnect();
                }
            }
        },
        created() {
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
          // console.log(process.env)
        },
        mounted() {
            this.initWebSocket();
        },
        beforeDestroy: function () {
            // 页面离开时断开连接,清除定时器
            this.disconnect();
            clearInterval(this.timer);
        }
    }
</script>
