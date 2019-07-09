import { $axios } from '../../config/axios'
//修改店铺信息
export default function (obj) {
  return $axios.call(this, 'api/ShopInfo/ChangeShopInfo', obj, 'post')
}
