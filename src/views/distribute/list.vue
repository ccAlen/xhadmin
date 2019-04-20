<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="分销商姓名或手机码" v-model="listQuery.keyword">
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
      <el-table-column fixed prop="username" label="姓名" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="mobile" label="手机号" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="debit_card" label="二维码" width="100px">
        <template slot-scope="scope">
          <el-button v-waves :loading="downloadCodeLoading === scope.row.id" type="primary" icon="el-icon-download" size='mini' @click="downLoadImage(scope.row.id,1)">Zip</el-button >
        
        </template>
      </el-table-column>
      <el-table-column fixed prop="debit_card" label="小程序码" width="120px">
        <template slot-scope="scope">
          <el-button v-waves :loading="downloadQrcodeLoading  === scope.row.id" type="primary" icon="el-icon-download" size='mini' @click="downLoadImage(scope.row.id,2)">Zip</el-button >
        </template>
      </el-table-column>
      <el-table-column fixed prop="updated_at" label="更新时间" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="创建时间" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)"
                     type="text"
                     size="small">
            编辑
          </el-button>
          <el-button @click="handleCourses(scope.row)"
                     type="text"
                     size="small">
            设置课程
          </el-button>
          <el-button @click="handleShow(scope.row)"
                     type="text"
                     size="small">
            用户
          </el-button>
          <el-button @click="handleOrdersShow(scope.row)"
                     type="text"
                     size="small">
            课程提成
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
        <el-form-item label="姓名:" prop="username" label-width="100px" >
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile" label-width="100px" >
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
        <el-form-item label="开户银行:" prop="bank_name" label-width="100px" >
          <el-input v-model="temp.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="开户支行:" prop="branch_bank_name" label-width="100px" >
          <el-input v-model="temp.branch_bank_name"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号:" prop="debit_card" label-width="100px" >
          <el-input v-model="temp.debit_card"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置课程" :visible.sync="dialogCoursesVisible">
      <el-form :rules="rules" ref="dataForm" :model="distributorDetail" label-position="left" label-width="70px" style='width: 70%; margin-left:50px;'>
        <el-form-item label="姓名:" prop="username" label-width="100px" >
          <el-input v-model="distributorDetail.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile" label-width="100px" >
          <el-input v-model="distributorDetail.mobile"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="课程分类" prop="course_cat_id">
          <treeselect style="width: 400px"
                      name="course_cat_id"
                      :options="coursesCats"
                      v-model="course_cat_id"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setCatValues"
          >
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" prop="prof_id">
          <el-tag
            v-for="tag in courseSelect"
            closable
            :key="tag.id"
            :type="tag.course_title_rate"
            @close="closeCourseTag(tag)"
          >
            <el-button type="text" @click="changeCourseTag(tag)">{{tag.course_title_rate}}</el-button>
          </el-tag>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" prop="prof_id">
          <el-checkbox-group v-model="checkedCities2">
            <el-checkbox v-for="course in courses" :label="course.id" :key="course.id" @change="courseRate">{{course.title}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="rateDialogVisible"
      width="30%"
      center
      :before-close="rateNo">
      <el-form :rules="rules2" ref="rateForm" :model="rateForm">
        <el-form-item  prop="rate" label="该课程提成比例">
          <el-input v-model.number="rateForm.rate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="rateNo">取 消</el-button>
      <el-button type="primary" @click="rateYes">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="用户绑定信息"
      :visible.sync="dialogNewUsersTable"
      width="90%"
      heigth="90%"
      :before-close="handleClose">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilterUser" style="width: 200px;" class="filter-item" placeholder="昵称或手机码" v-model="listQueryTable.name">
        </el-input>
        <el-select v-model="listQueryTable.state" placeholder="状态" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarUserStateOptions" :key="item.state" :label="item.state_name" :value="item.state"/>
        </el-select>
        <el-select v-model="listQueryTable.is_new" placeholder="拉新" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarUserIsNewOptions" :key="item.isNew" :label="item.state_name" :value="item.isNew"/>
        </el-select>
        <el-select v-model="listQueryTable.bind_mobile" placeholder="是否绑定手机号" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarUserbindMobileOptions" :key="item.bind_mobile" :label="item.state_name" :value="item.bind_mobile"/>
        </el-select>
        <el-select v-model="listQueryTable.course" placeholder="课程" clearable class="filter-item" style="width: 260px">
          <el-option v-for="item in orderSelectCourses" :key="item.course_id" :label="item.title" :value="item.course_id"/>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilterUser">{{$t('table.search')}}</el-button>
      <el-button v-waves :loading="downloadUserLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleUserDownload">{{ $t('table.export') }}</el-button>
      </div>
      <template>
        <el-table
          :data="couponHeldusersData"
          height="500px"
          max-height="700px"
          border
          style="width: 100%">
          <el-table-column
            prop="username"
            label="分销名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="title"
            label="课程名称"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="用户手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="state"
            label="激活状态"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.state == 0? '未激活': '已激活'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="绑定时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="expiry_time"
            label="绑定有效时间"
            width="180">
          </el-table-column>

        </el-table>
      </template>
      <el-pagination
        @size-change="handleSizeChangeTable"
        @current-change="handleCurrentChangeTable"
        :current-page="listQueryTable.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQueryTable.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalTable">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
    </span>
    </el-dialog>
    <el-dialog
      title="订单信息"
      :visible.sync="dialogUsersOrderTable"
      width="90%"
      :before-close="handleCloseOrder">
      <div class="filter-container">
        <div>
        <el-input @keyup.enter.native="handleFilterUserOrder" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="listQueryOrder.name">
        </el-input>
        <el-select v-model="listQueryOrder.paid_state" placeholder="订单状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarOrderStateOptions" :key="item.state" :label="item.state_name" :value="item.state"/>
      </el-select>
      <el-select v-model="listQueryOrder.course" placeholder="课程" clearable class="filter-item" style="width: 260px">
        <el-option v-for="item in orderSelectCourses" :key="item.course_id" :label="item.title" :value="item.course_id"/>
      </el-select>
</div>
        <el-date-picker
            v-model="dateSearch"
            type="datetimerange"
            start-placeholder="支付开始日期"
            end-placeholder="支付结束日期"
            :default-time="['12:00:00']"
            style="margin-bottom:10px;vertical-align:middle">
        </el-date-picker>
      
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilterUserOrder">{{$t('table.search')}}</el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      </div><span style="float:right;text-align: right">总额度:{{total_amount}} 元;已支付:{{paid_amount}} 元;未支付:{{total_amount-paid_amount}} 元; 收益:{{earned_amount}} 元</span>
      <template>
        <el-table
          :data="userOrdersData"
          height="500px"
          max-height="700px"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="username"
            label="分销名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="title"
            label="课程名称">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名称"
            width="80">
          </el-table-column>
          <el-table-column
            prop="distributor_rate"
            label="提成率"
            width="70">
          </el-table-column>
          <el-table-column
            prop="paid_amount"
            label="实付"
            width="60">
          </el-table-column>
          <el-table-column
            prop="earned_amount"
            label="提成金额"
            width="80">
          </el-table-column>
          <el-table-column
            prop="state"
            label="订单状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.state==0? '未支付': '已付'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="consume_sn"
            label="订单编号"
            width="200">
          </el-table-column>
          <el-table-column
            prop="paid_time"
            label="支付时间"
            width="100">
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="下单时间"
            width="100">
          </el-table-column>

        </el-table>
      </template>
      <el-pagination
        @size-change="handleSizeChangeOrder"
        @current-change="handleCurrentChangeOrder"
        :current-page="listQueryOrder.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQueryOrder.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalOrders">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUsersOrderTable = false">关闭</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import { fetchDistributes, createDistribute, updateDistribute, fetchDistributorDetail, setDistributeCourse, unSetDistributeCourse, updateDistributeCourse, getDistributorUsers, getDbtorConsumeLogs, uploadQrcodepkg } from '@/api/distribute'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { fetchCat, fetchList } from '@/api/courses'
  import { treeToTree, fmtDate } from '@/utils/helps'
  export default {
    directives: {
      waves
    },
    name: 'distribute',
    components: { Treeselect },
    data() {
      const setDateSearch = () => {
        var now = new Date()
        now.setDate(now.getDate() + 1)
        return [new Date().toLocaleDateString(), now.toLocaleDateString()]
      }
      return {
        total_amount: 0, // 订单总金额
        paid_amount: 0, // 实付金额
        earned_amount: 0, // 收益额度
        distributeName: '',
        downloadCodeLoading: false,
        downloadQrcodeLoading: false,
        downloadUserLoading: false,
        calendarOrderStateOptions: [{ state: '1', state_name: '已付' }, { state: '0', state_name: '未付' }],
        calendarUserStateOptions: [{ state: '1', state_name: '已激活' }, { state: '0', state_name: '未激活' }],
        calendarUserIsNewOptions: [{ isNew: '1', state_name: '新用户' }, { isNew: '0', state_name: '旧用户' }],
        calendarUserbindMobileOptions: [{ bind_mobile: '1', state_name: '已绑' }, { bind_mobile: '0', state_name: '未绑' }],
        downloadLoading: false,
        dialogUsersOrderTable: false,
        userOrdersData: [],
        listQueryOrder: {
          page: 1,
          per_page: 10
        },
        totalOrders: 0,
        dialogNewUsersTable: false,
        couponHeldusersData: [],
        listQueryTable: {
          page: 1,
          per_page: 10
        },
        totalTable: 0,
        rateForm: {
          rate: null // 百分比
        },
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          keyword: ''
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
        dialogCoursesVisible: false, // 设置课程的弹窗
        course_cat_id: null,
        coursesCats: [],
        distributorDetail: {},
        courseSelect: [],
        courses: [],
        checkedCities2: [],
        rateDialogVisible: false, // 弹窗提成
        rules: {
          username: [{ required: true, message: '请输入姓名', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
          bank_name: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
          branch_bank_name: [{ required: true, message: '开户支行', trigger: 'blur' }],
          debit_card: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }]
        },
        rules2: {
          rate: [{ type: 'number', required: true, message: '请填写整数' }]
        },
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        dateSearch: setDateSearch(),
        orderSelectCourses: [],
        authorized_count: 0 // 授权用户
      }
    },
    created() {
      this.getList()
    },
    methods: {
      downLoadImage(bist_id, type) {
        if (type === 2) {
          this.downloadQrcodeLoading = bist_id
        } else {
          this.downloadCodeLoading = bist_id
        }
        // var reg = /^http(s)?:\/\/(.*?)\//
        var domain = process.env.BASE_API
        uploadQrcodepkg({ distributor_id: bist_id, code_type: type }).then(response => {
          if (type === 2) {
            this.downloadQrcodeLoading = false
            window.open(domain + '/downloadzip?zip_path=' + response.data)
          } else {
            this.downloadCodeLoading = false
            window.open(domain + '/downloadzip?zip_path=' + response.data)
          }
        })
      },
      handleSizeChangeOrder(val) {
        this.listQueryOrder.per_page = val
        this.handleShow()
      },
      handleCurrentChangeOrder(val) {
        this.listQueryOrder.page = val
        this.handleShow()
      },
      handleCloseOrder() {
        this.dialogUsersOrderTable = false
      },
      handleOrdersShow(rows) {
        this.dialogUsersOrderTable = true
        if (typeof rows !== 'undefined') {
          this.listQueryOrder.distributor_id = rows.id
          this.distributeName = rows.username
          fetchDistributorDetail({ id: rows.id }).then(response => {
            this.orderSelectCourses = response.data.courses
          })
        }
        // this.listQueryOrder.paid_start_time = fmtDate(new Date())
        // this.listQueryOrder.paid_end_time = fmtDate(new Date())
        getDbtorConsumeLogs(this.listQueryOrder).then(response => {
          this.total_amount = response.data.total_amount // 订单总金额
          this.paid_amount = response.data.paid_amount // 实付金额
          this.earned_amount = response.data.earned_amount // 收益额度
          this.userOrdersData = response.data.data
          this.totalOrders = response.data.page.total
        })
      },
      handleFilterUserOrder() {
        this.listQueryOrder.page = 1
        if (this.dateSearch.length === 2) {
          this.listQueryOrder.paid_start_time = fmtDate(this.dateSearch[0])
          this.listQueryOrder.paid_end_time = fmtDate(this.dateSearch[1])
        }
        getDbtorConsumeLogs(this.listQueryOrder).then(response => {
          this.total_amount = response.data.total_amount // 订单总金额
          this.paid_amount = response.data.paid_amount // 实付金额
          this.earned_amount = response.data.earned_amount // 收益额度
          this.userOrdersData = response.data.data
          this.totalOrders = response.data.page.total
        })
      },
      handleClose() {
        this.listQueryTable.course = ''
        this.listQueryTable.state = ''
        this.listQueryTable.is_new = ''
        this.listQueryTable.bind_mobile = ''
        this.dialogNewUsersTable = false
      },
      handleSizeChangeTable(val) {
        this.listQueryTable.per_page = val
        this.handleShow(1)
      },
      handleCurrentChangeTable(val) {
        this.listQueryTable.page = val
        this.handleShow(1)
      },
      handleShow(rows) {
        this.dialogNewUsersTable = true
        if (rows !== 1) {
          this.listQueryTable.distributor_id = rows.id
          this.distributeName = rows.username
          fetchDistributorDetail({ id: this.listQueryTable.distributor_id }).then(response => {
            this.orderSelectCourses = response.data.courses
          })
        }
        getDistributorUsers(this.listQueryTable).then(response => {
          // console.log(response.data)
          this.couponHeldusersData = response.data
          this.totalTable = response.page.total
        })
        /* countAuthorizedUser(this.listQueryTable).then(response => {
          this.authorized_count = response.data.authorized_count
        })*/
      },
      handleFilterUser() {
        this.listQueryTable.page = 1
        this.listQueryTable.state === '' ? delete this.listQueryTable.state : ''
        this.listQueryTable.course === '' ? delete this.listQueryTable.course : ''
        this.listQueryTable.bind_mobile === '' ? delete this.listQueryTable.bind_mobile : ''
        this.listQueryTable.is_new === '' ? delete this.listQueryTable.is_new : ''
        getDistributorUsers(this.listQueryTable).then(response => {
          this.couponHeldusersData = response.data
          this.totalTable = response.page.total
        })
        /* countAuthorizedUser(this.listQueryTable).then(response => {
          this.authorized_count = response.data.authorized_count
        })*/
      },
      handleUserDownload() {
        this.downloadUserLoading = true
        this.listQueryTable.state === '' ? delete this.listQueryTable.state : ''
        this.listQueryTable.course === '' ? delete this.listQueryTable.course : ''
        this.listQueryTable.bind_mobile === '' ? delete this.listQueryTable.bind_mobile : ''
        this.listQueryTable.is_new === '' ? delete this.listQueryTable.is_new : ''
        this.listQueryTable.is_export = 1
        getDistributorUsers(this.listQueryTable).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['分销名称', '课程名称', '用户名称', '用户手机号', '激活状态', '绑定时间', '有效时间']
            const filterVal = ['username', 'title', 'name', 'mobile', 'state', 'created_at', 'expiry_time']
            const data = this.formatUserJson(filterVal, response.data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '分销商-' + this.distributeName + '用户数据'
            })
            delete this.listQueryTable.is_export
            this.downloadUserLoading = false
          })
        })
      },
      formatUserJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'state') {
            return this.parseUserSatue(v[j])
            // return v[j]
          } else {
            return v[j]
          }
        }))
      },
      parseUserSatue(v) {
        if (v === 1) {
          return '激活'
        } else {
          return '未激活'
        }
      },
      getList() {
        this.listLoading = true
        fetchDistributes(this.listQuery).then(response => {
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
          username: '',
          mobile: '',
          bank_name: '',
          branch_bank_name: '',
          debit_card: ''
        }
      },
      getDistributorDetail(query) {
        fetchDistributorDetail(query).then(response => {
          this.distributorDetail = response.data
          for (var i = 0; i < this.distributorDetail.courses.length; i++) {
            this.distributorDetail.courses[i].course_title_rate = this.distributorDetail.courses[i].title + '(' + this.distributorDetail.courses[i].distributor_rate + ')'
            this.distributorDetail.courses[i].id = this.distributorDetail.courses[i].course_id
          }
          this.courseSelect = this.distributorDetail.courses
        })
      },
      handleCourses(rows) {
        this.dialogCoursesVisible = true

        this.course_cat_id = null
        this.courseSelect = []
        this.courses = []
        // this.temp = Object.assign({}, rows)
        this.getDistributorDetail({ id: rows.id })
        this.getCoursesCats()
      },
      closeCourseTag(tag) {
        var ids = []
        if (this.courses.length > 0) {
          for (var course in this.courses) {
            ids.push(this.courses[course].id)
          }
          var str = ',' + ids.join(',') + ','
          // console.log(str.indexOf(',' + tag.id + ','))
          if (str.indexOf(',' + tag.id + ',') === -1) {
            this.courses.push(tag)
          }
        } else {
          this.courses.push(tag)
        }
        for (var mCert in this.courseSelect) {
          if (tag.id === this.courseSelect[mCert].id) {
            this.courseSelect.splice(mCert, 1)
            unSetDistributeCourse({ id: tag.distribute_course_id }).then(response => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
        if (this.checkedCities2.length > 0) {
          for (var checked in this.checkedCities2) {
            if (tag.id === this.checkedCities2[checked]) {
              this.checkedCities2.splice(checked, 1)
            }
          }
        }
      },
      changeCourseTag(tag) {
        this.rateDialogVisible = true
        this.rateForm.rate = tag.distributor_rate
        this.rateForm.id = tag.id
      },
      courseRate() {
        this.rateDialogVisible = true
        this.rateForm.rate = null
      },
      rateYes() {
        // console.log(this.)
        this.$refs['rateForm'].validate((valid) => {
          var course
          if (valid) {
            var rate = 0
            var delId
            if (this.rateForm.id) {
              delId = this.rateForm.id
              for (course in this.courseSelect) {
                if (this.courseSelect[course].id === this.rateForm.id) {
                  this.courseSelect[course].rate = this.rateForm.rate
                  this.courseSelect[course].distributor_rate = this.rateForm.rate
                  this.courseSelect[course].course_title_rate = this.courseSelect[course].title + ' (' + this.rateForm.rate + '% )'
                  rate = this.rateForm.rate
                  updateDistributeCourse({ id: this.courseSelect[course].distribute_course_id, expiry_day: 1, distributor_rate: rate }).then(response => {
                    this.$notify({
                      title: '成功',
                      message: '设置成功',
                      type: 'success',
                      duration: 2000
                    })
                  })
                }
              }
              this.rateDialogVisible = false
              this.rateForm.rate = null
              this.rateForm.id = null
            } else {
              delId = this.checkedCities2[this.checkedCities2.length - 1]
              for (course in this.courses) {
                if (this.courses[course].id === delId) {
                  var se = this.courses.splice(course, 1)
                  // console.log(se[0])
                  se[0].course_title_rate = se[0].title + ' (' + this.rateForm.rate + '% )'
                  rate = se[0].rate = this.rateForm.rate
                  this.courseSelect.push(se[0])
                  setDistributeCourse({ expiry_day: 7, course_id: delId, distributor_id: this.distributorDetail.id, distributor_rate: rate }).then(response => {
                    this.$notify({
                      title: '成功',
                      message: '设置成功',
                      type: 'success',
                      duration: 2000
                    })
                  })
                }
              }
              // console.log(this.majorSelectCerts)
              this.rateDialogVisible = false
              this.rateForm.rate = null
            }
          }
        })
      },
      rateNo() {
        this.checkedCities2.splice(this.checkedCities2.length - 1, 1)
        // console.log(this.checkedCities1)
        this.rateDialogVisible = false
      },
      setCatValues(value) {
        // this.course_cat_id = value
        if (!value) {
          return false
        }
        fetchList({ cat_id: value }).then(response => {
          // courses = response.data
          var courses = response.data
          var ids = []
          // console.log(this.majorSelectCerts)
          if (this.courseSelect.length > 0) {
            for (var course in this.courseSelect) {
              ids.push(this.courseSelect[course].id)
            }
          }
          var str = ',' + ids.join(',') + ','
          // console.log(courses)
          for (let i = courses.length - 1; i >= 0; i--) {
            // console.log(str + '==' + courses[i].id)
            if (str.indexOf(',' + courses[i].id + ',') !== -1) {
              courses.splice(i, 1)
            }
          }
          // console.log(courses)
          this.courses = courses
        })
      },
      getCoursesCats() {
        fetchCat().then(response => {
          this.coursesCats = treeToTree(response.data)
        })
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
            createDistribute(this.temp).then(() => {
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
            updateDistribute(tempData).then(() => {
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
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDownload() {
        this.downloadLoading = true
        this.listQueryOrder.page = 1
        if (this.dateSearch.length === 2) {
          this.listQueryOrder.paid_start_time = fmtDate(this.dateSearch[0])
          this.listQueryOrder.paid_end_time = fmtDate(this.dateSearch[1])
        }
        this.listQueryOrder.is_export = 1
        getDbtorConsumeLogs(this.listQueryOrder).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['分销名称', '课程名称', '用户名称', '提成率', '实付', '提成金额', '订单状态', '订单编号', '支付时间', '下单时间']
            const filterVal = ['username', 'title', 'name', 'distributor_rate', 'paid_amount', 'earned_amount', 'state', 'consume_sn', 'paid_time', 'created_at']
            const data = this.formatJson(filterVal, response.data.data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.distributeName
            })
            delete this.listQueryOrder.is_export
            this.downloadLoading = false
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'state') {
            return this.parseState(v[j])
            // return v[j]
          } else {
            return v[j]
          }
        }))
      },
      parseState(state) {
        if (state === 1) {
          return '已付款'
        } else if (state === 0) {
          return '未支付'
        } else {
          return '支付失败'
        }
      }
    }
  }
</script>
<style>
  .el-tag{
    margin-bottom: 10px;
    height: 42px;
    margin-left: 10px;
  }
</style>
