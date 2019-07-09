import { $axios } from '../../config/axios'
//获取推荐商品
export default function (obj) {
  return  $axios.call(this, 'api/Order/GetGoodsCommend', obj, 'get')
}
