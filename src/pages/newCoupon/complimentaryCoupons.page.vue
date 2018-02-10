<template>
  <div class="gift-coupon-list">
    <coupon :couponList="couponList"></coupon>
  </div>
</template>
<script>
  import coupon from '@/components/coupon/coupon.component'
  import couponService from '@/service/coupon/coupon.service'
  export default {
    name: 'complimentaryCoupons',
    components: {
      'coupon': coupon
    },
    data () {
      return {
        params: {
          couponId: this.$route.params.couponId
        },
        couponList: []
      }
    },
    created () {
      this.getGiftcoupons()
    },
    methods: {
      async getGiftcoupons () { // 获取赠送优惠券列表数据
        let data = await couponService.complimentaryCoupons(this.params, {showLoading: true})
        this.couponList = data
        this.couponList['oldId'] = this.$route.params.couponId
      }
    }
  }

</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
.gift-coupon-list{
  background-color: #efefef;
  padding-top: 10px;
}
</style>
