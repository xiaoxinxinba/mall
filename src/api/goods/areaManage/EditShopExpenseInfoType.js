import { $axios } from '../../../config/axios'

//修改地址信息类型

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/EditShopExpenseInfoType', obj, 'post')
}
