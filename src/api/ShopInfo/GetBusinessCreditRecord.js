import { $axios } from '../../config/axios'
//获取信用记录
export default function (obj) {
  return  $axios.call(this, 'api/ShopCredit/GetBusinessCreditRecord', obj, 'get')
}
