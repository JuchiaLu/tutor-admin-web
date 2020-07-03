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
      <el-tab-pane label="进行" name="4"></el-tab-pane>
      <el-tab-pane label="完成" name="5"></el-tab-pane>
      <el-tab-pane label="关闭" name="6"></el-tab-pane>
    </el-tabs>

    <el-table ref="multipleTable" :data="teachers" style="width: 100%" height="550" border fit stripe
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="ID"><span>{{ props.row.id }}</span></el-form-item>
            <el-form-item label="用户ID"><span>{{ props.row.studentId }}</span></el-form-item>
            <el-form-item label="关闭原因"><span>{{ props.row.reason }}</span></el-form-item>
            <el-form-item label="学员类型"><span>{{ props.row.studentType.name }}</span></el-form-item>
            <el-form-item label="其他要求"><span>{{ props.row.demand }}</span></el-form-item>
            <el-form-item label="QQ"><span>{{ props.row.qq }}</span></el-form-item>
            <el-form-item label="微信"><span>{{ props.row.wechat }}</span></el-form-item>
            <el-form-item label="已预约人数"><span>{{ props.row.totalAppoint }}</span></el-form-item>
            <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
            <el-form-item label="修改时间"><span>{{ props.row.updateTime }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="gender" label="性别" width="60">
        <template slot-scope="scope">
          {{scope.row.gender | gender}}
        </template>
      </el-table-column>

      <el-table-column prop="gender" label="课程" width="140">
        <template slot-scope="scope">
          {{scope.row.firstCategory.name}} {{scope.row.secondCategory.name}} {{scope.row.thirdCategory.name}}
        </template>
      </el-table-column>

      <el-table-column prop="frequency" label="课时次数" width="80">
        <template slot-scope="scope">
          {{scope.row.frequency}} 次
        </template>
      </el-table-column>
      <el-table-column prop="timeHour" label="课时时长" width="80">
        <template slot-scope="scope">
          {{scope.row.timeHour}}小时/次
        </template>
      </el-table-column>
      <el-table-column prop="hourPrice" label="课时价格" width="100">
        <template slot-scope="scope">
          {{scope.row.hourPrice}} 元/小时
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价" width="80">
        <template slot-scope="scope">
          {{scope.row.totalPrice}} 元
        </template>
      </el-table-column>


      <el-table-column prop="gender" label="地址" width="180">
        <template slot-scope="scope">
          {{scope.row.city.name}} {{scope.row.area.name}} {{scope.row.address}}
        </template>
      </el-table-column>

      <el-table-column  prop="state" label="状态" width="120" align="center" sortable>
        <template slot-scope="scope">
          <el-tag type="warning" effect="dark" v-if="scope.row.state===1">
            待审核
          </el-tag>
          <el-tag type="danger" effect="dark" v-else-if="scope.row.state===2">
            未通过
          </el-tag>
          <el-tag type="primary" effect="dark" v-else-if="scope.row.state===3">
            已通过
          </el-tag>
          <el-tag effect="dark" v-else-if="scope.row.state===4" style="background: hotpink;border-color:hotpink">
            进行中
          </el-tag>
          <el-tag type="succeed" effect="dark" v-else-if="scope.row.state===5">
            已完成
          </el-tag>
          <el-tag type="info" effect="dark" v-else-if="scope.row.state===6">
            已关闭
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

  import * as teacherApi from '@/api/business/need'

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
          return '待审核'
        }
        if(value===3){
          return '已通过'
        }
        if(value===2){
          return '不通过'
        }
        if(value===4){
          return '进行中'
        }
        if(value===5){
          return '已完成'
        }
        if(value===6){
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
