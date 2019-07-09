import { $axios } from '../../../config/axios'

/**
 * 获取用户自提地点详情
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetOneselfPackInfo', obj, 'get')
}
