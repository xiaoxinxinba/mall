import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/GetFullBuyGiftActivityList', obj, 'get')
}

/**买一赠一百 */
