import { $axios } from '../../../config/axios'

//获取配送模板列表
/**
 * 查询模板详情
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryDispatchingTemplateList', obj, 'get')
}
