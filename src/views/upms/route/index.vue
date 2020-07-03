<template>
  <div class="app-container">

    <el-container>
      <el-aside>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete()">删除</el-button>
        <el-tree
          :data="routes"
          @node-click="handleNodeClick"
          :props="routeTreeProps"
          node-key="id"
          ref="routeTree"
          :expand-on-click-node="false"
          :indent="22"
          accordion
          :default-expanded-keys="defaultExpandedKeys">
        </el-tree>

        <!--:load="loadNode"-->
        <!--lazy-->

      </el-aside>

      <el-main>
        <el-form :model="tempRoute" :rules="rules" ref="ruleForm" label-width="100px" status-icon>

          <el-row>
            <el-col :span="12">
              <el-form-item label="路由名" prop="name">
                <el-input v-model="tempRoute.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="tempRoute.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="路径" prop="path">
                <el-input v-model="tempRoute.path" placeholder="路由的地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件路径" prop="componentPath">
                <el-input v-model="tempRoute.componentPath">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model.number="tempRoute.status">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="排序" prop="weight">
                <el-input v-model="tempRoute.weight"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="父级ID" prop="parentId">
                <el-input v-model="tempRoute.parentId" :disabled="true">
                  <el-button slot="append" icon="el-icon-refresh" @click="tempRoute.parentId=0"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="createTime" v-if="dialogMap[dialogStatus].showInputTime">
                <el-input v-model="tempRoute.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="更新时间" prop="updateTime" v-if="dialogMap[dialogStatus].showInputTime">
                <el-input v-model="tempRoute.updateTime" :disabled="true"></el-input>
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
    pageRoutes,
    saveRoute,
    removeRouteById,
    removeRoutesByIds,
    updateRoute,
    listRoutes,
    listRoutesByParentId
  } from '@/api/upms/auth/route'
  import {objectMerge} from "@/utils";

  export default {
    name: "Route",
    props: {},
    data() {
      return {

        defaultExpandedKeys:['1'],

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
        routeTreeProps: {
          label: 'name',
          children: 'children'
        },
        routes: [], //列表
        total: 0, //总共条数
        listQuery: { // 多条件分页查询
          current: 1, //当前页
          size: 10, //每页大小
          //orders: [], //排序

          //以下根据业务需求
          name: undefined,
        },
        tempRoute: {
          id:undefined,
          parentId: 0,
          name: undefined,
          value: undefined,
          uri: undefined,
          icon: undefined,
          type: undefined,
          weight: undefined,
          createTime:undefined,
          updateTime:undefined,
          status: 1,
        },
        backupTempRoute:undefined,
        // 当前被点击的节点
        currentRoute: {},
        rules: {
          name: [
            {required: true, message: '用户名必填', trigger: 'blur'},
            {type: 'string', min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'},
            // {
            //   validator: (rule, value, callback) => { //异步重名校验
            //     if (value === 'exit') {
            //       callback(new Error("用户名已存在"))
            //     }
            //     callback()
            //   },
            //   trigger: 'blur'
            // },
          ],
        }
      }
    },

    methods: {

      // 获取路由列表
      getRouteList() {
        listRoutes().then(response => {
          this.routes = array2tree(response,'id')
        })
      },

      updateForm(){
        updateRoute(this.tempRoute).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.getRouteList()
        })
      },

      // 懒加载节点
      loadNode(node, resolve) {
        if (node.level === 0) {
          listRoutesByParentId(0).then(response => {
            resolve(response)
            return
          }).catch(reason => {
            resolve([])
          })
        } else {
          const parentId = node.data.id
          listRoutesByParentId(parentId).then(response => {
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
        this.tempRoute = Object.assign({}, data)
        this.currentRoute = Object.assign({}, data)
      },

      handleAdd() {
        this.dialogStatus = 'save'
        const parentId = this.tempRoute.id
        this.tempRoute = Object.assign({}, this.backupTempRoute);
        this.tempRoute.parentId = parentId
      },
      saveForm(){
        saveRoute(this.tempRoute).then(response=>{
          this.$message({
            message: '新添成功',
            type: 'success',
            duration: 3000
          })
          this.getRouteList()
        })
      },

      handleDelete() {
        this.$confirm('此操作将永久删除本菜单和子菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return removeRouteById(this.tempRoute.id)
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          //TODO 刷新节点
          this.getRouteList()
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
      this.backupTempRoute = Object.assign({}, this.tempRoute)
      this.getRouteList()
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
