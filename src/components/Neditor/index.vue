<template>
  <div>
    <script :id="this.id" type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../static/neditor/neditor.config.js'
  import '../../../static/neditor/neditor.all.js'
  import '../../../static/neditor/lang/zh-cn/zh-cn.js'
  import '../../../static/neditor/neditor.parse.js'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'nEditor',
    data() {
      return {
        nEditor: null,
        ue: null,
        content: '',
        hasInit: false,
        hasChange: false,
        hasLocalValue: false // 本地改变值
      }
    },
    props: {
      id: {
        type: String | Number
      },
      value: {
        type: String,
        default: ''
      }
    },
    watch: {
      value(val) {
        // console.log('监控内容变动')
        if (this.hasLocalValue) {
          this.hasLocalValue = false
          return true
        }
        const _this = this
        // 初始化编辑器
        // if (_this.ue && val !== _this.ue.getContent()) this.ue.setContent(val)
        // console.log('变动数据 ' + val)
        if (!this.hasChange && this.hasInit) {
          _this.$nextTick(function() {
            // _this.ue.setContent(val)
            window.UE.getEditor(_this.id).setContent(val)
            // console.log(1)
          })
        }
        _this.content = val
        // console.log('有数据延迟加载 ')
        // console.log(val)
      }
    },
    mounted: function() {
      const _this = this
      this.$nextTick(function() {
        // 初始化编辑器
        _this.initEditor()
      })
    },
    methods: {
      initEditor() {
        const _this = this
        // console.log('aaa+++' + _this.value)
        if (_this.value) {
          _this.content = _this.value
        }
        _this.ue = window.UE.getEditor(this.id, {
          serverUrl: process.env.BASE_API + '/ueditor/updateImage?token=' + getToken(),
          theme: 'notadd',
          // themePath: '../static/neditor/themes/',
          initialFrameWidth: '100%',
          initialFrameHeight: 320,
          allowDivTransToP: false,
          autoHeightEnabled: false,
          zIndex: 9999
        }) // 初始化UE
        _this.ue.addListener('ready', function() {
          // console.log('载完了')
          _this.hasInit = true
          //  if (_this.content)
          _this.ue.setContent(_this.content) // 确保UE加载完成后，放入内容。
          // console.log('----' + _this.content)
        })
        // 编辑器内容修改时
        _this.selectionchange()
      },
      emitInput(val) {
        this.hasLocalValue = true
        this.$emit('input', val)
        // this.hasChange = false
      },
      // 编辑器内容修改时
      selectionchange() {
        const _this = this
        _this.ue.addListener('selectionchange', () => {
          // this.hasChange = true
          this.content = _this.ue.getContent()
          if (this.content !== _this.value) {
            // console.log(2)
            this.emitInput(this.content)
          }
        })
      },
      ueDestroy() {
        const _this = this
        _this.hasInit = false
        _this.hasChange = false
        _this.ue.destroy()
      }
    },
    destroyed() {
      const _this = this
      // console.log('销毁')
      _this.ue.destroy()
    }
  }
</script>
