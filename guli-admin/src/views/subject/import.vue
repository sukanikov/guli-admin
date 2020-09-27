<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="defaultExcelTemplate">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-exceed="fileUploadExceed"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          action="http://127.0.0.1:8110/admin/edu/subject/import"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>

          <el-button
            :disabled="importBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data() {
    return {
      importBtnDisabled: false,
      defaultExcelTemplate: process.env.OSS_PATH + '/excel/课程分类列表模板.xls' // process.env是node中的一个环境变量
    }
  },
  methods: {
    // 上传多于一个文件时被触发
    fileUploadExceed() {
      this.$message.error('只能上传一个文件')
    },
    submitUpload() {
      console.log('submitUpload')
      // 获取view中的组件对象，并调用组件的提交方法
      this.$refs.upload.submit() // 提交后，向aciton中的url提交
      this.importBtnDisabled = true
    },
    // 文件上传成功的回调函数
    fileUploadSuccess(res) {
      if (res.success) {
        // 如果成功则显示批量导入成功的提示
        this.$message.success(res.message)
        this.importBtnDisabled = false
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error('上传失败(业务失败)')
      }
    },
    // 错误处理
    fileUploadError() {
      console.log('error')
      this.$message.error('上传失败（http失败）')
    }
  }
}
</script>
