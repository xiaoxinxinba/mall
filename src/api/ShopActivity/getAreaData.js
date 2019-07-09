import { $axios } from '../../config/axios'
//获取包邮地区
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetAreaData', obj, 'get')
}
