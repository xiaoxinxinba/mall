import { $axios } from '../../config/axios'
//返劵查询列表
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/PcGetReturnCouponActivitiyList', obj, 'get')
}
