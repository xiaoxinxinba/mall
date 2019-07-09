import { $axios } from '../../../config/axios'

//获取搬楼模板列表

export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetCategory', obj, 'get')
}
