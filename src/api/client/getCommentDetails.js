import { $axios } from '../../config/axios'

//获取商家具体商品评论信息
export default function (obj) {
  return $axios.call(this, 'api/OrderComment/GetCommentDetailInfo', obj, 'get')
}
