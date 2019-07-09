import { $axios } from '../../config/axios'
//  获取店铺积分发放规则
export default function(obj){
    return $axios.call(this,'/api/ShopVip/GetPointRule',obj,'get')
}