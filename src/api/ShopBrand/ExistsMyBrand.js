import { $axios } from '../../config/axios'

// 判断商家品牌库是否已经存在此品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/ExistsMyBrand', obj, 'get')
}
