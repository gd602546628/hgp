<template>
  <zyt-page :hasHeader="true"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div class="tab" slot="header">
      <div class="tab-item" @click.stop="tabClick(-1)" :class="{active:params.status==-1}">全部</div>
      <div class="tab-item " @click.stop="tabClick(0)" :class="{active:params.status==0}">待付款</div>
      <div class="tab-item " @click.stop="tabClick(1)" :class="{active:params.status==1}">待发货</div>
      <div class="tab-item " @click.stop="tabClick(2)" :class="{active:params.status==2}">待收货</div>
      <div class="tab-item " @click.stop="tabClick(3)" :class="{active:params.status==3}">待评价</div>
    </div>
    <div class="online-my-order" slot="main">
      <my-order
        :orderList="orderList"
        class="order-list"
        v-show="orderList.length>0"></my-order>
      <div class="noData" v-show="noData">
        <img src="../../../assets/img/dind_k.png"/>
        <span>暂时没有相关订单</span>
        <div class="button" @click.stop="goLock()">去看看有没有想买的</div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import api from '@/api/user/user.api'
  import myOrder from '@/pages/user/myOrder/myOrder.component'

  export default {
    name: 'onlineMyOrder',
    components: {
      'my-order': myOrder
    },
    data () {
      return {
        params: {
          orderType: 0,
          pageNum: 1,
          pageSize: 10,
          status: 0
        },
        orderList: [],
        noData: false,
        dataFinish: false
      }
    },
    created () {
      this.init()
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      tabClick (status) {
        this.$router.replace({name: 'onlineMyOrder', params: {status: status}})
      },
      async init () {
        this.dataFinish = true
        if (this.$route.name !== 'onlineMyOrder') {
          return
        }
        this.params.status = this.$route.params.status
        this.params.pageNum = 1
        this.noData = false
        this.dataFinish = false
        this.getOrderFrontList(true, {showLoading: true})
      },
      async getOrderFrontList (reset, showLoading) {
        this.params.status = parseInt(this.$route.params.status)
        let data = await api.getOrderFrontList(this.params, showLoading)
        let result = this.orderSplit(data.list)
        if (data.list.length === 0) {
          console.log('没有数据')
          this.orderList = []
          this.noData = true
          this.dataFinish = true
          return
        } else {
          this.noData = false
        }
        if (data.page.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          console.log('全部数据加载完毕')
        }
        if (reset) {
          this.orderList = result
        } else {
          this.orderList = this.orderList.concat(result)
        }
      },
      // 订单拆分
      orderSplit (orderList) {
        let result = []
        orderList.forEach(order => {
          if (parseInt(order.order.status) === 0 || parseInt(order.order.status) === 2) { // 代付款和已失效不用拆分
            result.push(order)
          } else {
            order.prdInfos.forEach(prd => {
              let splitedOrder = {
                doorInfo: order.doorInfo,
                order: order.order,
                prdInfos: [prd]
              }
              result.push(splitedOrder)
            })
          }
        })
        return result
      },
      async loadMore (done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getOrderFrontList(false)
        done && done()
      },
      goLock () {
        this.$router.push({
          name: 'selectedGoodsOnline',
          query: {
            secondWebView: 0
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    border-bottom: 1px solid #f4f4f4;
    position: fixed;
    width: 100%;
    top: 0;
    background: #ffffff;
    opacity: 1;
    z-index: 10;
    .tab-item {
      font-size: 14px;
      color: #333333;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      &.active {
        color: #066cc2;
        border-bottom: 1px solid #0164a6;
      }
    }
  }

  .online-my-order {
    .noData {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -70px;
      margin-top: -92px;
      img {
        height: 100px;
        width: 96px;
        display: block;
      }
      span {
        color: #9e9e9e;
        margin: 5px 0 10px 0;
      }
      .button {
        height: 40px;
        border: 1px solid #0164a6;
        border-radius: 5px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        width: 160px;
        color: #0164a6;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

</style>
