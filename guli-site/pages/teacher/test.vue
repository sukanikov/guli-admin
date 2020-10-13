<template>
  <div>
    <!-- <div v-for="item in items" :key="item.id">
      <a :href="'teacher/' + item.id">{{ item.name }}</a>
    </div> -->
    1
  </div>
</template>

<script>
import teacherApi from '~/api/teacher'

export default {

  // async asyncData() {
  //   const response = await teacherApi.getList()
  //   // const responseCourse = await courseApi.getList()
  //   return {
  //     items: response.data.items
  //   //   courseItems: responseCourse.data.items
  //   }
  // },

  data() {
    return {
      items: []
    }
  },

  //   created() {
  //     teacherApi.getList().then(response => {
  //       this.items = response.data.items
  //     })

  //     courseApi.getList().then(response => {
  //       this.courseItems = response.data.items
  //     })
  //   }

  created() {
    console.log('created.....')
    teacherApi.getList().then(response => {
      this.items = response.data.items
    })
  }

}
</script>
