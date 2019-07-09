import { $axios } from '../../config/axios'
//根据活动Id获得商家当前是否有效包邮活动详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetFreeActivityDetail', obj, 'get')
}
