import { $axios } from '../../../config/axios'

////获取要修改的安装模板

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryInstallationTemplate', obj, 'get')
}
