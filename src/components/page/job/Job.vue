<template>
    <div class="job-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 定时任务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="job-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="" class="handle-input"
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
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <!--<el-table-column
                        sortable
                        resizable
                        prop="jobId"
                        label="job_id"
                        fit>
                </el-table-column>-->
                <el-table-column
                        sortable
                        resizable
                        prop="beanName"
                        label="@Component"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="methodName"
                        label="方法名"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="params"
                        label="参数"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="cronExpression"
                        label="CRON表达式"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="status"
                        label="状态"
                        fit>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status ==='0'" type="success">执行中</el-tag>
                        <el-tag v-if="scope.row.status ==='1'" type="warning">暂停</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="remark"
                        label="备注"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="createTime"
                        label="创建时间"
                        fit>
                </el-table-column>
                <el-table-column label="任务恢复/暂停" resizable="">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === '1'"
                                size="mini"
                                type="success"
                                @click="handleResume(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">恢复执行
                        </el-button>
                        <el-button v-if="scope.row.status === '0'"
                                size="mini"
                                type="warning"
                                @click="handlePause(scope.$index, scope.row)" v-has-perm="buttonPerms.edit">暂停
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="操作" resizable v-if="this.$_has(buttonPerms.operateCol)">
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
                    @closed="resetForm('jobForm')">
                <el-form ref="jobForm" :model="editJobForm"
                         :rules="rules" label-width="80px">

                    <el-form-item label="@Component" :label-width="formLabelWidth" show-message
                                  prop="beanName">
                        <el-input v-model="editJobForm.beanName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="方法名" :label-width="formLabelWidth" show-message
                                  prop="methodName">
                        <el-input v-model="editJobForm.methodName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="参数" :label-width="formLabelWidth" show-message
                                  prop="params">
                        <el-input v-model="editJobForm.params"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="cron表达式" :label-width="formLabelWidth" show-message
                                  prop="cronExpression">
                        <el-input v-model="editJobForm.cronExpression"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth" show-message
                                  prop="status">
                        <el-input v-model="editJobForm.status"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" show-message
                                  prop="remark">
                        <el-input v-model="editJobForm.remark"
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
                    @closed="resetForm('newJobForm')">
                <el-form ref="newJobForm" :model="newJobForm" :rules="rules"
                         label-width="80px" size="small">

                    <el-form-item label="@Component" :label-width="formLabelWidth" show-message
                                  prop="beanName">
                        <el-input v-model="newJobForm.beanName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="方法名" :label-width="formLabelWidth" show-message
                                  prop="methodName">
                        <el-input v-model="newJobForm.methodName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="参数" :label-width="formLabelWidth" show-message
                                  prop="params">
                        <el-input v-model="newJobForm.params"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="cron表达式" :label-width="formLabelWidth" show-message
                                  prop="cronExpression">
                        <el-input v-model="newJobForm.cronExpression"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" show-message
                                  prop="remark">
                        <el-input v-model="newJobForm.remark"
                                  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newJobForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Job",
        data() {
            return {
                buttonPerms: {
                    save: ['system:job:save'],
                    edit: ['system:job:edit'],
                    delete: ['system:job:delete'],
                    batchDelete: ['system:job:batchDelete'],
                    operateCol: ['system:job:edit', 'system:job:delete']
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
                selectedJobIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newJobForm: {
                    jobId:
                        '',
                    beanName:
                        '',
                    methodName:
                        '',
                    params:
                        '',
                    cronExpression:
                        '',
                    status:
                        '',
                    remark:
                        '',
                    createTime:
                        ''
                },
                editJobForm: {
                    jobId:
                        '',
                    beanName:
                        '',
                    methodName:
                        '',
                    params:
                        '',
                    cronExpression:
                        '',
                    status:
                        '',
                    remark:
                        '',
                    createTime:
                        ''
                }
                ,
                rules: {}
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
                this.$axios.post(this.$Api.job.listAll, listParams).then(
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
                let jobId = row.jobId
                // console.log(roleId)
                let data = {
                    jobId: jobId
                }
                this.$axios.post(this.$Api.job.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            for (let f in this.editJobForm) {
                                this.editJobForm[f] = result.data.msg[f]
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
                this.$refs['jobForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.job.update, this.editJobForm).then(
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
                this.$refs['newJobForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.job.save, this.newJobForm).then(
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
                        this.$axios.post(this.$Api.job.delete, {"jobId": row.jobId}).then(
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
                if (this.selectedJobIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.job.deleteBatch, {"selectedJobIds": this.selectedJobIds}).then(
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

            },
            handleSelectionChange: function (selection) {
                this.selectedJobIds = []
                for (let item in selection) {
                    this.selectedJobIds[item] = selection[item].jobId
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            },
            handleResume: function (index, row) {
                this.$confirm("确定恢复任务吗？").then(y => {
                    let data = {jobIds: [row.jobId]}
                    // console.log(data)
                    this.$axios.post(this.$Api.job.resume, data).then(res => {
                        this.refreshTableData(this.listParams)
                        this.$message.success(res.data.msg)
                    }).catch(err => {
                        this.$message.error("恢复失败")
                    });
                });
            },
            handlePause: function (index, row) {
                this.$confirm("确定暂停任务吗？").then(y => {
                    let data = {
                        jobIds: [row.jobId],
                    }
                    // console.log(data)
                    this.$axios.post(this.$Api.job.pause, data).then(res => {
                        this.refreshTableData(this.listParams)
                        this.$message.success(res.data.msg)
                    }).catch(err => {
                        this.$message.error("暂停失败")
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .job-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }
</style>
