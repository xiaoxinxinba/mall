import { $axios } from '../../../config/axios'

//添加或编辑商家地址信息

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateShopExpenseInfo', obj, 'post')
}
