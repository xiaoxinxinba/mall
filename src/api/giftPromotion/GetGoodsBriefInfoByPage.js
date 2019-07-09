import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/GetGoodsBriefInfoByPage', obj, 'get')
}
/**查询买赠的商品列表 */
