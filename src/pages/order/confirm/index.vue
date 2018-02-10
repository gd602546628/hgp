/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasFooter="true">
    <div slot="main">
      <address-component :is-online="isOnline" :address="address"></address-component>
      <div class="blankDiv"></div>
      <div v-for="order,i in this.confirmOrders">
        <order-door :order="order" :index="i" @openPopup="openCoupon"></order-door>
      </div>
      <div class="order-statistics">
        <order-statistics :prd-price="prdPriceTotal" :postage="postageTotal" :discount="discountTotal"
                          :price="priceTotal"></order-statistics>
      </div>
    </div>
    <div slot="footer" class="footer">
      <button class="common-submit-btn" :disabled="!canSubmit" @click="submit()">提交订单</button>
    </div>
  </zyt-page>
</template>
<script>
  //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数据（用户刷新，则退回到上一个界面）
  import {mapActions, mapGetters, mapMutations} from 'Vuex'
  import OrderStatistics from '@/components/order/order-statistics.component'
  import {Codes} from '@/config/config'
  import DoorApi from '@/api/door/door.api'
  import UserApi from '@/api/user/user.api'
  import OrderApi from '@/api/order/order.api'
  import OrderDoor from './_order-door'
  import AddressComponent from './_address'
  import OrderService from '@/service/order/order.service'
  import Coupon from './_coupon'
  export default {
    name: 'prdOrderConfirm',
    data () {
      return {
        index: 0,
        totalCommodity: 0
      }
    },
    computed: {
      // confirmOrders 是store中获取，如果为null，则返回上一页
      ...mapGetters(['userInfo', 'confirmOrders']),
      /* 判断是否有线上交易的商品 */
      isOnline(){
        let result = false
        // 只要有一件产品是线上交易的，该订单就属于线上交易的，需要填写收货地址
        this.confirmOrders.forEach((item) => {
          item.prdList.forEach((prd) => {
            if (prd.prdType === 0) {
              result = true
              return result
            }
          })
        })
        return result
      },
      /* 折扣前的产品总价 */
      prdPriceTotal(){
        let price = 0
        this.confirmOrders.forEach((order) => {
          price += this.getPriceByDoor(order)
        })
        return price
      },
      /* 获取运费 */
      postageTotal(){
        let total = 0
        this.confirmOrders.forEach((order) => {
          if (order.doorInfo) {
            let postage = order.doorInfo.postage
            if (order.prdList[0].prdType === 1) { // 如果是线下商品就不计算邮费，线下商品不能加入到购物车，所以只存才一个商品
              postage = 0
            }
            let priceCondition = order.doorInfo.priceCondition
            if (postage) {
              // 店铺的总价
              let prdPrice = this.getPriceByDoor(order) - this.getDiscountByDoor(order)
              console.info(44444, prdPrice, priceCondition, this.getDiscountByDoor(order))
              if (priceCondition && prdPrice >= priceCondition) {
                postage = 0
              }
              total += postage
            }
          }
        })
        return total
      },
      /* 总折扣 */
      discountTotal(){
        let discount = 0
        this.confirmOrders.forEach((order) => {
          discount += this.getDiscountByDoor(order)
        })
        return discount
      },
      /* 用户需要支付的总价 */
      priceTotal(){
        let total = this.prdPriceTotal - this.discountTotal
        total = total <= 0 ? 0 : total
        total = total + this.postageTotal
        return total
      },
      /* 判断是否能提交订单 */
      canSubmit(){
        if (this.isOnline) {
          if (!this.address.receiverMobile) {
            return false
          }
        }
        return true
      },
      address(){
        if (this.userInfo && this.userInfo.addressList && this.userInfo.addressList.length > 0) {
          let defaultAddress = this.userInfo.addressList.filter(address => {
            return address.isDefault
          })
          return defaultAddress[0] || this.userInfo.addressList[0]
        }
        return {}
      },
      couponList(){
        return this.confirmOrders[this.index].couponList
      }
    },
    created(){
      this.init()
    },
    methods: {
      ...mapActions(['getUserInfo']),
      ...mapMutations(['changeCartState']),
      async init(){
        //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数个据（用户刷新，则退回到上一界面）
        if (!this.confirmOrders) {
          this.$router.back()
        } else {
          /* 获取店铺信息，主要是获取相应店铺的邮费和包邮的条件 */
          this.completeData()
          // 获取用户信息，主要是获取用户的地址
          await this.getUserInfo({
            address: true
          })
        }
      },
      /**
       * 获取店铺的订单总价
       * order：订单
       * userCoupon：false，没有使用优惠券的价格。true：使用了优惠券的价格
       **/
      getPriceByDoor(order){
        let price = 0
        order.prdList.forEach(prd => {
          price += prd.num * prd.discountPrice
        })
        return price
      },
      //  获取店铺的所有折扣
      getDiscountByDoor(order){
        let discount = 0
        let selectCoupons = order.couponList.filter(coupon => {
          return coupon.selected
        })
        selectCoupons.forEach((coupon) => {
          discount += coupon.disCountMoney
        })
        return discount
      },
      /**
       * 设置店铺信息，获取用户可用的优惠券
       */
      completeData(){
        this.confirmOrders.forEach((order) => {
          //  前一个界面没有传入doorInfo的时候从接口中获取
          this.setDoorInfo(order)
          // 过滤可用的优惠券
          this.filterCoupon(order)
        })
      },
      async setDoorInfo(order){
        if (!order.doorInfo || !order.doorInfo.id) {
          let data = await DoorApi.getDoorInfo(order.doorId).catch((e) => {
          })
          if (data) {
            order.doorInfo = data
          }
        }
      },
      async filterCoupon(order){
        let price = this.getPriceByDoor(order)
        let data = await UserApi.filterCoupon({
          doorId: order.doorId,
          totalCommodity: price
        })
        if (data.code === Codes.success) {
          let list = []
          let map = {}
          data.data.forEach(item => {
            //  设置为米有选中
            item.selected = false
            // 根据最大重复使用数，进行第一次筛选
            let n = map[item.couponId] || 0
            if (n < item.overlayNum) {
              list.push(item)
              n++
              map[item.couponId] = n
            }
          })
          order.couponList = list
        }
      },
      getSubmitData(){
        let data = {
          order: [],
          buyChannel: 0
        }
        if (this.isOnline) {
          data['addressId'] = this.address.addressId
        }
        this.confirmOrders.forEach(order => {
          let coupons = [] // 优惠券的列表
          order.couponList.forEach(coupon => {
            if (coupon.selected) {
              coupons.push(coupon.userCouponId)
            }
          })
          let item = {
            doorId: order.doorId,
            userCouponId: coupons.join(','),
            orderPrd: []
          }
          order.prdList.forEach((prd) => {
            item.orderPrd.push({
              num: prd.num,
              prdId: prd.prdId,
              priceId: prd.priceId
            })
          })
          data.order.push(item)
        })
        return data
      },
      async delCartPrd(){
        let ids = []
        this.confirmOrders.forEach(order => {
          order.prdList.forEach(prd => {
            if (prd.id) {
              ids.push(prd.id)
            }
          })
        })
        if (ids.length) {
          await UserApi.getdelCartPrd({
            ids: ids.join(',')
          })
          // 购物车的状态发生变化
          this.changeCartState()
        }
      },
      async submit(){
        if (this.canSubmit) {
          let data = this.getSubmitData() // 提交订单的所需要的数据
          let orderId = await OrderApi.addOrder(data)
          if (orderId) {
            this.delCartPrd() // 删除购物车
            OrderService.goToPrdPayPage(orderId, this.$router)
          }
        }
      },
      openCoupon(totalCommodity, index){
        console.info(index, this.confirmOrders[index])
        /*   this.index = index
         this.totalCommodity = totalCommodity
         this.$refs.coupon.openPopup() */
        this.$router.push({
          name: 'selectCoupon',
          params: {
            totalCommodity: totalCommodity,
            couponList: this.confirmOrders[index].couponList
          }
        })
      }
    },
    components: {
      'order-door': OrderDoor,
      'order-statistics': OrderStatistics,
      'address-component': AddressComponent,
      'coupon-component': Coupon
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  @import "../../../assets/css/variables-primary";

  .footer {
    height: 49px;
  }

  .order-statistics {
    padding: 10px;
  }
</style>
