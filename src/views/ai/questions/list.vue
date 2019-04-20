<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.category')" v-model="listQuery.title">
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
      <el-table-column fixed prop="title" label="标题" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cat_name" label="所属分类" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.categories.cat_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="rank" label="排序" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="日期" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
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
        <el-form-item label="标题" prop="title" label-width="70px" >
          <el-input v-model="temp.title" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="70px" label="分类" prop="cat_id">
          <el-select v-model="temp.cat_id" placeholder="请选择" style="width: 700px">
            <el-option
              v-for="item in Profs"
              :key="item.id"
              :label="item.cat_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="rank" label-width="70px" >
          <el-input v-model="temp.rank" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="70px" label="内容" prop="contents">
          <nEditor ref="ent"  :id="contents" v-model="temp.contents" :isEdit="temp.id"></nEditor>
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
  import { fetchQuestionList, fetchQuestionType, createQuestionList, fetchSkillsDetail, updateQuestionList } from '@/api/ai'
  import waves from '@/directive/waves'// 水波纹指令
  import nEditor from '@/components/Neditor/index'
  export default {
    directives: {
      waves
    },
    name: 'questionList',
    components: { nEditor },
    data() {
      return {
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          title: ''
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
          title: [{ required: true, message: 'title is required', trigger: 'change' }],
          cat_id: [{ required: true, message: 'cat_id is required', trigger: 'change' }],
          contents: [{ required: true, message: 'contents is required', trigger: 'change' }],
          rank: [{ required: true, message: 'rank is required', trigger: 'change' }]
        },
        temp: {
          id: '',
          title: '',
          contents: '',
          rank: 50
        },
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        Profs: []
      }
    },
    created() {
      this.getList()
      fetchQuestionType().then(response => {
        this.Profs = response.data
      })
    },
    computed: {
      contents() {
        return this.$route.fullPath + Math.random()
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchQuestionList(this.listQuery).then(response => {
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
          id: '',
          title: '',
          contents: '',
          rank: 50
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
        this.temp.contents = this.$refs.ent.content
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createQuestionList(this.temp).then(() => {
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
        this.temp.contents = this.$refs.ent.content
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateQuestionList(tempData).then(() => {
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
        fetchSkillsDetail({ id: row.id }).then(response => {
          this.temp = response.data
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
