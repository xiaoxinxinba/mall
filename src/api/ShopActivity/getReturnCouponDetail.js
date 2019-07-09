import { $axios } from '../../config/axios'
//返劵查询详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetReturnCouponDetail', obj, 'get')
}
