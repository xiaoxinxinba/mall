import { $axios } from '../../config/axios'
//添加满折活动
export default function (obj) {
  return $axios.call(this, 'api/ShopActivity/AddMeetDiscount', obj, 'post')
}
