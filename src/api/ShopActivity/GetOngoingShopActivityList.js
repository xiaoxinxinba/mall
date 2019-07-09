import { $axios } from '../../config/axios'
//哪些商家有活动正在进行中
export default function (obj) {
  return $axios.call(this, '/api/ShopActivity/GetOngoingShopActivityList', obj, 'get')
}
