<template>
  <div class="my-order-component">
    <div class="list-item" v-for="item in orderList">

      <div class="header">
        <div class="logo">
          <img :src="item.doorInfo.logo | imgPrefix">
          <span>{{item.doorInfo.name}}</span>
        </div>
        <div class="status">{{getStatus(item).text}}</div>
      </div>

      <div class="prd-list" @click.stop="goDetail(item)">
        <div class="prd-item" v-for="prd in item.prdInfos" :class="{'invalid':getStatus(item).status==5}">
          <div class="prd-avatar" :style="{backgroundImage:'url('+imgPrefix(prd.prdImg)+')'}"></div>
          <div class="prd-info">
            <div class="prd-name">{{prd.prdName}}</div>
            <div class="prd-size">{{prd.fpName}}: {{prd.fpValue}} &#12288<span
              v-if="prd.spName">{{prd.spName}}: {{prd.spValue}}</span></div>
            <div class="prd-price">
              <span class="num">X{{prd.num}}</span>
              <span class="price"><price-component
                :price="getTotalPrice(prd.totalPrice, item.order.totalPrice, item.order.discountTotalPrice,item.order.postage)"></price-component></span>
            </div>
          </div>
        </div>

        <div class="prd-total-price" v-if="getStatus(item).status==0">
          <span> 共{{item.order.totalNum}}件商品实付款：
            <price-component :price="item.order.totalPrice"></price-component>
          </span>
          <span v-if="item.order.postage!=0"> (包含邮费:
            <price-component :price="item.order.postage"></price-component>)
          </span>
        </div>
      </div>

      <div class="order-btn">

        <div class="btn-pay btn-wrap" v-if="getStatus(item).status==0">
          <span class="cancel btn" @click.stop="cancelOrder(item)">取消订单</span>
          <span class="confirm btn" @click.stop="toPay(item)">去支付</span>
        </div>


        <div class="btn-remind btn-wrap" v-if="getStatus(item).status==1">
          <span class="remind btn" @click.stop="remind(item)">提醒发货</span>
        </div>

        <div class="btn-receive btn-wrap" v-if="getStatus(item).status==2">
          <span class="query btn" @click.stop="seeLogistics(item)">物流查询</span>
          <span class="receive btn" @click.stop="confirm(item)">确认收货</span>
        </div>

        <div class="btn-evaluate btn-wrap" v-if="getStatus(item).status==3">
          <span class="evaluate btn" @click.stop="evaluate(item,item.prdInfos)">评价</span>
        </div>

        <!--<div class="btn-complete btn-wrap" v-if="getStatus(item).status==4">
          <span class="add btn">追加评价</span>
          <span class="add btn">修改评价</span>
        </div>-->

        <div class="btn-delete btn-wrap" v-if="getStatus(item).status==5||getStatus(item).status==4">
          <span class="delete btn" @click.stop="delOrder(item)">删除订单</span>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import {Config, Codes} from '@/config/config'
  import api from '@/api/user/user.api'
  import Util from '@/service/common/utils/util.service'
  import localStorageService from '@/service/common/localStorage/localStorage.service'
  import OrderService from '@/service/order/order.service'
  import PriceComponent from '@/components/common/price/price.component'
  import pic from '@/assets/img/wutu.png'
  export default{
    components: {
      'price-component': PriceComponent
    },
    props: {
      orderList: {
        type: Array,
        required: true
      }
    },
    methods: {
      imgPrefix(url){
        if (url) {
          return Config.imgPrefix + url
        } else {
          return pic
        }
      },
      // 返回状态，0代付款，1待发货，2待收货，3待评价，4完成，5失效
      getStatus(order){
        let statusMap = [{status: 0, text: '等待付款'}, {status: 1, text: '等待发货'}, {status: 2, text: '等待收货'},
          {status: 3, text: '等待评价'}, {status: 4, text: '已完成'}, {status: 5, text: '已失效'}, {status: 6, text: '等待消费'}]
        let orderType = parseInt(order.order.orderType)
        let orderStatus = parseInt(order.order.status)
        let prdOrderStatus = parseInt(order.prdInfos[0].orderStatus)
        if (orderType === 0) { // 线上订单
          if (orderStatus === 0) { // 订单状态 代付款
            return statusMap[0]
          } else if (orderStatus === 1) { // 订单状态已付款
            return statusMap[prdOrderStatus]
          } else if (orderStatus === 2) { // 订单状态 已失效
            return statusMap[5]
          }
        } else { // 线下订单
          if (orderStatus === 0) { // 订单状态 代付款
            return statusMap[0]
          } else if (orderStatus === 1) { // 订单状态已付款
            if (prdOrderStatus === 2) { // 商品订单状态待收货
              return statusMap[6]
            } else if (prdOrderStatus === 3) {
              return statusMap[3]
            } else if (prdOrderStatus === 4) {
              return statusMap[4]
            }
          } else if (orderStatus === 2) {
            return statusMap[5]
          }
        }
        console.log('状态判断有误', orderType, orderStatus, prdOrderStatus, order.order.id)
        return {
          status: 5,
          text: '数据错误'
        }
      },
      // 价格显示机制
      getTotalPrice(totalPrice, orderTotalPrice, discountTotalPrice, postage){
        console.log(totalPrice, orderTotalPrice, discountTotalPrice)
        if (discountTotalPrice) {
          if (orderTotalPrice - postage === 0) {
            return '0.00'
          }
          var price = totalPrice - totalPrice / (orderTotalPrice + discountTotalPrice) * discountTotalPrice
          price = Math.floor(price * 100 + 0.5) / 100
          return price
        } else {
          return totalPrice
        }
      },
      // 删除订单
      async delOrder(order){
        await Util.confirm('确认删除订单?')
        let params = {}
        if (parseInt(order.order.status) === 2) {
          params.orderId = order.order.id
        } else {
          params.orderPrdId = order.prdInfos[0].id
        }
        let data = await api.delOrder(params)
        if (data.code !== Codes.success) {
          Util.alert(data.mesg)
        } else {
          this.orderList.splice(this.orderList.indexOf(order), 1)
        }
      },

      // 取消订单
      async cancelOrder(order){
        await Util.confirm('确认取消订单?')
        let params = {
          orderId: order.order.id
        }
        let data = await api.cancelOrder(params)
        if (data.code !== Codes.success) {
          Util.alert(data.mesg)
        } else {
          // order.order.status = 2 // 取消后状态变为已失效
          this.orderList.splice(this.orderList.indexOf(order), 1)
        }
      },
      // 提醒发货
      async remind(order){
        let payTime = new Date(order.order.payTime).getTime()
        let nowTime = new Date().getTime()
        let orderFlag = payTime + '' + order.order.id // 订单付款时间+订单ID生成字符串，标识该订单
        let disTime = nowTime - payTime
        let remindDisTime = 0
        let lastRemindTime = localStorageService.getStorage(orderFlag)
        const halfDayTime = 43200000
        const dayTime = 86400000

        async function sendRemind() {
          let data = await api.remindDeliver({orderId: order.order.id})
          if (data.code === Codes.success) {
            Util.alert('发货提醒已经发送给商家，请耐心等待商家发货')
          } else {
            Util.alert(data.mesg)
          }
          localStorageService.setStorage(orderFlag, new Date().getTime())
          return
        }

        function waitAlert() {
          Util.alert('商家正在发货，请耐心等待！')
        }

        if (lastRemindTime) {
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
      // 确认收货
      async confirm(order){
        await Util.confirm('是否确认收货?')
        let data = await api.confirmGetPrd({'orderPrdId': order.prdInfos[0].id})
        if (data.code === Codes.success) {
          if (parseInt(order.order.orderType) === 0) {
            this.$router.replace({name: 'onlineMyOrder', params: {status: 3}})
          } else {
            this.$router.replace({name: 'offlineMyOrder', params: {status: 3}})
          }
        } else {
          Util.alert(data.mesg)
        }
      },
      // 查看物流
      async seeLogistics(order){
        await Util.alert('运单编号已复制，请在新打开的页面粘贴运单编号查看物流详情!')
        window.location.href = 'https://m.kuaidi100.com/result.jsp?nu=' + order.prdInfos[0].storeOrderLogistics.logisticsCode
      },
      toPay(item){
        OrderService.goToPrdPayPage(item.order.id, this.$router, true)
      },
      evaluate(order, prdinfo){
        console.log(prdinfo)
        this.$router.push({
          name: 'addComment',
          params: {
            doorId: order.order.doorId,
            orderPrdId: order.prdInfos[0].id,
            orderId: order.order.id,
            priceId: prdinfo[0].priceId
          }
        })
      },
      // 跳转详情
      async goDetail(order){
        if (parseInt(order.order.status) === 2) {
          await Util.alert('订单已失效')
          let params = {}
          params.orderId = order.order.id
          let data = await api.delOrder(params)
          if (data.code !== Codes.success) {
            Util.alert(data.mesg)
          } else {
            this.orderList.splice(this.orderList.indexOf(order), 1)
          }
        } else {
          if (this.getStatus(order).status === 6) {
            this.$router.push({name: 'consumeDetail', params: {orderId: order.order.id, doorId: order.order.doorId}})
            return
          }
          this.$router.push({name: 'myOrderDetail', params: {id: order.order.id}})
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .my-order-component {
    margin-top: 10px;
    .list-item {

      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        padding: 0 10px;
        width: 100%;
        .logo {
          flex: 1;
          display: flex;
          width: 80%;
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
          span {
            display: block;
            width: 85%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0164a6;
          width: 20%;
        }
      }

      .prd-list {
        .prd-item {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          background-color: #f4f4f4;
          padding: 10px;
          &.invalid {
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
            .prd-size {
              margin-bottom: 6px;
              color: #9e9e9e;
            }
            .prd-price {
              display: -webkit-flex;
              -webkit-justify-content: space-between;
              -webkit-align-items: center;
              justify-content: space-between;
              align-items: center;
              .num {
                flex: 1;
              }
              .price {
                color: #0164a6;
              }
            }
          }
        }
        .prd-total-price {
          padding-right: 10px;
          display: flex;
          justify-content: flex-end;
          height: 46px;
          align-items: center;
          border-bottom: 1px solid #f4f4f4;
        }
      }

      .order-btn {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        border-bottom: 1px solid #f4f4f4;
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
      }
    }
  }

</style>
