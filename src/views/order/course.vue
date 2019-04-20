<template>
  <div class="app-container">

    <div class="filter-container">
      <div>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="讲师、课程、买家" v-model="listQuery.keyword">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="订单编号" v-model="listQuery.consume_sn">
      </el-input>
      <el-select v-model="listQuery.state" placeholder="订单状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarOrderStateOptions" :key="item.state" :label="item.state_name" :value="item.state"/>
      </el-select>
      </div>
      <el-date-picker
            v-model="dateOrderSearch"
            type="datetimerange"
            start-placeholder="下单时间"
            end-placeholder="下单时间"
            :default-time="['12:00:00','23:59:59']"
            style="margin-bottom:10px;vertical-align:middle">
        </el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <div style="text-align: right">总额：1000元；已付金额：506元；未付金额：394元；已付数量：120条；未付数量：20条</div>
      
    </div>
    <el-table :data="data" v-loading.body="listLoading" style="width: 100%" >
      <el-table-column fixed prop="date" label="Id" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="consume_sn" label="订单编号" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.consume_sn}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="consume_sn" label="讲师" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.lecturer_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="user.name" label="用户" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="course_name" label="课程名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.course_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="order_amount" label="订单金额" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.order_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="paid_amount" label="实付金额" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.paid_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="discount" label="优惠金额" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="state" label="订单状态" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.state ==1 ? '已支付':scope.row.state === 0 ?'待支付':'取消支付'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="paid_time" label="支付时间" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.paid_time}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="下单时间" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleShow(scope.row)"
                     type="text"
                     size="small">
            查看
          </el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      列表信息已经全部显示
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import { fetchOrderCourses, fetchOrderDetail } from '@/api/order_courses'
  import waves from '@/directive/waves'// 水波纹指令
  export default {
    directives: {
      waves
    },
    name: 'addPosition',
    data() {
      return {
        dateOrderSearch: [],
        calendarOrderStateOptions: [{ state: '1', state_name: '已付' }, { state: '0', state_name: '未付' }],
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
        fetchOrderCourses(this.listQuery).then(response => {
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
      handleShow(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        fetchOrderDetail({ id: row.id }).then(response => {
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
