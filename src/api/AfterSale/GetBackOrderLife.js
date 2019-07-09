import { $axios } from '../../config/axios'

//获取退单操作日志

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/GetBackOrderLife', obj, 'get')
}
