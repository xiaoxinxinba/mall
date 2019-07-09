import { $axios } from '../../config/axios'

//商家端-获取商家订单评论统计信息(好、中、差各数量及占比)
export default function (obj) {
  return $axios.call(this, 'api/OrderComment/GetOrderCommentStatisticInfo', obj, 'get')
}
