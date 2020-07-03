<template>
  <div class="app-container">

    <div class="filter-container" align="">
      <el-input placeholder="昵称 ↵ " v-model="listQuery.nickname" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
    </div>

    <el-tabs v-model="state" @tab-click="handleClick">
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
            <el-form-item label="用户ID"><span>{{ props.row.userId }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" ></el-table-column>
      <el-table-column prop="realname" label="姓名" ></el-table-column>
      <el-table-column prop="cashoutAccount" label="提现帐号" ></el-table-column>
      <el-table-column prop="cash" label="提现金额" ></el-table-column>
      <el-table-column prop="note" label="备注" ></el-table-column>
      <el-table-column prop="createTime" label="日期" width="180"></el-table-column>


      <el-table-column
        prop="cashoutType"
        label="类型"
        align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.cashoutType | cashoutType}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column  prop="state" label="状态"  align="center" sortable>
        <template slot-scope="scope">
          <el-tag type="warning" effect="dark" v-if="scope.row.state===1">
            待审核
          </el-tag>
          <el-tag type="danger" effect="dark" v-else-if="scope.row.state===2">
            未通过
          </el-tag>
          <el-tag type="success" effect="dark" v-else-if="scope.row.state===3">
            已通过
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="dialogFormVisible=true; auditId=scope.row.id" :disabled="scope.row.state!=1">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[3,7, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background >
    </el-pagination>


    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="400px" >
      <div align="center">
        <el-radio v-model="form.state" :label="2">失败</el-radio>
        <el-radio v-model="form.state" :label="3">通过</el-radio>
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

  import * as teacherApi from '@/api/pay/cashout'

  export default {
    name: "Need",

    props: {},
    data() {
      return {
        teachers: [], //用户列表
        total: 0, //总共条数
        listQuery: { // 多条件 分页 排序 查询
          current: 1, //当前页
          size: 7, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          nickname:undefined,
          state:undefined,
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

        if(this.form.state===3)
        {
          const loading = this.$loading({
            lock: true,
            text: '正在向其转账,请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          teacherApi.audit(this.auditId,this.form).then(response=>{
            this.$message({
              message: '已审核',
              type: 'success',
              duration: 3000
            })
            this.dialogFormVisible=false
            this.getList()
            loading.close();
          }).catch(error=>{
            loading.close();
          })
        }else {
          teacherApi.audit(this.auditId,this.form).then(response=>{
            this.$message({
              message: '已审核',
              type: 'success',
              duration: 3000
            })
            this.dialogFormVisible=false
            this.getList()
          }).catch(error=>{
          })
        }

      },

    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {
      cashoutType(value){
        if(value===1){
          return '支付宝'
        }
        if(value===2){
          return '微　信'
        }
        if(value===3){
          return '银行卡'
        }
      },
      state(value){
        if(value===1){
          return '待审核'
        }
        if(value===2){
          return '不通过'
        }
        if(value===3){
          return '已通过'
        }
        return '未知'
      },
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
