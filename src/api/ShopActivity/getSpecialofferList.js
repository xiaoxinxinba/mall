import { $axios } from '../../config/axios'
//特价活动列表
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetSpecialofferList', obj, 'get')
}
