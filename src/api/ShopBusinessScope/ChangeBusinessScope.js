import { $axios } from '../../config/axios'

/**
 * 修改经营范围(提交到客户系统审核)
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/BusinessScope/AddScopeChangeLog', obj, 'post')
}
