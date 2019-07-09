import { $axios } from '../../../config/axios'

//删除模板（同城配送）

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/CopyDeliveryTemplate', obj, 'post')
}
