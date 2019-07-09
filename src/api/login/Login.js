import { $axios } from '../../config/axios'

// 获取阿里云秘钥
export default function (obj) {
  return $axios.call(this, `/auth/oauth/token?username=${obj.username}&password=${obj.password}&grant_type=password&scope=server&client_id=shoppc`, '', 'post', 'login')
  /*
  * 接口共四个参数
  * 依次是  1：链接地址  2：data传的参数  3：是get还是post 不传值默认 post 4：要切换的IP地址 添加IP地址到config/vuex/state/api 文件 不传值默认host IP
  * $axios.call(this, '/api/sample/login', obj, ''，'test')
  * */
}
