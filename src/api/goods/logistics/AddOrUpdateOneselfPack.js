import { $axios } from '../../../config/axios'

/**
 * 保存或修改自提设置
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateOneselfPack', obj, 'post')
}
