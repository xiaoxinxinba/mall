import { $axios } from '../../config/axios'
//PC端获得商家当前是否有效包邮活动详情
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetShopValidFreepostageDetailPC', obj, 'get')
}
