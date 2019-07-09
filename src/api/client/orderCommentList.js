import { $axios } from '../../config/axios'

//获取商家订单评论分页列表(待完善)
export default function (obj) {
    return $axios.call(this, 'api/OrderComment/GetOrderCommentSearchPageList', obj, 'get')
}
