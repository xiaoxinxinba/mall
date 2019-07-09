import { $axios } from '../../config/axios'
//获取偏远地区
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetExcludeArea', obj, 'get')
}
