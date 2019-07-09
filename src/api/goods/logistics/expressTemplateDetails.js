import { $axios } from '../../../config/axios'

/**
 * 查询模板详情
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, '/api/ExpressTemplate/GetExpressTemplateDetails', obj, 'get')
}
