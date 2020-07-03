<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input placeholder="用户名 ↵ " v-model="listQuery.username" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-table ref="multipleTable" :data="users" style="width: 100%" height="550" border fit stripe
              :default-sort="{prop: 'username', order: 'ascending'}" v-loading="listLoading" highlight-current-row>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="用户名"><span>{{ props.row.username }}</span></el-form-item>
            <el-form-item label="昵称"><span>{{ props.row.nickname }}</span></el-form-item>
            <el-form-item label="姓名"><span>{{ props.row.realName }}</span></el-form-item>
            <el-form-item label="邮箱"><span>{{ props.row.email }}</span></el-form-item>
            <el-form-item label="电话"><span>{{ props.row.phone }}</span></el-form-item>
            <el-form-item label="状态"><span>{{ props.row.status }}</span></el-form-item>
            <el-form-item label="密码"><span>***</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed type="index" label="序号" width="55"></el-table-column>
      <el-table-column fixed sortable prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                     :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"
                     @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleUpdate(scope.$index,scope.row)">用户角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background>
    </el-pagination>

    <el-dialog :title="dialogMap[dialogStatus].title" :visible.sync="dialogVisible">
      <el-form :model="tempUser" :rules="dialogMap[dialogStatus].rules" ref="ruleForm" label-width="100px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="tempUser.username" clearable :disabled="dialogMap[dialogStatus].usernameInputDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="tempUser.email" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="tempUser.password" clearable :placeholder="dialogMap[dialogStatus].placeholder" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model.number="tempUser.status">
                <el-radio :label="1">启用</el-radio><el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="tempUser.nickname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="tempUser.phone" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="tempUser.realName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roles">
              <el-select v-model="tempUser.roles" placeholder="请选择" multiple filterable style="width: 100%"
                         @focus="getRoleList" clearable>
                <el-option v-for="role in roles" :key="role.id" :label="role.title" :value="role.id"></el-option>
              </el-select>
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
  </div>
</template>

<script>

  import {
    pageUsers,
    saveUser,
    removeUserById,
    removeUsersByIds,
    updateUser,
    patchUser,
    getUserByUsername,
    checkUsername,
    listRolesByUserId,
    saveUserRolesByUserId
  } from '@/api/upms/auth/user'

  import * as roleApi from '@/api/upms/auth/role'

  export default {
    name: "User",

    props: {},
    data() {
      return {
        users: [], //用户列表
        total: 0, //总共条数
        listQuery: { // 多条件 分页 排序 查询
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          username: undefined,
        },
        //系统中存在的角色，异步加载
        roles: [],
        // 新增或修改用户时弹出框要显示的用户
        tempUser: {
          username: undefined,
          nickname: undefined,
          realName: undefined,
          password: undefined,
          email: undefined,
          phone: undefined,
          status: 1,
          roles: [] //只包含id
        },
        backupsTempUser: undefined,

        listLoading: false,

        //弹窗框的状态,是新增还是修改
        dialogStatus: 'create',
        //是否显示弹出框
        dialogVisible: false,
        // 新增和编辑共用一个弹窗但数据不同
        dialogMap: {
          create: {
            title: '添加用户',
            usernameInputDisabled: false,
            showResetButton: true,
            placeholder: '',
            rules: {
              username: [
                {required: true, message: '用户名必填', trigger: 'blur'},
                {type: 'string', min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
                {
                  validator: (rule, value, callback) => { //异步重名校验
                    checkUsername(value).then((response) => {
                      if (response.existed) {
                        callback(new Error("用户名已存在"))
                      } else {
                        callback()
                      }
                    }).catch(reason => {
                      console.log(reason)
                    })
                  },
                  trigger: 'blur'
                },
                // {
                //   // TODO 批量所有字段，而不是单这个字段
                //   transform: (value) => {
                //     return value.trim();
                //   },
                //   trigger: 'blur'
                // }
              ],
              password: [
                {required: true, message: '密码必填', trigger: 'blur'},
                {type: 'string', min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
              ],
              email: [
                {required: true, message: '邮箱必填', trigger: 'blur'},
                {type: 'email', message: '邮箱格式错误', trigger: 'blur'},
              ],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              nickname: [],
              realName: [],
              phone: [],
              roles: [],
            },
          },
          update: {
            title: '更新用户',
            usernameInputDisabled: true,
            showResetButton: false,
            placeholder: '请输入新密码, 否则留空',
            rules: {
              username: [{required: true, message: '用户名必填', trigger: 'blur'}],
              password: [
                {type: 'string', min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'},
              ],
              email: [
                {required: true, message: '邮箱必填', trigger: 'blur'},
                {type: 'email', message: '邮箱格式错误', trigger: 'blur'},
              ],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              nickname: [],
              realName: [],
              phone: [],
              roles: [],
            },
          },
        },
      }
    },

    methods: {
      // 获取用户列表
      getList() {
        this.listLoading = true
        pageUsers(this.listQuery).then(response => {
          this.users = response.records
          this.total = parseInt(response.total)
          this.listLoading = false
        })
      },

      // 获取角色列表
      getRoleList() {
        // TODO page方法 服务端有默认值 page=10, 可以采用懒加载加远程搜索
        roleApi.list().then(response => {
          this.roles = response
        })
      },

      //搜索框
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

      //点击新增按钮时
      handleAdd() {
        this.tempUser = Object.assign({}, this.backupsTempUser)
        this.dialogStatus = 'create'
        this.dialogVisible = true
        // 弹窗加载完后才能获取到this.$refs['ruleForm'],用$nextTick可以解决DOM加载完后再执行方法
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      //点击编辑按钮时
      handleUpdate(index, row) {
        this.getRoleList()
        listRolesByUserId(row.id).then(resopne => {
          row.roles = resopne.map(role => {
            return role.id
          })
          this.tempUser = Object.assign({}, row) // copy obj
        })
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      // 点击删除按钮时
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return removeUserById(row.id)
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
        const users = this.$refs['multipleTable'].selection
        const ids = users.map(user => {
          return user.id
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (ids.length === 0) {
            throw new Error("未选择")
          }
          return removeUsersByIds(ids)
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
      //重置表单
      handleReset() {
        this.$refs['ruleForm'].resetFields();
      },

      handleStatusChange(row){
        const {id, status} = row //对象的结构语法
        patchUser({id,status}).catch(() => {
          this.getList()
        })
      },
      //新增时的提交表单
      saveForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          saveUser(this.tempUser).then(response => {
            return response
          }).then(response => {
            return saveUserRolesByUserId(response.id, this.tempUser.roles)
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
      //修改时的提交表单
      updateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateUser(this.tempUser).then(respose => {
            return respose
          }).then(response => {
            return saveUserRolesByUserId(this.tempUser.id, this.tempUser.roles)
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
    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {},
    created() {
      this.getList()
      this.backupsTempUser = Object.assign({}, this.tempUser)
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
