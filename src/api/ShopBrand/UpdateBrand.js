import { $axios } from '../../config/axios'

// 更新已有品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/UpdateBrand', obj, 'post')
}
