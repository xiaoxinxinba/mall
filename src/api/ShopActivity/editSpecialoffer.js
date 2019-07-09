import { $axios } from '../../config/axios'
//新增与编辑特价活动
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/EditSpecialoffer', obj, 'post')
}
