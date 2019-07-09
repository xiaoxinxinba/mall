import { $axios } from '../../config/axios'

//获取商家已经配置了物流模板的快递公司列表
export default function (obj) {
  return  $axios.call(this, '/api/GoodsPublish/GetValidExpressCompanyList', obj, 'get')
}
