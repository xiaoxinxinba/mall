import { $axios } from '../../config/axios'
//   删除积分兑换券
export default function(obj){
    return $axios.call(this,'/api/ShopVip/DeleTicket',obj,'post')
}