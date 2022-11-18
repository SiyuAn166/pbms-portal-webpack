<template>
    <div class="v_code_wrapper">
        <el-row>
            <el-col :span="12">
                <el-input placeholder="请输入验证码" v-model="params.verifyCodeActual" minlength="4" maxlength="4" >
                                <span slot="prepend">
                                    <i class="el-icon-postcard"/>
                                </span>
                </el-input>
            </el-col>
            <el-col :span="12" align="right">
                <img :src="url" fit="contain" class="v-code" @click="refreshCode"/>
            </el-col>
        </el-row>
        <el-button type="primary" @click="checkcode">验证</el-button>
        {{result}}
    </div>
</template>

<script>
    export default {
        name: "ValidateCode",
        data() {
            return {
                params: {
                    verifyCodeActual: ''
                },
                url: this.$Api.vCodeUrl,
                result: ""
            };
        },
        methods: {
            refreshCode: function () {
                this.url = this.$Api.vCodeUrl + '?' + Math.random();
            },
            checkcode: function () {
                this.$axios.get(this.$Api.vCodeCheckUrl, {params: this.params}).then(r => {
                    // console.log(r)
                    const {code, msg} = r.data
                    if (code === 200 && msg) {
                        this.result = "验证码正确";
                    } else {
                        this.result = "验证码错误";
                    }
                }).catch(e => {
                    console.log(e);
                });
            }
        }
    }
</script>

<style scoped>
    .v-code {
        width: 160px;
        height: 60px;
    }
</style>
