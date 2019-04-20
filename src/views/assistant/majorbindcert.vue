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
      <el-table-column fixed prop="major_name" label="专业名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.major_name}}</span>
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
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="专业分类" prop="cat_id">
          <treeselect style="width: 400px"
                      name="tid"
                      :options="majorCats"
                      :value="temp.cat_id"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setMajorCatValue">
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="专业名称" prop="major_id">
        <el-select v-model="temp.major_id" placeholder="请选择" style="width: 400px">
          <el-option
            v-for="item in majors"
            :key="item.id"
            :label="item.major_name"
            :value="item.id"
            :disabled="item.isDisabled">
          </el-option>
        </el-select>
        </el-form-item>

          <el-form-item style="margin-bottom: 20px;" label-width="100px" label="证书类型" prop="cert_ats_id">
          <treeselect style="width: 400px"
                      name="cert_ats_id"
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
            v-for="tag in majorSelectCerts"
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
            <el-checkbox v-for="cert in certs" :label="cert.id" :key="cert.id" @change="testt">{{cert.cert_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="职业类型" prop="prof_id">
          <treeselect style="width: 400px"
                      name="prof_id"
                      :options="profCats"
                      v-model="profCatId"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setProfCatValues">
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
            :type="tag.prof_name_rate"
            @close="closeProfTag(tag)"
          >
            <el-button type="text" @click="changeProfTag(tag)">{{tag.prof_name_rate}}</el-button>
          </el-tag>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" prop="prof_id">
          <el-checkbox-group v-model="checkedCities2">
            <el-checkbox v-for="prof in profs" :label="prof.id" :key="prof.id" @change="profRate">{{prof.prof_name}}</el-checkbox>
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
    <el-dialog
      title="提示"
      :visible.sync="profDialogVisible"
      width="30%"
      center
      :before-close="profNo">
      <el-form :rules="rules2" ref="profForm" :model="profForm">
        <el-form-item  prop="rate" label="百分比">
          <el-input v-model.number="profForm.rate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="profNo">取 消</el-button>
      <el-button type="primary" @click="profYes">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchBinds, bindCertsUpdate, fetchBindDetail } from '@/api/majorbindcert'
  import { fetchMajors, fetchMajorCats } from '@/api/major'
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
    name: 'majorList',
    components: { Treeselect, nEditor },
    data() {
      return {
        rateForm: {
          rate: null // 百分比
        },
        profForm: {
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
        majorSelectCerts: [],
        checkboxTrue: [],
        profSelect: [],
        profs: [],
        checkedCities2: [],
        profDialogVisible: false,
        allMajors: [],
        certCatId: null,
        profCatId: null
      }
    },
    created() {
      this.getList()
      fetchBinds().then(response => {
        this.allMajors = response.data
      })
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
      testt(val) {
        // console.log(this.checkedCities1)
        this.centerDialogVisible = true
        this.rateForm.rate = null
        // console.log(this.certs)
        // console.log(this.checkedCities1)
        // console.log(this.checkedCities1[this.checkedCities1.length - 1])
      },
      rateYes() {
        // console.log(this.)
        this.$refs['rateForm'].validate((valid) => {
          if (valid) {
            if (this.rateForm.id) {
              console.log(this.majorSelectCerts)
              for (var prof in this.majorSelectCerts) {
                if (this.majorSelectCerts[prof].id === this.rateForm.id) {
                  this.majorSelectCerts[prof].rate = this.rateForm.rate
                  this.majorSelectCerts[prof].cert_name_rate = this.majorSelectCerts[prof].cert_name + ' (' + this.rateForm.rate + '% )'
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
                  this.majorSelectCerts.push(se[0])
                }
              }
              // console.log(this.majorSelectCerts)
              this.centerDialogVisible = false
              this.rateForm.rate = null
            }
          }
        })
        console.log(this.majorSelectCerts)
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
        for (var mCert in this.majorSelectCerts) {
          if (tag.id === this.majorSelectCerts[mCert].id) {
            this.majorSelectCerts.splice(mCert, 1)
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
      changeProfTag(tag) {
        // console.log(tag)
        this.profDialogVisible = true
        this.profForm.rate = tag.rate
        this.profForm.id = tag.id
      },
      profRate() {
        this.profDialogVisible = true
        this.profForm.rate = null
      },
      profYes() {
        // console.log(this.)
        this.$refs['profForm'].validate((valid) => {
          if (valid) {
            if (this.profForm.id) {
              console.log(this.profSelect)
              for (var prof in this.profSelect) {
                if (this.profSelect[prof].id === this.profForm.id) {
                  this.profSelect[prof].rate = this.profForm.rate
                  this.profSelect[prof].prof_name_rate = this.profSelect[prof].prof_name + ' (' + this.profForm.rate + '% )'
                }
              }
              this.profDialogVisible = false
              this.profForm.rate = null
              this.profForm.id = null
            } else {
              var delId = this.checkedCities2[this.checkedCities2.length - 1]
              for (var cert in this.profs) {
                console.log(cert)
                if (this.profs[cert].id === delId) {
                  var se = this.profs.splice(cert, 1)
                  // console.log(se[0])
                  se[0].prof_name_rate = se[0].prof_name + ' (' + this.profForm.rate + '% )'
                  se[0].rate = this.profForm.rate
                  this.profSelect.push(se[0])
                }
              }
              // console.log(this.majorSelectCerts)
              this.profDialogVisible = false
              this.profForm.rate = null
            }
          }
        })
        console.log(this.majorSelectCerts)
      },
      profNo() {
        this.profDialogVisible = false
        console.log(12)
        this.checkedCities2.splice(this.checkedCities2.length - 1, 1)
      },
      closeProfTag(tag) {
        console.log(tag)
        var ids = []
        var isCatId = false
        if (this.profs.length > 0) {
          for (var cert in this.profs) {
            // console.log(tag.cat_id + '===' + this.certs[cert].cat_id)
            if (tag.cat_id === this.profs[cert].cat_id) {
              isCatId = true
            }
            ids.push(this.profs[cert].id)
          }
          var str = ',' + ids.join(',') + ','
          // console.log(str.indexOf(',' + tag.id + ','))
          if (isCatId && str.indexOf(',' + tag.id + ',') === -1) {
            this.profs.push(tag)
          }
        } else {
          this.profs.push(tag)
        }
        console.log(1212)
        for (var mCert in this.profSelect) {
          if (tag.id === this.profSelect[mCert].id) {
            this.profSelect.splice(mCert, 1)
          }
        }
        console.log(this.checkedCities2)
        if (this.checkedCities2.length > 0) {
          for (var checked in this.checkedCities2) {
            console.log(tag.id + '===' + this.checkedCities2[checked])
            if (tag.id === this.checkedCities2[checked]) {
              this.checkedCities2.splice(checked, 1)
            }
          }
        }
      },
      getList() {
        this.listLoading = true
        fetchBinds(this.listQuery).then(response => {
          this.data = response.data
          this.total = response.page.total
          this.listLoading = false
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
          major_id: null,
          major_name: '',
          major_alias: '',
          rank: 50,
          content: ``,
          state: true,
          cat_id: null
        }
        this.majorSelectCerts = []
        this.profSelect = []
        this.profs = []
        this.certs = []
        this.majors = []
        this.certCatId = null
        this.profCatId = null
        this.checkedCities2 = []
        this.checkedCities1 = []
      },
      setMajorDisabled() {
        this.allMajors
      },
      getMajors(val) {
        fetchMajors({ tid: val }).then(response => {
          console.log(1)
          var allm = []
          var str = ''
          this.majors = response.data // treeToTree(response.data)
          for (var i = 0; i < this.allMajors.length; i++) {
            allm.push(this.allMajors[i].id)
            str += ',' + this.allMajors[i].id + ','
          }

          for (i = 0; i < this.majors.length; i++) {
            console.log(str + '==,' + this.majors[i].id + ',')
            if (str.indexOf(',' + this.majors[i].id + ',') !== -1) {
              this.majors[i].isDisabled = true
            }
          }
          console.log(this.majors)
        })
      },
      getMajorCat() {
        fetchMajorCats().then(response => {
          this.majorCats = treeToTree(response.data)
        })
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
      setMajorCatValue(val) {
        if (this.temp.tid !== val) {
          this.temp.major_id = null
        }
        if (typeof val !== 'undefined') {
          this.getMajors(val)
        }
      },
      setProfCatValues(val) {
        if (typeof val !== 'undefined') {
          fetchProfs({ tid: val }).then(response => {
            // this.certCats = response.data
            var prof = response.data
            var ids = []
            // console.log(this.majorSelectCerts)
            if (this.profSelect.length > 0) {
              for (var mCert in this.profSelect) {
                ids.push(this.profSelect[mCert].id)
              }
            }
            var str = ',' + ids.join(',') + ','
            console.log(prof)
            for (let i = prof.length - 1; i >= 0; i--) {
              console.log(str + '==' + prof[i].id)
              if (str.indexOf(',' + prof[i].id + ',') !== -1) {
                prof.splice(i, 1)
              }
            }
            console.log(prof)
            this.profs = prof
          })
        }
      },
      setCertCatValue(val) {
        if (typeof val !== 'undefined') {
          fetchCerts({ cat_id: val, state: 1 }).then(response => {
            // this.certCats = response.data
            var certs = response.data
            var ids = []
            // console.log(this.majorSelectCerts)
            if (this.majorSelectCerts.length > 0) {
              for (var mCert in this.majorSelectCerts) {
                ids.push(this.majorSelectCerts[mCert].id)
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
        this.getMajorCat()
        this.getCertCat()
        this.getProfCat()
        this.certCatId = null
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      beforePush() {
        if (this.majorSelectCerts.length > 0) {
          this.temp.cert_ids = []
          for (var majorCert in this.majorSelectCerts) {
            this.temp.cert_ids.push({ id: this.majorSelectCerts[majorCert].id, per: this.majorSelectCerts[majorCert].rate })
          }
        }
        if (this.profSelect.length > 0) {
          this.temp.prof_ids = []
          for (var profCert in this.profSelect) {
            this.temp.prof_ids.push({ id: this.profSelect[profCert].id, per: this.profSelect[profCert].rate })
          }
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.beforePush()
            console.log(this.temp)
            console.log(this.majorSelectCerts)
            console.log(this.profSelectCerts)
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
        this.getMajorCat()
        this.getCertCat()
        this.getProfCat()
        this.certCatId = null
        this.profCatId = null
        // this.temp = Object.assign({}, row) // copy obj
        fetchBindDetail({ major_id: row.id }).then(response => {
          this.temp = response.data
          //  console.log(this.temp.certs)
          for (var i = 0; i < this.temp.certs.length; i++) {
            this.temp.certs[i].cert_name_rate = this.temp.certs[i].cert_name + '(' + this.temp.certs[i].rate + ')'
          }
          // console.log(this.temp.certs)
          this.majorSelectCerts = this.temp.certs
          for (i = 0; i < this.temp.professions.length; i++) {
            this.temp.professions[i].prof_name_rate = this.temp.professions[i].prof_name + '(' + this.temp.professions[i].rate + ')'
          }
          this.profSelect = this.temp.professions
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
