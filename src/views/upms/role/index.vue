<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.name" @clear="handleFilter" @keyup.enter.native="handleFilter"
                placeholder="角色名 ↵ " clearable suffix-icon="el-icon-search" style="width: 200px;" ></el-input>
      <el-button @click="handleAdd" type="primary" icon="el-icon-plus" >添加</el-button>
      <el-button @click="handleBatchDelete" type="danger" icon="el-icon-delete" >批量删除</el-button>
    </div>

    <el-table :data="listData" :default-sort="{prop: 'name', order: 'ascending'}" v-loading="listLoading" ref="multipleTable"
              style="width: 100%" height="550" border fit stripe highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id"><span>{{ row.id }}</span></el-form-item>
            <el-form-item label="角色名"><span>{{ row.name }}</span></el-form-item>
            <el-form-item label="标题"><span>{{ row.title }}</span></el-form-item>
            <el-form-item label="描述"><span>{{ row.description }}</span></el-form-item>
            <el-form-item label="状态"><span>{{ row.status }}</span></el-form-item>
            <el-form-item label="排序"><span>{{ row.weight }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed type="index" label="序号" width="55"></el-table-column>
      <el-table-column fixed sortable prop="name" label="角色名" width="120"></el-table-column>
      <el-table-column prop="title" label="标题" width="120"></el-table-column>
      <el-table-column prop="description" label="描述" width="120"></el-table-column>
      <el-table-column prop="weight" label="排序" width="120"></el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.row)" :active-value="1" :inactive-value="0"
                     active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.$index,scope.row)" type="primary" icon="el-icon-edit" circle ></el-button>
          <el-button @click="handleDelete(scope.$index,scope.row)" type="danger" icon="el-icon-delete" circle ></el-button>
          <el-button @click="handleUpdatePermission(scope.$index,scope.row)" type="primary" icon="el-icon-circle-plus-outline" >角色权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :page-sizes="[10, 20, 30, 40]" :current-page="listQuery.current" :page-size="listQuery.size" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>

    <el-dialog :title="dialogMap[dialogStatus].title" :visible.sync="dialogVisible">
      <el-form :model="tempRole" :rules="dialogMap[dialogStatus].rules" ref="ruleForm" label-width="100px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="tempRole.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="tempRole.title" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="描述" prop="description">
              <el-input v-model="tempRole.description" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model.number="tempRole.status">
                <el-radio :label="1">启用</el-radio><el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="tempRole.weight" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="dialogMap[dialogStatus].showResetButton">
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?saveForm():updateForm()">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色权限" :visible.sync="permissionTreeVisible">
      <el-tree
        :data="permissions"
        @current-change="handleTreeCurrentChange"
        :props="permissionTreeProps"
        node-key="id"
        ref="permissionTree"
        :check-strictly="true"
        :expand-on-click-node="false"
        :indent="22"
        default-expand-all
        show-checkbox>
      </el-tree>


      <!--:load="loadNode"-->
      <!--lazy-->
      <!--default-expand-all-->
      <!--@check-change="handleCheckChange"-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionTreeVisible = false">取 消</el-button>
        <el-button @click="updatePermission" type="primary" >更新</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  // TODO 数组转树方法,后期后移到工具类
  function array2tree2(source, id='id', parentId='parentId', children='children') {
    const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
    return cloneData.filter(father => { // 循环所有项，并添加children属性
      const branchArr = cloneData.filter(child => father[id] === child[parentId]) // 返回每一项的子级数组

      if (branchArr.length > 0) {
        father[children] = branchArr // 如果有子数组，就给父级添加一个children属性，并赋值
      }
      // if (menuMapComponent[father.componentName]) {
      //   father.component = menuMapComponent[father.componentName]
      // }
      return father[parentId] === '0' // 如果第一层不是parentId=0，请自行修改
    })
  }
  // 方式二速度快,可以处理百万级别数据
  function array2tree(source, id='id', parentId='parentId', children='children') {
    const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
    let map = {}, i, node, roots = [];
    for (i = 0; i < cloneData.length; i += 1) {
      map[cloneData[i][id]] = i; // 初始化 map, 使得能通过map[node.parentId]来定位cloneData中的元素
      cloneData[i][children] = []; // 初始化 cloneData, 为cloneData中元素添加 children属性
    }
    for (i = 0; i < cloneData.length; i += 1) {
      node = cloneData[i];
      if (node[parentId] !== '0') {
        // 父id不为零, 拿出父节点的的索引map[node.parentId], 再给父节点添加children
        try {
          // 要确保parentId对应的节点必须存在
          cloneData[map[node[parentId]]][children].push(node);
        }catch (e) {
          console.log('parentId对应的父节点不存在')
          continue
        }
      } else {
        roots.push(node); // 父id为0 ,直接放入数组
      }
    }
    return roots;
  }

  import {
    page,
    save,
    removeById,
    removeByIds,
    update,
    patch,
    getByName,
    listRoles,
    listPermissionsByRoleId,
    saveRolePermissionsByRoleId
  } from '@/api/upms/auth/role'

  import {listPermissions,listPermissionsByParentId} from '@/api/upms/auth/permission'

  export default {
    name: "Role",

    props: {},
    data() {
      return {


        //角色列表
        listData: [],
        //数据库list总共条数
        total: 0,
        // 多条件 分页 排序 查询
        listQuery: {
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          name: undefined,
        },

        // tree的配置属性
        permissionTreeProps: {
          label: 'name',
          children: 'children'
        },
        // tree是否显示
        permissionTreeVisible: false,

        //系统中存在的权限，全加载
        permissions: [],

        // 新增或修改角色时弹出框要显示的角色
        tempRole: {
          id:undefined,
          name: undefined,
          title: undefined,
          description: undefined,
          weight: undefined,
          status: 1,
          permissions: [] //只包含id
        },
        backupsTempRole: undefined,
        //表格的加载图标状态
        listLoading: false,

        //弹窗框的状态,是新增还是修改
        dialogStatus: 'create',
        //是否显示新增或编辑页
        dialogVisible: false,
        // 新增和编辑共用一个弹窗但数据不同
        dialogMap: {
          create: {
            title: '添加角色',
            showResetButton: true,
            rules: {
              name: [
                {required: true, message: '角色名必填', trigger: 'blur'},
                {type: 'string', min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                // {
                //   validator: (rule, value, callback) => { //异步重名校验
                //     getByName(value).then((response) => {
                //       if (Object.keys(response).length != 0) {
                //         callback(new Error("角色名已存在"))
                //       } else {
                //         callback()
                //       }
                //     }).catch(reason => {
                //       console.log(reason)
                //     })
                //   },
                //   trigger: 'blur'
                // },
                // {
                //   // TODO 批量所有字段，而不是单这个字段
                //   transform: (value) => {
                //     return value.trim();
                //   },
                //   trigger: 'blur'
                // }
              ],
              title: [
                {required: true, message: '标题必填', trigger: 'blur'},
                {type: 'string', min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
              ],
              description: [],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              weight: [],
              permissions: [],
            },
          },
          update: {
            title: '更新角色',
            showResetButton: false,
            rules: {
              name: [{required: true, message: '角色名必填', trigger: 'blur'}],
              title: [
                {required: true, message: '标题必填', trigger: 'blur'},
                {type: 'string', min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
              ],
              description: [],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              weight: [],
              permissions: [],
            },
          },
        },
      }
    },

    methods: {

      //点击新增按钮时
      handleAdd() {
        this.tempRole = Object.assign({}, this.backupsTempRole)
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      //新添时重置表单
      handleReset() {
        this.$refs['ruleForm'].resetFields();
      },
      //新增时的提交表单
      saveForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            save(this.tempRole).then(response => {
              return response
            }).then(response => {
              return saveRolePermissionsByRoleId(response.id, this.tempRole.permissions)
            }).then((response) => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3000
              })
              this.dialogVisible = false
              this.getList()
            })
          } else {
            return false;
          }
        });
      },


      // 点击删除按钮时
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return removeById(row.id)
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 3000
          });
        });
      },
      //点击批量删除按钮时
      handleBatchDelete() {
        const roles = this.$refs['multipleTable'].selection
        const ids = roles.map(role => {
          return role.id
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (ids.length === 0) {
            throw new Error("未选择")
          }
          return removeByIds(ids)
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch((message) => {
          this.$message({
            type: 'info',
            message: '已取消或未选择',
            duration: 3000
          });
        });
      },


      //点击编辑按钮时
      handleUpdate(index, row) {
        this.tempRole = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogVisible = true
        // 弹窗加载完后才能获取到this.$refs['ruleForm'],用$nextTick可以解决DOM加载完后再执行方法
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      //修改时的提交表单
      updateForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            update(this.tempRole).then(respose => {
              return respose
            }).then((response) => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.dialogVisible = false
              this.getList()
            })
          } else {
            return false;
          }
        });
      },
      //状态开关改变时处理
      handleStatusChange(row){
        const {id,status} = row
        patch({id,status}).catch(() => {
          this.getList()
        })
      },
      //点击编辑角色权限按钮时
      handleUpdatePermission(index,row){
        this.tempRole = Object.assign({}, row)
        // 查系统中全部的权限
        this.getPermissionList()
        // 查角色已经拥有的权限
        listPermissionsByRoleId(row.id).then(resopne => {
          const has = resopne.map(permission => {
            return permission.id
          })
          // 选中已经拥有的权限
          this.$refs.permissionTree.setCheckedKeys(has)
        })
        this.permissionTreeVisible = true
      },
      //提交角色权限按修改
      updatePermission(){
        const permissions = this.$refs.permissionTree.getCheckedNodes()
        const ids = permissions.map(permission=>{
          return permission.id
        })
        saveRolePermissionsByRoleId(this.tempRole.id, ids).then(respose=>{
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 3000
          })
          this.permissionTreeVisible = false
        })
      },


      // 获取角色列表
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.listData = response.records
          this.total = parseInt(response.total)
          this.listLoading = false
        })
      },
      //搜索框回车或清空搜索条件
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      // 每页大小改变
      handleSizeChange(val) {
        this.listQuery.size = val
        this.listQuery.current = 1
        this.getList()
      },
      //当前页改变
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.getList()
      },
      // 获取权限列表
      getPermissionList() {
        listPermissions().then(response => {
          this.permissions = array2tree(response,'id')
        })
      },
      // 懒加载权限节点
      loadNode(node, resolve) {
        if (node.level === 0) {
          listPermissionsByParentId(0).then(response => {
            resolve(response)
            return
          }).catch(reason => {
            resolve([])
          })
        } else {
          const parentId = node.data.id
          listPermissionsByParentId(parentId).then(response => {
            resolve(response)
            return
          }).catch(reason => {
            resolve([])
          })
        }
      },

      //权限树的勾选逻辑
      handleTreeCurrentChange(data,node){
        // 没点一下当前取反
        node.checked=!node.checked
        // 选子必选父
        if(node.checked){
          this.selectParent(node)
          // 选父帮选子
          this.selectChild(node)
        }else{
          //  父取消子取消
          this.cancelChild(node)
        }
      },
      selectParent(node){
        if(node.parent){
          node.parent.checked = true
          this.selectParent(node.parent)
        }else {
          return
        }
      },
      selectChild(node){
        if(node.childNodes){
          node.childNodes.forEach(child=>{
            child.checked = true
            this.selectChild(child)
          })
        } else {
          return
        }
      },
      cancelChild(node){
        if(node.childNodes){
          node.childNodes.forEach(child=>{
            child.checked = false
            this.cancelChild(child)
          })
        } else {
          return
        }
      },
    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {},
    created() {
      this.getList()
      this.backupsTempRole = Object.assign({}, this.tempRole)
    }

  }
</script>

<style scoped>

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
