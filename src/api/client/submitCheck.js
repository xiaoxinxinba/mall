import { $axios } from '../../config/axios'

export default function (obj) {
  alert();
  return $axios.call(this, 'api/OrderComment/shopApplyPlatformInvolved ', obj, 'post')
}
