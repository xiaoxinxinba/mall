import { $axios } from '../../config/axios'
//修改店铺信息
export default function (obj) {
  return $axios.call(this, 'api/Order/ModifyLogisticsInfo', obj, 'post')
}
