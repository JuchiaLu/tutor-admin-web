<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input placeholder="名字 ↵ " v-model="listQuery.username" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <br/>

    <el-table ref="multipleTable" :data="records" style="width: 100%" height="550" border fit stripe row-key="id"
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row>


      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="排序"><span>{{ props.row.weight }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTiime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" ></el-table-column>
      <el-table-column  sortable prop="name" label="名字" ></el-table-column>
      <el-table-column prop="url" label="跳转地址" ></el-table-column>

      <el-table-column  type="index" label="背景图片" width="240">
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]">

            <div slot="error" class="image-slot">
              <el-button type="danger" style="width: 200px;height: 100px">加载错误</el-button>
            </div>

          </el-image>

        </template>
      </el-table-column>


      <el-table-column label="状态" width="150" sortable prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                     :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"
                     @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.$index,scope.row)"></el-button>
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
            <el-form-item label="名字" prop="name">
              <el-input v-model="tempForm.name" clearable :disabled="dialogMap[dialogStatus].usernameInputDisabled"></el-input>
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
            <el-form-item label="跳转地址" prop="url">
              <el-input v-model="tempForm.url" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model.number="tempForm.status">
                <el-radio :label="1">启用</el-radio><el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>

          <el-col :span="24">
          <el-form-item label="图片" prop="status">
          <el-upload
          class="el-upload avatar-uploader"
          action
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,"
          :auto-upload="true"
          :show-file-list="false"
          ref="upload"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :http-request="fileUpload">
            <img v-if="tempForm.imageUrl" :src="tempForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

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

  import * as friendLinkApi from '@/api/system/friendLink'

  import * as attachmentApi from '@/api/system/attachment'

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
          name: undefined,
          url: undefined,
          imageUrl: undefined,
          type: 1,
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
            rules: {
              name: [
                {required: true, message: '名字必填', trigger: 'blur'},
              ],
              type: [
                {required: true, message: '类型必填', trigger: 'blur'},
              ],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              imageUrl: [{required: true, message: '请上传图片', trigger: 'blur'}],
            },
          },
          update: {
            title: '更新',
            rules: {
              name: [
                {required: true, message: '名字必填', trigger: 'blur'},
              ],
              type: [
                {required: true, message: '类型必填', trigger: 'blur'},
              ],
              status: [{required: true, message: '状态必选', trigger: 'blur'},],
              imageUrl: [{required: true, message: '请上传图片', trigger: 'blur'}],
            },
          },
        },
      }
    },

    methods: {
      // 获取用户列表
      getList() {
        this.listLoading = true
        friendLinkApi.page(this.listQuery).then(response => {
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
          return friendLinkApi.deleteById(row.id)
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

      //修改状态
      handleStatusChange(row){
        friendLinkApi.patch(row).then(() => {
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
          friendLinkApi.save(this.tempForm).then(response => {
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
          friendLinkApi.patch(this.tempForm).then(respose => {
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

      //自定义文件上传逻辑
      fileUpload(file){
        return attachmentApi.upload(file)
      },
      //文件上传前的处理
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'|| file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 jpeg 或 png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //文件上传成功时
      handleSuccess(response, file, fileList){
        this.tempForm.imageUrl = response.url
      },

    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {
      type(value){
        if(value===1){
          return '站内跳转'
        }
        return '站外跳转'
      }
    },
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

   .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
   .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 260px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 280px;
    height: 130px;
    display: block;
  }

</style>
