import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this, 'api/GoodsPublish/PriceAuditInfo', obj, 'get')
}
