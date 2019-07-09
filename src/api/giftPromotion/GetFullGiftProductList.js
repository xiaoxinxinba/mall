import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'api/ShopActivity/GetFullGiftActivityList', obj, 'get')
}

/**查询满赠列表 */