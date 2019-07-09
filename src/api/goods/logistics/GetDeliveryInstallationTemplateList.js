import { $axios } from '../../../config/axios'

//获取安装模板列表

export default function (obj) {
  return $axios.call(this, 'api/ExpressTemplate/GetDeliveryInstallationTemplateList', obj, 'get')
}
