import { $axios } from '../../config/axios'
//获取商家支持的物流信息
export default function (obj) {
  return  $axios.call(this, 'api/GoodsPublish/GetExpressCompanyList', obj, 'get')
}
