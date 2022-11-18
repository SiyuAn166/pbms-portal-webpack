<template>
    <div class="resource-table-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-folder-opened"></i> 资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="resource-search-panel">
            <el-row>
                <el-col :span="6">
                    <el-input v-model="search_word" placeholder="" class="handle-input"
                              @keyup.enter.native="handleSearch"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="14" align="right">
                    <el-button type="primary" icon="el-icon-plus" @click="handleNew" v-has-perm="buttonPerms.save">
                        新建资源
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
                    row-key="resourceId"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <!--<el-table-column
                        type="selection"
                        width="55">
                </el-table-column>-->

                <!--<el-table-column
                        sortable
                        prop="resourceId"
                        label="资源id"
                        fit>
                </el-table-column>-->
                <!--<el-table-column
                        sortable
                        prop="parentId"
                        label="上级菜单id"
                        fit>
                </el-table-column>-->
                <el-table-column
                        sortable
                        resizable
                        prop="resourceName"
                        label="菜单名称"
                        fit>
                </el-table-column>
<!--                <el-table-column-->
<!--                        sortable-->
<!--                        resizable-->
<!--                        prop="url"-->
<!--                        label="资源url"-->
<!--                        fit>-->
<!--                </el-table-column>-->
                <el-table-column
                        sortable
                        resizable
                        prop="perms"
                        label="权限标识"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="icon"
                        label="图标"
                        fit>
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="type"
                        label="类型"
                        fit>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type == 0">目录</el-tag>
                        <el-tag v-if="scope.row.type == 1" type="success">菜单</el-tag>
                        <el-tag v-if="scope.row.type == 2" type="warning">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="orderNum"
                        label="排序"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="createTime"
                        label="创建时间"
                        fit>
                </el-table-column>
                <el-table-column
                        sortable
                        resizable
                        prop="modifyTime"
                        label="修改时间"
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
            <!--<el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[1,10,20,50,100]"
                    :current-page.sync="pageData.currPage"
                    :page-size="pageData.pageSize"
                    :total="pageData.totalPage"
                    layout="sizes,total, prev, pager, next"
                    align="right">
            </el-pagination>-->
            <el-dialog
                    title="编辑"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :show-close="showClose">
                <el-form ref="resourceForm" :model="editResourceForm" :rules="rules" label-width="80px">

                    <!--                    <el-form-item label="资源id" :label-width="formLabelWidth" show-message prop="resourceId">-->
                    <!--                        <el-input v-model="editResourceForm.resourceId" autocomplete="off"></el-input>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="上级菜单id" :label-width="formLabelWidth" show-message prop="parentId">-->
                    <!--                        <el-input v-model="editResourceForm.parentId" autocomplete="off"></el-input>-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="菜单名称" :label-width="formLabelWidth" show-message prop="resourceName">
                        <el-input v-model="editResourceForm.resourceName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="资源url" :label-width="formLabelWidth" show-message prop="url">
                        <el-input v-model="editResourceForm.url" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识" :label-width="formLabelWidth" show-message prop="perms">
                        <el-input v-model="editResourceForm.perms" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" :label-width="formLabelWidth" show-message prop="icon">
                        <el-input v-model="editResourceForm.icon" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" :label-width="formLabelWidth" show-message prop="type">
                        <el-radio v-model="editResourceForm.type" label="0">目录</el-radio>
                        <el-radio v-model="editResourceForm.type" label="1">菜单</el-radio>
                        <el-radio v-model="editResourceForm.type" label="2">按钮</el-radio>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" show-message prop="orderNum">
                        <el-input v-model="editResourceForm.orderNum" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="toggleEditDialog">取 消</el-button>
                    <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
                 </span>
            </el-dialog>

            <el-dialog
                    title="新建资源"
                    :visible.sync="newDialogVisible"
                    width="30%"
                    :show-close="showClose">
                <el-form ref="newResourceForm" :model="newResourceForm" :rules="rules" label-width="80px" size="small">

                    <el-form-item label="上级菜单" :label-width="formLabelWidth" show-message prop="parentId">
                        <!--<el-input v-model="newResourceForm.parentId" autocomplete="off"></el-input>-->
                        <div :class="{'treeClass':treeClass}">
                            <el-scrollbar style="height: 100%">
                                <el-tree
                                        ref="tree"
                                        node-key="id"
                                        :check-strictly="true"
                                        :expand-on-click-node="expandOnClickNode"
                                        :check-on-click-node="checkOnClickNode"
                                        :highlight-current="highlightCurrent"
                                        :data="treeData"
                                        :props="defaultProps"
                                        :default-expanded-keys="defaultExpandKeys"
                                        @check-change="checkChange"
                                        @node-click="nodeClick">
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                    <el-form-item label="菜单名称" :label-width="formLabelWidth" show-message prop="resourceName">
                        <el-input v-model="newResourceForm.resourceName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="资源url" :label-width="formLabelWidth" show-message prop="url">
                        <el-input v-model="newResourceForm.url" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识" :label-width="formLabelWidth" show-message prop="perms">
                        <el-input v-model="newResourceForm.perms" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" :label-width="formLabelWidth" show-message prop="icon">
                        <el-input v-model="newResourceForm.icon" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" :label-width="formLabelWidth" show-message prop="type">
                        <el-radio v-model="newResourceForm.type" label="0">目录</el-radio>
                        <el-radio v-model="newResourceForm.type" label="1">菜单</el-radio>
                        <el-radio v-model="newResourceForm.type" label="2">按钮</el-radio>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" show-message prop="orderNum">
                        <el-input v-model="newResourceForm.orderNum" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('newResourceForm')">清 空</el-button>
                <el-button @click="toggleNewDialog">取 消</el-button>
                <el-button type="primary" @click="handleNewConfirm">确 定</el-button>
             </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import ElTreeNode from "element-ui/packages/tree/src/tree-node";

    export default {
        name: "ResourcePage",
        components: {ElTreeNode},
        data() {
            return {
                buttonPerms: {
                    save: ['system:resource:save'],
                    edit: ['system:resource:edit'],
                    delete: ['system:resource:delete'],
                    batchDelete: ['system:resource:batchDelete'],
                    operateCol: ['system:resource:edit', 'system:resource:delete']
                },
                treeClass: true,
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
                deleteResourceIds: [],
                listParams: {
                    currPage: 1,
                    pageSize: 20,
                    entity: {},
                },
                newResourceForm: {
                    parentId: '',
                    resourceName: '用户管理',
                    url: '/system/user',
                    perms: 'system:user',
                    icon: '',
                    type: '1',
                    orderNum: '',
                },
                editResourceForm: {
                    resourceId: '',
                    parentId: '',
                    resourceName: '',
                    url: '',
                    perms: '',
                    icon: '',
                    type: '',
                    orderNum: '',
                },
                rules: {},
                checkOnClickNode: true,  //树形菜单 点击即选中，不用点击复选框
                highlightCurrent: true,
                expandOnClickNode: false,
                editCheckId: '',
                treeData: [
                    {
                        id: "0",
                        parentId: "#",
                        label: '顶级菜单',
                        permission: "*",
                        children: []
                    }
                ],
                defaultExpandKeys: ["0"],
                defaultProps: {
                    label: "label",
                    children: "children"
                }
            }
        },
        created() {
            this.refreshTableData(this.listParams);
            this.getTreeData()
        },
        methods: {
            getTreeData: function () {
                //this.treeData =
                this.$axios.post(this.$Api.resource.getTree).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.treeData.children = this.treeData.children.concat(result.data.msg);
                            // console.log(result.data)
                            // console.log(this.treeData.children)
                            let [topNode] = this.treeData
                            topNode.children = result.data.msg
                        }
                    }
                ).catch(
                    error => {
                        console.log(error)
                        this.$message.error("获取菜单树数据错误")
                    }
                )
            },
            checkChange: function (item, node, self) {
                // console.log(this.$refs.tree.getCheckedKeys())
                if (node == true) {//点击未选中复选框
                    this.editCheckId = item.id;
                    this.$refs.tree.setCheckedKeys([item.id]);
                } else {
                    if (this.editCheckId == item.id) {//点击已选中复选框，保证至少一个选中
                        this.$refs.tree.setCheckedKeys([item.id]);
                    }
                }
            },
            nodeClick: function (item, node, self) {
                this.editCheckId = item.id;
                this.$refs.tree.setCheckedKeys([item.id]);
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
                this.$axios.post(this.$Api.resource.listAll, listParams).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.tableData = result.data.msg.records
                            // this.pageData.currPage = result.data.msg.current
                            // this.pageData.pageSize = result.data.msg.size
                            // this.pageData.totalPage = result.data.msg.total
                            this.tableData = result.data.msg
                            this.loading = false
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
                let resourceId = row.resourceId
                // console.log(roleId)
                let data = {
                    resourceId: resourceId
                }
                // if (resourceId !== this.editResourceForm.resourceId) {
                this.$axios.post(this.$Api.resource.find, data).then(
                    result => {
                        if (result.data.code === 200) {
                            // this.editUserForm = result.data.msg
                            // console.log(result)
                            for (let f in this.editResourceForm) {
                                this.editResourceForm[f] = result.data.msg[f]
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
                // } else {
                //     this.toggleEditDialog()
                // }
            },
            handleNew: function () {
                this.newDialogVisible = !this.newDialogVisible
            },
            handleEditConfirm: function () {
                this.$refs['resourceForm'].validate(valid => {
                    if (valid) {
                        this.$axios.post(this.$Api.resource.update, this.editResourceForm).then(
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
                this.$refs['newResourceForm'].validate(valid => {
                    if (valid) {
                        this.newResourceForm.parentId = this.$refs.tree.getCheckedKeys()[0];
                        this.$axios.post(this.$Api.resource.save, this.newResourceForm).then(
                            result => {
                                if (result.data.code === 200) {
                                    this.$message.success(result.data.msg)
                                    this.toggleNewDialog()   //关闭对话框
                                    this.refreshTableData(this.listParams) //刷新表格

                                    this.getTreeData() //刷新树形菜单
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
                        this.$axios.post(this.$Api.resource.delete, {"resourceId": row.resourceId}).then(
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
                if (this.deleteResourceIds.length !== 0) {
                    this.$confirm("确定删除吗？").then(
                        y => {
                            this.$axios.post(this.$Api.resource.deleteBatch, {"deleteResourceIds": this.deleteResourceIds}).then(
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
                this.deleteResourceIds = []
                for (let item in selection) {
                    this.deleteResourceIds[item] = selection[item].resourceId
                }
            }
        }
    }
</script>

<style scoped>
    @import '../../../assets/css/external-style.css'; /*去掉横向滚动条*/
    .resource-search-panel {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
        margin-right: 20px;
    }


    .treeClass {
        width: 100%;
        height: 200px;
    }
</style>
