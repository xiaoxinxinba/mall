import { $axios } from '../../config/axios'

//获取订单未发货商品
export default function (obj) {
  return  $axios.call(this, '/api/Order/GetUnshippedGoods', obj, 'get')
}
