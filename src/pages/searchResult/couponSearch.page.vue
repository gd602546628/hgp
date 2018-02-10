<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            :hasHeader="true"
            class="couponSearchPage"
  >
    <div class="header" slot="header">
      <div class="top">
        <div class="search" @click="onSearch()">
          <div class="wrap">
            <i class="icon-zyt-search"></i>
            <p v-if="!params.keyword">搜索</p>
            <p v-if="params.keyword">{{params.keyword}}</p>
          </div>
        </div>
        <servant-sort :sortData="sortData" :useScroll="false" @getSort="onSort($event)" :position="46"></servant-sort>
      </div>
    </div>
    <div slot="main" class="good-life-category">
      <div class="door-list">
        <coupon :couponList="couponList"></coupon>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import couponService from '@/service/coupon/coupon.service'
  import coupon from '@/components/coupon/coupon.component'
  import locationService from '@/service/common/location/location'
  import Search from '@/service/commonSearch/commonSearch.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: 'couponSearch',
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
          'country': null,
          'keyword': ''
        },
        couponList: [],
        dataFinish: false,
        pageFlag: false,
        noData: false,
        keyWords: ''
      }
    },
    components: {
      'servant-sort': servantSort,
      'coupon': coupon,
      'no-data': noData
    },
    computed: {
      ...mapState(['selectCity', 'showSearch'])
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'couponSearch') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
            if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      init() {
        if (this.$route.name !== 'couponSearch') {
          return
        }
        this.params.keyword = this.$route.params.keyword || ''
        this.params.province = this.selectCity.province
        this.params.city = this.selectCity.city
        this.params.country = this.selectCity.country
        setTimeout(() => {
          if (this.showSearch) {
            this.onSearch()
          }
          this.showSearchMutation(false)
        }, 10)
        this.getLocation().then(() => {
          this.getCouponList(true)
        })
      },
      async getCouponList(reset) { // 优惠券列表获取，reset是否重置列表true重置，false添加,check为true时只是检测，不会渲染数据
        await couponService.searchCoupon(this.params, {showLoading: true}).then(data => {
          if (data.list.length === 0) {
            this.dataFinish = true
            this.pageFlag = true
            this.noData = true
            this.couponList = []
            return
          } else {
            this.noData = false
          }
          if (this.params.pageNum === data.page.totalPage) {
            this.dataFinish = true
            this.pageFlag = true
            console.log('所有数据加载完毕')
          } else {
            this.dataFinish = false
            this.pageFlag = false
          }
          if (reset) {
            this.couponList = data.list
          } else {
            this.couponList = this.couponList.concat(data.list)
          }
        })
      },
      async getLocation() {
        let position = this.selectCity
        if (!position.latitude) {
          position = await locationService.getLocation().catch(() => {
            throw new Error(false)
          })
        }
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      async onSort(data) {
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.params.sortType = data.sortType
        this.params.position.distance = data.distance
        if (this.params.position.longitude === null) {
          await this.getLocation().catch(() => {
          })
        }
        this.getCouponList(true, false)
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getCouponList(false, false)
        done && done()
      },
      onSearch() {
        Search(false, 1).then(keyWord => {
          this.$router.replace({
            name: 'couponSearch',
            params: {keyword: keyWord.keyword || null}
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .top {
    z-index: 10;
    width: 100%;
    .search {
      padding: 6px 10px;
      background: #f2f2f2;

      .wrap {
        display: flex;
        background: #ffffff;
        height: 34px;
        border-radius: 4px;
        align-items: center;
        color: #88888d;

        i {
          font-size: 20px;
          margin: 0 10px;
        }

        p {
          font-size: 14px;
        }

      }
    }
  }

  .good-life-category {
    .door-list {
      margin-top: 47px;
    }

  }
</style>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .couponSearchPage {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 87px !important;
      z-index: 11;
    }
  }
</style>
