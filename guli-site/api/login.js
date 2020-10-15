import request from '~/utils/request'
import cookie from 'js-cookie'

export default {
  submitLogin(user) {
    return request({
      baseURL: 'http://localhost:8160',
      url: '/api/ucenter/member/login',
      method: 'post',
      data: user
    })
  },

  getLoginInfo() {
    return request({
      baseURL: 'http://localhost:8160',
      url: '/api/ucenter/member/auth/get-login-info',
      method: 'get',
      // 添加自定义的header
      headers: {
        'token': cookie.get('guli_token')
      }
    })
  }

}
