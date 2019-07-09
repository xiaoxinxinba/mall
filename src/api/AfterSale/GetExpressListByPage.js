import { $axios } from '../../config/axios'

//获取物流方式列表

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/GetExpressListByPage', obj, 'get')
}
