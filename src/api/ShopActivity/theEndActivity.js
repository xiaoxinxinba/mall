import { $axios } from '../../config/axios'
//结束活动
export default function (obj) {
  return $axios.call(this, '/api/ShopActivity/TheEndActivity', obj, 'post')
}
