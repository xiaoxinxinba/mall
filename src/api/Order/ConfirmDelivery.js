import { $axios } from '../../config/axios'

//同意送达
export default function (obj) {
  return  $axios.call(this, 'api/Order/ConfirmDelivery', obj, 'post')
}
