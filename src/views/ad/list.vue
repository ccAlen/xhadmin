<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="广告名称" v-model="listQuery.ad_name">
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
          <span>{{scope.row.ad_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cat_name" label="广告位" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.ad_position.position_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cat_name" label="广告图" label-width="150px">
        <template slot-scope="scope">
          <span><img :src="scope.row.img_uri" style="width: 50px;height: 50px"></span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="rank" label="排序" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="开始时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.start_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="结束时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.end_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="visits" label="浏览量" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.visits}}</span>
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
        <el-form-item label="名称" prop="ad_name" label-width="100px" >
          <el-input v-model="temp.ad_name" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="广告类型" prop="ad_type">
          <el-select v-model="temp.ad_type" placeholder="请选择" style="width: 700px">
            <el-option
              v-for="item in adTypes"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="广告位" prop="pid">
          <el-select v-model="temp.pid" placeholder="请选择" style="width: 700px">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.position_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="展示形式" prop="show_type">
          <el-select v-model="temp.show_type" placeholder="请选择" style="width: 700px">
            <el-option
              v-for="item in showTypes"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示地址" prop="show_url" label-width="100px" >
          <el-input v-model="temp.show_url" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank" label-width="100px" >
          <el-input v-model="temp.rank" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="广告图" prop="img_uri" label-width="100px">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.img_uri" />
          </div>
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
  import { fetchAdList, fetchAdPositions, createAd, fetchAdDetail, updateAd } from '@/api/ad'
  import waves from '@/directive/waves'// 水波纹指令
  import Upload from '@/components/Upload/singleImage'
  import { fmtDate } from '@/utils/helps'
  export default {
    directives: {
      waves
    },
    name: 'adList',
    components: { Upload },
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
          ad_name: [{ required: true, message: 'ad_name is required', trigger: 'change' }],
          ad_type: [{ required: true, message: 'ad_type is required', trigger: 'change' }],
          pid: [{ required: true, message: 'pid is required', trigger: 'change' }],
          show_type: [{ required: true, message: 'show_type is required', trigger: 'change' }],
          rank: [{ required: true, message: 'rank is required', trigger: 'change' }],
          img_uri: [{ required: true, message: 'img_uri is required', trigger: 'change' }],
          time: [{ required: true, message: 'time is required', trigger: 'change' }],
          show_url: [{ required: true, message: 'show_url is required', trigger: 'change' }]
        },
        adTypes: [
          { id: '1', title: '图片' },
          { id: '2', title: '文字' }
        ],
        showTypes: [
          { id: '1', title: '小程序' },
          { id: '2', title: '网页' }
        ],
        temp: {
          id: '',
          pid: '',
          ad_name: '',
          img_uri: '',
          rank: 50,
          ad_type: '1',
          show_url: '',
          show_type: '1',
          start_at: '',
          end_at: '',
          state: true,
          time: ''
        },
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        positions: []
      }
    },
    created() {
      this.getList()
      fetchAdPositions().then(response => {
        this.positions = response.data
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
        fetchAdList(this.listQuery).then(response => {
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
          pid: '',
          ad_name: '',
          img_uri: '',
          rank: 50,
          ad_type: '1',
          show_url: '',
          show_type: '1',
          start_at: '',
          end_at: '',
          state: true,
          time: []
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
            this.temp.start_at = fmtDate(this.temp.time[0])
            this.temp.end_at = fmtDate(this.temp.time[1])
            createAd(this.temp).then(() => {
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
            tempData.start_at = fmtDate(this.temp.time[0])
            tempData.end_at = fmtDate(this.temp.time[1])
            tempData.state === false ? tempData.state = 0 : tempData.state = 1
            updateAd(tempData).then(() => {
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
        fetchAdDetail({ id: row.id }).then(response => {
          this.temp = response.data
          this.temp.time = []
          this.temp.ad_type = String(this.temp.ad_type)
          this.temp.show_type = String(this.temp.show_type)
          this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
          this.temp.time.push(new Date(this.temp.start_at))
          this.temp.time.push(new Date(this.temp.end_at))
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
