<template>
  <!--优惠券-->
  <div class="couponList-box">
    <div class="prdList-couponList" v-if="couponInfo.length>0&&couponInfo.length<=3">
            <div class="prdList-couponList-info"
            :class="couponListinfoClass"
                     v-for="coupon in couponInfo" @click="receiveCoupon($event,coupon)">
                <div>
                    <span class="coupon-price-small">￥</span>
                    <span class="coupon-price-big">{{coupon.discountMoney}}</span>
                </div>
                <p>{{coupon.showName}}</p>
            </div>
        </div>
        <div class="prdList-couponList" v-if="couponInfo.length>3" style="overflow-y: hidden;overflow-x: auto;">
            <div :style="couponStyleFn()">
                <div class="prdList-couponList-info prdList-couponList-info-4" v-for="coupon in couponInfo" @click="receiveCoupon($event,coupon)">
                <div>
                    <span class="coupon-price-small">￥</span>
                    <span class="coupon-price-big">{{coupon.discountMoney}}</span>
                </div>
                <p>{{coupon.showName}}</p>
            </div>
            </div>
        </div>
   </div>
</template>
<script>
  import couponService from '@/service/coupon/coupon.service'
  import {Codes} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  export default {
    props: ['couponInfo', 'couponStyle'],
    computed: {
      couponListinfoClass(){
        let test = `prdList-couponList-info-${this.couponInfo.length}`
        let result = {}
        result[test] = true
        return result
      }
    },
    methods: {
      async receiveCoupon($event, item){ // 领取优惠券
        $event.stopPropagation()
        let data = await couponService.receiveCoupon({couponId: item.couponId, type: 0})
        switch (data.code) {
          case Codes.success:
            item.receive = true
            item.num--
            Util.alert({message: '您已成功领取该优惠券！'})
            break
          case Codes.hasReceive:
            item.receive = true
            Util.alert({message: '领取失败，您的领取量已达上限！'})
            break
          case Codes.code02:
            item.receive = true
            Util.alert({message: '优惠券已被领取完！'})
            break
          default:
            Util.alert({message: data.mesg})
            break
        }
      },
      couponStyleFn(){
        return {
          width: this.couponStyle + 'px'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .couponList-box{
    background: #efefef;
    padding-left: 5px;
    padding-top: 5px;
    .prdList-couponList .prdList-couponList-info{
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-right: 5px;
      padding-bottom: 10px;
      float: left;
      text-align: center;
      padding-top: 10px;
    }
    .prdList-couponList .prdList-couponList-info .coupon-price-small{
      color: #FFFFFF;
      font-size: 15px;
    }
    .prdList-couponList .prdList-couponList-info .coupon-price-big{
      color: #FFFFFF;
      font-size: 22px;
    }
    .prdList-couponList .prdList-couponList-info-1{
      /*background-image: url("../../../assets/img/doorIndeximg/bg03.png");*/
      background-image: url("../../../assets/img/doorIndeximg/quan1.png");
      width: 99%;
    }
    .prdList-couponList .prdList-couponList-info-2{
      /*background-image: url("../../../assets/img/doorIndeximg/bg02.png");*/
      background-image: url("../../../assets/img/doorIndeximg/quan1.png");
      width: 48%;
    }
    .prdList-couponList .prdList-couponList-info-3,
    .prdList-couponList .prdList-couponList-info-4{
      /*background-image: url("../../../assets/img/doorIndeximg/bg01.png");*/
      background-image: url("../../../assets/img/doorIndeximg/quan1.png");
      width: 32%;
      margin-right: 4px;
    }
    .prdList-couponList .prdList-couponList-info-4{
      width: 100px;
      display: inline-block;
      float: none;
    }
    .prdList-couponList .prdList-couponList-info-3:last-child,
    .prdList-couponList .prdList-couponList-info-2:last-child,
    .prdList-couponList .prdList-couponList-info-1:last-child{
      margin-right: 0;
    }
    .prdList-couponList:after{
      width: 0px;
      content: "";
      display: block;
      height: 0;
      visibility: hidden;
      clear: both;
    }
    .prdList-couponList .prdList-couponList-info p{
      font-size: 12px;
      color: #fff;
      /*margin-top: 0px;*/
      text-indent: 5px;
    }
  }
</style>
