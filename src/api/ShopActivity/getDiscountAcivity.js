import { $axios } from '../../config/axios'
//查询折扣详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetDiscountAcivity', obj, 'get')
}
