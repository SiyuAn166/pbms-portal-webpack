<template>
    <div class="user-settings">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user-solid"></i> 个人设置</el-breadcrumb-item>
                <!--                {{userSettingForm}}-->
            </el-breadcrumb>
        </div>
        <div class="user-settings-panel">
            <el-tabs type="border-card">
                <el-tab-pane label="个人资料">
                    <el-card class="profile-card">
                        <el-row>
                            <el-col :span="6" align="center">
                                <el-image :src="userProfile.avatar" @click="changeAvatar">
                                    <div slot="error" class="image-slot" @click="changeAvatar">
                                        <img class="default-avatar" src="../../assets/img/default_avatar.jpg">
                                    </div>
                                </el-image>
                            </el-col>


                            <el-col :span="12">
                                <el-form ref="userProfile" :model="userProfile" label-width="80px" :rules="rules">
                                    <el-form-item label="姓名" :label-width="formLabelWidth" show-message prop="fullname">
                                        <el-input v-model="userProfile.fullname"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱" :label-width="formLabelWidth" show-message prop="email">
                                        <el-input v-model="userProfile.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号" :label-width="formLabelWidth" show-message prop="mobile">
                                        <el-input v-model="userProfile.mobile"></el-input>
                                    </el-form-item>
                                    <el-form-item :label-width="formLabelWidth">
                                        <el-button type="primary" @click="handleProfileSubmit">提交</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-card>

                </el-tab-pane>
                <el-tab-pane label="修改密码">
                    <el-card class="box-card">
                        <el-form ref="userSettingForm" :model="userSettingForm" :rules="rules" label-width="80px">
                            <el-form-item label="原始密码" :label-width="formLabelWidth" show-message prop="oldPassword">
                                <el-input v-model="userSettingForm.oldPassword" autocomplete="off"
                                          show-password></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" :label-width="formLabelWidth" show-message prop="newPassword">
                                <el-input v-model="userSettingForm.newPassword" autocomplete="off"
                                          @input="triggerCheckPass"
                                          show-password></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" :label-width="formLabelWidth" show-message
                                          prop="confirmPassword">
                                <el-input v-model="userSettingForm.confirmPassword" autocomplete="off"
                                          show-password></el-input>
                            </el-form-item>
                            <el-form-item :label-width="formLabelWidth">
                                <el-button type="primary" @click="handlePasswordSubmit">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
            <el-dialog
                    title="更换头像"
                    :visible.sync="avatarDialogVisible"
                    width="20%">
                <el-upload
                        align="center"
                        name="multipart"
                        ref="uploadAvatar"
                        :action="imageUploadUrl"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="imgPreview"
                        :on-success="handleAvatarSuccess"
                        :on-error="handleAvatarError"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleAvatarConfirm">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import {getToken} from "../../utils/auth";

    export default {
        name: "UserSettings",
        data() {

            const checkOldNew = (rule, value, callback) => {
                if (this.userSettingForm.oldPassword === this.userSettingForm.newPassword) {
                    callback(new Error("新密码不能与旧密码一致！"))
                } else {
                    callback();
                }
            };

            const checkNewConfirm = (rule, value, callback) => {
                // console.log(this.userSettingForm)
                if (this.userSettingForm.newPassword !== value) {
                    callback(new Error("两次输入密码不一致！"))
                } else {
                    callback();
                }
            };

            return {
                formLabelWidth: '120px',
                avatarDialogVisible: false,
                imageUploadUrl: this.$Api.user.avatar,
                imageUrl: '',
                userProfile: {
                    userId: '',
                    fullname: '',
                    email: "",
                    mobile: "",
                    avatar: ''
                },
                userSettingForm: {
                    username: getToken(),
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                rules: {
                    fullname: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在2-20个字符', trigger: 'blur'},
                        {pattern: '^[\u4e00-\u9fa5]{0,20}$', message: '请输入汉字！', trigger: 'blur'}
                    ],
                    email: [
                        {
                            pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
                            message: '请输入正确的邮箱',
                            trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            pattern: '^(13[0-9]|14[5|7]|15[0-9]|18[0-9]|19[0-9])\\d{8}$',
                            message: '请输入正确的手机号',
                            trigger: 'blur'
                        }
                    ],
                    oldPassword: [
                        {required: true, message: '请输入原始密码'},
                        {min: 6, max: 20, message: '长度在6-20个字符'},
                        {pattern: '^[a-zA-Z0-9_-]{6,20}$', message: '请以字母开头，长度在6~20之间，只能包含字母、数字和下划线'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码'},
                        {min: 6, max: 20, message: '长度在6-20个字符'},
                        {pattern: '^[a-zA-Z0-9_-]{6,20}$', message: '请以字母开头，长度在6~20之间，只能包含字母、数字和下划线'},
                        {required: true, validator: checkOldNew, trigger: ['blur', 'change']}
                    ],
                    confirmPassword: [
                        {required: true, message: '请输入确认密码'},
                        {min: 6, max: 20, message: '长度在6-20个字符'},
                        {pattern: '^[a-zA-Z0-9_-]{6,20}$', message: '请以字母开头，长度在6~20之间，只能包含字母、数字和下划线'},
                        {required: true, validator: checkNewConfirm, trigger: ['blur', 'change']}
                    ]
                }
            }
        },
        methods: {
            triggerCheckPass: function () {
                this.$refs.userSettingForm.validateField("newPassword");
                this.$refs.userSettingForm.validateField("confirmPassword");
            },
            getUserInfo: function () {
                this.$axios.post(this.$Api.user.find, {username: getToken()}).then(
                    response => {
                        // console.log(response.data)
                        const {code, msg} = response.data;
                        if (code === 200 && msg) {
                            // this.userProfile = msg
                            for (let fie in this.userProfile) {
                                this.userProfile[fie] = msg[fie]
                            }
                        }
                    }
                ).catch(
                    error => {
                        console.log(error.data)
                    }
                );


            },
            handleProfileSubmit: function () {
                this.$refs.userProfile.validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.user.updateProfile, this.userProfile).then(response => {
                            console.log(response)
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                })
            },
            handlePasswordSubmit: function () {
                this.$refs.userSettingForm.validate(valid => {
                    // console.log(valid)
                    if (valid) {
                        this.$store.dispatch("user/modifyPassword", this.userSettingForm).then(response => {
                            // console.log(response)
                            let {data} = response
                            // console.log(data)
                            if (data.code === 200) {
                                this.$message.success(data.msg);
                                //重新登录
                                this.$store.dispatch("user/logout").then(response => {
                                    this.$router.push('/login');
                                });
                            } else {
                                this.$message.error(data.msg)
                            }
                        }).catch(error => {
                            // console.log(error);
                            let {data} = error;
                            this.$message.error(data.msg)
                        });
                    }
                });
            },
            changeAvatar: function () {
                this.avatarDialogVisible = !this.avatarDialogVisible
            },
            handleAvatarSuccess(res, file) {
                // console.log(res)
                // console.log(file)
                this.imageUrl = URL.createObjectURL(file.raw);
                this.userProfile.avatar = '/api/ava' + res.msg.serverPath
                this.$message.success("上传头像成功！")
                this.avatarDialogVisible = !this.avatarDialogVisible
            },
            handleAvatarError: function (err, file, fileList) {
                console.log(err);
                this.$message.error("上传头像失败！")
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            imgPreview(file, fileList) {
                let fileName = file.name;
                // console.log(file)
                let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
                if (regex.test(fileName.toLowerCase())) {
                    this.imageUrl = URL.createObjectURL(file.raw);
                } else {
                    this.$message.error('请选择图片文件');
                }
            },
            handleAvatarConfirm: function () {
                this.$refs.uploadAvatar.submit();
            }
        },
        created() {
            this.getUserInfo();
        }
    }
</script>

<style>
    @import "../../assets/css/external-style.css";
    .user-settings {
        width: 100%;
        /*height: 100%;*/
    }

    .box-card {
        width: 480px;
        margin: 0 auto;
    }

    .profile-card {
        width: 800px;
        margin: 0 auto;
    }

    .el-tab-pane {
        height: 650px;
    }

    .el-image {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        cursor: pointer;
        /*background-color: red;*/
    }

    .el-upload {
        width: 180px;
        height: 180px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
    }

    .default-avatar {
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }

</style>
