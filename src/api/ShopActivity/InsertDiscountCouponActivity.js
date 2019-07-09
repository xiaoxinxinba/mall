import { $axios } from '../../config/axios'
//获取商品分类
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/InsertDiscountCouponActivity', obj, 'post')
}
