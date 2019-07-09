import { $axios } from '../../../config/axios'

/**
 * 查询物流配送省市
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetAreaInfoList', obj, 'get')
}
