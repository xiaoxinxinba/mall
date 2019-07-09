import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this, 'api/GoodsPublish/ExportGoodsSpecInfo', obj, 'get', null, {
      responseType: 'blob'
  })

}
