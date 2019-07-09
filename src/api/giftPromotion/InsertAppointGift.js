import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/InsertAppointGift', obj, 'post')
}
// 指定赠添加或者修改

