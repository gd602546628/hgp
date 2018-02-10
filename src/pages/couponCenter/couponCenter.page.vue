<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish" :hasHeader="true" class="coupon-page"
  >
    <div slot="header" class="header">
      <div class="couponTop">
        <div class="top">
          <city-select class="city-select" @getSelectCity="onSelectCity"></city-select>
          <coupon-category class="coupon-category"
                           @getCouponCate="onSelectCategory($event)"
                           @onSearch="onSearch()"
          ></coupon-category>
        </div>
        <servant-sort
          :position="40"
          :sortData="sortData"
          :useScroll="false"
          @getSort="onSort($event)"
          v-if="showSort"
        ></servant-sort>
      </div>
    </div>
    <div slot="main">
      <div class="couponWrap"
           :class="{noSHowSort:!showSort}"
      >
        <coupon :couponList="couponList"></coupon>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import couponCategory from '@/components/couponCategory/couponCategory.component'
  import citySelect from '@/components/citySelect/citySelect.component'
  import servantSort from '@/components/servantSort/servantSort.component'
  import couponService from '@/service/coupon/coupon.service'
  import coupon from '@/components/coupon/coupon.component'
  import locationService from '@/service/common/location/location'
  import noData from '@/components/noDataMark/noDataMark.component'
  import {mapGetters, mapMutations} from 'vuex'
  import distanceService from '@/service/common/distance/distance'

  export default {
    name: 'couponCenter',
    components: {
      'city-select': citySelect,
      'couponCategory': couponCategory,
      'servant-sort': servantSort,
      'coupon': coupon,
      'no-data': noData
    },
    data() {
      return {
        sortData: [
          {
            type: 'location',
            default: '综合排序',
            defaultValue: -1,
            key: 'sortType',
            content: [
              {
                name: '综合排序',
                value: -1,
                check: false
              },
              {
                name: '离我最近',
                value: 0,
                check: true
              },
              {
                name: '面额最高',
                value: 1,
                check: false
              }
            ]
          },
          {
            type: 'location',
            default: '全城',
            defaultValue: null,
            key: 'distance',
            content: [
              {
                name: '1千米',
                value: 1000,
                check: true
              },
              {
                name: '3千米',
                value: 3000,
                check: true
              },
              {
                name: '5千米',
                value: 5000,
                check: true
              },
              {
                name: '10千米',
                value: 10000,
                check: true
              },
              {
                name: '全城',
                value: null,
                check: false
              }
            ]
          }
        ],
        params: {
          'pageNum': 1,
          'pageSize': 20,
          'doorCateName': null,
          'fcName': null,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': -1,
          'city': '玉溪市',
          'country': null
        },
        advertParams: {
          'proviceName': '云南省',
          'cityName': '玉溪市',
          'category': 17,  // 17-优惠券首页轮播
          'pageNum': 1,
          'pageSize': 20
        },
        couponList: [],
        noData: false,
        dataFinish: false,
        showSort: false,
        isShowAdvert: true
      }
    },
    created(){
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      async getCouponList(reset, check) { // 优惠券列表获取，reset是否重置列表true重置，false添加,check为true时只是检测，不会渲染数据
        await couponService.searchCoupon(this.params, {showLoading: true}).then(data => {
          if (check) {
            if (data.list.length === 0 && this.params.pageNum === 1) {
              this.noData = true
              this.couponList = []
            } else {
              this.noData = false
            }
          } else {
            if (data.list.length === 0 && this.params.pageNum === 1) {
              this.noData = true
              this.couponList = []
            } else {
              this.noData = false
            }
            if (this.params.pageNum === data.page.totalPage) {
              this.dataFinish = true
            }
            if (reset) {
              this.couponList = data.list
            } else {
              this.couponList = this.couponList.concat(data.list)
            }
          }
        })
      },
      async onSelectCity(data) {
        this.couponList = []
        this.dataFinish = false
        let position = data
        if (position.latitude) {
          this.params.position.latitude = position.latitude
          this.params.position.longitude = position.longitude
        }
        this.params.position.latitude || await this.getLocation()
        if (position) {
          this.params.city = position.city
          this.params.province = position.province
          this.params.country = position.country
          this.params.doorCateName = null
          this.params.fcName = null
          this.params.pageNum = 1
          this.advertParams.proviceName = position.province
          this.advertParams.cityName = position.city
          this.advertParams.pageNum = 1
          this.isShowAdvert = true
          this.getAdvertCouponList(true)
        }
      },
      async onSelectCategory(data) {
        this.dataFinish = false
        this.params.pageNum = 1
        this.params.fcName = data.fcName
        this.params.doorCateName = data.doorCateName
        this.advertParams.pageNum = 1
        if (this.params.position.longitude === null) {
          await this.getLocation().catch(() => {
          })
        }
        if (data.doorCateName === null && data.fcName === null) {
          this.showSort = false
          this.dataFinish = true
          this.isShowAdvert = true
          await this.getAdvertCouponList(true)
        } else {
          this.isShowAdvert = false
          this.dataFinish = false
          this.showSort = true
          this.getCouponList(true, false)
        }
      },
      async onSort(data) {
        this.dataFinish = false
        this.params.pageNum = 1
        this.params.sortType = data.sortType
        this.params.position.distance = data.distance
        if (this.params.position.longitude === null) {
          await this.getLocation().catch(() => {
          })
        }
        this.getCouponList(true, false)
      },
      async getLocation() {
        let position = await locationService.getLocation().catch(() => {
          throw new Error(false)
        })
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        this.advertParams.pageNum++
        this.isShowAdvert
          ? await this.getAdvertCouponList(false)
          : await this.getCouponList(false, false)
        done && done()
      },
      onSearch() {
        this.showSearchMutation(true)
        this.$router.push({
          name: 'couponSearch',
          params: {keyword: null}
        })
      },
      async getAdvertCouponList(reset) {
        this.isShowAdvert = true
        let data = await couponService.getAdvertCoupon(this.advertParams)
        this.computedDistance(data.list)
        this.couponList = reset ? data.list : this.couponList.concat(data.list)
        this.noData = this.advertParams.pageNum === 1 && data.list.length === 0
        this.dataFinish = data.pageNum >= data.totalPage
      },
      computedDistance(couponList) {
        couponList.forEach(coupon => {
          if (coupon.location) {
            let location = coupon.location.split(',')
            let latitude = location[0]
            let longitude = location[1]
            if (!this.params.position.latitude) return
            let distance = distanceService.distanceFn(latitude, this.params.position.latitude, longitude, this.params.position.longitude)
            coupon.distance = distance * 1000
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .couponTop {
    z-index: 3;
    width: 100%;
    .top {
      background: #0164a6;
      width: 100%;
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .city-select {
        /*flex: 0 0 80px;*/
        width: 23%;
        color: #ffffff;
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-justify-content: flex-start;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
      }
      .coupon-category {
        width: 0px;
        flex: 1;
        width: 77%;
      }
    }
  }

  .couponWrap {
    z-index: 2;
    margin-top: 37px;
    background: #efefef;
    &.noSHowSort {
      margin-top: 0px;
    }
  }
</style>

<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .coupon-page {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 81px !important;
      z-index: 11;
    }
  }
</style>
