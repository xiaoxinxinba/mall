import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'api/ShopActivity/GetGiftActivityDetails', obj, 'get')
}
/**查询赠品详情信息接口 */