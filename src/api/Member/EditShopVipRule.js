import { $axios } from '../../config/axios'
//  开通、编辑店铺会员规则
export default function(obj){
    return $axios.call(this,'/api/ShopVip/EditShopVipRule',obj,'post')
}