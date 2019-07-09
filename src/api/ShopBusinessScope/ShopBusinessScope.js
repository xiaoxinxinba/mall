import { $axios } from '../../config/axios'

/**
 * 店铺当前经营范围
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/BusinessScope/GetShopBusinessScope', obj, 'get')
}
