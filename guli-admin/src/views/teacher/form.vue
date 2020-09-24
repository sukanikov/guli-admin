<template>
  <div>
    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="http://localhost:8120/admin/oss/file/upload?module=avatar">
          <img v-if="teacher.avatar" :src="teacher.avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 防止表单重复提交
      teacher: {} // teacher对象
    }
  },
  created() {
    if (this.$route.params.id) {
      this.fetchDataById(this.$route.params.id)
    }
  },

  methods: {
    fetchDataById(id) {
      teacherApi.getById(id).then(response => {
        this.teacher = response.data.item
      })
    },

    // saveOrUpdate() {
    // // 禁用保存按钮
    //   this.saveBtnDisabled = true
    //   this.saveData()
    // },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    saveData() {
    // debugger
      teacherApi.save(this.teacher).then(response => {
        this.$message.success(response.message)
        // 将当前页面跳转到指定的路由地址
        this.$router.push({
          path: '/teacher'
        })
      })
    },

    updateData() {
      teacherApi.updateById(this.teacher).then(response => {
        this.$message.success(response.message)
        // 将当前页面跳转到指定的路由地址
        this.$router.push({
          path: '/teacher'
        })
      })
    },

    // 文件上传成功的回调函数
    handleAvatarSuccess(res) {
      console.log('res', res)
      if (res.success) {
        this.teacher.avatar = res.data.url

        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败(业务失败)')
      }
    },

    // 错误处理
    handleAvatarError() {
      console.log('error')
      this.$message.error('上传失败（http失败）')
    },

    // 文件上传前的格式和大小的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' // MIME类型
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar-uploader img {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
