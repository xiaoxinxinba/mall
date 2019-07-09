import { $axios } from '../../config/axios'

//获取商家问答详情
export default function (obj) {
  return $axios.call(this, 'api/AnswerQuestion/GetShopQuestionDetail', obj, 'get')
}
