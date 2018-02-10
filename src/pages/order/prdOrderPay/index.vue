/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasFooter="true">
    <div slot="main" class="main">
      <!--订单列表-->
      <order-door v-for="order,i in orderInfo" :order="order" :key="i"></order-door>
      <!--订单价格汇总-->
      <div class="order-statistics" v-if="false">
        <order-statistics :prd-price="totalPrdPrice" :postage="totalPostage" :discount="totalDiscountPrice"
                          :price="totalPrice">
        </order-statistics>
      </div>
      <!--支付方式选择-->
      <pay-type-component v-model="payType"></pay-type-component>
    </div>
    <div slot="footer" class="footer">
      <div class="btn-container">
        <button :disabled="!canSubmit" class="common-submit-btn" @click="submit()">
          {{buttonText}}￥{{totalPrice | toFixed}}
        </button>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import {mapGetters} from 'Vuex'
  import OrderApi from '@/api/order/order.api'
  import {Codes} from '@/config/config'
  import OrderDoor from './_order-door'
  import OrderStatistics from '@/components/order/order-statistics.component'
  import WeixinService from '@/service/weixin/weixin.service'
  import PayTypeComponent from '@/components/pay/pay-type.component'
  import OrderService from '@/service/order/order.service'
  import Utils from '@/service/common/utils/util.service'
  import Toast from '@/service/toast/toast.service'

  export default {
    name: 'prdOrderPay',
    data () {
      return {
        payId: '',
        paySource: 0, //  0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
        paySuccessRouterName: 'payResult',
        orderId: this.$route.params.orderId,
        openId: '',
        orderInfo: [],
        payType: (() => {
          return WeixinService.isWeixin() ? 1 : 0
        })()
      }
    },
    created(){
      this.init()
    },
    computed: {
      ...mapGetters(['userInfo']),
      totalPrice(){
        let total = 0
        this.orderInfo.forEach(order => {
          total += order.orderDetail.totalPrice
        })
        return total
      },
      totalDiscountPrice(){
        let total = 0
        this.orderInfo.forEach(order => {
          total += order.orderDetail.discountTotalPrice
        })
        return total
      },
      totalPostage(){
        let total = 0
        this.orderInfo.forEach(order => {
          total += order.orderDetail.postage
        })
        return total
      },
      totalPrdPrice(){
        /*  需要支付的总价=商品总价-已优惠券的+邮费
         商品总价=需要支付的总价+已优惠券的-邮费 */
        return this.totalPrice + this.totalDiscountPrice - this.totalPostage
      },
      canSubmit(){
        let flag = WeixinService.isWeixin() ? this.openId : true
        flag = flag && (!this.paidNum || !this.payId)
        return flag
      },
      paidNum(){
        let num = 0
        this.orderInfo.forEach((order) => {
          if (order.orderDetail.status) { // 0是未支付
            ++num
          }
        })
        return num
      },
      isOnline(){
        let isOffline = false
        this.orderInfo.forEach((order) => {
          if (order.orderDetail.orderType) { // 0是线上的，1是线下的
            isOffline = true
          }
        })
        return !isOffline
      },
      buttonText(){
        if (this.paidNum) {
          if (this.paidNum === this.orderInfo.length) {
            return '订单已支付'
          } else {
            return '部分订单已完成支付'
          }
        }
        return '确认支付'
      }
    },
    methods: {
      // 获取支付ID
      async getPayId(orderIds){
        this.payId = await OrderService.addPayOrderId(orderIds, this.paySource).catch(e => {
          throw e
        })
      },
      getReturnUrl (params) {
        let urlPrefix = window.location.href.split('#')[0]
        let paramsStr = encodeURIComponent(JSON.stringify(params))
        return `${urlPrefix}#/${this.paySuccessRouterName}/${paramsStr}`
      },
      async init(){
        this.getOrderInfo()
        this.getPayId(this.orderId)
        if (WeixinService.isWeixin()) {
          let data = await WeixinService.getOpenId()
          this.openId = data
          console.info(data)
        }
      },
      async getOrderInfo(){
        let params = {
          orderId: this.orderId
        }
        let data = await OrderApi.getOrderInfo(params).catch(e => {
          console.info(e)
        })
        if (data.code === Codes.success) {
          this.orderInfo = data.data
        }
      },
      async submit(){
        if (this.paidNum) { // 部分订单已经完成支付
          if (this.isOnline) {
            this.$router.push({
              name: 'onlineMyOrder',
              params: {
                status: 1
              }
            })
          } else {
            this.$router.push({
              name: 'offlineMyOrder',
              params: {
                status: 2
              }
            })
          }
          return
        }
        let params = {
          type: 'prdOrder',
          isOnline: this.isOnline,
          payId: this.payId // 支付ID
        }
        let returnUrl = this.getReturnUrl(params)
        await OrderService.pay(this.userInfo.userId, this.payId, this.paySource, this.payType, returnUrl, this.openId).catch(e => {
          Utils.alert({message: e})
          throw String('支付失败')
        })
        Toast.bottom('支付成功')
        this.$router.push({
          name: 'payResult',
          params: {
            params: encodeURIComponent(JSON.stringify(params))
          }
        })
      }
    },
    components: {
      'order-door': OrderDoor,
      'order-statistics': OrderStatistics,
      'pay-type-component': PayTypeComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  @import "../../../assets/css/variables-primary";

  .main {
    padding-bottom: 40px;
  }

  .btn-container {
    height: 49px;
  }

  .order-statistics {
    margin: 10px;
  }
</style>
