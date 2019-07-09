import { $axios } from '../../../config/axios'

//获取城市信息

export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetCityList', obj, 'get')
}
