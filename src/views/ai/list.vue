<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table
      :data="data" v-loading.body="listLoading"
      style="width: 100%" >
      <el-table-column fixed prop="date" label="编号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_title" label="题目">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_title" label="类型" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.prof_categories.cat_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="type" label="职业" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.profession.prof_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed class-name="status-col" label="状态" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 1">启</div><div v-else>禁</div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="time_length" label="答题时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.time_limit}}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" @close="handleClose">
      <el-form :rules="rules" ref="postForm" :model="postForm" label-position="left"  label-width="100px" style='width: 100%; margin-left:50px;'>
        <el-form-item label="题目" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入题目" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="职业分类" prop="prof_tid" label-width="100px">
          <treeselect
            name="pid"
            :options="ProfCats"
            :value="postForm.prof_tid"
            :searchable="false"
            :show-count="true"
            :default-expand-level="1"
            @input="setCatValues"
            style="width: 500px"
          >
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
              <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="职业" prop="profession_id">
          <el-select v-model="postForm.profession_id" placeholder="请选择" style="width: 500px">
            <el-option
              v-for="item in Profs"
              :key="item.id"
              :label="item.prof_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="答题时间" prop="time_limit"  label-width="100px">
          <el-input v-model="postForm.time_limit"  style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="状态:" porp="state">
          <el-switch
            v-model="postForm.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="描述:" prop="description"  label-width="100px">
          <el-input type="textarea" v-model="postForm.description"  placeholder="请输入描述" style="width: 500px" :autosize="{minRows: 12, maxRows: 18}"></el-input>
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
  import { fetchList, createQuestion, fetchQuestion, updateQuestion } from '@/api/ai'
  import { fetchProfs, fetchProfCats } from '@/api/professions'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree } from '@/utils/helps'

  const defaultForm = {
    id: undefined,
    title: '',
    time_limit: 60,
    description: '',
    prof_tid: null,
    profession_id: '',
    state: true
  }
  export default {
    directives: {
      waves
    },
    name: 'aiList',
    components: { Treeselect },
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          title: ''
        },
        data: [],
        total: 0,
        listLoading: true,
        args: [null, null, 'timeLine'],
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '请填写题目', trigger: 'blur' }],
          prof_tid: [{ required: true, message: '请选择分类', trigger: 'blur' }],
          profession_id: [{ required: true, message: '请填写职业', trigger: 'blur' }],
          description: [{ required: true, message: '请填写描述', trigger: 'blur' }],
          time_limit: [{ required: true, type: 'number', message: '请填写答题时长', trigger: 'blur' }]
        },
        temp: {},
        dialogPvVisible: false,
        // define options
        ProfCats: [],
        Profs: [],
        isChang: false
      }
    },
    computed: {
      createId() {
        return this.$route.fullPath
      }
    },
    created() {
      // this.listQuery.id = this.$route.params && this.$route.params.id
      // this.getCourses(this.listQuery.course_id)
      this.getList()
      fetchProfCats().then(response => {
        this.ProfCats = treeToTree(response.data)
        console.log(this.ProfCats)
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.data = response.data
          // console.log(this.data)
          this.total = response.page.total
          this.listLoading = false
        })
      },
      setFree() {
        if (this.charge_mode === '1') {
          this.postForm.is_free = true
          return false
        } else if (this.charge_mode === '4') {
          this.postForm.is_free = false
          return true
        }
      },
      setCatValues(value) {
        this.postForm.prof_tid = value
        if (this.isChang) {
          this.postForm.profession_id = ''
        }
        this.isChang = true
        fetchProfs({ tid: value }).then(response => {
          this.Profs = treeToTree(response.data)
          // console.log(this.Profs)
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
      resetPostForm() {
        this.postForm = Object.assign({}, defaultForm)
      },
      handleCreate() {
        this.isChang = false
        this.resetPostForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.postForm.clearValidate()
        })
      },
      handleClose() {
        // nEditor.methods.destroyUe()
        // this.$refs.classTexts.ueDestroy()
      },
      createData() {
        this.postForm.time_limit = this.postForm.time_limit * 1
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            // console.log(this.postForm)
            this.temp = Object.assign({}, this.postForm)
            this.temp.state = this.postForm.state ? 1 : 0
            // console.log(this.temp)
            createQuestion(this.temp).then(() => {
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
        this.postForm.time_limit = this.postForm.time_limit * 1
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.postForm)
            tempData.state = this.postForm.state ? 1 : 0
            console.log(tempData)
            updateQuestion(tempData).then(() => {
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
        // this.postForm = Object.assign({}, row) // copy obj
        this.isChang = false
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        fetchQuestion(row.id).then(response => {
          // console.log(response)
          this.postForm = response.data
          this.postForm.state ? this.postForm.state = true : this.postForm.state = false
        })
        this.$nextTick(() => {
          this.$refs.postForm.clearValidate()
        })
      }
    }
  }
</script>


