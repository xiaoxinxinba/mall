import { $axios } from '../../config/axios'

//商家发货
export default function (obj) {
  return  $axios.call(this, '/api/Order/Shipped', obj, 'post')
}
