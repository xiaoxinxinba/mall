import { $axios } from '../../config/axios'

// 更新新申请品牌
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/UpdateApplyBrand', obj, 'post')
}
