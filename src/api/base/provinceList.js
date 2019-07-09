import { $axios } from '../../config/axios'

/**
 * 获取省份列表
 * @param obj
 * @returns {*}
 */
export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetProvinceList', obj, 'get')
}
