<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="专业名称" v-model="listQuery.major_name">
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
      <el-table-column fixed prop="prof_name" label="职业名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.prof_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="绑定时间" width="160">
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
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="职业分类" prop="cat_id">
          <treeselect style="width: 400px"
                      name=""
                      :options="profCats"
                      :value="temp.cat_id"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setProfCatValues">
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="职业名称" prop="profession_id">
          <el-select v-model="temp.profession_id" placeholder="请选择" style="width: 400px">
            <el-option
              v-for="item in profs"
              :key="item.id"
              :label="item.prof_name"
              :value="item.id"
              :disabled="item.isDisabled">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="证书类型" prop="">
          <treeselect style="width: 400px"
                      name="tid"
                      :options="certCats"
                      v-model="certCatId"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setCertCatValue">
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" prop="prof_id">
          <el-tag
            v-for="tag in profSelect"
            closable
            :key="tag.id"
            :type="tag.cert_name_rate"
            @close="closeTag(tag)"
          >
            <el-button type="text" @click="changeTag(tag)">{{tag.cert_name_rate}}</el-button>
          </el-tag>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" prop="prof_id">
          <el-checkbox-group v-model="checkedCities1">
            <el-checkbox v-for="cert in certs" :label="cert.id" :key="cert.id" @change="profRate">{{cert.cert_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :before-close="rateNo"
    >
      <el-form :rules="rules2" ref="rateForm" :model="rateForm">
        <el-form-item  prop="rate" label="百分比">
          <el-input v-model.number="rateForm.rate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="rateNo">取 消</el-button>
      <el-button type="primary" @click="rateYes">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchBinds, bindCertsUpdate, fetchBindDetail } from '@/api/profbindcert'
  import { fetchCerts, fetchCertCats } from '@/api/cert'
  import { fetchProfCats, fetchProfs } from '@/api/professions'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree } from '@/utils/helps'
  import nEditor from '@/components/Neditor/index'
  const cityOptions = ['上海', '北京', '广州', '深圳']
  export default {
    directives: {
      waves
    },
    name: 'profList',
    components: { Treeselect, nEditor },
    data() {
      return {
        rateForm: {
          rate: null // 百分比
        },
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger', aa: '' }
        ],
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
          major_name: [{ required: true, message: '请填写职业名称', trigger: 'change' }],
          tid: [{ required: true, message: '请选择分类', trigger: 'change' }],
          rank: [{ required: true, message: 'rank is required', trigger: 'change' }]
        },
        rules2: {
          rate: [{ type: 'number', required: true, message: '请填写整数' }]
        },
        temp: {},
        dialogPvVisible: false,
        majorCats: [],
        certCats: [],
        profCats: [],
        majors: [],
        certs: [],
        checkedCities1: [],
        cities: cityOptions,
        centerDialogVisible: false,
        checkboxTrue: [],
        profSelect: [],
        profs: [],
        allProfs: [],
        certCatId: null
      }
    },
    created() {
      this.getList()

      /* fetchCertCats().then(response => {
        this.options = treeToTree(response.data)
      })*/
    },
    computed: {
      contents() {
        return this.$route.fullPath + Math.random()
      }
    },
    methods: {
      profRate() {
        this.centerDialogVisible = true
      },
      rateYes() {
        // console.log(this.)
        this.$refs['rateForm'].validate((valid) => {
          if (valid) {
            if (this.rateForm.id) {
              console.log(this.profSelect)
              for (var prof in this.profSelect) {
                if (this.profSelect[prof].id === this.rateForm.id) {
                  this.profSelect[prof].rate = this.rateForm.rate
                  this.profSelect[prof].cert_name_rate = this.profSelect[prof].cert_name + ' (' + this.rateForm.rate + '% )'
                }
              }
              this.centerDialogVisible = false
              this.rateForm.rate = null
              this.rateForm.id = null
            } else {
              var delId = this.checkedCities1[this.checkedCities1.length - 1]
              for (var cert in this.certs) {
                console.log(cert)
                if (this.certs[cert].id === delId) {
                  var se = this.certs.splice(cert, 1)
                  // console.log(se[0])
                  se[0].cert_name_rate = se[0].cert_name + ' (' + this.rateForm.rate + '% )'
                  se[0].rate = this.rateForm.rate
                  this.profSelect.push(se[0])
                }
              }
              // console.log(this.profSelect)
              this.centerDialogVisible = false
              this.rateForm.rate = null
            }
          }
        })
        console.log(this.profSelect)
      },
      rateNo() {
        this.checkedCities1.splice(this.checkedCities1.length - 1, 1)
        console.log(this.checkedCities1)
        this.centerDialogVisible = false
      },
      closeTag(tag) {
        console.log(tag)
        var ids = []
        var isCatId = false
        if (this.certs.length > 0) {
          for (var cert in this.certs) {
            // console.log(tag.cat_id + '===' + this.certs[cert].cat_id)
            if (tag.cat_id === this.certs[cert].cat_id) {
              isCatId = true
            }
            ids.push(this.certs[cert].id)
          }
          var str = ',' + ids.join(',') + ','
          // console.log(str.indexOf(',' + tag.id + ','))
          if (isCatId && str.indexOf(',' + tag.id + ',') === -1) {
            this.certs.push(tag)
          }
        } else {
          this.certs.push(tag)
        }
        for (var mCert in this.profSelect) {
          if (tag.id === this.profSelect[mCert].id) {
            this.profSelect.splice(mCert, 1)
          }
        }
        console.log(this.checkedCities1)
        if (this.checkedCities1.length > 0) {
          for (var checked in this.checkedCities1) {
            console.log(tag.id + '===' + this.checkedCities1[checked])
            if (tag.id === this.checkedCities1[checked]) {
              this.checkedCities1.splice(checked, 1)
            }
          }
        }
      },
      changeTag(tag) {
        console.log(tag)
        this.centerDialogVisible = true
        this.rateForm.rate = tag.rate
        this.rateForm.id = tag.id
      },
      getList() {
        this.listLoading = true
        fetchBinds(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
        })
        fetchBinds().then(response => {
          this.allProfs = response.data
        })
      },
      setCatValues(value) {
        this.temp.cat_id = value
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
          profession_id: null,
          major_name: '',
          major_alias: '',
          rank: 50,
          content: ``,
          state: true,
          cat_id: null,
          tid: null,
          cert_id: null
        }
        this.profSelect = []
        this.profs = []
        this.certs = []
        this.majors = []
        this.certCatId = null
        this.checkedCities1 = []
      },
      getCertCat() {
        fetchCertCats().then(response => {
          this.certCats = treeToTree(response.data)
        })
      },
      getProfCat() {
        fetchProfCats().then(response => {
          this.profCats = treeToTree(response.data)
        })
      },
      setProfCatValues(val) {
        if (typeof val !== 'undefined') {
          fetchProfs({ tid: val }).then(response => {
            // this.certCats = response.data
            var prof = response.data
            var ids = []
            // console.log(this.profSelect)
            if (this.profSelect.length > 0) {
              for (var mCert in this.profSelect) {
                ids.push(this.profSelect[mCert].id)
              }
            }
            var str = ',' + ids.join(',') + ','
            for (let i = prof.length - 1; i >= 0; i--) {
              console.log(str + '==' + prof[i].id)
              if (str.indexOf(',' + prof[i].id + ',') !== -1) {
                prof.splice(i, 1)
              }
            }
            this.profs = prof
            for (var i = 0; i < this.allProfs.length; i++) {
              str += ',' + this.allProfs[i].id + ','
            }
            for (i = 0; i < this.profs.length; i++) {
              if (str.indexOf(',' + this.profs[i].id + ',') !== -1) {
                console.log(str + '==,' + this.profs[i].id + ',')
                this.profs[i].isDisabled = true
              }
            }
          })
        }
      },
      setCertCatValue(val) {
        if (typeof val !== 'undefined') {
          fetchCerts({ cat_id: val, state: 1 }).then(response => {
            // this.certCats = response.data
            var certs = response.data
            var ids = []
            // console.log(this.profSelect)
            if (this.profSelect.length > 0) {
              for (var mCert in this.profSelect) {
                ids.push(this.profSelect[mCert].id)
              }
            }
            var str = ',' + ids.join(',') + ','
            console.log(certs)
            for (let i = certs.length - 1; i >= 0; i--) {
              console.log(str + '==' + certs[i].id)
              if (str.indexOf(',' + certs[i].id + ',') !== -1) {
                certs.splice(i, 1)
              }
            }
            console.log(certs)
            this.certs = certs
          })
        }
      },
      handleCreate() {
        this.resetTemp()
        this.getCertCat()
        this.getProfCat()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      beforePush() {
        if (this.profSelect.length > 0) {
          this.temp.cert_ids = []
          for (var profCert in this.profSelect) {
            this.temp.cert_ids.push({ id: this.profSelect[profCert].id, per: this.profSelect[profCert].rate })
          }
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.beforePush()
            const tempData = Object.assign({}, this.temp)
            bindCertsUpdate(tempData).then(() => {
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
            this.beforePush()
            const tempData = Object.assign({}, this.temp)
            bindCertsUpdate(tempData).then(() => {
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
        this.getCertCat()
        this.getProfCat()
        // this.temp = Object.assign({}, row) // copy obj
        fetchBindDetail({ profession_id: row.id }).then(response => {
          this.temp = response.data
          this.temp.profession_id = row.id
          //  console.log(this.temp.certs)
          for (var i = 0; i < this.temp.certs.length; i++) {
            this.temp.certs[i].cert_name_rate = this.temp.certs[i].cert_name + '(' + this.temp.certs[i].rate + ')'
          }
          // console.log(this.temp.certs)
          this.profSelect = this.temp.certs
          this.temp.major_id = this.temp.id
          this.temp.cat_id = this.temp.tid
          // console.log(this.profSelect)
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
<style>
  .el-tag{
    margin-bottom: 10px;
    height: 42px;
    margin-left: 10px;
  }
</style>
