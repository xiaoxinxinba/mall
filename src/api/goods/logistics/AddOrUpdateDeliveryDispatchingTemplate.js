import { $axios } from '../../../config/axios'

//添加或更新配送费用模板
/**

 */
export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateDeliveryDispatchingTemplate', obj, 'post')
}
