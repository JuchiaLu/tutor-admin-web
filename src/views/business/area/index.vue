<template>
  <div class="app-container">

    <el-container>
      <el-aside>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete()">删除</el-button>
        <el-tree
          :data="categorys"
          @node-click="handleNodeClick"
          :props="categoryTreeProps"
          node-key="id"
          ref="categoryTree"
          :expand-on-click-node="false"
          :indent="22"
          accordion
          :default-expanded-keys="defaultExpandedKeys"
          >
          <!--default-expand-all-->
        </el-tree>

        <!--:load="loadNode"-->
        <!--lazy-->

      </el-aside>

      <el-main>
        <el-form :model="tempCategory" :rules="rules" ref="ruleForm" label-width="100px" status-icon>

          <el-row>
            <el-col :span="12">
              <el-form-item label="名字" prop="name">
                <el-input v-model="tempCategory.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="weight">
                <el-input v-model="tempCategory.weight">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="12">
              <el-form-item label="父级ID" prop="parentId">
                <el-input v-model="tempCategory.parentId" :disabled="true">
                  <el-button slot="append" icon="el-icon-refresh" @click="tempCategory.parentId=0"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="createTime" v-if="dialogMap[dialogStatus].showInputTime">
                <el-input v-model="tempCategory.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="更新时间" prop="updateTime" v-if="dialogMap[dialogStatus].showInputTime">
                <el-input v-model="tempCategory.updateTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            <el-button type="primary" @click="dialogStatus=='update'?updateForm():saveForm()">{{dialogMap[dialogStatus].buttonName}}</el-button>
          </el-form-item>

        </el-form>
      </el-main>

    </el-container>
  </div>
</template>

<script>


  function array2tree(source, id='id', pid='parentId', children='children') {
    const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
    let map = {}, i, node, roots = [];
    for (i = 0; i < cloneData.length; i += 1) {
      map[cloneData[i][id]] = i; // 初始化 map, 使得能通过map[node.pid]来定位cloneData中的元素
      cloneData[i][children] = []; // 初始化 cloneData, 为cloneData中元素添加 children属性
    }
    for (i = 0; i < cloneData.length; i += 1) {
      node = cloneData[i];
      if (node[pid] !== '0') {
        // 父id不为零, 拿出父节点的的索引map[node.pid], 再给父节点添加children
        try {
          // 要确保pid对应的节点必须存在
          cloneData[map[node[pid]]][children].push(node);
        }catch (e) {
          console.log('pid对应的父节点不存在')
          continue
        }
      } else {
        roots.push(node); // 父id为0 ,直接放入数组
      }
    }
    return roots;
  }

  import * as areaApi from '@/api/business/area'

  export default {
    name: "Area",
    props: {},
    data() {
      return {

        defaultExpandedKeys:['21'],

        dialogMap: {
          update:{
            showInputTime:true,
            buttonName: '更新',

          },
          save:{
            showInputTime:false,
            buttonName: '新增',
          }
        },

        dialogStatus: 'save',

        // tree的配置属性
        categoryTreeProps: {
          label: 'name',
          children: 'children'
        },
        categorys: [], //列表
        total: 0, //总共条数
        listQuery: { // 多条件分页查询
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          name: undefined,
        },
        tempCategory: {
          id:undefined,
          name: undefined,
          parentId: 0,
          path: undefined,
          pic: undefined,
          sort: undefined,
          choose_num: undefined,
          createAt:undefined,
          updateAt:undefined,
        },
        backupTempCategory:undefined,
        // 当前被点击的节点
        currentCategory: {},
        rules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'},
            {type: 'string', min: 0, max: 12, message: '长度在 0 到 12 个字符', trigger: 'blur'},
            {
              validator: (rule, value, callback) => { //异步重名校验
                if (value === 'exit') {
                  callback(new Error("已存在"))
                }
                callback()
              },
              trigger: 'blur'
            },
          ],
        }
      }
    },

    methods: {

      // 获取列表
      getCategoryList() {
        areaApi.list().then(response => {
          this.categorys = array2tree(response,'id','parentId')
        })
      },

      updateForm(){
        areaApi.patch(this.tempCategory).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.getCategoryList()
        })
      },

      // 懒加载节点
      loadNode(node, resolve) {
        if (node.level === 0) {
          areaApi.listByParentId(0).then(response => {
            resolve(response)
            return
          }).catch(reason => {
            resolve([])
          })
        } else {
          const pid = node.data.id
          areaApi.listByParentId(pid).then(response => {
            resolve(response)
            return
          }).catch(reason => {
            resolve([])
          })
        }
      },

      // 点击节点时处理
      handleNodeClick(data, node) {
        this.defaultExpandedKeys = []
        this.defaultExpandedKeys.push(data.id)
        this.dialogStatus = 'update'
        this.tempCategory = Object.assign({}, data)
        this.currentCategory = Object.assign({}, data)
      },

      handleAdd() {
        this.dialogStatus = 'save'
        const parentId = this.tempCategory.id
        this.tempCategory = Object.assign({}, this.backupTempCategory);
        this.tempCategory.parentId = parentId
      },
      saveForm(){
        areaApi.save(this.tempCategory).then(response=>{
          this.$message({
            message: '新添成功',
            type: 'success',
            duration: 3000
          })
          this.getCategoryList()
        })
      },

      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.defaultExpandedKeys = []
          this.defaultExpandedKeys.push(this.tempCategory.parentId)
          return areaApi.deleteById(this.tempCategory.id)
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          //TODO 刷新节点
          this.getCategoryList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
            duration: 3000
          });
        })
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    computed: {},
    watch: {},
    components: {},
    directives: {},
    filters: {},

    created() {
      this.backupTempCategory = Object.assign({}, this.tempCategory)
      this.getCategoryList()
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
