import {$axios} from '../../config/axios'

// 删除品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/DeleteShopBrand', obj,'post')
}
