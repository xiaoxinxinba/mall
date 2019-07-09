import { $axios } from '../../config/axios'

/**
 * 获取区县列表
 * @param obj
 * @returns {*}
 */
export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetCountyList', obj, 'get')
}
