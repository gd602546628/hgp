<template>
  <div>
    <div v-if="isLowIosApp">
      <div class="me-expressage-order">快递物流订单</div>
      <div class="me-top-order-box">
        <div class="me-all-order" @click="goToOnlineOrder(order)" v-for="order in onlineOrders">
          <i :class="[order.icon]"></i>
          <span class="me-top-order-new" v-if="getTip(expressOrderCount,order.key)">{{getTip(expressOrderCount, order.key)}}</span>
          <p>{{order.title}}</p>
        </div>
      </div>

      <div class="me-expressage-order-line"></div>

      <div class="me-expressage-order">到店消费订单</div>
      <div class="me-top-order-box1">
        <div class="me-all-order" @click="goToOfflineOrder(order)" v-for="order in offlineOrders">
          <i :class="[order.icon]"></i>
          <span class="me-top-order-new" v-if="getTip(consumeOrderCount,order.key)">{{getTip(consumeOrderCount, order.key)}}</span>
          <p>{{order.title}}</p>
        </div>
      </div>

      <div class="me-expressage-order-line"></div>

      <div class="me-bottom-order-box">
        <div v-for="btns in btnList" class="me-order-bottom">
          <div class="me-order-list" @click="clickBtn(btn)" v-for="btn in btns">
            <i :class="[btn.icon]"></i>
            <p>{{btn.title}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="ios-tip">
      <p>该功能正在开发中</p>
      <p>敬请期待</p>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'Vuex'
  import meService from '@/service/me/me.service'
  import Utils from '@/service/common/utils/util.service'
  import {Config} from '@/config/config'
  export default{
    name: 'disKeepAlive',
    data () {
      return {
        isLowIosApp: true,
        consumeOrderCount: {}, // 到店消费统计个数
        expressOrderCount: {}, // 快递物流订单
        onlineOrders: [
          {
            icon: 'icon-zyt-all-order1',
            title: '全部',
            tip: 0,
            status: -1
          },
          {
            icon: 'icon-zyt-wait-payment',
            title: '待付款',
            tip: 0,
            key: 'pendPayment',
            status: 0
          },
          {
            icon: 'icon-zyt-wait-shipments',
            title: '待发货',
            tip: 0,
            key: 'pendDelivery',
            status: 1
          },
          {
            icon: 'icon-zyt-wait-Receiving',
            title: '待收货',
            tip: 0,
            key: 'pendReceipts',
            status: 2
          },
          {
            icon: 'icon-zyt-wait-evaluate',
            title: '待评价',
            tip: 0,
            key: 'pendAssess',
            status: 3
          }
        ],
        offlineOrders: [
          {
            icon: 'icon-zyt-all-order1',
            title: '全部',
            tip: 0,
            status: -1
          },
          {
            icon: 'icon-zyt-wait-payment1',
            title: '待付款',
            tip: 0,
            key: 'pendPayment',
            status: 0
          },
          {
            icon: 'icon-zyt-wait-consume',
            title: '待消费',
            tip: 0,
            key: 'pendReceipts',
            status: 2
          },
          {
            icon: 'icon-zyt-wait-evaluate1',
            title: '待评价',
            tip: 0,
            key: 'pendAssess',
            status: 3
          }
        ],
        btnList: [
          [{
            icon: 'icon-zyt-shop-cart',
            title: '购物车',
            routerName: 'cart',
            params: {}
          }, {
            icon: 'icon-zyt-coupon',
            title: '优惠券',
            routerName: 'myCoupon',
            params: {index: 0}
          }, {
            icon: 'icon-zyt-order-store',
            title: '收藏的店铺',
            routerName: 'collection',
            params: {type: 0}
          }, {
            icon: 'icon-zyt-product1',
            title: '收藏的商品',
            routerName: 'collection',
            params: {type: 1}
          }],
          [{
            icon: 'icon-zyt-subscribe',
            title: '我的预约',
            routerName: 'myService'
          }, {
            icon: 'icon-zyt-order-gift',
            title: '我的奖品',
            routerName: 'myPrize',
            params: {index: 0}
          }, {
            icon: 'icon-zyt-my-money',
            title: '我的赢元',
            routerName: 'myYinYuan'
          }]
        ]
      }
    },
    watch: {
      'hasAuth': 'init'
    },
    created(){
      this.init()
      this.setAppVersion()
    },
    computed: {
      ...mapGetters(['hasAuth'])
    },
    methods: {
      ...mapMutations(['switchIndexTab', 'switchCollectedTab']),
      async setAppVersion(){
        let appVersion = await Utils.getAppVersion()
        if (Utils.browser.versions.ios) {
          this.isLowIosApp = !Utils.compareVersion(appVersion, Config.iosVersion)
        }
      },
      init(){
        this.getAccountInfo()
      },
      getTip(orderCount, key){
        return orderCount[key] || 0
      },
      async getAccountInfo(){ // 统计订单状态数量以及到店消费状态数量
        if (this.hasAuth) {
          let data = await meService.getAccountInfo().catch(() => {
            throw new Error('统计订单状态数量以及到店消费状态数量失败')
          })
          if (data) {
            this.consumeOrderCount = data.consumeOrderCount
            this.expressOrderCount = data.expressOrderCount
          }
        } else {
          this.consumeOrderCount = {}
          this.expressOrderCount = {}
        }
      },
      clickBtn(btn){
        if (btn.fun) {
          btn.fun()
        } else {
          if (btn.params) {
            this.$router.push({name: btn.routerName, params: btn.params})
          } else {
            this.$router.push({name: btn.routerName})
          }
        }
      },
      goToCart(){
        //  切换到购物车tab页面
        this.$root.eventHub.$emit('switchIndexTab', 2)
      },
      goToCollectedDoor(){
        this.$root.eventHub.$emit('switchIndexTab', 1)
        this.switchCollectedTab({
          index: 0
        })
      },
      goToCollectedPrd(){
        this.$root.eventHub.$emit('switchIndexTab', 1)
        this.switchCollectedTab({
          index: 1
        })
      },
      goToOnlineOrder(order){
        this.$router.push({name: 'onlineMyOrder', params: {status: order.status}})
      },
      goToOfflineOrder(order){
        this.$router.push({name: 'offlineMyOrder', params: {status: order.status}})
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .ios-tip {
    margin: 30px auto;
    text-align: center;
    font-size: 20px;
    color: #6f6f6f;
    p {
      padding-top: 10px;
    }
  }

  .me-expressage-order {
    padding: 3%;
    border-bottom: 1px solid #f5f5f9;
  }

  .me-top-order-box {
    display: flex;
    justify-content: space-around;
    padding: 3%;
    padding-top: 4%;
    width: 100%;
    .me-all-order {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 20%;

      i {
        font-size: 30px;
        color: #6f6f6f;
      }

      .me-top-order-new {
        position: absolute;
        right: 7px;
        top: -4px;
        height: 16px;
        width: 16px;
        border-radius: 8px;
        border: 1px solid #ff3c3c;
        background-color: #ff3c3c;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: '黑体';
        font-size: 12px;
      }

      p {
        font-size: 12px;
        margin-top: 5px;
        color: #88888d;
      }

    }
  }

  .me-top-order-box1 {
    display: flex;
    justify-content: space-around;
    padding: 3%;
    padding-top: 4%;
    width: 100%;
    .me-all-order {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 25%;
      .me-order-all {
        color: #0164a6;
        font-size: 30px;
      }

      .me-order-obligation {
        font-size: 30px;
        color: #0164a6;
      }

      .me-order-consume {
        color: #0164a6;
        font-size: 30px;
      }

      .me-order-finish {
        color: #0164a6;
        font-size: 30px;
      }

      i {
        font-size: 30px;
        color: #6f6f6f;
      }

      .me-top-order-new {
        position: absolute;
        right: 16px;
        top: -3px;
        height: 16px;
        width: 16px;
        border-radius: 8px;
        border: 1px solid #f8311e;
        background-color: #f8311e;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: '黑体';
        font-size: 12px;
      }

      p {
        font-size: 12px;
        margin-top: 5px;
        color: #88888d;
      }

    }
  }

  .me-expressage-order-line {
    background-color: #f5f5f9;
    height: 10px;
  }

  .me-bottom-order-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;

    .me-order-bottom {
      display: flex;
      justify-content: flex-start;
      width: 100%;

      .me-order-list {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        height: 94px;
        width: 25%;
        border-right: 1px solid #f5f5f9;
        border-bottom: 1px solid #f5f5f9;

        i {
          font-size: 32px;
          color: #066cc2;
        }

        p {
          font-size: 12px;
          margin-top: 5px;
        }

      }
    }
  }

</style>
