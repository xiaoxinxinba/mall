import { $axios } from '../../../config/axios'

//获取要修改的配送模板

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryDispatchingTemplate', obj, 'get')
}
