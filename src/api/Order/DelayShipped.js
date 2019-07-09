import { $axios } from '../../config/axios'

//商家延迟发货
export default function (obj) {
  return  $axios.call(this, '/api/Order/DelayShipped', obj, 'post')
}
