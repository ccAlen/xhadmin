<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar draft'" :zIndex="999">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">保存
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="标题:" prop="title">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入标题" v-model="postForm.title">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="副标题:" prop="subtitle">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入副标题" v-model="postForm.subtitle">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="分类" prop="cat_id">
          <treeselect style="width: 400px"
                      name="cat_id"
                      :options="options"
                      :value="postForm.cat_id"
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
        <el-form-item style="margin-bottom: 20px;"  label-width="100px" label="讲师" prop="user_id">
          <el-select v-model="postForm.user_id" placeholder="请选择" style="width: 400px">
            <el-option
              v-for="item in lecturer"
              :key="item.id"
              :label="item.real_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="封面:" prop="cover_img">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.cover_img" />
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="小节数:" prop="class_number">
          <el-input v-model="postForm.class_number" placeholder="小节数" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="现价:" prop="current_price">
          <el-input v-model="postForm.current_price" placeholder="请输入现价" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="原价:" prop="original_price">
          <el-input v-model="postForm.original_price" placeholder="请输入原价" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="讲师分成:" prop="share_ratio">
          <el-input v-model="postForm.share_ratio" placeholder="0.7" style="width: 100px">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
          <label>例：0.7，代表讲师得销售额的70%</label>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="收费模式:">
          <el-radio-group v-model="postForm.charge_mode" size="medium">
            <el-radio-button label="1">免费</el-radio-button>
           <!-- <el-radio-button label="2">限时免费</el-radio-button>
            <el-radio-button label="3">部分免费</el-radio-button>-->
            <el-radio-button label="4">收费</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="postForm.charge_mode == 2" style="margin-bottom: 20px;text-align: left" label-width="100px" label=" " prop="time">
          <div class="block">
            <el-date-picker
              v-model="postForm.time"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="专业标签:">
          <el-tag
            :key="tag.id"
            v-for="tag in majorTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,'major')"
            style="margin-right: 10px"
          >
            {{tag.major_name}}  {{tag.id}}
          </el-tag>
          <el-autocomplete
            v-if="majorInputVisible"
            v-model="majorSearch"
            :fetch-suggestions="queryMajorSearchAsync"
            ref="saveTagInput"
            placeholder="请输入专业名称"
            @select="handleSelect"
            @keyup.enter.native="handleInputConfirm('major')"
            size="small"
            style="z-index: 99999"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.id }} {{ item.major_name }}</div>
            </template>
          </el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showInput('major')">+ 专业Tag</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="职业标签:">
          <el-tag
            :key="tag.id"
            v-for="tag in profTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,'prof')"
            style="margin-right: 10px"
          >
            {{tag.prof_name}}  {{tag.id}}
          </el-tag>
          <el-autocomplete
            v-if="profInputVisible"
            v-model="profSearch"
            :fetch-suggestions="queryProfSearchAsync"
            ref="saveProfTagInput"
            placeholder="请输入专业名称"
            @select="handleSelect"
            @keyup.enter.native="handleInputConfirm('prof')"
            size="small"
            style="z-index: 99999"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.id }} {{ item.prof_name }}</div>
            </template>
          </el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showInput('prof')">+ 职业Tag</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="证书标签:">
          <el-tag
            :key="tag.id"
            v-for="tag in certTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,'cert')"
            style="margin-right: 10px"
          >
            {{tag.cert_name}}  {{tag.id}}
          </el-tag>
          <el-autocomplete
            v-if="certInputVisible"
            v-model="certSearch"
            :fetch-suggestions="queryCertSearchAsync"
            ref="saveCertTagInput"
            placeholder="请输入专业名称"
            @select="handleSelect"
            @keyup.enter.native="handleInputConfirm('cert')"
            size="small"
            style="z-index: 99999"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.id }} {{ item.cert_name }}</div>
            </template>
          </el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showInput('cert')">+ 证书Tag</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="是否发布:">
          <el-switch
            v-model="postForm.is_published"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="首页推荐:">
          <el-switch
            v-model="postForm.is_home"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="是否推荐:">
          <el-switch
            v-model="postForm.is_recommend"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="是否热门:">
          <el-switch
            v-model="postForm.is_hot"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="排序:">
          <el-input v-model="postForm.rank" style="width: 60px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="你将获得:" prop="description">
          <nEditor ref="decs"  :id="description" v-model="postForm.description"></nEditor>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="课程简介:" prop="course_content">
          <nEditor ref="Ccontent"  :id="courseContent" v-model="postForm.course_content"></nEditor>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { fetchCourses, fetchCat, createCourses, updateCourses } from '@/api/courses'
  import { fetchLecturerList } from '@/api/lecturer'
  import MDinput from '@/components/MDinput'
  import Upload from '@/components/Upload/singleImage3'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import { adminSearch } from '@/api/admin'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { treeToTree, fmtDate } from '@/utils/helps'
  import { validatMoney, validateInt, validatSeparateInto } from '@/utils/validate'
  import nEditor from '@/components/Neditor/index'
  import { fetchMajors } from '@/api/major'
  import { fetchProfs } from '@/api/professions'
  import { fetchCerts } from '@/api/cert'

  const defaultForm = {
    title: '', // 文章题目
    subtitle: '',
    cat_id: null, // 分类id
    class_number: 0, // 课程小节数
    current_price: '0.00', // 现价
    original_price: '0.00', // 原价
    user_id: null, // 讲师id
    charge_mode: 4, // 收费模式：1完全免费，2限时免费，3部分免费，4全部收费
    start_time: null, // 限时免费开始时间：收费模式为限时免费时必须（charge_mode=2）
    end_time: null, // 限时免费结束时间：收费模式为限时免费时必须 （charge_mode=2）
    is_published: true, // 是否发布
    is_recommend: false, // 推荐
    is_hot: false,
    is_home: false,
    description: '', // 文章摘要
    cover_img: '', // 文章图片
    id: undefined,
    rank: 50,
    time: [],
    course_content: '',
    major_label_ids: '',
    prof_label_ids: '',
    cert_label_ids: '',
    share_ratio: '' // 分成
  }
  export default {
    name: 'CoursesDetail',
    components: { MDinput, Multiselect, Upload, Treeselect, Sticky, nEditor },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateMoney = (rule, value, callback) => {
        if (!validatMoney(value)) {
          callback(new Error('请输入正确的金额'))
        } else {
          if (value === '0.00') {
            callback(new Error('请输入正确的金额'))
          } else {
            callback()
          }
        }
      }
      var validateTime = (rule, value, callback) => {
        if (this.postForm.charge_mode === '2' && value === null) {
          callback(new Error('请选择限时免费时间'))
        } else {
          callback()
        }
      }
      const validateGreaterThan = (rule, value, callback) => {
        if (!validateInt(value)) {
          callback(new Error('请输入合法的整数'))
        }
        if (value <= '0') {
          callback(new Error('请填写大于0的整数'))
        }
        callback()
      }
      const separateInto = (rule, value, callback) => {
        if (!validatSeparateInto(value) || value > 1) {
          callback(new Error('请输入合法数值'))
        } else {
          callback()
        }
      }
      return {
        restaurants: [],
        majorSearch: '',
        timeout: null,

        majorTags: [], // 专业标签
        majorInputValue: {},
        majorInputVisible: false,

        profTags: [], // 职业
        profInputValue: {}, // 职业
        profInputVisible: false,
        profSearch: '',

        certTags: [], // 证书
        certInputValue: {}, // 证书
        certInputVisible: false,
        certSearch: '',

        major_label_ids: [],
        prof_label_ids: [],
        cert_label_ids: [],

        options: [],
        lecturer: [],
        postForm: Object.assign({}, defaultForm),
        loading: false,
        userListOptions: [],
        rules: {
          title: [{ required: true, message: 'title is required', trigger: 'blur' }],
          description: [{ required: true, message: 'description is required', trigger: 'blur' }],
          course_content: [{ required: true, message: 'course_content is required', trigger: 'blur' }],
          cover_img: [{ required: true, message: 'cover_img is required', trigger: 'blur' }],
          cat_id: [{ required: true, message: 'cat is required', trigger: 'blur' }],
          current_price: [{ required: true, trigger: 'blur', validator: validateMoney }],
          original_price: [{ required: true, trigger: 'blur', validator: validateMoney }],
          time: [{ required: true, trigger: 'blur', validator: validateTime }],
          class_number: [{ required: true, trigger: 'blur', validator: validateGreaterThan }],
          user_id: [{ required: true, trigger: 'blur', message: '请选择讲师' }],
          share_ratio: [{ required: true, trigger: 'blur', validator: separateInto }]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.description.length
      },
      courseContent() {
        return this.$route.fullPath + Math.random()
      },
      description() {
        return this.$route.fullPath + Math.random()
      }
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
      fetchLecturerList({ group_id: 2 }).then(response => {
        this.lecturer = response.data
      })
    },
    methods: {
      handleSelect(item) {
        var T = null
        console.log(item)
        if (item.major_name) {
          this.majorInputValue = { id: item.id, major_name: item.major_name }
          T = 'major'
          this.major_label_ids.push(item.id)
        }
        if (item.prof_name) {
          this.profInputValue = { id: item.id, prof_name: item.prof_name }
          T = 'prof'
          this.prof_label_ids.push(item.id)
        }
        if (item.cert_name) {
          this.certInputValue = { id: item.id, cert_name: item.cert_name }
          T = 'cert'
          this.cert_label_ids.push(item.id)
        }
        this.handleInputConfirm(T)
      },
      queryMajorSearchAsync(queryString, cb) {
        clearTimeout(this.timeout)
        if ((queryString && queryString.length >= 2) || !queryString) {
          fetchMajors({ major_name: queryString, page: 1 }).then(response => {
            var str = ',' + this.major_label_ids.join(',') + ','
            for (var i = response.data.length - 1; i >= 0; i--) {
              if (str.indexOf(',' + response.data[i].id + ',') !== -1) {
                response.data.splice(i, 1)
                // i = response.data.length - 1
              }
            }
            console.log(response.data)
            this.timeout = setTimeout(() => {
              cb(response.data)
            }, 3000 * Math.random())
          })
        }
      },
      queryProfSearchAsync(queryString, cb) {
        clearTimeout(this.timeout)
        if ((queryString && queryString.length >= 2) || !queryString) {
          fetchProfs({ prof_name: queryString, page: 1 }).then(response => {
            var str = ',' + this.prof_label_ids.join(',') + ','
            for (var i = response.data.length - 1; i >= 0; i--) {
              if (str.indexOf(',' + response.data[i].id + ',') !== -1) {
                response.data.splice(i, 1)
                // i = response.data.length - 1
              }
            }
            console.log(response.data)
            this.timeout = setTimeout(() => {
              cb(response.data)
            }, 3000 * Math.random())
          })
        }
      },
      queryCertSearchAsync(queryString, cb) {
        clearTimeout(this.timeout)
        if ((queryString && queryString.length >= 2) || !queryString) {
          fetchCerts({ cert_name: queryString, page: 1 }).then(response => {
            var str = ',' + this.cert_label_ids.join(',') + ','
            for (var i = response.data.length - 1; i >= 0; i--) {
              if (str.indexOf(',' + response.data[i].id + ',') !== -1) {
                response.data.splice(i, 1)
                // i = response.data.length - 1
              }
            }
            console.log(response.data)
            this.timeout = setTimeout(() => {
              cb(response.data)
            }, 3000 * Math.random())
          })
        }
      },
      handleClose(tag, T) {
        var i
        if (T === 'major') {
          // this.majorTags.splice(this.majorTags.indexOf(tag.id), 1)
          for (i in this.majorTags) {
            if (this.majorTags[i].id === tag.id) {
              this.majorTags.splice(i, 1)
            }
          }
          for (i in this.major_label_ids) {
            if (this.major_label_ids[i] === tag.id) {
              this.major_label_ids.splice(i, 1)
            }
          }
        } else if (T === 'prof') {
          // this.majorTags.splice(this.majorTags.indexOf(tag.id), 1)
          for (i in this.profTags) {
            if (this.profTags[i].id === tag.id) {
              this.profTags.splice(i, 1)
            }
          }
          for (i in this.prof_label_ids) {
            if (this.prof_label_ids[i] === tag.id) {
              this.prof_label_ids.splice(i, 1)
            }
          }
        } else if (T === 'cert') {
          // this.majorTags.splice(this.majorTags.indexOf(tag.id), 1)
          for (i in this.certTags) {
            if (this.certTags[i].id === tag.id) {
              this.certTags.splice(i, 1)
            }
          }
          for (i in this.cert_label_ids) {
            if (this.cert_label_ids[i] === tag.id) {
              this.cert_label_ids.splice(i, 1)
            }
          }
        }
        /* console.log(tag)
        console.log(this.major_label_ids)*/
      },
      showInput(T) {
        this.majorInputVisible = false
        this.profInputVisible = false
        this.certInputVisible = false
        if (T === 'major') {
          this.majorInputVisible = true
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus()
          })
        } else if (T === 'prof') {
          this.profInputVisible = true
          this.$nextTick(_ => {
            this.$refs.saveProfTagInput.$refs.input.focus()
          })
        } else if (T === 'cert') {
          this.certInputVisible = true
          this.$nextTick(_ => {
            this.$refs.saveCertTagInput.$refs.input.focus()
          })
        }
      },
      handleInputConfirm(T) {
        if (T === 'major') {
          var majorInputValue = this.majorInputValue
          if (majorInputValue) {
            this.majorTags.push(majorInputValue)
          }
          this.majorInputVisible = false
          this.majorInputValue = ''
        } else if (T === 'prof') {
          var profInputValue = this.profInputValue
          if (profInputValue) {
            this.profTags.push(profInputValue)
          }
          this.profInputVisible = false
          this.profInputValue = ''
        } else if (T === 'cert') {
          var certInputValue = this.certInputValue
          if (certInputValue) {
            this.certTags.push(certInputValue)
          }
          this.certInputVisible = false
          this.certInputValue = ''
        }
      },
      execStr(arr) {
        var lables = []
        for (var i in arr) {
          lables.push(arr[i].id)
        }
        return lables
      },
      fetchData(id) {
        fetchCourses(id).then(response => {
          response.data.time = []
          this.postForm = response.data
          // Just for test
          this.postForm.is_hot === 0 ? this.postForm.is_hot = false : this.postForm.is_hot = true
          this.postForm.is_recommend === 0 ? this.postForm.is_recommend = false : this.postForm.is_recommend = true
          this.postForm.is_published === 0 ? this.postForm.is_published = false : this.postForm.is_published = true
          this.postForm.is_home === 0 ? this.postForm.is_home = false : this.postForm.is_home = true
          this.postForm.time.push(new Date(this.postForm.start_time))
          this.postForm.time.push(new Date(this.postForm.end_time))
          this.majorTags = this.postForm.major_labels
          this.profTags = this.postForm.profession_labels
          this.certTags = this.postForm.cert_labels
          this.major_label_ids = this.execStr(this.postForm.major_labels)
          this.prof_label_ids = this.execStr(this.postForm.prof_labels)
          this.cert_label_ids = this.execStr(this.postForm.cert_labels)
        }).catch(err => {
          console.log(err)
        })
      },
      setCatValues(value) {
        this.postForm.cat_id = value
      },
      submitForm() {
        this.postForm.description = this.$refs.decs.content
        this.postForm.course_content = this.$refs.Ccontent.content
        // console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.isEdit) {
              this.updateCourses()
            } else {
              this.createCourses()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      createCourses() {
        var postForm = Object.assign({}, this.postForm)
        postForm.major_label_ids = this.major_label_ids.join(',')
        postForm.prof_label_ids = this.prof_label_ids.join(',')
        postForm.cert_label_ids = this.cert_label_ids.join(',')
        postForm.is_hot === false ? postForm.is_hot = 0 : postForm.is_hot = 1
        postForm.is_recommend === false ? postForm.is_recommend = 0 : postForm.is_recommend = 1
        postForm.is_published === false ? postForm.is_published = 0 : postForm.is_published = 1
        postForm.is_home === false ? postForm.is_home = 0 : postForm.is_home = 1
        if (postForm.charge_mode === 2) {
          postForm.start_time = fmtDate(this.postForm.time[0])
          postForm.end_time = fmtDate(this.postForm.time[1])
        } else {
          delete postForm.start_time
          delete postForm.end_time
        }
        createCourses(postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        })
        this.loading = false
        // this.$router.push('/courses/list')
      },
      updateCourses() {
        var postForm = Object.assign({}, this.postForm)
        postForm.major_label_ids = this.major_label_ids.join(',')
        postForm.prof_label_ids = this.prof_label_ids.join(',')
        postForm.cert_label_ids = this.cert_label_ids.join(',')
        postForm.is_hot === false ? postForm.is_hot = 0 : postForm.is_hot = 1
        postForm.is_recommend === false ? postForm.is_recommend = 0 : postForm.is_recommend = 1
        postForm.is_published === false ? postForm.is_published = 0 : postForm.is_published = 1
        postForm.is_home === false ? postForm.is_home = 0 : postForm.is_home = 1
        if (postForm.charge_mode === 2) {
          postForm.start_time = fmtDate(this.postForm.time[0])
          postForm.end_time = fmtDate(this.postForm.time[1])
        } else {
          delete postForm.start_time
          delete postForm.end_time
        }
        updateCourses(postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '更改成功',
            type: 'success',
            duration: 2000
          })
        })
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


