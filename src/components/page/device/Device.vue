<template>
    <div class="device-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user-solid"></i> 设备管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="device-search-panel">
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

<!--                <el-table-column-->
<!--                        sortable-->
<!--                        resizable-->
<!--                        prop="boxId"-->
<!--                        label="box_id"-->
<!--                        fit>-->
<!--                </el-table-column>-->
                <el-table-column
                        sortable
                        resizable
                        prop="boxDeviceId"
                        label="设备序列号"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="boxName"
                        label="别名"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="boxStat"
                        label="状态"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="boxAddr"
                        label="地址"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="boxGroup"
                        label="设备组"
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
                    @closed="resetForm('deviceForm')">
                <el-form ref="deviceForm" :model="editDeviceForm"
                         :rules="rules" label-width="80px">

<!--                    <el-form-item label="box_id" :label-width="formLabelWidth" show-message-->
<!--                                  prop="boxId">-->
<!--                        <el-input v-model="editDeviceForm.boxId"-->
<!--                                  autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="设备序列号" :label-width="formLabelWidth" show-message
                                  prop="boxDeviceId">
                        <el-input v-model="editDeviceForm.boxDeviceId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="别名" :label-width="formLabelWidth" show-message
                                  prop="boxName">
                        <el-input v-model="editDeviceForm.boxName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth" show-message
                                  prop="boxStat">
                        <el-input v-model="editDeviceForm.boxStat"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" :label-width="formLabelWidth" show-message
                                  prop="boxAddr">
                        <el-input v-model="editDeviceForm.boxAddr"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="设备组" :label-width="formLabelWidth" show-message
                                  prop="boxGroup">
                        <el-input v-model="editDeviceForm.boxGroup"
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
                    @closed="resetForm('newDeviceForm')">
                <el-form ref="newDeviceForm" :model="newDeviceForm" :rules="rules"
                         label-width="80px" size="small">

<!--                    <el-form-item label="box_id" :label-width="formLabelWidth" show-message-->
<!--                                  prop="boxId">-->
<!--                        <el-input v-model="newDeviceForm.boxId"-->
<!--                                  autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="设备序列号" :label-width="formLabelWidth" show-message
                                  prop="boxDeviceId">
                        <el-input v-model="newDeviceForm.boxDeviceId"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="别名" :label-width="formLabelWidth" show-message
                                  prop="boxName">
                        <el-input v-model="newDeviceForm.boxName"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth" show-message
                                  prop="boxStat">
                        <el-input v-model="newDeviceForm.boxStat"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" :label-width="formLabelWidth" show-message
                                  prop="boxAddr">
                        <el-input v-model="newDeviceForm.boxAddr"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="设备组" :label-width="formLabelWidth" show-message
                                  prop="boxGroup">
                        <el-input v-model="newDeviceForm.boxGroup"
                                  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newDeviceForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        name: "DevicePage",
        data() {
            return {
                buttonPerms: {
                    save: ['devicemgr:device:save'],
                    edit: ['devicemgr:device:edit'],
                    delete: ['devicemgr:device:delete'],
                    batchDelete: ['devicemgr:device:batchDelete'],
                    operateCol: ['devicemgr:device:edit', 'devicemgr:device:delete']
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
                deleteDeviceIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newDeviceForm: {
                    boxId:
                        '',
                    boxDeviceId:
                        '',
                    boxName:
                        '',
                    boxStat:
                        '',
                    boxAddr:
                        '',
                    boxGroup:
                        ''
                },
                editDeviceForm: {
                    boxId:
                        '',
                    boxDeviceId:
                        '',
                    boxName:
                        '',
                    boxStat:
                        '',
                    boxAddr:
                        '',
                    boxGroup:
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
                this.$axios.post(this.$Api.device.list, listParams).then(
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
                let boxId = row.boxId
                // console.log(roleId)
                let data = {
                    boxId: boxId
                }
                this.$axios.post(this.$Api.device.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            for (let f in this.editDeviceForm) {
                                this.editDeviceForm[f] = result.data.msg[f]
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
                this.$refs['deviceForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.device.update, this.editDeviceForm).then(
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
                this.$refs['newDeviceForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.device.save, this.newDeviceForm).then(
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
                        this.$axios.post(this.$Api.device.delete, {"boxId": row.boxId}).then(
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
                if (this.deleteDeviceIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.device.deleteBatch, {"deleteDeviceIds": this.deleteDeviceIds}).then(
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
                this.deleteDeviceIds = []
                for (let item in selection) {
                    this.deleteDeviceIds[item] = selection[item].boxId
                }
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .device-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }
</style>

