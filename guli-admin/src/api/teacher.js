import request from '@/utils/request'

export default{
  list() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },
  // 分页有条件查询
  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list-with-query/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  save(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'post',
      data: teacher
    })
  },
  getById(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'put',
      data: teacher
    })
  },
  removeById(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'delete'
    })
  },
  batchRemove(idList) {
    return request({
      url: '/admin/edu/teacher/batch-remove',
      method: 'delete',
      data: idList
    })
  },
  selectNameListByKey(key) {
    return request({
      url: '/admin/edu/teacher/list/name',
      params: { key } // 即key: key
    })
  }
}
