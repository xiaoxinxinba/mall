import { $axios } from '../../config/axios'
//激活店铺
export default function (obj) {
  return  $axios.call(this, '/api/ShopInfo/ActivateShop', obj, 'get')
}
