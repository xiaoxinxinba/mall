import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/DeleGiftProduct', obj, 'post')
}
//删除赠品接口