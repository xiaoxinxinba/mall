import { $axios } from '../../../config/axios'

/**
 * 获取用户自提地点列表
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetOneselfPackList', obj, 'get')
}
