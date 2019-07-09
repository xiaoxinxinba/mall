import { $axios } from '../../config/axios'

// 获取商家首页数据
export default function (obj) {
  return $axios.call(this, 'api/Admin/GetShopData', obj, 'get')
}
