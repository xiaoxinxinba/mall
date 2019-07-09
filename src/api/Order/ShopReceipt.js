import { $axios } from '../../config/axios'

// 商家接单[聚合：接单、取消接单、下架]
export default function (obj) {
  return  $axios.call(this, '/api/Order/ShopReceipt', obj, 'post')
}
