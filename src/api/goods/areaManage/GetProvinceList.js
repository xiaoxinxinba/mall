import { $axios } from '../../../config/axios'

//获取省份信息

export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetProvinceList', obj, 'get')
}
