<template>
    <div class="upload-container">
        <el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" :action="this.uploadUrl" :headers="this.headers"
            :on-success="handleImageScucess" :before-upload="beforeUpload" name="image">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
                <img :src="imageUrl">
                <div class="image-preview-action">
                    <i @click="rmImage" class="el-icon-delete"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 预览效果见付费文章
// import { getToken } from '@/api/qiniu'
import { getToken } from '@/utils/auth'

export default {
  name: 'singleImageUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      tempUrl: '',
      uploadUrl: process.env.BASE_API + '/uploadImage',
      dataObj: { token: '', key: '' },
      headers: { Authorization: '' }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(file) {
      this.emitInput(file.data.url)
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
    @import "src/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 20%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
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
    }

</style>
