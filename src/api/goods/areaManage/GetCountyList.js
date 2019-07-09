import { $axios } from '../../../config/axios'

//获取行政区信息

export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetCountyList', obj, 'get')
}
