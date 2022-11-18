<template>
    <div class="user-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user-solid"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="用户名" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-button type="primary" icon="el-icon-plus" @click="handleNew" v-has-perm="buttonPerms.save">
                        新建用户
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="batchDelete"
                               v-has-perm="buttonPerms.batchDelete">批量删除
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table-data">
            <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="username"
                        label="用户名"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="fullname"
                        label="姓名"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="roleName"
                        label="角色"
                        fit>
                    <template slot-scope="scope">
<!--                        <el-tag>{{scope.row.roleName}}</el-tag>-->
                        <el-tag v-for="(it,index) in scope.row.roleName.split(',')" :key="index">{{it}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="lastLoginTime"
                        label="最近登录时间"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="createTime"
                        label="创建日期"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="modifyTime"
                        label="修改日期"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="status"
                        label="账号状态"
                        fit>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === '1'" type="success">启用</el-tag>
                        <el-tag v-if="scope.row.status !== '1'" type="danger">停用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  resizable v-if="this.$_has(buttonPerms.operateCol)">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)" v-has-perm="buttonPerms.delete">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[1,10,20,50,100]"
                    :current-page.sync="pageData.currPage"
                    :page-size="pageData.pageSize"
                    :total="pageData.totalPage"
                    layout="sizes,total, prev, pager, next"
                    align="right">
            </el-pagination>
            <el-dialog
                    title="编辑用户"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('userForm')">
                <el-form ref="userForm" :model="editUserForm" label-width="80px" :rules="rules">

                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <span>{{editUserForm.username}}</span>
                    </el-form-item>

                    <el-form-item label="姓名" :label-width="formLabelWidth" show-message prop="fullname">
                        <el-input v-model="editUserForm.fullname" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="角色" :label-width="formLabelWidth" show-message :required="true">
                        <el-checkbox-group v-model="editUserForm.roleIds" :min="1"
                                           @change="checkChange">
                            <el-checkbox :key="index" :label="role.roleId" v-for="(role,index) in rolesData">
                                {{role.roleName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth">
                        <el-switch
                                v-model="editUserForm.status"
                                active-text="启用"
                                inactive-text="停用"
                                :active-value="1"
                                :inactive-value="0">
                        </el-switch>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="toggleEditDialog">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
             </span>
            </el-dialog>

            <el-dialog
                    title="新建用户"
                    :visible.sync="newDialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('newUserForm')">
                <el-form ref="newUserForm" :model="newUserForm" :rules="rules" label-width="80px" size="small">

                    <el-form-item label="用户名" :label-width="formLabelWidth" show-message prop="username">
                        <el-input v-model="newUserForm.username" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" :label-width="formLabelWidth" show-message prop="password">
                        <el-input v-model="newUserForm.password" autocomplete="off" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="姓名" :label-width="formLabelWidth" show-message prop="fullname">
                        <el-input v-model="newUserForm.fullname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" :label-width="formLabelWidth" show-message>
                        <el-checkbox-group v-model="newUserForm.roleIds" prop="roleIds" :min="1">
                            <el-checkbox v-for="(role,index) in rolesData" :key="index" :label="role.roleId"
                                         :checked="role.defaultChecked === 1"
                                         name="roleIds">
                                {{role.roleName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth">
                        <el-switch
                                v-model="newUserForm.status"
                                active-text="启用"
                                inactive-text="停用"
                                :active-value="1"
                                :inactive-value="0">

                        </el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newUserForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserPage",
        data() {
            return {
                buttonPerms: {
                    save: ['system:user:save'],
                    edit: ['system:user:edit'],
                    delete: ['system:user:delete'],
                    batchDelete: ['system:user:batchDelete'],
                    operateCol: ['system:user:edit', 'system:user:delete']
                },
                loading: false, //加载中效果
                tableData: [],  //表格数据
                rolesData: [],
                pageData: {     //分页数据
                    currPage: 1,
                    pageSize: 20,
                    totalPage: 0
                },
                dialogVisible: false, //信息查看对话框
                newDialogVisible: false, //新建对话框
                showClose: false,  //对话框右上角x图标
                userDataBuffer: {   //用户数据缓存
                },
                editUserForm: {  //用户信息查看
                    userId: '',
                    username: '',
                    fullname: '',
                    roleIds: [],
                    status: '',
                },
                newUserForm: {   //新增用户
                    username: '',
                    password: '',
                    fullname: '',
                    roleIds: [],
                    status: 1,
                },
                listParams: {  //列表参数
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                deleteUserIds: [],  //批量删除id
                formLabelWidth: '120px',
                search_word: '',
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
                    ],
                    fullname: [
                        {required: true, message: '请输入姓名'},
                        {min: 2, max: 20, message: '长度在2-20个字符'},
                        {pattern: '^[\u4e00-\u9fa5]{0,20}$', message: '请输入汉字！'}
                    ],
                    roleIds: [
                        {min: 1, message: '请至少选一个角色'}
                    ]
                }
            }
        },
        created() {
            this.refreshTableData(this.listParams)
            this.getRoleData()
        },
        methods: {
            checkChange: function () {
                // console.log(this.editUserForm.roleIds)
            },
            getRoleData: function () {
                this.$axios.post(this.$Api.role.listAll).then(
                    result => {
                        if (result.data.code === 200) {
                            this.rolesData = result.data.msg
                            // console.log(roleData)
                        }
                    }
                ).catch(
                    error => {
                        this.$message.error("获取角色数据错误")
                    }
                )
            },
            refreshTableData: function (listParams) {
                this.loading = true;
                this.$axios.post(this.$Api.user.listAll, listParams).then(
                    result => {
                        if (result.data.code === 200) {
                            this.tableData = result.data.msg.records
                            this.pageData.currPage = result.data.msg.current
                            this.pageData.pageSize = result.data.msg.size
                            this.pageData.totalPage = result.data.msg.total
                        }
                        this.loading = false;
                        // console.log(result.data)

                    }
                ).catch(
                    error => {
                        this.$message.error("获取用户数据错误")
                    }
                )
            },
            handleEdit: function (index, row) {
                // console.log(row.userId)
                let userId = row.userId
                let data = {
                    userId: userId
                }
                //清空edit数据
                // if (userId !== this.userDataBuffer.userId) {
                //异步请求
                this.$axios.post(this.$Api.user.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)

                            this.userDataBuffer = result.data.msg

                            //不可以直接this.editUserForm=this.userDataBuffer，会出现绑定效果，修改edit，buffer也会被修改
                            for (let f in this.userDataBuffer) {
                                this.editUserForm[f] = this.userDataBuffer[f] //把缓存中的数据显示，保证数据正确显示
                            }
                            this.toggleEditDialog()

                        } else {
                            this.$message.error(result.data.msg)
                        }
                        // console.log(this.editUserForm)
                    }
                ).catch(
                    error => {
                        console.log(error)
                        this.$message.error("获取用户数据错误")
                    }
                );
                // } else {
                //     for (let f in this.userDataBuffer) {
                //         this.editUserForm[f] = this.userDataBuffer[f] //把缓存中的数据显示，保证数据正确显示
                //     }
                //     this.toggleEditDialog()
                // }

            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleDelete: function (index, row) {
                // console.log(row.userId)
                this.$confirm("确定删除吗？").then(
                    y => {
                        this.$axios.post(this.$Api.user.delete, {"userId": row.userId}).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，删除失败！')
                            }
                        );
                    })
            },
            handleEditConfirm: function () {
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.user.update, this.editUserForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleEditDialog()   //关闭对话框
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，保存失败！')
                            }
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleNewConfirm: function () {
                this.$refs['newUserForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.user.save, this.newUserForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleNewDialog()   //关闭对话框
                                    this.refreshTableData(this.listParams) //刷新表格
                                } else {
                                    this.$message.error(result.data.msg)
                                }
                            }
                        ).catch(
                            error => {
                                this.$message.error('出现未知错误，新建失败！')
                            }
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleCurrentChange: function (curr) {
                this.listParams.currPage = curr
                this.refreshTableData(this.listParams)
            },
            handleSizeChange: function (size) {
                this.listParams.pageSize = size
                this.refreshTableData(this.listParams)
            },
            handleSearch: function () {
                this.listParams.entity.username = this.search_word.trim()
                // console.log(this.listParams)
                this.refreshTableData(this.listParams)
            },
            toggleNewDialog: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            toggleEditDialog: function () {
                this.dialogVisible = !this.dialogVisible
            },
            batchDelete: function () {
                if (this.deleteUserIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.user.deleteBatch, {"deleteUserIds": this.deleteUserIds}).then(
                                result => {
                                    if (result.data.code === 200) {
                                        this.$message.success(result.data.msg)
                                        this.refreshTableData(this.listParams) //刷新表格
                                    } else {
                                        this.$message.error(result.data.msg)
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$message.error('出现未知错误，删除失败！')
                                }
                            );
                        }
                    ).catch(
                        /*n => {
                            console.log(n+"取消操作")
                        }*/
                    )
                } else {
                    this.$message.error('请选择要删除的行！')
                }
            },
            handleSelectionChange: function (selection) {
                this.deleteUserIds = []
                for (let item in selection) {
                    this.deleteUserIds[item] = selection[item].userId
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .user-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }
    .el-tag{
        margin-right: 5px
    }
</style>
