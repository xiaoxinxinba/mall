import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'api/ShopActivity/GetFullGiftProductActivity', obj, 'get')
}
/**查询满赠详情接口 */