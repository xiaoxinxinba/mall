import { $axios } from '../../config/axios'
//添加折扣活动
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetCouponAcivity', obj, 'get')
}
