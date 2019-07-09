import { $axios } from '../../config/axios'

//同意/拒绝补发货

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/CompensateGoodsApply', obj, 'post')
}
