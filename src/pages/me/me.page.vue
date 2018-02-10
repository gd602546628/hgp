<template>
  <div>
    <div class="me-expressage-order">快递物流订单</div>
    <div class="me-top-order-box" v-if="expressOrderCount">
      <div class="me-all-order" @click="goAllOrder()">
        <i class="icon-zyt-all-express-order"></i>
        <p>全部</p>
      </div>
      <div class="me-all-order" @click="goObligation()">
        <i class="icon-zyt-payment"></i>
        <span class="me-top-order-new"
              v-if="expressOrderCount.pendPayment && expressOrderCount.pendPayment>0"
        >{{ expressOrderCount.pendPayment }}</span>
        <p>待付款</p>
      </div>
      <div class="me-all-order" @click="goShipments()">
        <i class="icon-zyt-deliver-goods"></i>
        <span class="me-top-order-new"
              v-if="expressOrderCount.pendDelivery && expressOrderCount.pendDelivery>0"
        >{{ expressOrderCount.pendDelivery }}</span>
        <p>待发货</p>
      </div>
      <div class="me-all-order" @click="goReceiving()">
        <i class="icon-zyt-delivery-goods"></i>
        <span class="me-top-order-new"
              v-if="expressOrderCount.pendReceipts &&　expressOrderCount.pendReceipts>0"
        >{{ expressOrderCount.pendReceipts }}</span>
        <p>待收货</p>
      </div>
      <div class="me-all-order" @click="goCompleted()">
        <i class="icon-zyt-all-door-order"></i>
        <span class="me-top-order-new"
              v-if="expressOrderCount.pendAssess && expressOrderCount.pendAssess>0"
        >{{ expressOrderCount.pendAssess }}</span>
        <p>待评价</p>
      </div>
    </div>
    <div class="me-expressage-order-line"></div>
    <div class="me-expressage-order">到店消费订单</div>
    <div class="me-top-order-box1" v-if="consumeOrderCount">
      <div class="me-all-order" @click="goAll()">
        <i class="icon-zyt-all-order"></i>
        <p>全部</p>
      </div>
      <div class="me-all-order" @click="gopayment()">
        <i class="icon-zyt-obligation"></i>
        <span class="me-top-order-new"
              v-if="consumeOrderCount.pendPayment && consumeOrderCount.pendPayment>0"
        >{{ consumeOrderCount.pendPayment }}</span>
        <p>待付款</p>
      </div>
      <div class="me-all-order" @click="goExpense()">
        <i class="icon-zyt-not-spending"></i>
        <span class="me-top-order-new"
              v-if="consumeOrderCount.pendReceipts && consumeOrderCount.pendReceipts>0"
        >{{ consumeOrderCount.pendReceipts }}</span>
        <p>待消费</p>
      </div>
      <div class="me-all-order" @click="goFinish()">
        <i class="icon-zyt-evaluate"></i>
        <span class="me-top-order-new"
              v-if="consumeOrderCount.pendAssess && consumeOrderCount.pendAssess>0"
        >{{ consumeOrderCount.pendAssess }}</span>
        <p>待评价</p>
      </div>
    </div>
    <div class="me-expressage-order-line"></div>
    <div class="me-bottom-order-box">
      <div class="me-order-box">
        <div class="me-order-list" @click="goBuyCart()">
          <i class="icon-zyt-shop-cart"></i>
          <p>购物车</p>
        </div>
        <div class="me-order-list" @click="goCoupon()">
          <i class="icon-zyt-coupon"></i>
          <p>优惠券</p>
        </div>
        <div class="me-order-list" @click="goCollectShop()">
          <i class="icon-zyt-order-store"></i>
          <p>收藏的店铺</p>
        </div>
        <div class="me-order-list" @click="goCollectProduct()">
          <i class="icon-zyt-product1"></i>
          <p>收藏的商品</p>
        </div>
      </div>
      <div class="me-order-bottom">
        <div class="me-order-list" @click="goService()">
          <i class="icon-zyt-subscribe"></i>
          <p>我的服务</p>
        </div>
        <div class="me-order-list" @click="goSpoil()">
          <i class="icon-zyt-order-gift"></i>
          <p>我的奖品</p>
        </div>
        <div class="me-order-list" @click="goYingYuan()">
          <i class="icon-zyt-my-money"></i>
          <p>我的赢元</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import meService from '../../service/me/me.service'
  export default{
    data () {
      return {
        consumeOrderCount: null, // 到店消费统计个数
        expressOrderCount: null // 快递物流订单
      }
    },
    /* watch: {
     '$route': 'init'
     }, */
    created(){
      this.init()
    },
    methods: {
      init(){
        if (parseInt(this.$route.params.index) !== 3) {
          return
        }
        this.getAccountInfo()
      },
      async getAccountInfo(){ // 统计订单状态数量以及到店消费状态数量
        let data = await meService.getAccountInfo(this.params).catch(() => {
          throw new Error('统计订单状态数量以及到店消费状态数量失败')
        })
        if (data) {
          this.consumeOrderCount = data.consumeOrderCount
          this.expressOrderCount = data.expressOrderCount
        }
      },
      goAllOrder(){
        this.$router.push({name: 'onlineMyOrder', params: {type: 0}})
      },
      goObligation(){
        this.$router.push({name: 'onlineMyOrder', params: {type: 1}})
      },
      goShipments(){
        this.$router.push({name: 'onlineMyOrder', params: {type: 2}})
      },
      goReceiving(){
        this.$router.push({name: 'onlineMyOrder', params: {type: 3}})
      },
      goCompleted(){
        this.$router.push({name: 'onlineMyOrder', params: {type: 4}})
      },
      goAll(){
        this.$router.push('/')
      },
      gopayment(){
        this.$router.push('/')
      },
      goExpense(){
        this.$router.push('/')
      },
      goFinish(){
        this.$router.push('/')
      },
      goBuyCart(){ // 购物车
        this.$router.push({name: 'indexDoor', params: {index: 2, doorId: this.$route.params.doorId}})
      },
      goCoupon(){ // 购物车
        this.$router.push('/')
      },
      goCollectShop(){ // 收藏的店铺
        this.$router.push({name: 'indexDoor', params: {index: 1, doorId: this.$route.params.doorId}})
      },
      goCollectProduct(){ // 收藏的商品
        this.$router.push({name: 'indexDoor', params: {index: 1, doorId: this.$route.params.doorId}})
      },
      goService(){
        this.$router.push('/')
      },
      goSpoil(){
        this.$router.push('/')
      },
      goYingYuan(){ // 我的赢元
        this.$router.push('/myYinYuan')
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .me-expressage-order {
    padding: 3%;
    border-bottom: 1px solid #f5f5f9;
  }

  .me-top-order-box {
    display: -webkit-flex;
    -webkit-justify-content: space-around;
    display: flex;
    justify-content: space-around;
    padding: 3%;
    padding-top: 4%;
    .me-all-order {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: relative;
      i {
        font-size: 30px;
        color: #6f6f6f;
      }
      .me-top-order-new {
        position: absolute;
        right: -7px;
        top: -7px;
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
    .me-all-order {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: relative;
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
        right: -7px;
        top: -7px;
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

  .me-expressage-order-line {
    background-color: #f5f5f9;
    height: 10px;
  }

  .me-bottom-order-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    .me-order-box {
      display: flex;
      justify-content: space-around;
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
