/**
* Created by guooug on 2017/6/16.
*/

<template lang="html">
  <zyt-page>
    <div slot="main">

      <div class="row">
        <div class="col img-container">
          <img-component :img-src="orderInfo.titleImage"></img-component>
        </div>
        <div class="col info-container">
          <p class="title">{{orderInfo.serviceName}}</p>
          <div class="space-between smaller">
            <p>预约时间：{{orderInfo.createTime}}</p>
            <price-component :price="orderInfo.totalPrice" class="price-container"></price-component>
          </div>
        </div>
      </div>

      <pay-type-component v-model="payType"></pay-type-component>
      <div class="btn-container">
        <button :disabled="!canSubmit" class="common-submit-btn" @click="submit()">
          确认支付￥{{orderInfo.totalPrice | toFixed}}
        </button>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import GoodService from '@/service/goodService/goodService.service'
  import WeixinService from '@/service/weixin/weixin.service'
  import PayTypeComponent from '@/components/pay/pay-type.component'
  import ImgComponent from '@/components/common/img/img.component'
  import PriceComponent from '@/components/common/price/price.component'
  import OrderService from '@/service/order/order.service'
  import Utils from '@/service/common/utils/util.service'
  import Toast from '@/service/toast/toast.service'

  export default {
    name: 'serversPay',
    data () {
      return {
        payId: '', // 支付id
        paySource: 4, // paySource 0：网店支付，1：一元夺宝，2：秒杀,3：汽车票,4好服务...
        id: this.$route.params.id,
        openId: '',
        serversOrder: 'serversOrder',
        paySuccessRouterName: 'payResult',
        orderInfo: this.$route.params.orderInfo || {},
        payType: (() => {
          return WeixinService.isWeixin() ? 1 : 0
        })()
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      canSubmit(){
        let flag = WeixinService.isWeixin() ? this.openId : true
        flag = flag && (!this.paidNum || !this.payId)
        return flag
      }
    },
    methods: {
      // 获取支付ID
      async getPayId(orderIds){
        this.payId = await OrderService.addPayOrderId(orderIds, this.paySource).catch(e => {
          throw e
        })
      },
      async getMyServiceDetail(){
        let data = await GoodService.getMyServiceDetail({id: this.id})
        if (data) {
          this.orderInfo = data.serviceOrderInfo
        }
      },
      init(){
        if (!this.orderInfo.id) {
          this.getMyServiceDetail()
        }
        this.getPayId(this.id)
      },
      getReturnUrl (params) {
        let urlPrefix = window.location.href.split('#')[0]
        let paramsStr = encodeURIComponent(JSON.stringify(params))
        return `${urlPrefix}#/${this.paySuccessRouterName}/${paramsStr}`
      },
      async submit(){
        if (this.paidNum) { // 部分订单已经完成支付
          this.$router.push({
            name: 'myService'
          })
          return
        }
        let params = {
          type: this.serversOrder,
          id: this.id
        }
        let returnUrl = this.getReturnUrl(params)
        await OrderService.pay(this.userInfo.userId, this.payId, this.paySource, this.payType, returnUrl, this.openId).catch(e => {
          Utils.alert({message: e})
          throw String('支付失败')
        })
        Toast.bottom('支付成功')
        this.$router.push({
          name: this.paySuccessRouterName,
          params: {
            params: encodeURIComponent(JSON.stringify(params))
          }
        })
      }
    },
    mounted(){
      this.init()
    },
    components: {
      'pay-type-component': PayTypeComponent,
      'img-component': ImgComponent,
      'price-component': PriceComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .btn-container {
    margin: 30px 20px;
    height: 40px;
    button {
      height: 100%;
      border-radius: 5px;
    }
  }

  .row {
    /*    background-color: map_get($ComColors, gray-ef);*/
    padding: 5px 10px;
    /*    border-bottom: 1px solid map_get($ComBorderColor, dd);*/
    &:last-child {
      border-bottom: 0px solid map_get($ComBorderColor, dd);
    }
    .img-container {
      width: 70px;
      max-width: 70px;
    }
    .info-container {
      padding-left: 10px;
      .title {
        font-size: 14px;
      }
      .smaller {
        font-size: small;
      }
      .space-between {
        padding-top: 5px;
      }
    }
    .price-container {
      font-size: 16px;
      color: map_get($ComColors, wathet-blue);
    }
  }
</style>
