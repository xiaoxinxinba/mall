import { $axios } from '../../config/axios'

/**
 * 获取经营范围（树结构）
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/BusinessScope/GetBusinessScope', obj, 'get')
}
