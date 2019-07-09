import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/InsertFullGiftAcitivity', obj, 'post')
}

/**新增/修改满赠信息 */