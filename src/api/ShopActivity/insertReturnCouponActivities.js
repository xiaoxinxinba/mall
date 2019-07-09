import { $axios } from '../../config/axios'
//返劵添加/编辑
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/InsertReturnCouponActivities', obj, 'post')
}
