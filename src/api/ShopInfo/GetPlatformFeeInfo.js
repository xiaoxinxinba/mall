import { $axios } from '../../config/axios'

export default function (obj) {
  return  $axios.call(this, 'api/ShopInfo/GetPlatformFeeInfo', obj, 'get')
}
