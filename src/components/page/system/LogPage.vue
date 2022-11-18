<template>
    <div class="log-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document-copy"></i> 日志管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="log-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="用户名" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-button type="primary" icon="el-icon-plus" @click="handleNew" v-has-perm="buttonPerms.save">新建
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
                <!--<el-table-column
                        type="selection"
                        width="55">
                </el-table-column>-->

                <!--<el-table-column
                        sortable
                        resizable
                        prop="logId"
                        label="log_id"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="userId"
                        label="用户id"
                        fit>
                </el-table-column>-->
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
                        prop="operation"
                        label="用户操作"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="time"
                        label="响应时间(ms)"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="method"
                        show-overflow-tooltip
                        label="请求方法"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="params"
                        label="请求参数"
                        show-overflow-tooltip
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="ip"
                        label="ip地址"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="createTime"
                        label="创建时间"
                        fit>
                </el-table-column>

                <el-table-column label="操作" resizable v-if="this.$_has(buttonPerms.operateCol)">
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
                    title="编辑"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('logForm')">
                <el-form ref="logForm" :model="editLogForm"
                         :rules="rules" label-width="80px">

                    <el-form-item label="log_id" :label-width="formLabelWidth" show-message
                                  prop="logId">
                        <el-input v-model="editLogForm.logId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户id" :label-width="formLabelWidth" show-message
                                  prop="userId">
                        <el-input v-model="editLogForm.userId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth" show-message
                                  prop="username">
                        <el-input v-model="editLogForm.username"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户操作" :label-width="formLabelWidth" show-message
                                  prop="operation">
                        <el-input v-model="editLogForm.operation"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="响应时间" :label-width="formLabelWidth" show-message
                                  prop="time">
                        <el-input v-model="editLogForm.time"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请求方法" :label-width="formLabelWidth" show-message
                                  prop="method">
                        <el-input v-model="editLogForm.method"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请求参数" :label-width="formLabelWidth" show-message
                                  prop="params">
                        <el-input v-model="editLogForm.params"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="ip地址" :label-width="formLabelWidth" show-message
                                  prop="ip">
                        <el-input v-model="editLogForm.ip"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" :label-width="formLabelWidth" show-message
                                  prop="createTime">
                        <el-input v-model="editLogForm.createTime"
                                  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="toggleEditDialog">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
             </span>
            </el-dialog>

            <el-dialog
                    title="新建"
                    :visible.sync="newDialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('newLogForm')">
                <el-form ref="newLogForm" :model="newLogForm" :rules="rules"
                         label-width="80px" size="small">

                    <el-form-item label="log_id" :label-width="formLabelWidth" show-message
                                  prop="logId">
                        <el-input v-model="newLogForm.logId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户id" :label-width="formLabelWidth" show-message
                                  prop="userId">
                        <el-input v-model="newLogForm.userId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth" show-message
                                  prop="username">
                        <el-input v-model="newLogForm.username"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户操作" :label-width="formLabelWidth" show-message
                                  prop="operation">
                        <el-input v-model="newLogForm.operation"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="响应时间" :label-width="formLabelWidth" show-message
                                  prop="time">
                        <el-input v-model="newLogForm.time"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请求方法" :label-width="formLabelWidth" show-message
                                  prop="method">
                        <el-input v-model="newLogForm.method"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请求参数" :label-width="formLabelWidth" show-message
                                  prop="params">
                        <el-input v-model="newLogForm.params"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="ip地址" :label-width="formLabelWidth" show-message
                                  prop="ip">
                        <el-input v-model="newLogForm.ip"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" :label-width="formLabelWidth" show-message
                                  prop="createTime">
                        <el-input v-model="newLogForm.createTime"
                                  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newLogForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        name: "LogPage",
        data() {
            return {
                buttonPerms: {
                    save: ['system:log:save'],
                    edit: ['system:log:edit'],
                    delete: ['system:log:delete'],
                    batchDelete: ['system:log:batchDelete'],
                    operateCol: ['system:log:edit', 'system:log:delete']
                },
                loading: false,
                tableData: [],  //表格数据
                pageData: {     //分页数据
                    currPage: 1,
                    pageSize: 20,
                    totalPage: 0
                },
                search_word: '',
                dialogVisible: false, //信息查看对话框
                newDialogVisible: false, //新建对话框
                showClose: false,  //对话框右上角x图标
                formLabelWidth: '120px',
                deleteLogIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newLogForm: {
                    logId:
                        '',
                    userId:
                        '',
                    username:
                        '',
                    operation:
                        '',
                    time:
                        '',
                    method:
                        '',
                    params:
                        '',
                    ip:
                        '',
                    createTime:
                        ''
                },
                editLogForm: {
                    logId:
                        '',
                    userId:
                        '',
                    username:
                        '',
                    operation:
                        '',
                    time:
                        '',
                    method:
                        '',
                    params:
                        '',
                    ip:
                        '',
                    createTime:
                        ''
                }
                ,
                rules: {

                }
            }
        },
        created() {
            this.refreshTableData(this.listParams);
        },
        methods: {
            handleCurrentChange: function (curr) {
                this.listParams.currPage = curr
                this.refreshTableData(this.listParams)
            },
            handleSizeChange: function (size) {
                this.listParams.pageSize = size
                this.refreshTableData(this.listParams)
            },
            toggleNewDialog: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            toggleEditDialog: function () {
                this.dialogVisible = !this.dialogVisible
            },
            refreshTableData: function (listParams) {
                this.loading = true;
                this.$axios.post(this.$Api.log.list, listParams).then(
                    result => {
                        if (result.data.code === 200) {
                            this.tableData = result.data.msg.records
                            this.pageData.currPage = result.data.msg.current
                            this.pageData.pageSize = result.data.msg.size
                            this.pageData.totalPage = result.data.msg.total

                            this.loading = false;
                        }
                        // console.log(result.data)
                    }
                ).catch(
                    error => {
                        this.$message.error("获取数据错误")
                    }
                )
            },
            handleEdit: function (index, row) {
                let logId = row.logId
                // console.log(roleId)
                let data = {
                    logId: logId
                }
                this.$axios.post(this.$Api.log.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            for (let f in this.editLogForm) {
                                this.editLogForm[f] = result.data.msg[f]
                            }
                            this.toggleEditDialog()
                        } else {
                            this.$message.error(result.data.msg)
                        }
                    }
                ).catch(
                    error => {
                        this.$message.error("获取数据错误")
                    }
                );
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['logForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.log.update, this.editLogForm).then(
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
                this.$refs['newLogForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.log.save, this.newLogForm).then(
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
                                this.$message.error('出现未知错误，保存失败！')
                            }
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleDelete: function (index, row) {
                this.$confirm("确定删除吗？").then(
                    y => {
                        this.$axios.post(this.$Api.log.delete, {"logId": row.logId}).then(
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
            batchDelete: function () {
                if (this.deleteLogIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.log.deleteBatch, {"deleteLogIds": this.deleteLogIds}).then(
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
            handleSearch: function () {
                this.listParams.entity.username = this.search_word.trim()
                this.refreshTableData(this.listParams)
            },
            handleSelectionChange: function (selection) {
                this.deleteLogIds = []
                for (let item in selection) {
                    this.deleteLogIds[item] = selection[item].logId
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .log-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }
</style>
