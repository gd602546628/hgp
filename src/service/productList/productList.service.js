/**
 * Created by ljl on 2017/6/20.
 */
import http from '@/service/common/http/http.service'
import {ProductListAdaptor} from './adaptor'
class ProductList {
  constructor() {
    this.productList = 'door/getPrdList'
    this.prdSearch = 'search/getPrdSearchList'
  }

  /**
   * 获取店铺列表信息
   * @param params
   * @returns {Promise.<void>}
   */
  async getPrdList(params) {
    let data = await http.post(this.productList, params)
    return data
  }

  async prdSearchList(params, option) {
    let data = await http.post(this.prdSearch, params, option)
    let result = {
      list: [],
      page: {
        pageNum: data.data.page.pageNum,
        totalPage: data.data.page.totalPage
      }
    }
    data.data.dataList.forEach(item => {
      result.list.push(ProductListAdaptor(item))
    })
    return result
  }
}
export default new ProductList()
