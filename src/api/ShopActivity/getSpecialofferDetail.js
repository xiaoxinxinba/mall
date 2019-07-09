import { $axios } from '../../config/axios'
//获取特价活动详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetSpecialofferDetail', obj, 'get')
}
