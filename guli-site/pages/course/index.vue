<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 一级类别 开始-->
              <ul class="clearfix">
                <li :class="{current: !$route.query.subjectParentId}">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne('')">全部</a>
                </li>
                <li
                  v-for="item in subjectNestedList"
                  :key="item.id"
                  :class="{current: $route.query.subjectParentId === item.id}">
                  <a
                    :title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne(item.id)">{{ item.title }}</a>
                </li>
              </ul>
              <!-- /一级类别 结束-->
            </dd>
          </dl>
          <dl v-if="$route.query.subjectParentId">
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 二级类别 开始-->
              <ul class="clearfix">
                <li :class="{current: !$route.query.subjectId}">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo('')">全部</a>
                </li>
                <li
                  v-for="item in subSubjectList"
                  :class="{current: $route.query.subjectId === item.id}"
                  :key="item.id">
                  <a
                    :title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo(item.id)">{{ item.title }}</a>
                </li>
              </ul>
              <!-- /二级类别 结束-->
            </dd>
          </dl>
          <div class="clear"/>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <!-- 排序 开始-->
            <ol class="js-tap clearfix">
              <li :class="{'current bg-green': $route.query.buyCountSort}">
                <a
                  title="销量"
                  href="javascript:void(0);"
                  @click="searchBuyCount()">销量
                  <i>↓</i>
                </a>
              </li>
              <li :class="{'current bg-green': $route.query.publishTimeSort}">
                <a
                  title="最新"
                  href="javascript:void(0);"
                  @click="searchPublishTime()">最新
                  <i>↓</i>
                </a>
              </li>
              <li :class="{'current bg-green': $route.query.priceSort}">
                <a
                  v-if="!$route.query.priceSort || $route.query.priceSort === '1'"
                  title="价格"
                  href="javascript:void(0);"
                  @click="searchPrice(2)">价格<i>↑</i>
                </a>
                <a
                  v-if="$route.query.priceSort === '2'"
                  title="价格"
                  href="javascript:void(0);"
                  @click="searchPrice(1)">价格<i>↓</i>
                </a>
              </li>
            </ol>
            <!-- /排序 结束-->
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section v-if="courseList1.length === 0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->

          <!-- 数据列表 开始-->
          <article v-if="courseList1.length > 0" class="comm-course-list">
            <ul id="bna" class="of">
              <li v-for="item in courseList1" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="item.cover" :alt="item.title" class="img-responsive">
                    <div class="cc-mask">
                      <a :href="'/course/'+item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/course/'+item.id" :title="item.title" class="course-title fsize18 c-333">{{ item.title }}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <!-- {{ Number('0.00') === 0 }} 字符串转数值-->
                    <span v-if="Number(item.price) === 0" class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span v-else class="fr jgTag ">
                      <i class="c-orange fsize12 f-fA"> ￥{{ item.price }}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ item.viewCount }}人学习</i>
                      |
                      <i class="c-999 f-fA">{{ item.buyCount }}人购买</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"/>
          </article>
          <!-- /数据列表 结束-->
        </div>
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>

<script>
import courseApi from '~/api/course'
import quertstring from 'querystring'

export default {

  async asyncData(page) {
    // 从url中获取参数
    const searchObj = page.route.query

    // 获取课程分类列表
    const subjectNestedListResponse = await courseApi.getSubjectNestedList()
    const subjectNestedList = subjectNestedListResponse.data.items

    // 定义课程二级分类列表
    let subSubjectList = []
    // 遍历一级类别
    if (searchObj.subjectParentId) {
      for (let i = 0; i < subjectNestedList.length; i++) {
        if (subjectNestedList[i].id === searchObj.subjectParentId) {
          subSubjectList = subjectNestedList[i].children
        }
      }
    }

    // 获取课程列表
    const courseListResponse = await courseApi.getList(searchObj)
    const courseList = courseListResponse.data.courseList

    return {
      courseList1: courseList, // 课程列表
      subjectNestedList, // 课程分类列表
      subSubjectList, // 二级分类列表
      searchObj // url查询参数
    }
  },

  methods: {
    searchSubjectLevelOne(subjectParentId) {
      window.location = 'course?subjectParentId=' + subjectParentId
    },

    searchSubjectLevelTwo(subjectId) {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: subjectId
      }
      window.location = 'course?' + quertstring.stringify(queryObj)
    },

    // 安销量排序
    searchBuyCount() {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        buyCountSort: 1
      }
      window.location = 'course?' + quertstring.stringify(queryObj)
    },

    // 按发布时间排序
    searchPublishTime() {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        publishTimeSort: 1
      }
      window.location = 'course?' + quertstring.stringify(queryObj)
    },

    // 安价格排序
    searchPrice(type) {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        priceSort: type
      }
      window.location = 'course?' + quertstring.stringify(queryObj)
    }
  }
}
</script>
