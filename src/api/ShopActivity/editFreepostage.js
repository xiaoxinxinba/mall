import { $axios } from '../../config/axios'
//添加/编辑 包邮活动
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/EditFreepostage', obj, 'post')
}
