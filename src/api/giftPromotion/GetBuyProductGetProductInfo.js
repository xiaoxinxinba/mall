import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/GetBuyProductGetProductInfo', obj, 'get')
}

/**买一赠一百 详情*/
