<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职业名称" v-model="listQuery.prof_name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :data="data" v-loading.body="listLoading" style="width: 100%" >
      <el-table-column fixed prop="date" label="编号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="prof_name" label="职业名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.prof_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="prof_alias" label="职业别名" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.prof_alias}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cat_name" label="职业分类" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.profession_categories.cat_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="rank" label="排序" label-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="更新时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="state" label="状态" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.state ? '开': '禁'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)"
                     type="text"
                     size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 100%; margin-left:50px;'>
        <el-form-item label="职业名称" prop="prof_name" label-width="100px" >
          <el-input v-model="temp.prof_name" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item label="职业别名" prop="prof_alias" label-width="100px" >
          <el-input v-model="temp.prof_alias" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="分类" prop="tid">
          <treeselect style="width: 400px"
                      name="tid"
                      :options="options"
                      :value="temp.tid"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setCatValues">
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item label="排序" prop="rank" label-width="100px" >
          <el-input v-model="temp.rank" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="ai面试显示:">
          <el-switch
            v-model="temp.show_in_ai"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="ai面试提示" prop="notice">
          <el-input type="textarea" v-model="temp.notice" style="width: 700px" :rows="10"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="内容" prop="">
          <nEditor ref="Eds"  :id="contents" v-model="temp.content"></nEditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchProfs, fetchProfDetail, createProf, updateProf, fetchProfCats } from '@/api/professions'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree } from '@/utils/helps'
  import nEditor from '@/components/Neditor/index'
  export default {
    directives: {
      waves
    },
    name: 'profList',
    components: { Treeselect, nEditor },
    data() {
      return {
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10
        },
        total: 0,
        listLoading: true,
        data: [],
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          prof_name: [{ required: true, message: '请填写职业名称', trigger: 'change' }],
          tid: [{ required: true, message: '请选择分类', trigger: 'change' }],
          rank: [{ required: true, message: 'rank is required', trigger: 'change' }]
        },
        temp: {},
        dialogPvVisible: false,
        options: []
      }
    },
    created() {
      this.getList()
      fetchProfCats().then(response => {
        this.options = treeToTree(response.data)
      })
    },
    computed: {
      contents() {
        return this.$route.fullPath
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchProfs(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      setCatValues(value) {
        this.temp.tid = value
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      message(row) {
        this.$message.info(row.name)
      },
      handleSizeChange(val) {
        this.listQuery.per_page = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: '',
          tid: null,
          prof_name: '',
          prof_alias: '',
          rank: 50,
          content: '',
          state: true,
          notice: '',
          show_in_ai: true
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.content = this.$refs.Eds.content
            tempData.state === false ? tempData.state = 0 : tempData.state = 1
            tempData.show_in_ai === false ? tempData.show_in_ai = 0 : tempData.show_in_ai = 1
            createProf(tempData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.content = this.$refs.Eds.content
            tempData.state === false ? tempData.state = 0 : tempData.state = 1
            tempData.show_in_ai === false ? tempData.show_in_ai = 0 : tempData.show_in_ai = 1
            updateProf(tempData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        // this.temp = Object.assign({}, row) // copy obj
        fetchProfDetail({ id: row.id }).then(response => {
          this.temp = response.data
          this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
          this.temp.show_in_ai === 0 ? this.temp.show_in_ai = false : this.temp.show_in_ai = true
        })
        // console.log(this.temp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
