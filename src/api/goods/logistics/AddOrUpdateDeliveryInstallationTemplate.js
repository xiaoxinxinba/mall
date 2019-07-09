import { $axios } from '../../../config/axios'

//添加或更新安装费用模板

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/AddOrUpdateDeliveryInstallationTemplate', obj, 'post')
}
