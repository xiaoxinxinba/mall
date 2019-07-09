import { $axios } from '../../config/axios'

//商家pc申请平台介入
export default function (obj) {
  return $axios.call(this, 'api/OrderComment/shopApplyPlatformInvolved', obj, 'post')
}
