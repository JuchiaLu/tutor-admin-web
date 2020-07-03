<template>
  <div class="app-container">

    <div class="filter-container" align="">
      <el-input placeholder="姓名 ↵ " v-model="listQuery.realname" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
    </div>


    <el-tabs  v-model="state" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="待审" name="1"></el-tab-pane>
      <el-tab-pane label="失败" name="2"></el-tab-pane>
      <el-tab-pane label="成功" name="3"></el-tab-pane>
    </el-tabs>

    <el-table ref="multipleTable" :data="teachers" style="width: 100%" height="550" border fit stripe
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="ID"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="用户ID"><span>{{ props.row.teacherId }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="realname" label="姓名" width="120" sortable></el-table-column>
      <el-table-column prop="idNumber" label="身份证号" width="240"></el-table-column>

      <el-table-column  label="身份证正面" width="240" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.image1"
            :preview-src-list="[scope.row.image1]">

            <div slot="error" class="image-slot">
              <el-button type="danger" style="width: 200px;height: 100px">未上传</el-button>
            </div>

          </el-image>
        </template>
      </el-table-column>

      <el-table-column  label="身份证反面" width="240" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 100px"
            :src="scope.row.image2"
            :preview-src-list="[scope.row.image2]">

            <div slot="error" class="image-slot">
              <el-button type="danger" style="width: 200px;height: 100px">未上传</el-button>
            </div>

          </el-image>
        </template>
      </el-table-column>

      <el-table-column  prop="state" label="审核状态" width="120" align="center" sortable>
        <template slot-scope="scope">

          <el-tag type="warning" effect="dark" v-if="scope.row.state===1">
            待审
          </el-tag>

          <el-tag type="danger" effect="dark" v-else-if="scope.row.state===2">
            失败
          </el-tag>

          <el-tag type="success" effect="dark" v-else>
            成功
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="dialogFormVisible=true; auditId=scope.row.id">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[3,10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background >
    </el-pagination>



    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="400px" >
      <div align="center">
          <el-radio v-model="form.state" :label="2">失败</el-radio>
          <el-radio v-model="form.state" :label="3">成功</el-radio>
      </div>

      <br>

      <el-input v-model="form.reason" placeholder="备注或失败原因"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false" >取 消</el-button>
        <el-button type="primary" @click="handleAudit()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import * as teacherApi from '@/api/business/realnameAuth'

  export default {
    name: "Teacher",

    props: {},
    data() {
      return {

        activeName: undefined,

        teachers: [], //用户列表
        total: 0, //总共条数
        listQuery: { // 多条件 分页 排序 查询
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          realname:undefined,
          state: undefined,
        },

        state: '0',

        listLoading: false,

        auditId: undefined,
        form:{
          state: 3,
          reason: undefined,
        },
        dialogFormVisible: false,

      }
    },

    methods: {
      // 获取用户列表
      getList() {
        this.listLoading = true
        teacherApi.page(this.listQuery).then(response => {
          this.teachers = response.records
          this.total = parseInt(response.total)
          this.listLoading = false
        })
      },

      handleClick(){
        if(this.state==='0'){
          this.listQuery.state = undefined
        }else {
          this.listQuery.state = this.state
        }
        this.listQuery.current = 1
        this.getList()
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


      handleAudit(){
        teacherApi.audit(this.auditId,this.form).then(response=>{
          this.$message({
            message: '已审核',
            type: 'success',
            duration: 3000
          })
          this.dialogFormVisible=false
          this.getList()
        })
      },

    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {
      gender(value){
        if(value===1){
          return '男'
        }
        if(value===2){
          return '女'
        }
        return '未知'
      }
    },
    created() {
      this.getList()
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
