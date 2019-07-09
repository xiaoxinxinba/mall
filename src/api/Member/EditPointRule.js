import { $axios } from '../../config/axios'
//  修改店铺积分规则
export default function(obj){
    return $axios.call(this,'/api/ShopVip/EditPointRule',obj,'post')
}