<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.keyword">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <audio
        controls="controls"
        preload="auto"
        :src="playUrl"
        id="playMusic">
      </audio>
    </div>
    <el-table
      :data="data" v-loading.body="listLoading"
      style="width: 100%" >
      <el-table-column fixed prop="date" label="编号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_title" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.class_title}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_title" label="章节" width="100">
        <template slot-scope="scope">
          <span>第 {{scope.row.class_no}} 节</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_current_price" label="现价" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.class_current_price}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="class_original_price" label="原价" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.class_original_price}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="url" label="封面" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.class_image}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="type" label="文件类型" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="is_free" label="试听" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_free}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="time_length" label="小节时长" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.time_length}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              @click="playPause(scope.row.id)"
              type="text"
              size="small">
              试听
            </el-button>
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
      <el-form :rules="rules" ref="postForm" :model="postForm" label-position="left" label-width="70px" style='width: 100%; margin-left:50px;'>
        <el-form-item :label="$t('table.title')" prop="class_title">
          <el-input v-model="postForm.class_title" placeholder="请输入标题" style="width: 500px"></el-input>
          <el-checkbox v-model="postForm.font_weight">加粗</el-checkbox>

            <el-color-picker v-model="postForm.color" size="mini" style="top:8px"></el-color-picker>

        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="70px" label="章节" prop="class_no">
          <el-input v-model="postForm.class_no" placeholder="章节" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="class_desc">
          <el-input type="textarea" v-model="postForm.class_desc"  placeholder="请输入描述" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="封面:" prop="class_image">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.class_image" />
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="音频:" prop="url">
          <div style="margin-bottom: 20px;">
            <UploadFile v-model="postForm.url" :id="postForm.id" :time_length.sync="postForm.time_length" v-on:set-time-length="onTimeLength" v-on:set-size="onSetSize" :course_id="postForm.course_id" :filename="postForm.filename"/>
          </div>
        </el-form-item>
        <el-form-item label="时长" prop="time_length">
          <el-input v-model="postForm.time_length"  style="width: 150px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="大小" prop="time_length">
          <el-input v-model="postForm.size"  style="width: 150px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="类型:" prop="type">
          <el-radio v-model="postForm.type" label="1">音频</el-radio>
          <!-- <el-radio v-model="postForm.type" label="2">视频</el-radio>-->
        </el-form-item>
        <!--<el-form-item style="margin-bottom: 20px;" label-width="80px" label="现价:" prop="class_current_price">
          <el-input v-model="postForm.class_current_price" placeholder="请输入现价" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="原价:" prop="class_original_price">
          <el-input v-model="postForm.class_original_price" placeholder="请输入原价" style="width: 100px"></el-input>
        </el-form-item>-->
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="试听:" porp="is_free">
          <el-switch
            v-model="postForm.is_free"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="is_free">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="发布:" porp="state">
          <el-switch
            v-model="postForm.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="课件:" prop="class_text">
          <div style="margin-bottom: 20px;">
            <nEditor ref="classTexts" v-model="postForm.class_text" :id="createId" :isEdit="postForm.id"></nEditor>
          </div>
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
  import { fetchClasses, createClasses, fetchClassesDetail, updateClasses, fetchPlayenableUrl, fetchCourses } from '@/api/courses'
  import Upload from '@/components/Upload/singleImage'
  import UploadFile from '@/components/Upload/singleImage2'
  import treeTable from '@/components/TreeTable'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import nEditor from '@/components/Neditor/index'

  const defaultForm = {
    id: undefined,
    course_id: undefined, // 课程id（先添加课程，获取课程id，之后再添加课程小节）
    class_title: '', // 课时名称（最多20个字符
    class_image: '', // 课时封面图
    class_desc: '', // 课时描述、摘要
    url: '', // 课时URL
    class_text: '', // 课时描述、摘要
    type: '1', // 类型：1音频，2视频
    is_free: '', // 是否免费：1是0非
    time_length: 0, // 小节时长（该字段的值，将在上传音视频文件时，返回具体的分钟数）
    class_current_price: 0.01, // 现价
    class_original_price: 0.01, // 原价
    color: null,
    font_weight: false,
    state: false,
    filename: null,
    size: '',
    class_no: ''
  }
  export default {
    directives: {
      waves
    },
    name: 'courseClasses',
    components: { treeTable, Treeselect, Upload, UploadFile, nEditor },
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        expandAll: false,
        listQuery: {
          course_id: '',
          page: 1,
          per_page: 10,
          keyword: ''
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
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          class_image: [{ required: true, message: '请上传封面', trigger: 'change' }],
          class_title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
          class_desc: [{ required: true, message: '请填写描述', trigger: 'blur' }],
          url: [{ required: true, message: '请上传音频', trigger: 'blur' }],
          class_text: [{ required: true, message: '请填写课件', trigger: 'blur' }],
          class_no: [{ required: true, message: '请填写章节', trigger: 'blur' }]
        },
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        // define options
        options: [],
        pid: null,
        playUrl: '',
        playId: null,
        oldPlayUrl: '',
        charge_mode: '1',
        is_free: false
      }
    },
    computed: {
      createId() {
        return this.$route.fullPath
      }
      /* getPlayUrl() {
        console.log(12)
      }*/
    },
    created() {
      this.listQuery.course_id = this.postForm.course_id = this.$route.params && this.$route.params.course_id
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchClasses(this.listQuery).then(response => {
          this.data = response.data
          // console.log(this.data)
          this.total = response.page.total
          this.listLoading = false
        })
      },
      setFree() {
        if (this.charge_mode === 1) {
          this.postForm.is_free = true
          this.is_free = true
          return false
        } else if (this.charge_mode === 4) {
          this.postForm.is_free = false
          this.is_free = true
          return true
        }
      },
      getCourses(id) {
        const _this = this
        fetchCourses(id).then(response => {
          _this.charge_mode = response.data.charge_mode
          // console.log(_this.charge_mode)
          // this.setFree()
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
      resetPostForm() {
        this.postForm = Object.assign({}, defaultForm)
        this.postForm.course_id = this.listQuery.course_id * 1
      },
      handleGetPlayUrl(id) {
        const _this = this
        fetchPlayenableUrl(id).then(response => {
          _this.playUrl = response.data.url
        })
      },
      handleCreate() {
        this.getCourses(this.listQuery.course_id)
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
        this.postForm.class_text = this.$refs.classTexts.content
        this.postForm.course_id = this.listQuery.course_id
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            // console.log(this.postForm)
            this.temp = Object.assign({}, this.postForm)
            this.temp.is_free = this.postForm.is_free ? 1 : 0
            this.temp.font_weight = this.postForm.font_weight ? 1 : 0
            this.temp.state = this.postForm.state ? 1 : 0
            !this.postForm.color ? this.temp.color = '' : ''
            // console.log(this.temp)
            createClasses(this.temp).then(() => {
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
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            this.postForm.class_text = this.$refs.classTexts.content
            const tempData = Object.assign({}, this.postForm)
            tempData.is_free = this.postForm.is_free ? 1 : 0
            tempData.font_weight = this.postForm.font_weight ? 1 : 0
            tempData.state = this.postForm.state ? 1 : 0
            console.log(tempData)
            updateClasses(tempData).then(() => {
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
      onSetSize(event) {
        this.postForm.size = event
      },
      onTimeLength(event) {
        this.postForm.time_length = event
        /* console.log('执行监控事件')
        console.log(event)*/
      },
      handleUpdate(row) {
        // this.postForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        fetchClassesDetail(row.id).then(response => {
          // console.log(response)
          this.postForm = response.data
          this.postForm.type = this.postForm.type ? '1' : '0'
          this.postForm.color = this.postForm.color ? this.postForm.color : null
          this.postForm.state = !!this.postForm.state
          this.postForm.is_free = !!this.postForm.is_free
          this.postForm.font_weight = !!this.postForm.font_weight
          console.log(this.postForm)
          // const _this = this
          /* setTimeout(function() {
            nEditor.methods.setUEContent(_this.postForm.class_text)
          }, 500)*/
        })
        this.$nextTick(() => {
          this.$refs.postForm.clearValidate()
        })
      },
      playPause(id) {
        var audio = document.getElementById('playMusic')
        // 播放id不等于已在播放的id
        const _this = this
        if (this.playId !== id) {
          this.playUrl = null
          this.handleGetPlayUrl(id)
          this.playId = id
          _this.playFlag = false
        }
        if (audio !== null) {
          setTimeout(function() {
            if (_this.playFlag) {
              audio.pause()
              _this.playFlag = false
            } else {
              audio.currentTime = 0
              audio.play()
              _this.playFlag = true
            }
          }, 1500)
        }
      }
    }
  }
</script>


