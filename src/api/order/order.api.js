/**
 * Created by guooug on 2017/7/7.
 */
import http from '@/service/common/http/http.service'
import {Codes} from '@/config/config'
import Util from '@/service/common/utils/util.service'
class OrderApi {
  constructor () {
    this.option = {
      token: true,
      showLoading: true
    }
    this.addOrderUrl = 'order/url/addOrder' // 新增订单
    this.getOrderInfoUrl = 'order/url/getOrderInfo' // 获取订单详情
    this.addPayOrderUrl = 'order/url/addPayOrder' // 新增支付订单
    this.getAliPayOrderUrl = 'common/url/getAliPayOrder' // 获取阿里的支付订单
    this.getWxPayOrderUrl = 'common/url/getWxPayOrder' // 获取微信的订单
    this.getStatusUrl = 'order/getStatus'
  }

  /**
   * 修改用户的昵称
   * @param params
   变量名  含义  类型  备注
   addressId    number
   order    array<object>
   ***doorId    number
   ***orderPrd    array<object>
   ******num    number
   ******prdId    number
   ******priceId    number
   ***userCouponId    string
   userId    number
   * @returns {Promise.<*>}
   */
  async addOrder (params) {
    let data = await http.post(this.addOrderUrl, params, this.option).catch(e => {
      console.info('新增订单失败：', e)
    })
    if (data.code === Codes.success) {
      return data.data
    } else if (data) {
      Util.alert({
        message: data.mesg
      })
      return null
    } else {
      return null
    }
  }

  /**
   * 获取订单详情
   * @param params
   orderId  订单id  string
   userId  用户id  number
   * @returns {Promise.<*|Promise.<T>>}
   */
  async getOrderInfo (params) {
    let data = await http.post(this.getOrderInfoUrl, params, this.option).catch(e => {
      console.info('新增订单失败：', e)
    })
    if (data.code !== Codes.success) {
      Util.alert({
        message: data.mesg
      })
    }
    return data
  }

  /**
   * 新增支付订单
   * @param params
   orderId 业务订单
   paySource 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
   * @returns {Promise.<*|Promise.<T>>}
   */
  async addPayOrder (params) {
    let data = await http.post(this.addPayOrderUrl, params, this.option).catch(e => {
      console.info('新增订单失败：', e)
    })
    return data
  }

  /**
   * 获取阿里的支付订单
   * @param params
   body 订单描述  string
   payOrderId 支付订单id  number
   subject 订单标题  string
   type支付类型 0-APP支付 1-H5支付  number
   returnUrl H5-支付成功的回调函数
   * @returns {Promise.<*|Promise.<T>>}
   */
  async getAliPayOrder (params) {
    let data = await http.post(this.getAliPayOrderUrl, params, this.option).catch(e => {
      throw String('获取支付宝订单失败')
    })
    return data
  }

  /**
   * 获取阿里的支付订单
   * @param params
   body 订单详情  string
   payOrderId 支付订单id  number
   subject 标题
   openId 微信用户对公众号的唯一标识  string ，微信公众号支付的时候需要
   * @returns {Promise.<*|Promise.<T>>}
   */
  async getWxPayOrder (params) {
    let data = await http.post(this.getWxPayOrderUrl, params, this.option).catch(e => {
      throw String('获取微信订单失败')
    })
    return data
  }

  /**
   * 获取订单状态
   * @param params
   * orderId
   * @returns {Promise.<*|Promise.<T>>}
   */
  async getStatus (params) {
    let data = await http.post(this.getStatusUrl, params, {
      token: true
    }).catch(e => {
      throw String('获取订单信息失败')
    })
    return data
  }
}
export default new OrderApi()
