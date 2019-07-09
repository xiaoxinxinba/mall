import { $axios } from '../../config/axios'
//获取订单各状态数量
export default function (obj) {
  return  $axios.call(this, 'api/Order/CountOrderByState', obj, 'get')
}
