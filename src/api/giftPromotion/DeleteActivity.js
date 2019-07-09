import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/DeleteActivity', obj, 'post')
}
/**删除活动 */