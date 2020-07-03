<template>
  <div class="app-container">

    <div class="filter-container" align="">
      <el-input placeholder="类型码 或 类型名字 ↵ " v-model="listQuery.realname" clearable suffix-icon="el-icon-search"
                style="width: 200px;" @clear="handleFilter" @keyup.enter.native="handleFilter"></el-input>

      <el-button type="primary" @click="form={};addDictTypeDialogFormVisible=true">添加类型</el-button>
    </div>


    <br/>

    <el-table ref="multipleTable" :data="teachers"  height="550" border fit stripe
              :default-sort="{prop: 'id', order: 'ascending'}" v-loading="listLoading" highlight-current-row
              row-key="id"
              @expand-change="loadChildren"
    >

      <el-table-column type="expand">
        <template slot-scope="props">

          <el-table
            :data="props.row.children"
            fit
            stripe
            border
            :default-sort="{prop: 'id', order: 'ascending'}"
            v-loading="listLoading"
            highlight-current-row
            row-key="id"
          >

            <el-table-column  type="index" label="序号"  align="center"></el-table-column>
            <el-table-column prop="name" label="字典值"  sortable align="center"></el-table-column>

            <el-table-column  label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle @click="form=scope.row;modifyDictDialogFormVisible=true"></el-button>
              </template>
            </el-table-column>
          </el-table>


        </template>
      </el-table-column>

      <el-table-column  type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="code" label="字典类型码" align="center" sortable></el-table-column>
      <el-table-column prop="name" label="字典类型名字" align="center"></el-table-column>

      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="form=scope.row;modifyDictTypeDialogFormVisible=true" ></el-button>
          <el-button type="success"  icon="el-icon-plus" circle @click="form={};form.dictTypeId=scope.row.id;addDictDialogFormVisible=true"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.current"
                   :page-sizes="[3,10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" background >
    </el-pagination>



    <el-dialog title="修改类型" :visible.sync="modifyDictTypeDialogFormVisible" width="400px" >

      <el-input v-model="form.name" placeholder="新的名字"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDictTypeDialogFormVisible=false" >取 消</el-button>
        <el-button type="primary" @click="handleModifyDictType()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新添类型" :visible.sync="addDictTypeDialogFormVisible" width="400px" >

      <el-form>
        <el-form-item>
          <el-input v-model="form.code" placeholder="类型码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.name" placeholder="类型名字"></el-input>
        </el-form-item>
      </el-form>




      <div slot="footer" class="dialog-footer">
        <el-button @click="addDictTypeDialogFormVisible=false" >取 消</el-button>
        <el-button type="primary" @click="handleAddDictType()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改字典" :visible.sync="modifyDictDialogFormVisible" width="400px" >

      <el-input v-model="form.name" placeholder="新的名字"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDictDialogFormVisible=false" >取 消</el-button>
        <el-button type="primary" @click="handleModifyDict()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="添加字典" :visible.sync="addDictDialogFormVisible" width="400px" >
      <el-input v-model="form.name" placeholder="名字"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDictDialogFormVisible=false" >取 消</el-button>
        <el-button type="primary" @click="handleAddDict()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import * as teacherApi from '@/api/business/dictType'

  import * as dictApi from '@/api/business/dict'

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
          id: 2,
          name: undefined,
        },
        modifyDictTypeDialogFormVisible: false,
        modifyDictDialogFormVisible: false,

        addDictTypeDialogFormVisible: false,
        addDictDialogFormVisible: false,

      }
    },

    methods: {

      // 修改字典类型
      handleModifyDictType(){
        teacherApi.patch(this.form).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.modifyDictTypeDialogFormVisible=false
          //this.getList()
        })
      },

      //修改字典
      handleModifyDict(){
        dictApi.patch(this.form).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.modifyDictDialogFormVisible=false
          //this.getList() // TODO
        })
      },

      //增加字典
      handleAddDict(){
        dictApi.save(this.form).then(response=>{
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 3000
          })
          this.addDictDialogFormVisible=false
          this.loadChildren({id:this.form.dictTypeId})
        })
      },

      //增加字典类型
      handleAddDictType(){
        teacherApi.save(this.form).then(response=>{
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 3000
          })
          this.addDictTypeDialogFormVisible=false
          this.getList()
        })
      },


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


      loadChildren(row){
        dictApi.listByDictTypeId(row.id).then(response=>{
          row.children =  {}
          row.children =  response
         })
      }

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

</style>
