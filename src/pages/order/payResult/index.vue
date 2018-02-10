/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page>
    <div slot="main">
      <div class="desc">
        <img :src="imgSrc" alt="">
        <span>支付成功</span>
      </div>
      <div class="btn-container">
        <button class="common-submit-btn" :disabled="!success" @click="submit()">确定</button>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import Img from '@/assets/img/zfcg.png'
  import OrderApi from '@/api/order/order.api'
  import {Codes} from '@/config/config'
  import Utils from '@/service/common/utils/util.service'
  export default {
    name: 'payResult',
    data () {
      return {
        imgSrc: Img,
        success: false,
        prdOrder: 'prdOrder', // 商品订单
        serversOrder: 'serversOrder' // 好服务支付订单
      }
    },
    computed: {
      params(){
        try {
          return JSON.parse(decodeURIComponent(decodeURIComponent(this.$route.params.params)))
        } catch (e) {
          return {}
        }
      }
    },
    mounted(){
      this.getOrderState()
    },
    methods: {
      goToPrd(){
        if (this.params.isOnline) {
          //  跳转到待发货界面
          this.$router.replace({
            name: 'onlineMyOrder',
            params: {
              status: 1
            }
          })
        } else {
          //  跳转到待消费界面
          this.$router.replace({
            name: 'offlineMyOrder',
            params: {
              status: 2
            }
          })
        }
      },
      goToServers(){
        //  跳转到我的服务列表页
        this.$router.replace({
          name: 'myService'
        })
      },
      goToDraw(data){
        let url = ''
        let msg = ''
        data.forEach((item) => {
          if (item.drawChageInfo && item.drawChageInfo.drawUrl) {
            url = item.drawChageInfo.drawUrl
            msg = item.drawChageInfo.drawPrompt
          }
        })
        if (url) {
          Utils.confirm({
            message: msg || '恭喜你获得一次抽奖机会',
            confirmButtonText: '去抽奖',
            cancelButtonText: '放弃抽奖'
          }).then((data) => {
            if (data === 'confirm') {
              // todo 跳转到抽奖界面
              console.info('todo 跳转到抽奖界面')
              Utils.openUrl(url)
            }
          })
        }
      },
      async getOrderState(){
        if (this.params.type === this.prdOrder) { // 产品订单需要查询订单状态
          let payId = this.params.payId || this.params.id
          let data = await OrderApi.getStatus({payId: parseInt(payId)}).catch(e => {
            throw e
          })
          if (data.code === Codes.success) {
            // 单支付成功
            if (data.data.length > 0 && [1, 2, 3, 4].indexOf(data.data[0].storeOrderInfo.status) !== -1) {
              this.success = true
              this.goToDraw(data.data)
            }
          }
          if (!this.success) {
            setTimeout(() => {
              this.getOrderState()
            }, 2000)
          }
        } else {
          this.success = true
        }
      },
      submit(){
        switch (this.params.type) {
          /* 商品订单 */
          case this.prdOrder:
            this.goToPrd()
            break
          /* 好服务订单 */
          case this.serversOrder:
            this.goToServers()
            break
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  @import "../../../assets/css/variables-primary";

  .desc {
    margin: 40px auto;
    text-align: center;
    img {
      height: 40px;
      width: auto;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      line-height: 40px;
      vertical-align: middle;
      font-size: 16px;
      color: map_get($ComColors, wathet-blue);
    }
  }

  .btn-container {
    margin: 20px;
    height: 40px;
    button {
      border-radius: 5px;
    }
  }
</style>
