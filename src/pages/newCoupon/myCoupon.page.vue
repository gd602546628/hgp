<template>
  <zyt-page class="page"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish" v-show="show">
    <div slot="main" class="wrap">
      <div class="tab">
        <div class="tab-item" @click="tabClick(false)">
          <p :class="{active:!isUsed}">未使用</p>
        </div>
        <div class="tab-item" @click="tabClick(true)">
          <p :class="{active:isUsed}">已失效</p>
        </div>
      </div>
      <div class="noUse" v-if="!isUsed">
        <my-coupon :couponList="couponList" :canClick="true" ref="couponNotUsed"></my-coupon>
      </div>
      <div class="used" v-if="isUsed">
        <my-coupon :couponList="usedCouponList" :canClick="false" ref="couponUsed"></my-coupon>
      </div>
      <no-coupon v-show="noData"></no-coupon>
    </div>
  </zyt-page>
</template>
<script>
  import myCoupon from '@/pages/newCoupon/newMyCounpon.component'
  import couponService from '@/service/coupon/coupon.service'
  import {mapGetters} from 'vuex'
  import noCoupon from './noCoupon.component.vue'
  export default{
    name: 'newMyCoupon',
    components: {
      'my-coupon': myCoupon,
      'no-coupon': noCoupon
    },
    created(){
      this.show = false
      this.couponList = []
      this.usedCouponList = []
      this.params.userId = this.userInfo.userId
      this.params.pageNum = 1
      this.dataFinish = false
      this.noData = false
      this.getUserCouponList(true)
    },
    /* deactivated(){
     this.dataFinish = true
     }, */
    computed: {
      ...mapGetters(['userInfo'])
    },
    data(){
      return {
        couponList: [],
        usedCouponList: [],
        isUsed: false,
        params: {
          pageNum: 1,
          pageSize: 20,
          statusFlag: 0,
          userId: null,
          couponType: 1
        },
        dataFinish: false,
        noData: false,
        pageFlag: true
      }
    },
    methods: {
      tabClick(flag){
        if (this.isUsed === flag) return
        this.dataFinish = false
        this.noData = false
        this.isUsed = flag
        this.params.statusFlag = this.isUsed ? 3 : 0
        this.params.pageNum = 1
        try {
          this.$refs.couponNotUsed.editCancel()
        } catch (e) {
          this.$refs.couponUsed.editCancel()
        }
        this.getUserCouponList(true)
      },
      async getUserCouponList(reset){
        this.dataFinish = true
        let data = await couponService.getUserCouponList(this.params, {showLoading: true})
        this.show = true
        if (data.list.length === 0) {
          this.noData = true
          this.dataFinish = true
          this.couponList = []
          this.usedCouponList = []
          console.log('没有数据')
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          console.log('数据加载完毕')
        } else {
          this.dataFinish = false
        }
        if (reset) {
          if (this.isUsed) {
            this.usedCouponList = data.list
          } else {
            this.couponList = data.list
          }
        } else {
          if (this.isUsed) {
            this.usedCouponList = this.usedCouponList.concat(data.list)
          } else {
            this.couponList = this.couponList.concat(data.list)
          }
        }
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getUserCouponList(false)
        done && done()
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .page {
    background: #f4f4f4;
  }

  .wrap {
    .tab {
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      border-bottom: 1px solid #d9d9d9;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 5;
      .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        p {
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #343434;
          &.active {
            color: #0164a6;
            border-bottom: 2px solid #0164a6;
          }
        }
      }
    }
    .noUse, .used {
      margin-top: 50px;
    }
  }
</style>
