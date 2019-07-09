import { $axios } from '../../config/axios'
//暂时活动、恢复活动
export default function (obj) {
  return $axios.call(this, '/api/ShopActivity/CouponsChangeActivityStatus', obj, 'post')
}
