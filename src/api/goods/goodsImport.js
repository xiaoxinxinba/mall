import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this, 'api/GoodsPublish/ImportGoodsSpecInfo', obj, 'post')
}
