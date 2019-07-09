import { $axios } from '../../config/axios'
//添加或者编辑优惠券
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/InsertCouponActivity', obj, 'post')
}
