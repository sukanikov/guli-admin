<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具按钮 -->
    <div style="margin-bottom: 10px">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="list"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      stripe
      @selection-change="handleSelectionChange" >
      <el-table-column type="selection"/>
      <el-table-column type="index" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-else size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>

      </el-table-column>

    </el-table>
    <!-- 基础功能分页 -->
    <!-- <el-pagination
      :page-size="limit"
      :total="total"
      layout="prev, pager, next"
      @current-change="changeCurrent"/> -->
    <!-- 完整功能分页 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="limit"
      :total="total"
      style="padding: 30px; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="changeCurrent"/>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  // 定义数据模型
  data() {
    return {
      list: [], // 讲师列表
      page: 1, // 当前页
      limit: 5, // 每页记录数
      total: 0, // 总数

      searchObj: {},
      multipleSelection: []

    }
  },

  // 页面渲染成功后获取数据
  created() {
    this.fetchData()
  },

  // 定义方法
  methods: {

    // 根据讲师id删除讲师
    removeById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '好',
        cancelButtonText: '算了',
        type: 'warning'
      }).then(() => {
        teacherApi.removeById(id).then(response => {
          this.$message.success(response.message)
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 清空表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 切换当前页码
    changeCurrent(page) {
      this.page = page
      this.fetchData()
    },
    // 切换页码大小
    handleSizeChange(size) {
      this.limit = size
      this.fetchData()
    },
    fetchData() {
      // // 调用api
      // teacherApi.list().then(response => {
      //   this.list = response.data.items
      // }),

      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        // console.log(response)
        this.list = response.data.pageModel.records
        this.total = response.data.pageModel.total
      })
    },
    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的元素')
        return
      }
      this.$confirm('此操作将永久删除选中的记录, 是否继续?', '提示', {
        confirmButtonText: '好',
        cancelButtonText: '算了',
        type: 'warning'
      }).then(() => { // 获取选中的元素id，再赋给batchRemove
        const idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return teacherApi.batchRemove(idList)
      }).then(response => {
        this.$message.success(response.message)
        this.fetchData() // 删除后重新刷新页面，防止源数据仍存留在页面
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 监听表格复选框的选中状态，获取被选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val // 放在this中表示mutipleSelection要注册到data中
      console.log(this.multipleSelection)
    }
  }
}
</script>
