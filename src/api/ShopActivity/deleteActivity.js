import { $axios } from '../../config/axios'
//删除活动
export default function (obj) {
  return $axios.call(this, '/api/ShopActivity/DeleteActivity', obj, 'post')
}
