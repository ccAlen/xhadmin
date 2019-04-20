<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="证书名称" v-model="listQuery.cert_name">
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
      <el-table-column fixed prop="cert_name" label="证书名称" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.cert_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cert_alias" label="证书别名" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.cert_alias}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="cat_name" label="证书分类" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.cert_cate.cat_name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="rank" label="排序" label-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="更新时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="is_hot" label="热门" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.is_hot ? '是': '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="state" label="状态" label-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.state ? '开': '禁'}}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 90%; margin-left:50px;'>
        <el-form-item label="证书名称" prop="cert_name" label-width="100px" >
          <el-input v-model="temp.cert_name"></el-input>
        </el-form-item>
        <el-form-item label="证书别名" prop="cert_alias" label-width="100px" >
          <el-input v-model="temp.cert_alias"  ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="分类" prop="cat_id">
          <treeselect style="z-index: 99999"
                      name="tid"
                      :options="options"
                      :value="temp.cat_id"
                      :searchable="false"
                      :show-count="true"
                      :default-expand-level="1"
                      @input="setCatValues">
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
            </label>
          </treeselect>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label="缩略图:" prop="cover_img">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.cover_img" />
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="rank" label-width="100px" >
          <el-input v-model="temp.rank"  ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="热门:">
          <el-switch
            v-model="temp.is_hot"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="状态:">
          <el-switch
            v-model="temp.state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="摘要:" prop="description">
          <el-input type="textarea" v-model="temp.description" :rows="10"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="内容" prop="content">
          <nEditor ref="Eds"  :id="contents" v-model="temp.content"></nEditor>
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
  import { fetchCerts, createCert, updateCert, fetchCertDetail, fetchCertCats } from '@/api/cert'
  import waves from '@/directive/waves'// 水波纹指令
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree } from '@/utils/helps'
  import nEditor from '@/components/Neditor/index'
  import Upload from '@/components/Upload/singleImage'
  export default {
    directives: {
      waves
    },
    name: 'certList',
    components: { Treeselect, nEditor, Upload },
    data() {
      return {
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
          cert_name: [{ required: true, message: '请填写证书名称', trigger: 'change' }],
          cat_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
          rank: [{ required: true, message: 'rank is required', trigger: 'change' }],
          cover_img: [{ required: true, message: 'cover_img is required', trigger: 'blur' }]
        },
        temp: {},
        dialogPvVisible: false,
        options: []
      }
    },
    created() {
      this.getList()
      fetchCertCats().then(response => {
        this.options = treeToTree(response.data)
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
        fetchCerts(this.listQuery).then(response => {
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
          cat_id: null,
          cert_name: '',
          cert_alias: '',
          rank: 50,
          is_hot: false,
          cover_img: '',
          description: '',
          content: `<h3>
    <span class="ue_t">通过率</span>

</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">就业及薪酬</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">考试时间</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">证书简介</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">证书详情</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">报名方式</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">报考条件</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">考试费用</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">考试范围</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>
<h3>
    <span class="ue_t">其他信息</span>
</h3>
<div>
    <p>
        <span class="ue_t">请在这里填写内容！！</span>
    </p>
</div>`,
          state: true
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
            const tempData = Object.assign({}, this.temp)
            tempData.content = this.$refs.Eds.content
            tempData.state === false ? tempData.state = 0 : tempData.state = 1
            tempData.is_hot === false ? tempData.is_hot = 0 : tempData.is_hot = 1
            createCert(tempData).then(() => {
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
            tempData.content = this.$refs.Eds.content
            tempData.state === false ? tempData.state = 0 : tempData.state = 1
            tempData.is_hot === false ? tempData.is_hot = 0 : tempData.is_hot = 1
            updateCert(tempData).then(() => {
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
        fetchCertDetail({ id: row.id }).then(response => {
          this.temp = response.data
          this.temp.state === 0 ? this.temp.state = false : this.temp.state = true
          this.temp.is_hot === 0 ? this.temp.is_hot = false : this.temp.is_hot = true
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
<style scoped>
.upload-container .image-uploader[data-v-c023cad6]{
  width: 40%
}
</style>
