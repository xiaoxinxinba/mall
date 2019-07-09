import { $axios } from '../../../config/axios'

//获取商家地址信息列表

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetShopExpenseInfo', obj, 'get')
}
