<template>
    <div class="role-table-container">

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="role-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="角色名" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-button type="primary" icon="el-icon-plus" @click="handleNew" v-has-perm="buttonPerms.save">
                        新建角色
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
                        prop="roleName"
                        label="角色名"
                        fit>
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
                    ref="editDialog"
                    title="编辑角色"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('roleForm')">
                <el-form ref="roleForm" :model="editRoleForm" :rules="rules" label-width="80px">

                    <el-form-item label="角色名" :label-width="formLabelWidth">
                        <span>{{editRoleForm.roleName}}</span>
                    </el-form-item>

                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="editRoleForm.remark" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" :label-width="formLabelWidth">
                        <div style="height: 400px">
                            <el-scrollbar style="height: 100%">
                                <el-tree
                                        ref="editTree"
                                        node-key="id"
                                        show-checkbox
                                        :data="treeData"
                                        :props="defaultProps"
                                        @check-change="checkChange">
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                    <el-form-item label="默认" :label-width="formLabelWidth">
                        <el-row>
                            <el-col :span="6">
                                <el-switch
                                        v-model="editRoleForm.defaultChecked"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0">
                                </el-switch>
                            </el-col>
                            <el-col :span="12">
                                <el-tag type="warning">新用户将默认拥有此角色.</el-tag>
                            </el-col>
                        </el-row>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="toggleEditDialog">取 消</el-button>
                    <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                    title="新建角色"
                    :visible.sync="newDialogVisible"
                    width="30%"
                    :show-close="showClose"
                    @closed="resetForm('newRoleForm')">
                <el-form ref="newRoleForm" :model="newRoleForm" :rules="rules" label-width="80px" size="small">

                    <el-form-item label="角色名" :label-width="formLabelWidth" show-message prop="roleName">
                        <el-input v-model="newRoleForm.roleName" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="备注" :label-width="formLabelWidth" show-message prop="remark">
                        <el-input v-model="newRoleForm.remark" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" :label-width="formLabelWidth">
                        <div style="height: 400px">
                            <el-scrollbar style="height: 100%">
                                <el-tree
                                        ref="newTree"
                                        node-key="id"
                                        show-checkbox
                                        :data="treeData"
                                        :props="defaultProps">
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                    <el-form-item label="默认" :label-width="formLabelWidth">
                        <el-row>
                            <el-col :span="6">
                                <el-switch
                                        v-model="newRoleForm.defaultChecked"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0">
                                </el-switch>
                            </el-col>
                            <el-col :span="12">
                                <el-tag type="warning">新用户将默认拥有此角色.</el-tag>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newRoleForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>

    export default {
        name: "RolePage",
        data() {
            return {
                buttonPerms: {
                    save: ['system:role:save'],
                    edit: ['system:role:edit'],
                    delete: ['system:role:delete'],
                    batchDelete: ['system:role:batchDelete'],
                    operateCol: ['system:role:edit', 'system:role:delete']
                },
                loading: false,
                check_strictly: true,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
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
                deleteRoleIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newRoleForm: {
                    roleName: '',
                    remark: '',
                    defaultChecked: 0,
                    resourceIds: []
                },
                editRoleForm: {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    defaultChecked: '',
                    resourceIds: []
                },
                roleFormBuffer: {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    resourceIds: []
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名'},
                        {min: 2, max: 20, message: '长度在2-20个字符'},
                        {pattern: '^[\u4e00-\u9fa5]{0,20}$', message: '请输入汉字！'}
                    ]
                }
            }
        },
        created() {
            this.refreshTableData(this.listParams);
            this.getTreeData();
        },
        updated() {
            this.renderDialog();//el-dialog懒渲染，在对话框未打开时，获取不到editTree，所以手动修改rendered=true渲染
        },
        methods: {
            renderDialog: function () {
                this.$refs.editDialog.rendered = true;
            },
            getTreeData: function () {
                this.$axios.post(this.$Api.resource.getTree).then(
                    result => {
                        if (result.data.code === 200) {
                            this.treeData = result.data.msg
                            // console.log(result.data)
                        }
                    }
                ).catch(
                    error => {
                        this.$message.error("获取菜单树数据错误")
                    }
                )
            },
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
                this.loading = true
                this.$axios.post(this.$Api.role.list, listParams).then(
                    result => {
                        if (result.data.code === 200) {
                            this.tableData = result.data.msg.records
                            this.pageData.currPage = result.data.msg.current
                            this.pageData.pageSize = result.data.msg.size
                            this.pageData.totalPage = result.data.msg.total
                            this.loading = false
                        }
                        // console.log(result.data)
                    }
                ).catch(
                    error => {
                        this.$message.error("获取角色数据错误")
                    }
                )
            },
            handleEdit: function (index, row) {
                let roleId = row.roleId
                // console.log(roleId)
                let data = {
                    roleId: roleId
                }

                // if (roleId !== this.roleFormBuffer.roleId) {
                this.$axios.post(this.$Api.role.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            this.roleFormBuffer = result.data.msg

                            for (let f in this.editRoleForm) {
                                this.editRoleForm[f] = this.roleFormBuffer[f]
                            }
                            //渲染树形菜单，前提是dialog对话框的内容被渲染才可以
                            let ids = this.editRoleForm.resourceIds === null ? [] : this.editRoleForm.resourceIds
                            // console.log(ids)
                            this.$refs.editTree.setCheckedKeys(ids);
                            this.toggleEditDialog()
                        } else {
                            this.$message.error(result.data.msg)
                        }
                    }
                ).catch(
                    error => {
                        console.log(error)
                        this.$message.error("获取角色数据错误")
                    }
                );
                // } else {
                //     for (let f in this.editRoleForm) {
                //         this.editRoleForm[f] = this.roleFormBuffer[f]
                //     }
                //     this.toggleEditDialog()
                // }
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['roleForm'].validate(valid => {
                    if (valid) {
                        let checkedKeys = this.$refs.editTree.getCheckedKeys();
                        // let halfCheckedKeys = this.$refs.editTree.getHalfCheckedKeys();
                        this.editRoleForm.resourceIds = checkedKeys
                        this.$axios.post(this.$Api.role.update, this.editRoleForm).then(
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
                this.$refs['newRoleForm'].validate(valid => {
                    if (valid) {
                        let checkedKeys = this.$refs.newTree.getCheckedKeys();
                        // let halfCheckedKeys = this.$refs.newTree.getHalfCheckedKeys();
                        this.newRoleForm.resourceIds = checkedKeys
                        this.$axios.post(this.$Api.role.save, this.newRoleForm).then(
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
                        this.$axios.post(this.$Api.role.delete, {"roleId": row.roleId}).then(
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
                if (this.deleteRoleIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.role.deleteBatch, {"deleteRoleIds": this.deleteRoleIds}).then(
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
                this.deleteRoleIds = []
                for (let item in selection) {
                    this.deleteRoleIds[item] = selection[item].roleId
                }
            },
            resetForm: function (formName) {
                // console.log(formName)
                this.$refs[formName].resetFields();
            },
            checkChange: function (thisNode, v2, v3) {
                // console.log(thisNode.children.length)

            }
        }
    }
</script>

<style>
    @import '../../../assets/css/external-style.css'; /*去掉横向滚动条*/
    .role-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }
</style>
