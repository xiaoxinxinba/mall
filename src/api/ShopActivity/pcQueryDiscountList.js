import { $axios } from '../../config/axios'
//折扣列表
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/PcQueryDiscountList', obj, 'get')
}
