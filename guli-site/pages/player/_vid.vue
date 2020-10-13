<template>
  <div>

    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css" >
    <!-- 播放器核心js -->
    <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"/>

    <!-- 播放器 -->
    <div id="J_prismPlayer" class="prism-player"/>
  </div>
</template>

<script>
import courseApi from '~/api/course'

export default {

  async asyncData(page) {
    const response = await courseApi.getPlayAuth(page.route.params.vid)
    console.log('playAuth', response.data.playAuth)
    return {
      vid: page.route.params.vid,
      playAuth: response.data.playAuth
    }
  },

  //   created() {
  //   },

  mounted() {
    // 创建播放器对象
    /* eslint-disable no-undef */ // 忽略 no-undef 检测
    new Aliplayer({
      id: 'J_prismPlayer',
      width: '100%',
      // 播放方式二：点播用户推荐
      vid: this.vid,
      playauth: this.playAuth,
      encryptType: 1 // 当播放私有加密流时需要设置。
    })
  }
}
</script>
