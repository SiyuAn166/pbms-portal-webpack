<template>
    <div class="login-wrap">
        <!--<div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>-->

        <el-card class="login-card">
            <div slot="header" class="clearfix">
                <h3 class="login-title">系统登录</h3>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <span slot="prepend">
                        <i class="el-icon-user"></i>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <span slot="prepend">
                            <i class="el-icon-lock"></i>
                        </span>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <!--                    <v-code></v-code>-->
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>

    import {setToken, setLoginToken} from "../../utils/auth";
    import VCode from '../common/ValidateCode'

    export default {
        components: {
            VCode
        },
        data: function () {
            return {

                url: this.$Api.loginUrl,
                ruleForm: {
                    username: 'admin1',
                    password: 'admin1'
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名'},
                        {min: 6, max: 20, message: '长度在6-20个字符'},
                        {pattern: '^[a-zA-Z0-9_-]{6,20}$', message: '请以字母开头，长度在6~20之间，只能包含字母、数字和下划线'}
                    ],
                    password: [
                        {required: true, message: '请输入密码'},
                        {min: 6, max: 20, message: '长度在6-20个字符'},
                        {pattern: '^[a-zA-Z0-9_-]{6,20}$', message: '请以字母开头，长度在6~20之间，只能包含字母、数字和下划线'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch("user/login", this.ruleForm).then(
                            response => {
                                // console.log(response)
                                const {code, msg} = response.data
                                if (code && code === 200 && msg) {
                                    localStorage.setItem('ms_username', this.ruleForm.username);
                                    setToken(this.ruleForm.username)
                                    setLoginToken(msg.id)
                                    this.$router.push('/');
                                } else {
                                    this.$message.error(response.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                console.log(error)
                                this.$message.error("登录失败，请联系系统管理员！")
                                return false;
                            }
                        )
                    } else {
                        console.log('error submit!!');
                        return false;
                    }

                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        /*background-image: url(../../assets/img/login-bg.jpg);*/
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

    .login-card {
        position: relative;
        top: 20%;
        width: 480px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.2);
        border: none;
    }

    .clearfix {
        text-align: center;
        color: #ffffff;
    }


</style>
