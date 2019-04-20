<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="广告名称" v-model="listQuery.share_name">
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
      <el-table-column fixed prop="share_name" label="活动名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.share_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="reward_type" label="奖励类型" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.reward_type}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="start_time" label="开始时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.start_time}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="end_time" label="结束时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="state" label="状态" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.state}}</span>
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
        <el-form-item label="活动名称" prop="share_name" label-width="100px" >
          <el-input v-model="temp.share_name" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item label="条件" prop="goal" label-width="100px" >
          <el-input v-model.number="temp.goal" style="width: 100px" auto-complete="off"></el-input><label> 分享次数；至少1次</label>
        </el-form-item>
        <el-form-item label="人数上限" prop="upper_limit" label-width="100px" >
          <el-input v-model.number="temp.upper_limit" style="width: 100px" auto-complete="off"></el-input> <label> 参与活动上限；0 不限制</label>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;text-align: left" label-width="100px" label="有效日期" prop="time">
          <div class="block">
            <el-date-picker
              v-model="temp.time"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="参与课程" prop="courses">
          <div style="text-align: left">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="temp.courses"
              filterable
              :render-content="renderFunc"
              :titles="['未添加', '已添加']"
              :button-texts="['移除', '添加']"
              @change="handleChange"
              :data="list">
            </el-transfer>
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
  import { fetchActivity, createActivity, updateActivity, fetchActivityDetail } from '@/api/activity'
  import { fetchList } from '@/api/courses'
  import waves from '@/directive/waves'// 水波纹指令
  import { fmtDate } from '@/utils/helps'
  import { validateInt } from '@/utils/validate'
  export default {
    directives: {
      waves
    },
    name: 'adList',
    data() {
      const generateData = _ => {
        const data = []
        fetchList().then(response => {
          var course = response.data
          for (var key in course) {
            // console.log(course[key])
            data.push({
              key: course[key].id,
              label: course[key].title + '(' + course[key].share_unlock + ')'
            })
          }
        })
        return data
      }
      const checkGoalMin = (rule, value, callback) => {
        if (!validateInt(value) || value <= 0) {
          callback(new Error('请输入大于0的整数'))
        } else {
          callback()
        }
      }
      return {
        list: generateData(),
        data: [],
        value3: [],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label } </span>
        },
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          share_name: ''
        },
        total: 0,
        listLoading: true,
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          share_name: [{ required: true, message: '请填写活动名称', trigger: 'change' }],
          courses: [{ required: true, message: '请选择课程', trigger: 'change' }],
          goal: [{ type: 'number', required: true, validator: checkGoalMin }],
          upper_limit: [{ type: 'number', required: true, message: '请填写整数' }],
          time: [{ required: true, message: 'time is required', trigger: 'change' }]
        },
        adTypes: [
          { id: '1', title: '图片' },
          { id: '2', title: '文字' }
        ],
        showTypes: [
          { id: '1', title: '小程序' },
          { id: '2', title: '网页' }
        ],
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        options: [],
        selected: []
      }
    },
    created() {
      this.getList()
    },
    computed: {
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchActivity(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      handleChange(value, direction, movedKeys) {
        console.log(value)
        // this.temp.courses = value
      },
      filterSearch(val) {
        this.listQuery.keyword = val
        if (val.length >= 2) {
          fetchList(this.listQuery).then(response => {
            this.options = response.data
          })
        } else {
          fetchList().then(response => {
            this.options = response.data
          })
        }
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
          share_name: '',
          reward: 1,
          upper_limit: '0',
          reward_type: 2,
          start_time: '',
          end_time: '',
          state: true,
          goal: '1',
          time: [],
          courses: []
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        fetchList().then(response => {
          this.options = response.data
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.temp.goal = this.temp.goal * 1
        this.temp.upper_limit = this.temp.upper_limit * 1
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.start_time = fmtDate(this.temp.time[0])
            this.temp.end_time = fmtDate(this.temp.time[1])
            this.temp.state === false ? this.temp.state = 0 : this.temp.state = 1
            // console.log(this.temp)
            if (this.temp.courses) {
              this.temp.course_ids = this.temp.courses.join(',')
            }

            createActivity(this.temp).then(() => {
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
        this.temp.goal = this.temp.goal * 1
        this.temp.upper_limit = this.temp.upper_limit * 1
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.start_time = fmtDate(this.temp.time[0])
            tempData.end_time = fmtDate(this.temp.time[1])
            this.temp.state === 0 ? tempData.state = false : tempData.state = true
            console.log(tempData)
            tempData.course_ids = tempData.courses.join(',')
            updateActivity(tempData).then(() => {
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
        this.resetTemp()
        // this.temp = Object.assign({}, row) // copy obj
        fetchActivityDetail({ id: row.id }).then(response => {
          var temp = response.data
          this.temp.goal = temp.goal * 1
          this.temp.upper_limit = temp.upper_limit * 1
          temp.state === 0 ? temp.state = false : temp.state = true
          this.temp.reward = temp.reward * 1
          this.temp.time = []
          this.temp.time.push(new Date(temp.start_time))
          this.temp.time.push(new Date(temp.end_time))
          this.temp.share_name = temp.share_name
          this.temp.reward_type = temp.reward_type
          this.temp.id = temp.id
          // this.temp.courses = []
          // console.log(temp.courses)
          for (var key in temp.courses) {
            this.temp.courses.push(temp.courses[key].course_id)
          }
        })

        // console.log(this.temp)
        fetchList().then(response => {
          this.options = response.data
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
