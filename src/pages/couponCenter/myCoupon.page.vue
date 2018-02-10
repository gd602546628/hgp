<template>
  <zyt-page :hasHeader="false"
            :enableInfinite="!dataFinish"
            :on-infinite="loadMore"
            ref="page">
    <div slot="main">
      <div class="tabBtn">
        <span :class="{tabActive:parseInt(num)==tab.flag}"
              v-for="(tab, index) in titleData"
              @click="clickTab(tab.flag)">
          {{tab.title}}
        </span>
      </div>
      <div v-if="parseInt(num)===0" class="notUsed">
        <!--<my-coupon :couponList="couponList" :showDelete="showDelete" :tabNum="num" ref="couponNotUsed"></my-coupon>-->
        <my-coupon :couponList="couponList" :canClick="true" ref="couponNotUsed"></my-coupon>
      </div>
      <div v-if="parseInt(num)===3" class="Used">
        <!--<my-coupon :couponList="couponList" :showDelete="showDelete" :tabNum="num" ref="couponUsed"></my-coupon>-->
        <my-coupon :couponList="couponList" :canClick="false" ref="couponUsed"></my-coupon>
      </div>
      <!-- <div v-if="parseInt(num)===1" class="Used">
         <my-coupon :couponList="couponList" :showDelete="showDelete" :tabNum="num"></my-coupon>
       </div>-->
      <!--  <div v-if="parseInt(num)===2" class="Expired">
          <my-coupon :couponList="couponList" :showDelete="showDelete" :tabNum="num"></my-coupon>
        </div>-->
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import couponService from '@/service/coupon/coupon.service'
  import { mapGetters } from 'vuex'
  import myCoupon from './../newCoupon/newMyCounpon.component.vue'
  import NoData from '@/pages/newCoupon/noCoupon.component.vue'

  export default {
    name: 'myCoupon',
    components: {
      'my-coupon': myCoupon,
      'no-data': NoData
    },
    data () {
      return {
        loaded: false,
        couponList: [],
        showDelete: false,
        num: 0,
        showList: false,
        dataFinish: false,
        pageFlag: false,
        // titleData: [{'title': '未使用'}, {'title': '已使用'}, {'title': '已失效'}],
        titleData: [{'title': '未使用', flag: 0}, {'title': '已失效', flag: 3}],
        params: {
          pageNum: 1,
          pageSize: 10,
          statusFlag: 0,
          userId: null
        }
      }
    },
    created () {
      this.init()
    },
    deactivated () {
      this.dataFinish = true
    },
    computed: {
      ...mapGetters(['userInfo']),
      noData () {
        return this.loaded && (!this.couponList || this.couponList.length === 0)
      }
    },
    methods: {
      async init () {
        if (this.$route.name !== 'myCoupon') {
          return
        }
        await this.paramsFn()
        this.getUserCouponList(true)
        this.$refs.page.init()
      },
      paramsFn () {
        this.num = parseInt(this.$route.params.index)
        this.couponList = []
        this.loaded = false
        this.params.userId = this.userInfo.userId
        this.params.statusFlag = this.$route.params.index
        this.params.pageNum = 1
        this.dataFinish = false
        this.pageFlag = false
        this.showDelete = false
      },
      async getUserCouponList (reset) {
        this.dataFinish = true
        let data = await couponService.getUserCouponList(this.params, {showLoading: true})
        this.loaded = true
        if (data.list.length === 0) {
          this.dataFinish = true
          this.pageFlag = true
          this.couponList = []
          console.log('没有数据')
          return
        } else {
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (data.list && data.list.length > 0) {
          data.list.forEach(item => {
            item['checked'] = false
          })
        }
        if (reset) {
          this.couponList = data.list
        } else {
          this.couponList = this.couponList.concat(data.list)
        }
        return true
      },
      clickTab (index) {
        try {
          this.$refs.couponNotUsed.editCancel()
        } catch (e) {
          this.$refs.couponUsed.editCancel()
        }
        this.num = index
        this.$router.replace({name: 'myCoupon', params: {index: index}, query: this.$route.query})
        this.init()
      },
      async loadMore (done) { // 加载更多
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
<style rel="stylesheet/scss" scoped lang="scss">
  /*  .index-title {
      border-bottom-width: 1px !important;
      background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
      border-bottom: 1px solid #b2b2b2;
      border-top: 1px solid #b2b2b2;
      color: #2d2d2d;
      .title-left {
        i {
          font-size: 19px;
          font-weight: bold;
          padding-left: 8px;
          color: #343434;
          margin-right: 2px;
        }
      }
      .title-right {
        color: #066cc2;
        .mint-button-text {
          color: #066cc2;
        }
      }
    }*/

  .tabBtn {
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0px;
    z-index: 3;
    height: 45px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f2f5;
    justify-content: space-between;
    background-color: white;
    span {
      display: -webkit-flex;
      -webkit-align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      align-items: center;
      display: flex;
      width: 50%;
      height: 100%;
      line-height: 45px;
      text-align: center;
      font-size: 13px;
      color: rgba(68, 68, 68, .4);
      opacity: 1;
    }
    .tabActive {
      color: #066cc2;
      border-bottom: solid 2px #066cc2;
    }
  }

  .notUsed, .Used, .Expired {
    margin-top: 45px;
    background: #efefef;
  }
</style>
