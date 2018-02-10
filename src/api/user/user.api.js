/**
 * Created by guooug on 2017/7/7.
 */
import http from '@/service/common/http/http.service'
import ToastService from '@/service/toast/toast.service'
import {Codes} from '@/config/config'
class UserApi {
  constructor() {
    this.option = {
      token: true,
      showLoading: true
    }
    this.saveCartUrl = 'user/url/saveCart'
    this.collectPrdUrl = 'user/url/savePrd'
    this.judgePrdIsCollectionUrl = 'user/url/judgePrdIsCollection'
    this.filterCouponUrl = 'user/url/filterCoupon'
    this.getAccountInfoUrl = 'user/url/getAccountInfo'
    this.modifyUserInfoUrl = 'user/url/modifyUserInfo'
    this.setDefaultAddressUrl = 'user/url/setDefaultAddress'
    this.delAddressUrl = 'user/url/delAddress'
    this.addAddresssUrl = 'user/url/suAddress'
    this.getCartPrdListUrl = 'user/url/getCartPrdList' // 获取购物车列表
    this.getdelCartPrdUrl = 'user/url/delCartPrd' // 购物车列表删除商品
    this.editCartPrdUrl = 'user/url/editCartPrd' // 购物车列表编辑商品
    this.getOrderFrontListUrl = 'order/url/getOrderFrontList' // 订单列表
    this.delOrderUrl = 'order/url/deleteOrder' // 删除订单
    this.cancelOrderUrl = 'order/url/cancel' // 取消订单
    this.remindDeliverUrl = 'order/url/remindDeliver' // 提醒发货
    this.confirmGetPrdUrl = 'order/url/confirmGetPrd' // 确认收货
    this.getOrderDetailUrl = 'order/url/getOrderInfo' // 订单详情
    this.getConsumeOrderInfoUrl = 'order/url/getConsumeOrderInfo' // 消费券详情
    this.getCartPrdNumUrl = '/user/url/getCartPrdNum' // 获取购车数量
    this.getConsumeOrderListUrl = 'order/url/getConsumerCodeList' // 消费券列表
  }

  /**
   * 添加商品到购车
   * @param params
   * doorId  店铺id  number
   * num  数量  number
   * prdId  产品id  number
   * priceId  价格id  number
   * userId  用户id  number
   * @returns {Promise.<*>}
   */
  async saveCart(params) {
    let data = await http.post(this.saveCartUrl, params, this.option)
      .then((data) => {
        if (data.code === Codes.success) {
          if (data.data === null) {
            ToastService.bottom('成功加入购物车')
          } else if (data.data === 0) {
            ToastService.bottom('已达购买上限')
          }
        } else {
          ToastService.bottom('加入购物车失败')
        }
        return data
      })
    return data
  }

  /**
   *收藏商品
   * @param params
   * prdId  商品id  number
   * doorId  店铺id  number
   * userId  用户id  number
   * @returns {Promise.<*>}
   */
  async collectPrd(params) {
    let data = await http.post(this.collectPrdUrl, params, this.option)
      .then((data) => {
        if (data.code === Codes.code01 || data.code === Codes.success) {
          ToastService.bottom('收藏成功')
        } else {
          ToastService.bottom('收藏失败')
        }
        return data
      })
    return data
  }

  /**
   * 判断用户是否收藏过某件商品
   * @param params
   * 变量名  含义  类型  备注
   * doorId  必传，店铺id  number
   * prdId  必传，产品id  number
   * userId  必传，用户id  number
   * @returns {Promise.<*>}
   */
  async judgePrdIsCollection(params) {
    let data = await http.post(this.judgePrdIsCollectionUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 筛选用户可用的优惠券
   * @param params
   *  doorId  店铺id  number
   *  totalCommodity  总价  number
   *  userId  用户id  number
   * @returns {Promise.<*>}
   */
  async filterCoupon(params) {
    let data = await http.post(this.filterCouponUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 获取用户的详细信息
   * @param params
   * userId
   * @returns {Promise.<*>}
   */
  async getAccountInfo(params) {
    let data = await http.post(this.getAccountInfoUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 修改用户的昵称
   * @param params
   *  headImg  用户头像  string
   *  nickName  昵称  string
   *  userId  必传，用户id  number
   * @returns {Promise.<*>}
   */
  async modifyUserInfo(params) {
    let data = await http.post(this.modifyUserInfoUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 修改用户的昵称
   * @param params
   *  addressId  地址id
   * @returns {Promise.<*>}
   */
  async setDefaultAddress(params) {
    let data = await http.post(this.setDefaultAddressUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 修改用户的昵称
   * @param params
   *  id  地址id
   * @returns {Promise.<*>}
   */
  async delAddress(params) {
    let data = await http.post(this.delAddressUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 修改用户的昵称
   * @param params
   *  id  地址id
   * @returns {Promise.<*>}
   */
  async addAddress(params) {
    let data = await http.post(this.addAddresssUrl, params, {
      token: true
    })
    return data
  }

  /**
   * 获取购物车列表
   * @param params
   * pageNum  请求页数  number
   * pageSize  请求条数  number
   * userId  用户id  number
   * @returns {Promise.<*>}
   */
  async getCartPrdList(params) {
    let data = await http.post(this.getCartPrdListUrl, params, this.option)
      .then((data) => {
        if (data.code !== Codes.success) {
          ToastService.bottom('获取购物车列表失败')
          return
        }
        for (let i = 0; i < data.data.doorPrdList.length; i++) {
          data.data.doorPrdList[i]['checked'] = false
          data.data.doorPrdList[i]['isEdit'] = false
          for (let j = 0; j < data.data.doorPrdList[i].prdList.length; j++) {
            data.data.doorPrdList[i].prdList[j]['money'] = data.data.doorPrdList[i].prdList[j].discountPrice * data.data.doorPrdList[i].prdList[j].num
            data.data.doorPrdList[i].prdList[j]['checked'] = false
          }
        }
        return data
      })
    return data
  }

  /**
   * 批量删除购物车商品
   * @param params
   * ids  要删除的商品ID  Array
   * userId  用户id  number
   * @returns {Promise.<*>}
   */
  async getdelCartPrd(params) {
    let data = await http.post(this.getdelCartPrdUrl, params, this.option)
      .then((data) => {
        if (data.code !== Codes.success) {
          ToastService.bottom(data.mesg)
          return
        }
        return data
      })
    return data
  }

  /**
   * 购物车列表编辑商品
   * @param params
   * doorId
   * id 购物车id
   * num 数量
   * prdId 商品ID
   * priceId
   * userId  用户id  number
   * @returns {Promise.<*>}
   */
  async geteditCartPrd(params) {
    let data = await http.post(this.editCartPrdUrl, params, this.option)
      .then((data) => {
        if (data.code !== Codes.success) {
          ToastService.bottom(data.mesg)
          return
        }
        return data
      })
    return data
  }

  // 获取订单列表
  async getOrderFrontList(params, option = {}) {
    let options = Object.assign({token: true}, option)
    let data = await http.post(this.getOrderFrontListUrl, params, options)
    let result = {
      list: data.data.orderList,
      page: {
        pageNum: data.data.pageNum,
        totalPage: data.data.totalPage
      }
    }
    return result
  }

  // 删除订单
  async delOrder(params) {
    let data = await http.post(this.delOrderUrl, params, {token: true, showLoading: true})
    return data
  }

  // 取消订单
  async cancelOrder(params) {
    let data = await http.post(this.cancelOrderUrl, params, {token: true, showLoading: true})
    return data
  }

  // 提醒发货
  async remindDeliver(params) {
    let data = await http.post(this.remindDeliverUrl, params, {token: true, showLoading: true})
    return data
  }

  // 确认收货
  async confirmGetPrd(params) {
    let data = await http.post(this.confirmGetPrdUrl, params, {token: true, showLoading: true})
    return data
  }

  // 获取订单详情
  async getOrderDetail(params) {
    let data = await http.post(this.getOrderDetailUrl, params, {token: true, showLoading: true})
    return data
  }

  // 消费券详情
  async getConsumeOrderInfo(params) {
    let data = await http.post(this.getConsumeOrderInfoUrl, params, {token: true, showLoading: false})
    return data
  }

  // 消费券列表
  async getConsumeOrderList(params) {
    let data = await http.post(this.getConsumeOrderListUrl, params, {token: true, showLoading: false})
    return data
  }

  // 获取购物车的数量
  async getCartPrdNum(params) {
    let data = await http.post(this.getCartPrdNumUrl, params, {token: true, showLoading: false})
    return data
  }
}
export default new UserApi()
