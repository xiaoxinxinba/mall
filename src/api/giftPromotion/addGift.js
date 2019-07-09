import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'api/ShopActivity/InsertGiftActivity', obj, 'post')
}
// 添加赠品接口