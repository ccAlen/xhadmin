<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar draft'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">保存
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="分类" prop="tid">
          <treeselect style="width: 400px"
            name="tid"
            :options="options"
            :value="postForm.tid"
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
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="摘要:" prop="description">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.description">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="关键字:" prop="keywords">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入关键字" v-model="postForm.keywords">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="文章来源:"  prop="origin">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入关键字" v-model="postForm.origin">

          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="缩略图:" prop="thumb_img">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.thumb_img" />
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="内容" prop="contents">
          <nEditor ref="Eds"  :id="createId" v-model="postForm.contents"></nEditor>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="是否显示:">
          <el-switch
            v-model="postForm.is_show"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="是否推荐:">
          <el-switch
            v-model="postForm.is_recommend"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="是否热门:">
          <el-switch
            v-model="postForm.is_hot"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="排序:">
          <el-input v-model="postForm.rank" style="width: 60px"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <!--<button @click="getContent" class="m-t-10">获取内容</button>-->
  </div>
</template>

<script>
  import { fetchNews, fetchCat, createNews, updateNews } from '@/api/news'
  import MDinput from '@/components/MDinput'
  import Upload from '@/components/Upload/singleImage3'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import { adminSearch } from '@/api/admin'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree } from '@/utils/helps'
  import nEditor from '@/components/Neditor/index'

  const defaultForm = {
    is_show: true,
    is_recommend: false,
    is_hot: false,
    rank: 50,
    origin: '原创',
    title: '', // 文章题目
    contents: '<p>', // 文章内容
    description: '', // 文章摘要
    thumb_img: '', // 文章图片
    id: undefined,
    keywords: '',
    tid: null
  }
  export default {
    name: 'newsDetail',
    components: { MDinput, Multiselect, Upload, Treeselect, nEditor, Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        options: [],
        postForm: Object.assign({}, defaultForm),
        loading: false,
        userListOptions: [],
        rules: {
          title: [{ required: true, message: 'title is required', trigger: 'blur' }],
          origin: [{ required: true, message: 'origin is required', trigger: 'blur' }],
          keywords: [{ required: true, message: 'keywords is required', trigger: 'blur' }],
          description: [{ required: true, message: 'description is required', trigger: 'blur' }],
          thumb_img: [{ required: true, message: 'thumb_img is required', trigger: 'blur' }],
          tid: [{ required: true, message: 'cat is required', trigger: 'blur' }],
          contents: [{ required: true, message: 'contents is required', trigger: 'blur' }]
        },
        id: null
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.description.length
      },
      createId() {
        return this.$route.fullPath
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      /* $route() {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      }*/
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
      fetchCat().then(response => {
        this.options = treeToTree(response.data)
      })
    },
    methods: {
      getContent() {
        return this.$refs.Eds.content
        // console.log(this.$refs.nEditor.content)
        // console.log(this.$refs.Ed.content)
      },
      fetchData(id) {
        fetchNews(id).then(response => {
          this.postForm = response.data
          // Just for test
          this.postForm.title
          this.postForm.description
          this.postForm.is_hot === 0 ? this.postForm.is_hot = false : this.postForm.is_hot = true
          this.postForm.is_recommend === 0 ? this.postForm.is_recommend = false : this.postForm.is_recommend = true
          this.postForm.is_show === 0 ? this.postForm.is_show = false : this.postForm.is_show = true
          this.postForm.contents = response.data.content.content
          console.log(this.postForm)
        }).catch(err => {
          console.log(err)
        })
      },
      setCatValues(value) {
        this.postForm.tid = value
      },
      submitForm() {
        this.postForm.display_time = parseInt(this.display_time / 1000)
        this.postForm.contents = this.getContent()
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              this.updateNews()
            } else {
              this.createNews()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      createNews() {
        this.$notify({
          title: '成功',
          message: '保存文章成功',
          type: 'success',
          duration: 2000
        })
        var postForm = Object.assign({}, this.postForm)
        postForm.is_hot === false ? postForm.is_hot = 0 : postForm.is_hot = 1
        postForm.is_recommend === false ? postForm.is_recommend = 0 : postForm.is_recommend = 1
        postForm.is_show === false ? postForm.is_show = 0 : postForm.is_show = 1
        createNews(postForm)
        this.loading = false
      },
      updateNews() {
        this.$notify({
          title: '成功',
          message: '更改文章成功',
          type: 'success',
          duration: 2000
        })
        var postForm = Object.assign({}, this.postForm)
        postForm.is_hot === false ? postForm.is_hot = 0 : postForm.is_hot = 1
        postForm.is_recommend === false ? postForm.is_recommend = 0 : postForm.is_recommend = 1
        postForm.is_show === false ? postForm.is_show = 0 : postForm.is_show = 1
        updateNews(postForm)
        this.loading = false
      }
    },
    getRemoteUserList(query) {
      adminSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

</style>

