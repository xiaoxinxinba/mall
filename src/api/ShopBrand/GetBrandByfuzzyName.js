import { $axios } from '../../config/axios'

// 模糊查询品牌列表
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/GetBrandByfuzzyName', obj, 'get')
}
