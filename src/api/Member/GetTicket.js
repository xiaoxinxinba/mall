import { $axios } from '../../config/axios'
//   获取商家设置的积分兑换券
export default function(obj){
    return $axios.call(this,'/api/ShopVip/GetTicket',obj,'get')
}