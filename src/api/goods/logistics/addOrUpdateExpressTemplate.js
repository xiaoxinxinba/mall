import { $axios } from '../../../config/axios'

/**
 * 保存或修改物流快递模板
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateExpressTemplate', obj, 'post')
}
