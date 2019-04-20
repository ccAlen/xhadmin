<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.category')" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          {{scope.row.created_at}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.category')" prop="pid">
          <treeselect
            name="pid"
            :options="options"
            :value="pid"
            :searchable="false"
            :show-count="true"
            :default-expand-level="1"
            @input="setCatValues"
          >
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
              <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="栏目显示:">
          <el-switch
                  v-model="temp.as_labels"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
          </el-switch><label> 猩考证</label>
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
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import { fetchCat, createCat, updateCat } from '@/api/news'
  import treeTable from '@/components/TreeTable'
  import { treeToArray, treeToTree } from './customEval'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    directives: {
      waves
    },
    name: 'newsCat',
    components: { treeTable, Treeselect },
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          name: ''
        },
        total: 0,
        listLoading: true,
        data: {},
        args: [null, null, 'timeLine'],
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          name: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        temp: {
          name: '',
          pid: null,
          as_labels: false
        },
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        // define options
        options: [],
        pid: null
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        if (this.listQuery.name !== '') {
          this.listQuery.pid = 's'
        }
        fetchCat(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      setCatValues(value) {
        this.pid = value
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
          name: '',
          pid: null,
          as_labels: false
        }
        this.pid = null
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        fetchCat().then(response => {
          this.options = treeToTree(response.data)
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.as_labels === false ? this.temp.as_labels = 0 : this.temp.as_labels = 1
            this.pid === null ? this.temp.pid = 0 : this.temp.pid = this.pid
            createCat(this.temp).then(() => {
              this.temp.pid === 0 ? this.temp.pid = null : ''
              // this.data.unshift(this.temp)
              // this.total = this.total + 1
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
            this.temp.as_labels === false ? tempData.as_labels = 0 : tempData.as_labels = 1
            tempData.pid = this.pid ? this.pid : 0
            updateCat(tempData).then(() => {
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
        this.temp.id = row.id
        this.temp.name = row.name
        this.temp.pid = this.pid = row.pid === 0 ? null : row.pid
        row.as_labels === 0 ? this.temp.as_labels = false : this.temp.as_labels = true
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        fetchCat().then(response => {
          this.options = treeToTree(response.data, '', '', '', '', this.temp.id)
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
