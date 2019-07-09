import { $axios } from '../../config/axios'

//获取退单列表

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/GetOrderBackList', obj, 'get')
}
