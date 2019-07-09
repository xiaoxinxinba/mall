import { $axios } from '../../../config/axios'

/**
 * 逻辑删除自提点
 * @param obj
 * @returns {*|Promise|Promise<any>}
 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/CopyOneselfPack', obj, 'post')
}
