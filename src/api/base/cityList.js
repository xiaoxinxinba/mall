import { $axios } from '../../config/axios'

/**
 * 获取市列表
 * @param obj
 * @returns {*}
 */
export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetCityList', obj, 'get')
}
