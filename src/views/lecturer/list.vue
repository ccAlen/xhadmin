<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="暂时没搜索功能" v-model="listQuery.position_name">
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
      <el-table-column fixed prop="name" label="昵称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="real_name" label="真实姓名" label-width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.real_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="mobile" label="手机号码" label-width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="lecturer_title" label="头衔" label-width="250px">
        <template slot-scope="scope">
          <span>{{scope.row.lecturer_title}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="avatar" label="头像" label-width="150px">
        <template slot-scope="scope">
          <span><img :src="scope.row.avatar" style="width: 50px"/></span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="sex" label="姓别" label-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.sex == 1 ? '男' : scope.row.sex ? '女' : '未知'}}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 90%; margin-left:50px;'>
        <el-form-item label="头像:" prop="avatar" label-width="100px" >
          <pan-thumb :image="temp.avatar"></pan-thumb>

          <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">Change avatar
          </el-button>

          <image-cropper :width="300" :height="300" :url="url" @close='close' @crop-upload-success="cropSuccess" langType="en" field="image"
                         :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname" label-width="100px" >
          <el-input v-model="temp.nickname">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="real_name" label-width="100px" >
          <el-input v-model="temp.real_name">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile" label-width="100px" >
          <el-input v-model="temp.mobile">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="开户银行:" prop="bank_name" label-width="100px" >
          <el-input v-model="temp.bank_name">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="开户支行:" prop="bank_sub_branch" label-width="100px" >
          <el-input v-model="temp.bank_sub_branch">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="银行卡号:" prop="debit_card" label-width="100px" >
          <el-input v-model="temp.debit_card">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="支付宝:" prop="alipay" label-width="100px" >
          <el-input v-model="temp.alipay">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="分成比例:" prop="royalty_rate" label-width="100px" >
          <el-input v-model="temp.royalty_rate" placeholder="0.7">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
          <label>例：0.7，代表讲师得销售额的70%</label>
        </el-form-item>
        <el-form-item label="头衔:" prop="title" label-width="100px" >
          <el-input v-model="temp.title">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" label-width="100px" >
          <el-input v-model="temp.password">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="password_confirmation" label-width="100px" >
          <el-input v-model="temp.password_confirmation">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex" label-width="100px" >
          <el-radio-group v-model="temp.sex" size="small">
            <el-radio border label="1">男</el-radio>
            <el-radio border label="2">女</el-radio>
            <el-radio border label="0">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:" prop="state">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="简介:" prop="description" label-width="100px" >
          <el-input type="textarea" v-model="temp.description"></el-input>
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
  import { fetchLecturerList, createLecturer, fetchLecturerDetail, addLecturer } from '@/api/lecturer'
  import waves from '@/directive/waves'// 水波纹指令
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import { validatSeparateInto } from '@/utils/validate'
  export default {
    directives: {
      waves
    },
    name: 'addPosition',
    components: { ImageCropper, PanThumb },
    data() {
      const separateInto = (rule, value, callback) => {
        if (!validatSeparateInto(value) || value > 1) {
          callback(new Error('请输入合法数值'))
        } else {
          callback()
        }
      }
      return {
        url: '/uploadImage',
        imagecropperShow: false,
        imagecropperKey: 0,

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
          nickname: [{ required: true, message: '请填写昵称', trigger: 'change' }],
          real_name: [{ required: true, message: '请填写真实姓名', trigger: 'change' }],
          bank_name: [{ required: true, message: '请填写开户银行', trigger: 'blur' }],
          bank_sub_branch: [{ required: true, message: '请填写开户支行', trigger: 'blur' }],
          debit_card: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }],
          alipay: [{ required: true, message: '请填写银支付宝', trigger: 'blur' }],
          royalty_rate: [{ required: true, message: '请填写分成', validator: separateInto }],
          title: [{ required: true, message: '请填写头衔', trigger: 'blur' }],
          birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
          mobile: [{ required: true, message: '请选择填写手机号码', trigger: 'blur' }]
          /* password: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }],
          password_confirmation: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }]*/
        },
        temp: {},
        statusOptions: ['published', 'draft', 'deleted'],
        dialogPvVisible: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      cropSuccess(resData) {
        console.log(resData)
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.temp.avatar = resData.url
      },
      close() {
        this.imagecropperShow = false
      },
      getList() {
        this.listLoading = true
        fetchLecturerList(this.listQuery).then(response => {
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
          nickname: '',
          real_name: '',
          bank_name: '',
          bank_sub_branch: '',
          debit_card: '',
          alipay: '',
          royalty_rate: '',
          mobile: '',
          title: '',
          birthday: '',
          password: '',
          password_confirmation: '',
          sex: '1',
          state: true,
          avatar: 'https://xhuser.oss-cn-shenzhen.aliyuncs.com/c11d4de4caae4294313307a4148be892.png',
          description: ''
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
        console.log(this.temp)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.state === false ? this.temp.state = 0 : this.temp.state = 1
            createLecturer(this.temp).then(() => {
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
            this.temp.state === false ? this.temp.state = 0 : this.temp.state = 1
            const tempData = Object.assign({}, this.temp)
            addLecturer(tempData).then(() => {
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
        this.dialogStatus = 'update'
        fetchLecturerDetail({ id: row.id }).then(response => {
          this.temp = response.data
          this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
          this.temp.sex = this.temp.sex + ''
          this.temp.alipay = response.data.lecturer.alipay
          this.temp.bank_name = response.data.lecturer.bank_name
          this.temp.bank_sub_branch = response.data.lecturer.bank_sub_branch
          this.temp.debit_card = response.data.lecturer.debit_card
          this.temp.description = response.data.lecturer.description
          this.temp.royalty_rate = response.data.lecturer.royalty_rate
          this.temp.title = response.data.lecturer.title
          this.temp.nickname = this.temp.name
          this.temp.user_id = this.temp.id
          delete this.temp.lecturer
          console.log(this.temp)
        })
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>
