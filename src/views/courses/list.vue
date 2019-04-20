<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.keyword">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="Title">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/courses/edit/'+scope.row.id">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{scope.row.category.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="原价" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.original_price}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="现价" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.current_price}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.is_published === 1">是</div><div v-else>否</div>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="推荐" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.is_recommend === 1">是</div><div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="热门" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.is_hot === 1">是</div><div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="首页" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.is_home === 1">是</div><div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column width="50px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.rank}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="180" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/courses/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
          <router-link :to="'/courses/classes/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-tickets">节</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { fetchList } from '@/api/courses'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    directives: {
      waves
    },
    name: 'coursesList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          per_page: 10
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '1': 'success',
          '0': 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.page.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      handleSizeChange(val) {
        this.listQuery.per_page = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.$router.push({ path: '/courses/create' })
      }
    }
  }
</script>

<style scoped>
  .pagination-container{
    margin-top: 30px;
  }
  .filter-container{
    margin-bottom: 30px;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
