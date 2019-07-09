import { $axios } from '../../config/axios'
//修改订单价格
export default function (obj) {
  return  $axios.call(this, 'api/Order/ChangeOrderAmount', obj, 'post')
}
