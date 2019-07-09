import { $axios } from '../../config/axios'
//查询满包邮活动的列表或总数
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetFreeFullGiftActivityList', obj, 'get')
}
