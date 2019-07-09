import { $axios } from '../../config/axios'

/**
 * 资质证件
 * @param obj
 * @returns {*|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/BusinessScope/GetShopCredentials', obj, 'get')
}
