import { $axios } from '../../../config/axios'

//添加或更新搬楼费用模板

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateDeliveryMovingFloorTemplate', obj, 'post')
}
