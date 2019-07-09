import { $axios } from '../../config/axios'
//  获取领取商家会员卡的用户列表
export default function(obj){
    return $axios.call(this,'/api/ShopVip/GetShopVipCardList',obj,'get')
}