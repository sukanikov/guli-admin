<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" title="添加课时" @close="close()">
    <el-form label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 上传视频 -->
      <el-form-item label="上传视频">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :on-remove="handleOnRemove"
          :before-remove="handleBeforeRemove"
          :file-list="fileList"
          :limit="1"
          action="http://127.0.0.1:8130/admin/vod/video/upload">
          <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import videoApi from '@/api/video'
import vodApi from '@/api/vod'

export default {

  data() {
    return {
      dialogVisible: false,
      video: {
        sort: 0,
        free: false
      },

      uploadBtnDisabled: false, // 上传视频按钮的状态
      fileList: [] // 上传的文件列表
    }
  },

  methods: {

    // 删除视频之前的确认
    handleBeforeRemove(file) {
      return this.$confirm('确定删除文件 ' + file.name + ' 吗')
    },

    handleOnRemove() {
      console.log('删除视频')
      vodApi.removeByVodId(this.video.videoSourceId).then(response => {
        this.video.videoOriginalName = ''
        this.video.videoSourceId = ''
        this.$message.success(response.message)
        videoApi.updateById(this.video)
      })
    },

    // 上传多于一个视频
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除列表中的视频')
    },

    // 视频上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      this.uploadBtnDisabled = false
      if (response.success) {
        this.$message.success(response.message)
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name
      } else {
        this.$message.error('上传失败-业务失败')
      }
    },

    // 失败回调
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败-http失败')
    },

    submitUpload() {
      // 禁用按钮
      this.uploadBtnDisabled = true
      // 提交上传请求
      this.$refs.upload.submit()
    },

    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId

      // 课时表单的回显
      if (videoId) {
        videoApi.getById(videoId).then(response => {
          this.video = response.data.item

          // 回显视频列表
          if (this.video.videoOriginalName) {
            this.fileList = [{ name: this.video.videoOriginalName }]
          }
        })
      }
    },

    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    resetForm() {
      this.video = {
        sort: 0,
        free: false
      }

      this.fileList = []
    },

    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.video.courseId = this.$parent.$parent.courseId
      videoApi.save(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },

    update() {
      videoApi.updateById(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    }
  }
}
</script>
