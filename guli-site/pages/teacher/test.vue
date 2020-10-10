<template>
  <div>
    <div v-for="item in items" :key="item.id">
      <a :href="'teacher/' + item.id">{{ item.name }}</a>
    </div>
  </div>
</template>

<script>
import teacherApi from '~/api/teacher'

export default {

  // 服务端渲染，服务端完成渲染，然后将html页面返回浏览器显示，页面html代码含有渲染数据，便于seo爬取
  async asyncData() {
    const response = await teacherApi.getList()
    // const responseCourse = await courseApi.getList()
    return {
      items: response.data.items
    //   courseItems: responseCourse.data.items
    }
  }

  // data() {
  //   return {
  //     items: []
  //   }
  // },

// 客户端渲染，客户端的浏览器向服务器发起请求，此时浏览器已经渲染完毕，页面html源代码不会有异步请求数据
  // created() {
  //   teacherApi.getList().then(response => {
  //     this.items = response.data.items
  //   })
  // }
//     courseApi.getList().then(response => {
//       this.courseItems = response.data.items
//     })
//   }
}
</script>
