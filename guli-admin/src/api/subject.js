import request from '@/utils/request'

export default {
  getNestedTreeList() {
    return request({
      url: '/admin/edu/subject/nested-list',
      method: 'get'
    })
  },
  getNestedTreeList_pro() {
    return request({
      url: '/admin/edu/subject/nested-list1',
      method: 'get'
    })
  }
}
