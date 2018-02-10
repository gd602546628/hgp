/**
 * Created by guooug on 2017/7/24.
 */
import Native from '@/service/common/native/native.service'
import OrderApi from '@/api/order/order.api'
import {Codes} from '@/config/config'
import WeixinService from '@/service/weixin/weixin.service'
class OrderService {
  constructor () {
    this.aliCode = {
      aliSuccess: '9000', // 订单支付成功
      ali8000: '8000', // 正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
      ali4000: '4000', // 订单支付失败
      ali5000: '5000', // 重复请求
      ali6001: '6001', // 用户中途取消
      ali6002: '6002', // 网络连接出错
      ali6004: '6004'// 支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
    }
    this.wxCode = {
      wxSuccess: '0', // 支付成功
      wx1: '-1', // 可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。
      wx2: '-2', // 用户取消
      wx3: '-3', // 没有安装微信客户端
      wx4: '-4', // 微信当前版本不支持支付
      wx5: '-5'// 无法调起微信
    }
    this.className = 'payment_module'
    this.methodNameAliPay = 'aliPay'
    this.methodNameWeixinPay = 'wxPay'
    // 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
    this.paySourceDesc = [
      '网店支付',
      '一元夺宝',
      '秒杀',
      '汽车票',
      '好服务'
    ]
    this.typeDesc = [
      '支付宝',
      '微信'
    ]
  }

  getOrderDesc (payOrderId, paySource, type) {
    // 网店支付_支付宝_xxxxxx
    return `${this.paySourceDesc[paySource]}_${this.typeDesc[type]}_${payOrderId}`
  }

  async aliPay (userId, payOrderId, paySource, returnUrl) {
    let isApp = Native.isApp()
    let orderInfo = await this._getAliOrder(payOrderId, paySource, returnUrl).catch(e => {
      throw e
    })
    if (isApp) {
      return await this._aliPayByApp(orderInfo, userId).catch(e => {
        throw e
      })
    } else {
      let div = document.createElement('div')
      div.style.display = 'none'
      div.innerHTML = orderInfo
      document.body.appendChild(div)
      let form = div.querySelector('form')
      form.submit()
      throw String('正在打开支付界面')
    }
  }

  /**
   * ali支付 通过app方式支付
   * @param params 获取的ali支付订单
   * @returns {*}
   */
  async _aliPayByApp (params, userId) {
    let data = {
      userId: userId,
      aliPayOrderInfo: params
    }
    return Native.todoNative(this.className, this.methodNameAliPay, data)
      .catch((data) => {
        if (data.code === this.aliCode.aliSuccess) {
          return Promise.resolve(data)
        } else if (data.code === this.aliCode.ali6001) {
          return Promise.reject('支付过程被取消，若不感兴趣该商品可以看看其它的')
        } else {
          return Promise.reject('支付异常，请重新确认订单或余额再次尝试')
        }
      })
  }

  /* eslint-disable no-undef */

  /**
   * 微信支付  通过app方式支付
   * @param params
   * @returns {*}
   */
  _wxPayByApp (params, userId) {
    let data = {
      userId: userId,
      wxPayOrderInfo: JSON.parse(params)
    }
    return Native.todoNative(this.className, this.methodNameWeixinPay, data)
      .catch((data) => {
        if (data.code === this.wxCode.wxSuccess) {
          return Promise.resolve(data)
        } else if (data.code === this.wxCode.wx3 || data.code === this.wxCode.wx4) {
          return Promise.reject('未安装微信或微信版本过低')
        } else if (data.code === this.wxCode.wx5) {
          return Promise.reject('调用支付失败，换个支付方式试试')
        } else if (data.code === this.wxCode.wx2) {
          return Promise.reject('支付过程被取消，若不感兴趣该商品可以看看其它的')
        } else {
          return Promise.reject('支付异常，请重新确认订单或余额再次尝试')
        }
      })
  }

  _wxPayByH5 (params) {
    return new Promise((resolve, reject) => {
      if (WeixinJSBridge && WeixinJSBridge.invoke) {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', JSON.parse(params),
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              //  console.info('支付成功');
              resolve('支付成功')
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              //  console.info('支付已取消');
              reject('支付已取消')
            } else {
              //  console.info('支付失败');
              reject('支付失败')
            }
          }
        )
      } else {
        reject('不支付微信公众号支付')
      }
    })
  }

  async wxPay (userId, payOrderId, paySource, openId) {
    let isApp = Native.isApp()
    let orderInfo = await this._getWeixinOrder(payOrderId, paySource, openId).catch(e => {
      throw e
    })
    if (isApp) {
      return await this._wxPayByApp(orderInfo, userId).catch(e => {
        throw e
      })
    } else {
      return await this._wxPayByH5(orderInfo).catch(e => {
        throw e
      })
    }
  }

  /**
   *  获取支付订单
   * @param orderId 业务订单
   * @param paySource 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
   */
  async addPayOrderId (orderId, paySource) {
    let data = await OrderApi.addPayOrder({
      orderIds: orderId,
      paySource: paySource
    })
    if (data.code === Codes.success) {
      return data.data
    }
    throw String('获取支付订单失败')
  }

  /**
   * 获取阿里的支付订单
   * @param payOrderId 支付订单id  number
   * @param paySource 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
   * @param subject 订单标题  string
   * @param type支付类型 0-APP支付 1-H5支付  number
   */
  async _getAliOrder (payOrderId, paySource, returnUrl) {
    let type = Native.isApp() ? 0 : 1
    let body = this.getOrderDesc(payOrderId, paySource, 0)
    var params = {
      payOrderId: payOrderId,
      body: body,
      subject: body,
      type: type,
      returnUrl: returnUrl
    }
    let data = await OrderApi.getAliPayOrder(params).catch(e => {
      throw e
    })
    if (data.code !== Codes.success) {
      throw data.mesg
    }
    return data.data
  }

  /**
   * 获取微信支付的订单
   * @param body 订单详情  string
   * @param payOrderId 支付订单id  number
   * @param subject 标题
   * @param openId 微信用户对公众号的唯一标识  string ，微信公众号支付的时候需要
   */
  async _getWeixinOrder (payOrderId, paySource, openId) {
    let body = this.getOrderDesc(payOrderId, paySource, 1)
    var params = {
      payOrderId: payOrderId,
      body: body,
      subject: body
    }
    if (openId) {
      params['openId'] = openId
    }
    let data = await OrderApi.getWxPayOrder(params).catch(e => {
      throw e
    })
    if (data.code !== Codes.success) {
      throw data.mesg
    }
    return data.data
  }

  /**
   *
   * @param payId  支付ID
   * @param paySource 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
   * @param type  支付方式 0：阿里，1：微信
   * @param body 订单描述  string
   * @param subject 订单标题  string
   * @param returnUrl 阿里H5支付需要
   */
  async pay (userId, payId, paySource, type, returnUrl, openId) {
    if (type === 0) {
      // 支付宝支付
      return await this.aliPay(userId, payId, paySource, returnUrl).catch(e => {
        throw e
      })
    } else {
      // 微信支付
      return await this.wxPay(userId, payId, paySource, openId).catch(e => {
        throw e
      })
    }
  }

  /**
   * 跳转到产品订单支付界面
   * @param orderIds 比如 1,2,3,4
   * @param router 传入 this.$router
   */
  goToPrdPayPage (orderIds, router, push) {
    if (WeixinService.isWeixin()) {
      let urlPrefix = window.location.href.split('#')[0]
      let url = `${urlPrefix}#/prdOrderPay/${orderIds}`
      WeixinService.openAuth(url)
    } else {
      let method = push ? 'push' : 'replace'
      router[method]({
        name: 'prdOrderPay',
        params: {
          orderId: orderIds
        }
      })
    }
  }

  // 跳转到服务支付界面
  goToServersPayPage (id, orderInfo, router) {
    if (WeixinService.isWeixin()) {
      let urlPrefix = window.location.href.split('#')[0]
      let url = `${urlPrefix}#/serversPay/${id}`
      WeixinService.openAuth(url)
    } else {
      router.push({
        name: 'serversPay',
        params: {
          id: id,
          orderInfo: orderInfo
        }
      })
    }
  }
}
export default new OrderService()
