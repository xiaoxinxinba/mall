import { $axios } from '../../config/axios'

//同意/拒绝退货退款 （用户是否寄回商品）

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/RefundConfirm', obj, 'post')
}
