import { $axios } from '../../config/axios'
//  获取经营分析数据
export default function(obj){
    return $axios.call(this,'/api/ShopVip/GetBusinessAnalysisInfo',obj,'get')
}