import { $axios } from '../../config/axios'
//发布活动 获取商品列表
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/GetGoodsBriefInfoByPage', obj, 'get')
}
