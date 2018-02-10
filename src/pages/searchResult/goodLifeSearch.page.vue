<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            :hasHeader="true"
            class="lifeSearchPage"
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
        <door :doorList="couponList" :showMoreData="hasShowMoreData"></door>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import preferredService from '@/service/preferred/preferred.service'
  import door from '@/components/preferred/preferred.component'
  import locationService from '@/service/common/location/location'
  import Search from '@/service/commonSearch/commonSearch.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: 'goodLifeSearch',
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
                name: '评分最高',
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
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': -1,
          'city': '玉溪市',
          'country': null,
          'keyword': '',
          'doorCateId': ['13530']
        },
        couponList: [],
        dataFinish: false,
        pageFlag: false,
        noData: false,
        hasShowMoreData: false
      }
    },
    components: {
      'servant-sort': servantSort,
      'door': door,
      'no-data': noData
    },
    computed: {
      ...mapState(['selectCity', 'showSearch'])
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'goodLifeSearch') {
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
        this.params.pageNum = 1
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
        if (parseInt(this.$route.params.num) === 1) {
          this.params.doorCateId = ['13285', '13286', '13530', '13619']
          this.hasShowMoreData = false
        } else {
          this.hasShowMoreData = true
          this.params.doorCateId = ['13530']
        }
        let data = await preferredService.searchDoor(this.params, {showLoading: true}).catch(() => {
          throw new Error('好生活搜索列表获取失败')
        })
        if (!data) {
          return
        }
        if (data.list.length === 0 && this.params.pageNum === 1) {
          this.dataFinish = true
          this.pageFlag = true
          this.noData = true
          this.couponList = []
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.couponList = data.list
        } else {
          this.couponList = this.couponList.concat(data.list)
        }
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
        Search(false, 4).then(keyWord => {
          this.$router.replace({
            name: 'goodLifeSearch',
            params: {keyword: keyWord.keyword || null, num: this.$route.params.num}
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
  .lifeSearchPage {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 87px !important;
      z-index: 11;
    }
  }
</style>
