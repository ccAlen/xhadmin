<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="优惠卷名称" v-model="listQuery.keyword">
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
      <el-table-column fixed prop="position_name" label="优惠名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.coupon_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="发行数量" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.coupon_number}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="状态" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.state?'启':'禁'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="创建时间" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_size" label="更新时间" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
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
          <el-button @click="handleShow(scope.row)"
                     type="text"
                     size="small">
            明细
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 90%; margin-left:50px;'>
        <el-form-item label="优惠卷名称:" prop="coupon_name" label-width="100px" >
          <el-input v-model="temp.coupon_name"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="课程分类" prop="course_cat_id">
          <treeselect style="width: 400px"
                      name="course_cat_id"
                      :options="coursesCats"
                      :value="temp.course_cat_id"
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
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="有效期类型:">
          <el-radio-group v-model="temp.validity_type" size="medium">
            <el-radio-button label="1">指定天数</el-radio-button>
            <el-radio-button label="2">指定区间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.validity_type == 1" label="生效日期" prop="validityDate" label-width="100px" >
          <el-date-picker
            v-model="validityDate"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item  v-if="temp.validity_type == 1" label="有效天数" prop="in_day" label-width="100px" >
          <el-input v-model="temp.in_day"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.validity_type == 2" style="margin-bottom: 20px;text-align: left" label-width="100px" label="有效范围" prop="validityTime">
          <div class="block">
            <el-date-picker
              v-model="validityTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="投放方式:">
          <el-radio-group v-model="temp.delivery_type" size="medium">
            <el-radio-button label="1">立即投放</el-radio-button>
            <el-radio-button label="2">定时投放</el-radio-button>
            <el-radio-button label="3">自助领取</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.delivery_type == 2" label="投放时间:" prop="deliveryTime" label-width="100px" >
          <el-date-picker
            v-model="deliveryTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="temp.delivery_type == 3" style="margin-bottom: 20px;text-align: left" label-width="100px" label="领取时间" prop="time">
          <div class="block">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="发放数量:" prop="coupon_number" label-width="100px" >
          <el-input v-model.number="temp.coupon_number"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="面额类型:">
          <el-radio-group v-model="temp.value_type" size="medium">
            <el-radio-button label="1">固定</el-radio-button>
            <el-radio-button label="2" v-if="temp.delivery_type == 3">随机</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.value_type == 1" label="面额:" prop="specify_value" label-width="100px" >
          <el-input v-model="temp.specify_value"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.value_type == 2" label="范围:" prop="denominationScope" label-width="100px" >
          <el-slider
            v-model="denominationScope"
            range
            show-stops
            :min="1"
            :max="20">
          </el-slider>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="投放对象:">
          <el-radio-group v-model="temp.delivered_object_type" size="medium">
            <el-radio-button label="0">所有用户</el-radio-button>
            <el-radio-button label="1">推广用户</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.delivered_object_type == 1" style="margin-bottom: 20px;" label-width="100px" label="用户组" prop="delivered_object_id">
          <el-select v-model="temp.delivered_object_id" placeholder="请选择">
            <el-option
              v-for="item in promotions"
              :key="item.id"
              :label="item.promotion_name"
              :value="item.id">
              <span style="float: left">{{ item.promotion_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">({{ item.users_count }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注说明:" prop="rank" label-width="100px" >
          <el-input type="textarea" v-model="temp.description" :rows="10"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="明细"
      :visible.sync="dialogVisibleTable"
      width="90%"
      :before-close="handleClose">
      <template>
        <el-table
          :data="couponHeldusersData"
          height="250"
          border
          style="width: 100%">
          <el-table-column
            prop="user_id"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户昵称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="coupon_value"
            label="优惠券面值">
          </el-table-column>
          <el-table-column
            prop="effective_time"
            label="生效时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="failure_time"
            label="失效时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="cost_time"
            label="使用时间"
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
    <el-button @click="dialogVisibleTable = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisibleTable = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'// 水波纹指令
  import { fetchPromotions } from '@/api/promotion'
  import { validateNumber } from '@/utils/validate'
  import { treeToTree, fmtDate } from '@/utils/helps'
  import { fetchCat } from '@/api/courses'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { fetchCoupons, addCoupon, fetchCouponDetail, updateCoupon, couponHeldusers } from '@/api/coupon'
  export default {
    directives: {
      waves
    },
    name: 'couponList',
    components: { Treeselect },
    data() {
      const isValidityDate = (rule, value, callback) => {
        if (parseInt(this.temp.validity_type) === 1) {
          if (!this.validityDate) {
            callback(new Error('请选择生效日期'))
          } else {
            this.temp.validity_date = fmtDate(this.validityDate)
            callback()
          }
        }
      }
      const isValidityTime = (rule, value, callback) => {
        if (parseInt(this.temp.validity_type) === 2) {
          if (!this.validityTime) {
            callback(new Error('请选择有效范围日期'))
          } else {
            this.temp.validity_start = fmtDate(this.validityTime[0])
            this.temp.validity_end = fmtDate(this.validityTime[1])
            callback()
          }
        }
      }
      const isDeliveryTime = (rule, value, callback) => {
        if (parseInt(this.temp.delivery_type) === 2) {
          if (!this.deliveryTime) {
            callback(new Error('请选择投放时间'))
          } else {
            this.temp.delivery_time = fmtDate(this.deliveryTime)
            callback()
          }
        }
      }
      const isTime = (rule, value, callback) => {
        if (parseInt(this.temp.delivery_type) === 3) {
          if (!this.time) {
            callback(new Error('请选择领取时间'))
          } else {
            this.temp.start_time = fmtDate(this.time[0])
            this.temp.end_time = fmtDate(this.time[1])
            callback()
          }
        }
      }
      const isSpecifyValue = (rule, value, callback) => {
        if (parseInt(this.temp.value_type) === 1) {
          if (!validateNumber(value) || (value && parseInt(value) <= 0)) {
            callback(new Error('请填写大于数值'))
          } else {
            callback()
          }
        }
      }
      return {
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          keyword: ''
        },
        listQueryTable: {
          page: 1,
          per_page: 10,
          id: ''
        },
        total: 0,
        totalTable: 0,
        listLoading: true,
        data: [],
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          coupon_name: [{ required: true, message: '请填写优惠卷名称', trigger: 'change' }],
          validityDate: [{ required: true, trigger: 'change', validator: isValidityDate }],
          validityTime: [{ required: true, trigger: 'change', validator: isValidityTime }],
          deliveryTime: [{ required: true, trigger: 'change', validator: isDeliveryTime }],
          time: [{ required: true, trigger: 'change', validator: isTime }],
          in_day: [{ required: true, message: '请选择有效天数', trigger: 'blur' }],
          coupon_number: [{ required: true, message: '请填写发放数量', trigger: 'blur' }],
          specify_value: [{ required: true, trigger: 'change', validator: isSpecifyValue }],
          delivered_object_id: [{ required: true, message: '请选择赠送用户组', trigger: 'blur' }]
        },
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        validityDate: '', // 生效日期
        validityTime: '', //  生效起始日期
        deliveryTime: '', // 投放时间
        time: '', // 领取时间范围
        denominationScope: [2, 5], // 面额范围,
        promotions: [], // 推广用户组
        coursesCats: [],

        dialogVisibleTable: false,
        couponHeldusersData: []
      }
    },
    created() {
      this.getList()
      this.getPromotions()
      this.getCoursesCats()
    },
    methods: {
      handleClose() {
        this.dialogVisibleTable = false
      },
      handleShow(rows) {
        this.dialogVisibleTable = true
        console.log(rows)
        if (rows) {
          this.listQueryTable.id = rows.id
        }
        couponHeldusers(this.listQueryTable).then(response => {
          this.couponHeldusersData = response.data
          this.totalTable = response.page.total
        })
      },
      getList() {
        this.listLoading = true
        fetchCoupons(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      setCatValues(value) {
        this.temp.course_cat_id = value
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      message(row) {
        this.$message.info(row.name)
      },
      getPromotions() {
        fetchPromotions().then(response => {
          this.promotions = response.data
        })
      },
      getCoursesCats() {
        fetchCat().then(response => {
          this.coursesCats = treeToTree(response.data)
        })
      },
      handleSizeChangeTable(val) {
        this.listQueryTable.per_page = val
        this.handleShow()
      },
      handleSizeChange(val) {
        this.listQuery.per_page = val
        this.getList()
      },
      handleCurrentChangeTable(val) {
        this.listQueryTable.page = val
        this.handleShow()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          coupon_name: '', // 优惠券名称
          course_cat_id: null, // 课程分类id,
          validity_type: 1, // 有效期类型：1指定天数；2指定区间,
          validity_date: null, // 生效日期,
          in_day: null, // 有效天数,
          validity_start: null, // 有效期始,
          validity_end: null, // 有效期止,
          delivery_type: 1, // 发送方式1立即发送；2定时发送；3用户领取,
          delivery_time: null, // 发送时间: null, // 当delivery_type=2,
          start_time: null, // 开始时间',
          end_time: null, // 结束时间,
          coupon_number: null, // 优惠券数量,
          value_type: 1, //  面额类型：1固定，2随机',
          specify_value: null, // 固定面额',
          min_value: null, //  最小面额',
          max_value: null, // 最大面额',
          is_overlay: 0, //  是否可叠加使用：1是0非',
          state: null, // '状态：1是0非'
          description: null, //  活动说明',
          delivered_object_type: 0,
          delivered_object_id: null
        }
        this.validityDate = '' // 生效日期
        this.validityTime = '' //  生效起始日期
        this.deliveryTime = '' // 投放时间
        this.time = '' // 领取时间范围
        this.denominationScope = [2, 5] // 面额范围
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      delNull() {
        for (var t in this.temp) {
          if (this.temp[t] === null) {
            delete this.temp[t]
          }
        }
      },
      createData() {
        // console.log(this.denominationScope)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.max_value = this.denominationScope[1]
            this.temp.min_value = this.denominationScope[0]
            this.temp.state === false ? this.temp.state = 0 : this.temp.state = 1
            if (!this.temp.in_day) {
              delete this.temp.in_day
            }
            // console.log(this.temp)
            this.delNull()
            addCoupon(this.temp).then(() => {
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
            if (!this.temp.in_day) {
              delete this.temp.in_day
            }
            this.delNull()
            const tempData = Object.assign({}, this.temp)
            updateCoupon(tempData).then(() => {
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
        fetchCouponDetail({ id: row.id }).then(response => {
          this.temp = response.data
          if (this.temp.value_type === 2) {
            this.denominationScope = []
            this.denominationScope.push(this.temp.min_value)
            this.denominationScope.push(this.temp.max_value)
          }
          this.time = []
          if (this.temp.delivery_type === 3) {
            this.time.push(new Date(this.temp.start_time))
            this.time.push(new Date(this.temp.end_time))
          }
          this.deliveryTime = null
          if (this.temp.delivery_type === 2) {
            this.deliveryTime = new Date(this.temp.delivery_time)
          }
          this.validityTime = []
          if (this.temp.validity_type === 2) {
            this.validityTime.push(this.temp.validity_start)
            this.validityTime.push(this.temp.validity_end)
          }
          this.validityDate = null
          if (this.temp.validity_type === 1) {
            this.validityDate = new Date(this.temp.validity_date)
          }
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
