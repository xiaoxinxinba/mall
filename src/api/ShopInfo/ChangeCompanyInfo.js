import { $axios } from '../../config/axios'
//修改公司信息
export default function (obj) {
  return $axios.call(this, 'api/ShopInfo/ChangeCompanyInfo', obj, 'post')
}
