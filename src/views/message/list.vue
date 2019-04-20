<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.category')" v-model="listQuery.position_name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :data="data" v-loading.body="listLoading" style="width: 100%" >
      <el-table-column fixed prop="date" label="Id" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_name" label="名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.position_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="尺寸规则" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.position_size}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="广告位编号" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.position_no}}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称:" prop="position_name" label-width="100px" >
          <el-input v-model="temp.position_name"></el-input>
        </el-form-item>
        <el-form-item label="尺寸规则:" prop="position_size" label-width="100px" >
          <el-input v-model="temp.position_size"></el-input><label>例：300x400</label>
        </el-form-item>
        <el-form-item label="编号:" prop="position_no" label-width="100px" >
          <el-input v-model="temp.position_no"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注:" prop="rank" label-width="100px" >
          <el-input type="textarea" v-model="temp.remark"></el-input>
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
  import { fetchAdPositions, createAdPositions, fetchAdPositionsDetail, updateAdPositions } from '@/api/ad'
  import waves from '@/directive/waves'// 水波纹指令
  export default {
    directives: {
      waves
    },
    name: 'messageList',
    data() {
      return {
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          position_name: ''
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
          position_name: [{ required: true, message: 'position_name is required', trigger: 'change' }],
          position_size: [{ required: true, message: 'position_size is required', trigger: 'change' }],
          position_no: [{ required: true, message: 'position_no is required', trigger: 'blur' }]
        },
        temp: {
          position_name: '',
          position_size: '',
          position_no: '',
          remark: '',
          state: ''
        },
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchAdPositions(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
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
          position_name: '',
          position_size: '',
          position_no: '',
          remark: '',
          state: true
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
            this.temp.state === false ? this.temp.state = 0 : this.temp.state = 1
            createAdPositions(this.temp).then(() => {
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
            updateAdPositions(tempData).then(() => {
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
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        fetchAdPositionsDetail({ id: row.id }).then(response => {
          this.temp = response.data
          this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
        })
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
