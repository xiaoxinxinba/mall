import { $axios } from '../../../config/axios'

//获取配送模板选择的所有区域

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryDispatchingAreaInfo', obj, 'get')
}
