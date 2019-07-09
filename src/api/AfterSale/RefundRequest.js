import { $axios } from '../../config/axios'

//同意/拒绝退单申请

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/RefundRequest', obj, 'post')
}
