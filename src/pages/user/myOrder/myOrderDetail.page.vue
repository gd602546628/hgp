<template>
  <zyt-page :hasFooter="orderDetail.orderDetail.status==0">
    <div class="my-order-detail" v-if="orderDetail" slot="main" v-show="show" >

      <div class="header">
        <div class="person">
          <p class="name" v-if="orderDetail.orderDetail.orderType==0">{{orderDetail.orderDetail.receiverName}}</p>
          <p class="name" v-if="orderDetail.orderDetail.orderType==1">到店消费</p>
          <p class="mobile" v-if="orderDetail.orderDetail.orderType==1">{{orderDetail.doorInfo.tel}}</p>
          <p class="mobile" v-if="orderDetail.orderDetail.orderType==0">{{orderDetail.orderDetail.mobile}}</p>
        </div>
        <div class="address" v-if="orderDetail.orderDetail.orderType==1">
          店铺地址: {{orderDetail.doorInfo.provinceName + orderDetail.doorInfo.cityName + orderDetail.doorInfo.districtName
          + orderDetail.doorInfo.address}}
        </div>
        <div class="address" v-if="orderDetail.orderDetail.orderType==0">
          地址: {{orderDetail.orderDetail.detail}}
        </div>
      </div>

      <div class="prd-list">
        <div class="door">
          <div class="logo">
            <img :src="orderDetail.doorInfo.logo | imgPrefix">
            <span>{{orderDetail.doorInfo.name}}</span>
          </div>
        </div>

        <div class="prd-item" v-for="prd in orderDetail.prdInfos">
          <div class="prd-content" @click="goPrdInfo(prd)">
            <div class="prd-avatar" :style="{backgroundImage:'url('+imgPrefix(prd.prdImg)+')'}"></div>
            <div class="prd-info">
              <div class="prd-name">{{prd.prdName}}</div>
              <div v-if="prd.fpName||prd.spName" class="specification-box">
                <div class="prd-size" v-if="prd.fpName">{{prd.fpName}}: {{prd.fpValue}}</div>
                <div class="prd-size1" v-if="prd.spName">{{prd.spName}}: {{prd.spValue}}</div>
              </div>
              <div class="prd-price">
                <span class="num">X{{prd.num}}</span>
                <span class="price"><price-component :price="prd.totalPrice"></price-component></span>
              </div>
            </div>
          </div>
          <div class="order-btn">

            <div class="btn-remind btn-wrap" v-if="prd.orderStatus==1">
              <span class="remind btn" @click="remind(prd)">提醒发货</span>
            </div>

            <div class="btn-receive btn-wrap" v-if="prd.orderStatus==2">
              <span class="query btn" @click.stop="seeLogistics(prd)">物流查询</span>
              <span class="receive btn" @click.stop="confirm(prd)">确认收货</span>
            </div>

            <div class="btn-evaluate btn-wrap" v-if="prd.orderStatus==3">
              <span class="evaluate btn" @click.stop="evaluate(prd)">评价</span>
            </div>

            <div class="btn-complete btn-wrap" v-if="prd.orderStatus==4">
              <span class="add btn" v-if="prd.commentStatus!==3&&prd.commentStatus!==4" @click.stop="addEvaluate(prd)">追加评价</span>
              <span class="modify btn" v-if="prd.commentStatus!==2&&prd.commentStatus!==4"
                    @click.stop="modifyEvaluate(prd)">修改评价</span>
            </div>

          </div>
        </div>

        <div class="price-info">
          <div class="price-item">
            <span class="name">商品总额</span>
            <span class="price"><price-component :price="totalPrice"></price-component></span>
          </div>
          <div class="price-item" v-if="orderDetail.orderDetail.postage">
            <span class="name">邮寄费用</span>
            <span class="price"><price-component :price="orderDetail.orderDetail.postage"></price-component></span>
          </div>
          <div class="price-item">
            <span class="name">优惠</span>
            <span class="price"><price-component :price="orderDetail.orderDetail.discountTotalPrice"></price-component></span>
          </div>
          <div class="price-item">
            <span class="name">实付款</span>
            <span class="price"><price-component :price="orderDetail.orderDetail.totalPrice"></price-component></span>
          </div>
        </div>

      </div>

      <div class="order-info">
        <div>订单编号： {{orderDetail.orderDetail.code}}</div>
        <div>创建时间： {{orderDetail.orderDetail.updateTime}}</div>
      </div>
    </div>
    <div slot="footer" v-if="orderDetail.orderDetail.status==0">
      <div class="pay-order" >
        <div class="interval">
          <p class="title">付款剩余时间</p>
          <p class="time">{{interval.h}}小时{{interval.m}}分{{interval.s}}秒</p>
        </div>
        <div class="btn-wrap">
          <div class="cancel" @click.stop="cancelOrder()">取消订单</div>
          <div class="pay" @click.stop="toPay()">去支付</div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import api from '@/api/user/user.api'
  import {Config, Codes} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  import localStorageService from '@/service/common/localStorage/localStorage.service'
  import PriceComponent from '@/components/common/price/price.component'
  import OrderService from '@/service/order/order.service'
  import pic from '@/assets/img/wutu.png'
  // import OrderService from '@/service/order/order.service'
  export default {
    name: 'myOrderDetail',
    components: {
      'price-component': PriceComponent
    },
    data () {
      return {
        show: false,
        orderDetail: null,
        timer: null,
        interval: {
          h: 0,
          m: 0,
          s: 0
        }
      }
    },
    created(){
      this.init()
    },
    computed: {
      totalPrice () {
        let total = 0
        this.orderDetail.prdInfos.forEach(item => {
          total += item.totalPrice
        })
        return total
      }
    },
    methods: {
      imgPrefix (url) {
        if (url) {
          return Config.imgPrefix + url
        } else {
          return pic  // 无商品图时
        }
      },
      goPrdInfo (prd) {
        this.$router.push({
          name: 'productInfo',
          params: {
            doorId: this.orderDetail.orderDetail.doorId,
            prdId: prd.prdId
          }
        })
      },
      async init () {
        this.interval = {
          h: 0,
          m: 0,
          s: 0
        }
        if (this.timer) {
          clearInterval(this.timer)
        }
        let data = await api.getOrderDetail({orderId: this.$route.params.id})
        this.show = true
        this.orderDetail = data.data[0]
        if (parseInt(this.orderDetail.orderDetail.status) === 0) { // 订单状态为代付款
          this.orderPayInterval()
        }
      },
      /* 付款剩余时间倒计时 */
      orderPayInterval () {
        let createdTime = new Date(this.orderDetail.orderDetail.createTime.replace(/-/g, '/'))
        let nowTime = new Date(this.orderDetail.nowTime.replace(/-/g, '/'))
        let endTime = `${createdTime.getFullYear()}/${createdTime.getMonth() + 1}/${createdTime.getDate() + 1} 23:59:59`
        endTime = endTime.replace(/-/g, '/')
        endTime = new Date(endTime)
        let disTime = endTime.getTime() - nowTime.getTime()
        this.timer = setInterval(() => {
          if (disTime === 0) {
            clearInterval(this.timer)
            this.interval = {
              h: 0,
              m: 0,
              s: 0
            }
          }
          let hTime = parseInt(disTime / 3600000) * 3600000
          let mTime = parseInt((disTime - hTime) / 60000) * 60000
          let sTime = parseInt(disTime - hTime - mTime)
          this.interval.h = hTime / 3600000
          this.interval.m = mTime / 60000
          this.interval.s = sTime / 1000
          disTime -= 1000
        }, 1000)
      },
      async remind () {
        let order = this.orderDetail.orderDetail
        let payTime = new Date(order.payTime).getTime()
        let nowTime = new Date().getTime()
        let orderFlag = payTime + '' + order.id // 订单付款时间+订单ID生成字符串，标识该订单
        let disTime = nowTime - payTime
        let remindDisTime = 0
        let lastRemindTime = localStorageService.getStorage(orderFlag)
        const halfDayTime = 43200000
        const dayTime = 86400000

        async function sendRemind () {
          let data = await api.remindDeliver({orderId: order.id})
          if (data.code === Codes.success) {
            Util.alert('发货提醒已经发送给商家，请耐心等待商家发货')
          } else {
            Util.alert(data.mesg)
          }
          localStorageService.setStorage(orderFlag, new Date().getTime())
          return
        }

        function waitAlert () {
          Util.alert('商家正在发货，请耐心等待！')
        }

        if (lastRemindTime) { // 发送过提醒发货
          remindDisTime = nowTime - lastRemindTime
          if (remindDisTime >= halfDayTime) { // 上次提醒发货时间距离现在超过12小时
            await sendRemind()
          } else {
            waitAlert()
          }
        } else {
          if (disTime >= dayTime) { // 订单付款时间距离现在超过24小时
            await sendRemind()
          } else {
            waitAlert()
          }
        }
      },
      async seeLogistics (prd) {
        await Util.alert('运单编号已复制，请在新打开的页面粘贴运单编号查看物流详情!')
        window.location.href = 'https://m.kuaidi100.com/result.jsp?nu=' + prd.storeOrderLogistics.logisticsCode
      },
      async confirm (prd) {
        await Util.confirm('是否确认收货?')
        let data = await api.confirmGetPrd({'orderPrdId': prd.id})
        if (data.code === Codes.success) {
          if (parseInt(this.orderDetail.orderDetail.orderType) === 0) {
            this.$router.push({name: 'onlineMyOrder', params: {status: 3}})
          } else {
            this.$router.push({name: 'offlineMyOrder', params: {status: 3}})
          }
        } else {
          Util.alert(data.mesg)
        }
      },
      // 评价
      evaluate (prd) {
        this.$router.push({
          name: 'addComment',
          params: {
            doorId: this.orderDetail.orderDetail.doorId,
            orderPrdId: prd.id,
            orderId: this.orderDetail.orderDetail.id,
            priceId: prd.priceId
          }
        })
      },
      // 追加评论
      addEvaluate (prd) {
        console.log(prd)
        this.$router.push({
          name: 'appendComment',
          params: {
            orderId: this.orderDetail.orderDetail.id,
            orderPrdId: prd.id,
            priceId: prd.priceId
          }
        })
      },
      // 修改评论
      modifyEvaluate (prd) {
        this.$router.push({
          name: 'modifyComment',
          params: {
            doorId: this.orderDetail.orderDetail.doorId,
            orderId: this.orderDetail.orderDetail.id,
            orderPrdId: prd.id,
            priceId: prd.priceId
          }
        })
      },
      async cancelOrder () {
        await Util.confirm('确认取消订单?')
        let params = {
          orderId: this.orderDetail.orderDetail.id
        }
        let data = await api.cancelOrder(params)
        if (data.code !== Codes.success) {
          Util.alert(data.mesg)
        } else {
          if (parseInt(this.orderDetail.orderDetail.orderType) === 0) { // 取消成功线上订单跳转
            this.$router.replace({name: 'onlineMyOrder', params: {status: 0}})
          } else {
            this.$router.replace({name: 'offlineMyOrder', params: {status: 0}})
          }
        }
      },
      toPay () {
        OrderService.goToPrdPayPage(this.orderDetail.orderDetail.id, this.$router, true)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .my-order-detail {
    background: #f0f2f5;

    .header {
      background: #ffffff;
      padding: 10px 10px 10px 20px;

      .person {
        display: flex;
        align-items: center;
        justify-content: center;
        coolor: #2d2d2d;
        font-size: 14px;
        font-weight: bold;

        .name {
          flex: 1;
        }

      }
      .address {
        color: #525252;
        margin-top: 6px;
      }

    }

    .prd-list {
      margin-top: 8px;
      background: #ffffff;

      .door {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        padding: 0 10px;
        width: 100%;

        .logo {
          flex: 1;
          display: flex;

          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 90%;
          }

        }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0164a6;
        }

      }
      .prd-item {

        .prd-content {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          background-color: #f4f4f4;
          padding: 10px;

          &
          .invalid {
            opacity: 0.5;
          }

          .prd-avatar {
            height: 70px;
            width: 70px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }

          .prd-info {
            flex: 1;
            margin-left: 10px;

            .prd-name {
              margin-bottom: 6px;
            }
            .specification-box{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .prd-size {
                margin-bottom: 6px;
                color: #9e9e9e;
              }
              .prd-size1{
                margin-left: 10px;
                margin-bottom: 6px;
                color: #9e9e9e;
              }
            }

            .prd-price {
              display: -webkit-flex;
              -webkit-justify-content: space-between;
              -webkit-align-items: center;
              justify-content: space-between;
              align-items: center;

              /*display: flex;*/
              .num {
                flex: 1;
              }

              .price {
                color: #0164a6;
              }

            }
          }
        }
        .order-btn {
          display: flex;
          justify-content: flex-end;
          padding: 10px;
          border-bottom: 1px solid #f4f4f4;
          width: 100%;
          background: #ffffff;

          .btn-wrap {
            display: flex;

            .btn {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 28px;
              width: 76px;
              background: #ffffff;
              border: 1px solid #066cc2;
              border-radius: 3px;
              color: #066cc2;
              font-size: 13px;
              margin-left: 10px;
            }

          }
          .btn-pay {

            .cancel {
              border: 1px solid #2d2d2d;
              color: #2d2d2d;
            }

          }
          .btn-delete {

            .delete {
              color: #f8311e;
              border: 1px solid #f8311e;
            }

          }
          .btn-receive {

            .query {
              border: 1px solid #2d2d2d;
              color: #2d2d2d;
            }

          }
          .btn-complete {

            .add {
              color: #525252;
              border: 1px solid #525252;
            }

          }
        }
      }
      .price-info {
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-flex-direction: column;
        padding: 2%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .price-item {
          display: -webkit-flex;
          -webkit-justify-content: space-between;
          -webkit-align-items: center;
          /*display: flex;*/
          align-items: center;
          justify-content: space-between;

          .name {
            /*flex: 1;*/
          }

          .price {
            color: #0164a6;
          }

        }
      }
    }

    .order-info {
      background: #ffffff;
      margin-top: 10px;
      padding: 10px;

      div {
        font-size: 12px;
        color: #9e9e9e;
      }

    }
  }
  .pay-order {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    padding: 0 10px;
    height: 50px;
    border-top: 1px solid #f4f4f4;
    width: 100%;
    z-index: 10;

    .interval {
      flex: 1;

      .title {
      }

      .time {
        color: #ff3c3c;
        margin-top: 4px;
      }

    }
    .btn-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      div {
        width: 50%;
        font-size: 15px;
        margin-left: 4px;
        border: 1px solid #9e9e9e;
        border-radius: 5px;
        color: #2d2d2d;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
      }

      .pay {
        border: 1px solid #0164a6;
        color: #0164a6;
      }

    }
  }
</style>
