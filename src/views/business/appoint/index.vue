<template>
  <div class="app-container">

    <div class="filter-container" align="">
      <el-input placeholder="昵称 ↵ " v-model="listQuery.nickname" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>
    </div>

    <el-tabs v-model="state" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="已预约" name="1"></el-tab-pane>
      <el-tab-pane label="待付款" name="2"></el-tab-pane>
      <el-tab-pane label="试教中" name="3"></el-tab-pane>
      <el-tab-pane label="进行中" name="4"></el-tab-pane>
      <el-tab-pane label="待结课" name="5"></el-tab-pane>
      <el-tab-pane label="待关闭" name="6"></el-tab-pane>
      <el-tab-pane label="已完成" name="7"></el-tab-pane>
      <el-tab-pane label="已维权" name="9"></el-tab-pane>
      <el-tab-pane label="已关闭" name="10"></el-tab-pane>
    </el-tabs>

    <el-table ref="multipleTable" :data="teachers" style="width: 100%" height="550" border fit stripe
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="ID"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="需求ID"><span>{{ props.row.needId }}</span></el-form-item>

            <el-form-item label="学员ID"><span>{{ props.row.studentId }}</span></el-form-item>
            <el-form-item label="教员ID"><span>{{ props.row.teacherId }}</span></el-form-item>

            <el-form-item label="学员已评"><span>{{ props.row.studentCommentState }}</span></el-form-item>
            <el-form-item label="教员已评"><span>{{ props.row.teacherCommentState }}</span></el-form-item>

            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="tradeNo" label="订单号"></el-table-column>
      <el-table-column prop="nickname" label="学员昵称" ></el-table-column>
      <el-table-column prop="phone" label="电话" ></el-table-column>
      <el-table-column prop="qq" label="QQ" ></el-table-column>
      <el-table-column prop="wechat" label="微信" ></el-table-column>
      <el-table-column prop="subject" label="辅导科目" ></el-table-column>
      <el-table-column prop="address" label="地址" ></el-table-column>
      <el-table-column prop="totalPrice" label="总价格" ></el-table-column>

      <el-table-column  prop="state" label="状态" width="120" align="center" sortable>
        <template slot-scope="scope">
          <el-tag  effect="dark" v-if="scope.row.state===1" style="background: #10ff22;border-color:#10ff22">
            已预约
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===2" style="background: #0cfffc;border-color:#0cfffc">
            待付款
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===3" style="background: #0b15ff;border-color:#164ebc">
            试教中
          </el-tag>
          <el-tag effect="dark" v-else-if="scope.row.state===4" style="background: #ef0aff;border-color:#f623ff">
            进行中
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===5" style="background: #72bbff;border-color:#72bbff">
            待结课
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===6" style="background: #ff9590;border-color:#ff9590">
            待关闭
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===7" style="background: #5cff14;border-color:#46ff12">
            已完成
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===8" style="background: #9dffd7;border-color:#9dffd7">
            已评价
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===9" style="background: #ff8063;border-color:#ff8063">
            已维权
          </el-tag>
          <el-tag  effect="dark" v-else-if="scope.row.state===10" style="background: #9c9cab;border-color:#9c9cab">
            已关闭
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[3,7, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background >
    </el-pagination>
  </div>
</template>

<script>

  import * as teacherApi from '@/api/business/appoint'

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
      },
      state(value){
        if(value===1){
          return '已预约'
        }
        if(value===2){
          return '待付款'
        }
        if(value===3){
          return '试教中'
        }
        if(value===4){
          return '进行中'
        }
        if(value===5){
          return '待结课'
        }
        if(value===6){
          return '待关闭'
        }
        if(value===7){
          return '已完成'
        }
        if(value===8){
          return '已评价'
        }
        if(value===9){
          return '已维权'
        }
        if(value===8){
          return '已关闭'
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
