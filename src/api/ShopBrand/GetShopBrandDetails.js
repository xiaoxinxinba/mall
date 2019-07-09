import { $axios } from '../../config/axios'

// 获取品牌详情
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/GetShopBrandDetails', obj, 'get')
}
