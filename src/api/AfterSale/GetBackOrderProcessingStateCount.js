import { $axios } from '../../config/axios'

//获取统计退单各处理状态数量

export default function (obj) {
  return $axios.call(this, 'api/BackOrder/GetBackOrderProcessingStateCount', obj, 'get')
}
