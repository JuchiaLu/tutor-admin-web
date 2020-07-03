<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input placeholder="标题 ↵ " v-model="listQuery.title" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
    </div>

    <br/>

    <el-table ref="multipleTable" :data="records" style="width: 100%" height="550" border fit stripe
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row>


      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="排序"><span>{{ props.row.weight }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>


      <el-table-column  type="index" label="序号" ></el-table-column>
      <el-table-column  sortable prop="title" label="标题" ></el-table-column>
      <el-table-column prop="content" label="内容" ></el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                     :active-value="1" :inactive-value="0" active-text="已读" inactive-text="未读"
                     @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background>
    </el-pagination>




    <el-dialog :title="dialogMap[dialogStatus].title" :visible.sync="dialogVisible">
      <el-form :model="tempForm" :rules="dialogMap[dialogStatus].rules" ref="ruleForm" label-width="100px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="tempForm.title" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="tempForm.weight" clearable type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" v-model="tempForm.content" rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model.number="tempForm.status">
                <el-radio :label="1">已读</el-radio><el-radio :label="0">未读</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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

  import * as adviceApi from '@/api/system/advice'

  export default {
    name: "User",

    props: {},
    data() {
      return {
        records: [], //列表
        total: 0, //总共条数
        listQuery: { // 多条件 分页 排序 查询
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          name: undefined,
        },
        //系统中存在的角色，异步加载
        // 新增或修改用户时弹出框要显示的用户
        tempForm: {
          title: undefined,
          content: undefined,
          status: 1,
        },
        backupsTempForm: undefined,

        listLoading: false,

        //弹窗框的状态,是新增还是修改
        dialogStatus: 'create',
        //是否显示弹出框
        dialogVisible: false,
        // 新增和编辑共用一个弹窗但数据不同
        dialogMap: {
          create: {
            title: '添加',
            usernameInputDisabled: false,
            showResetButton: true,
            placeholder: '',
            rules: {
              title: [
                {required: true, message: '标题必填', trigger: 'blur'},
              ],
              content: [{required: true, message: '内容必填', trigger: 'blur'},],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
            },
          },
          update: {
            title: '更新',
            rules: {
              title: [
                {required: true, message: '标题必填', trigger: 'blur'},
              ],
              content: [{required: true, message: '内容必填', trigger: 'blur'},],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
            },
          },
        },
      }
    },

    methods: {
      // 获取用户列表
      getList() {
        this.listLoading = true
        adviceApi.page(this.listQuery).then(response => {
          this.records = response.records
          this.total = parseInt(response.total)
          this.listLoading = false
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
        this.tempForm = Object.assign({}, this.backupsTempForm)
        this.dialogStatus = 'create'
        this.dialogVisible = true
        // 弹窗加载完后才能获取到this.$refs['ruleForm'],用$nextTick可以解决DOM加载完后再执行方法
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      //点击编辑按钮时
      handleUpdate(index, row) {
        this.tempForm = Object.assign({}, row) // copy obj
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
          return adviceApi.deleteById(row.id)
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


      //重置表单
      handleReset() {
        this.$refs['ruleForm'].resetFields();
      },

      //修改状态
      handleStatusChange(row){
        adviceApi.patch(row).then(() => {
          let message = row.status===0?'已禁用':'已启用'
          this.$message({
            message: message,
            type: 'success',
            duration: 3000
          })
          this.getList()
        })
      },


      //新增时的提交表单
      saveForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          adviceApi.save(this.tempForm).then(response => {
            return response
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
          adviceApi.patch(this.tempForm).then(respose => {
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
    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {},
    created() {
      this.getList()
      this.backupsTempForm = Object.assign({}, this.tempForm)
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
