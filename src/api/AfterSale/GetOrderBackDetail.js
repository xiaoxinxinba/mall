import { $axios } from '../../config/axios'

//获取退单详情

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/GetOrderBackDetail', obj, 'get')
}
