
import { $axios } from '../../config/axios'
//获取店铺状态
export default function (obj) {
  return  $axios.call(this, 'api/ShopInfo/ApplyColseShop', obj, 'get')
}
