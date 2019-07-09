import { $axios } from '../../../config/axios'

////获取要修改的搬楼模板

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryMovingFloorTemplate', obj, 'get')
}
