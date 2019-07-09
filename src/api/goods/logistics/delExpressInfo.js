import { $axios } from '../../../config/axios'

/**
 * 删除物流快递模板
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/DelExpressInfo', obj, 'post')
}
