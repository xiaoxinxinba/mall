import { $axios } from '../../config/axios'

// 添加申请品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/AddApplyBrand', obj, 'post')
}
