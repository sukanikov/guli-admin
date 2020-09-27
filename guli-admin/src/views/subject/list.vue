<template>
  <div class="app-container">
    <!-- 过滤文本框 -->
    <el-input
      v-model="filterText"
      style="margin-bottom:30px;"
      placeholder="输入关键字进行过滤"/>
    <!-- 树形控件 node-click表示点击节点会发生事件，此处无用-->
    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"/>
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      filterText: '', // 别忘了定义
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      // 接收任意参数，并传递给filter-node-method，并作为第一个参数
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.fetchSubjectNodeList()
  },

  methods: {
    // 根据输入过滤节点
    filterNode(value, data) {
      if (!value) return true // 如果value没有值，则显示这个节点
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    // 获取所有节点列表
    fetchSubjectNodeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    }
  }
}
</script>
