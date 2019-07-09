import { $axios } from '../../config/axios'
// 获取店铺会员规则
export default function(obj){
    return $axios.call(this,'/api/ShopVip/GetShopVipRule',obj,'get')
}