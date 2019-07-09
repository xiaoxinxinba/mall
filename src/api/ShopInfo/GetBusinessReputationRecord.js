import { $axios } from '../../config/axios'
//获取信誉记录
export default function (obj) {
  return  $axios.call(this, 'api/ShopCredit/GetBusinessReputationRecord', obj, 'get')
}
