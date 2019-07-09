import { $axios } from '../../config/axios'

export default function (obj) {
  return $axios.call(this,'/api/ShopActivity/InsertBuyProductGetProduct', obj, 'post')
}

/**添加或编辑买赠活动*/
