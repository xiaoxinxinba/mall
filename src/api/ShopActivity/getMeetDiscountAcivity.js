import { $axios } from '../../config/axios'
//查询满折详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetMeetDiscountAcivity', obj, 'get')
}
