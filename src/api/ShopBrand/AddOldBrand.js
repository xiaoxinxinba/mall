import { $axios } from '../../config/axios'

// 添加品牌授权
export default function (obj) {
  return $axios.call(this, 'api/ShopBrand/AddOldBrand', obj, 'post')
}
