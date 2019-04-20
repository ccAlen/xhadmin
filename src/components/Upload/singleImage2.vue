<template>
  <div class="singleImageUpload2 upload-container upload-demo">
    <el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="true" :action="this.uploadUrl" :headers="this.headers"
      :on-success="handleImageScucess" :before-upload="beforeUpload" name="course" :file-list="filelist">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传mp3文件</div>
    </el-upload>
    <audio
      controls="controls"
      preload="auto"
      :src="tempUrl" style="margin-top: 10px"
      id="music">
    </audio>
  </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'
import { getToken } from '@/utils/auth'
import { fetchPlayenableUrl } from '@/api/courses'

export default {
  name: 'singleImageUpload2',
  props: {
    value: {
      type: String
    },
    id: {
      type: Number
    },
    time_length: {
      type: Number | String
    },
    course_id: {
      type: Number | String
    },
    filename: {
      type: String
    }
  },
  created() {
    // console.log(21211)
  },
  watch: {
    value(val) {
      console.log('123')
      if (!val) {
        this.tempUrl = ''
      }
      this.filelist = []
    },
    filename(val) {
      console.log('---' + val)
      console.log(this.course_id + '-' + this.id)
      if (val) {
        this.dataObj.filename = this.course_id + '-' + this.id
      } else {
        delete this.dataObj.filename
      }
    },
    id(val) {
      if ((typeof val) !== 'undefined') {
        this.getPlayUrl(this.id)
      }
    }
  },
  computed: {
    imageUrl() {
      return this.tempUrl
    }
  },
  data() {
    return {
      tempUrl: '',
      oldId: 0,
      oldUrl: '', // 旧的url
      uploadUrl: process.env.BASE_API + '/uploadCourse?course_id=' + this.course_id,
      dataObj: { token: '', key: '' },
      headers: { Authorization: '' },
      filelist: []
    }
  },
  methods: {
    getPlayUrl(id) {
      // var _this = this
      fetchPlayenableUrl(id).then(response => {
        this.tempUrl = response.data.url
      })
    },
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    emitTimeLength(val) {
      this.$emit('set-time-length', val)
    },
    handleImageScucess(file) {
      this.tempUrl = file.data.play_url
      this.emitInput(file.data.url)
      this.emitTimeLength(file.data.time_length)
      this.$emit('set-size', file.data.size * 1)
    },
    mytest(event) {
      console.log(event)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        _self.headers.Authorization = 'Bearer ' + getToken()
        resolve(true)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 30%;
  height: 20%;
  position: relative;
  .image-uploader {
    height: 10%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .upload-demo .el-upload .el-upload-dragger{
    background: #1f2d3d;
    border:none;
  }
}

</style>
