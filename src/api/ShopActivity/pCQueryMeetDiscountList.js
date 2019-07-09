import { $axios } from '../../config/axios'
//满折列表
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/PCQueryMeetDiscountList', obj, 'get')
}
