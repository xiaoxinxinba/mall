import { $axios } from '../../config/axios'

//同意/拒绝换货 （用户是否寄回商品）

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/RefundReceived', obj, 'post')
}
