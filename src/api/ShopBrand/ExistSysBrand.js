import { $axios } from '../../config/axios'

// 查询系统品牌库是否存在该品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/ExistSysBrand', obj, 'get')
}
