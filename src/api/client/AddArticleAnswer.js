import { $axios } from '../../config/axios'

//添加商家回复问答
export default function (obj) {
  return $axios.call(this, 'api/AnswerQuestion/AddArticleAnswer', obj, 'post')
}
