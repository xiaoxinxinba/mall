import { $axios } from '../../../config/axios'

//删除商家地址信息

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/DelShopExpenseInfo', obj, 'post')
}
