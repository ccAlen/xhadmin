<template>
  <div class="app-container" v-loading.body="listLoading" :element-loading-text="loadingTextCode">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="推广名称" v-model="listQuery.promotion_name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :data="data"  style="width: 100%">
      <el-table-column fixed prop="date" label="Id" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="position_name" label="推广名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.promotion_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="code_image" label="普通码" label-width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="downLoadImage(scope.row.code_image)" v-if="scope.row.code_image">下载</el-button >
        </template>
      </el-table-column>
      <el-table-column fixed prop="code_image" label="小程序码" label-width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="downLoadImage(scope.row.mina_code_img)" v-if="scope.row.mina_code_img">下载</el-button >
        </template>
      </el-table-column>
      <el-table-column fixed prop="target_page" label="着落页" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.target_page}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="target_number" label="目标数量" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.target_number}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="sweep_number" label="已扫数量" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.sweep_number}}</span>
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
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)"
                     type="text"
                     size="small">
            编辑
          </el-button>
          <el-button @click="getCodeImage(scope.row)"
                     type="text"
                     size="small">
            生成二维码
          </el-button>
          <el-button @click="handleShow(scope.row)"
                     type="text"
                     size="small">
            查看明细
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
        <el-form-item label="推广名称:" prop="promotion_name" label-width="100px" >
          <el-input v-model="temp.promotion_name"></el-input>
        </el-form-item>
        <el-form-item label="预计数量:" prop="target_number" label-width="100px" >
          <el-input v-model.number="temp.target_number"></el-input>
        </el-form-item>
        <el-form-item label="着落页:" prop="target_page" label-width="100px" >
          <el-input v-model="temp.target_page"></el-input><label>/ 默认首页 </label>
        </el-form-item>
        <!--<el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>-->
        <el-form-item label="备注:" prop="rank" label-width="100px" >
          <el-input type="textarea" v-model="temp.description" :rows="6"></el-input>
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
       <div class="filter-container">
        <el-input @keyup.enter.native="handleFilterUser" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="listQueryTable.keyword">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilterUser">{{$t('table.search')}}</el-button>
      </div>
      <template>
        <el-table
          :data="couponHeldusersData"
          height="550"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户昵称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别">
            <template slot-scope="scope">
              <span>{{scope.row.sex == 1? '男': scope.row.sex ==2 ? '女' : '未知'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_login_time"
            label="最后登陆"
            width="180">
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="注册时间"
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
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import { fetchPromotions, createPromotion, updatePromotion, createCodeImage, getPromotionEffect } from '@/api/promotion'
  import waves from '@/directive/waves'// 水波纹指令
  export default {
    directives: {
      waves
    },
    name: 'addPosition',
    data() {
      return {
        dialogVisibleTable: false,
        loadingTextCode: '',
        expandAll: false,
        listQuery: {
          page: 1,
          per_page: 10,
          promotion_name: ''
        },
        listQueryTable: {
          page: 1,
          per_page: 10,
          keyword: ''
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
          promotion_name: [{ required: true, message: '请填写推广名称', trigger: 'change' }],
          target_number: [{ type: 'number', required: true, message: '预计数量，请填写整数', trigger: 'change' }],
          target_page: [{ required: true, message: '请填写着落页', trigger: 'blur' }]
        },
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false,
        couponHeldusersData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleClose() {
        this.dialogVisibleTable = false
      },
      handleSizeChangeTable(val) {
        this.listQueryTable.per_page = val
        this.handleShow()
      },
      handleCurrentChangeTable(val) {
        this.listQueryTable.page = val
        this.handleShow()
      },
      handleShow(rows) {
        this.dialogVisibleTable = true
        console.log(rows)
        if (rows) {
          this.listQueryTable.id = rows.id
        }
        getPromotionEffect(this.listQueryTable).then(response => {
          this.couponHeldusersData = response.data
          this.totalTable = response.page.total
        })
      },
      handleFilterUser() {
        this.listQueryTable.page = 1
        getPromotionEffect(this.listQueryTable).then(response => {
          this.couponHeldusersData = response.data
          this.totalTable = response.page.total
        })
      },
      getList() {
        this.listLoading = true
        fetchPromotions(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getCodeImage(row) {
        this.loadingTextCode = '二维码创建中...'
        this.listLoading = true
        // 生成普通二维码
        createCodeImage({ id: row.id, is_qrcode: 1 }).then(response => {
          console.log(response.data)
          this.getCodeMini(row)
          row.code_image = response.data
          this.loadingTextCode = '二维码创建成功！'
          this.listLoading = false
        }).catch(() => {
          this.loadingTextCode = '二维码创建失败！'
          var _this = this
          setTimeout(function() {
            _this.listLoading = false
          }, 1000)
        })
      },
      getCodeMini(row) {
        // 生成小程序码
        createCodeImage({ id: row.id, is_qrcode: 0 }).then(response => {
          row.mina_code_img = response.data
        }).catch(() => {
        })
      },
      downLoadImage(url) {
        // downLoadImage('https://www.baidu.com/img/bd_logo1.png')
        if (url.search('http://') !== -1 || url.search('https://') !== -1) {
          window.open(url)
        } else {
          var reg = /^http(s)?:\/\/(.*?)\//
          window.open(reg.exec(process.env.BASE_API)[0] + '/' + url)
        }
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
          id: null,
          promotion_name: '', // 推广名称
          target_number: null, // 预计数量
          target_page: '/', // 着落页
          description: '', // 备注简要
          state: true,
          mina_code_img: null
        }
        this.listQueryTable.keyword = ''
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
            var tempData = Object.assign({}, this.temp)
            this.temp.state === false ? tempData.state = 0 : tempData.state = 1
            createPromotion(tempData).then(() => {
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
            this.temp.state === false ? tempData.state = 0 : tempData.state = 1
            updatePromotion(tempData).then(() => {
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
        this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
