import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/GetFullSpecifiedProductList', obj, 'get')
}
// 指定赠查询列表