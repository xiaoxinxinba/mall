import { $axios } from '../../config/axios'

/**
 * 获取街道列表
 * @param obj
 * @returns {*}
 */
export default function (obj) {
  return $axios.call(this, 'api/AreaInfo/GetStreetList', obj, 'get')
}
