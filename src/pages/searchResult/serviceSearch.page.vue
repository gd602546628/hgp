<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            :hasHeader="true"
            class="serviceSearchPage"
  >
    <div class="header" slot="header">
      <div class="head-fixed">
        <div class="headSearch">
          <div class="search-box">
            <div class="search-icon" @click="onSearch()">
              <i class="icon-zyt-search"></i>
              <p class="good-life-search-input" v-if="!params.keyword">搜索</p>
              <p class="good-life-search-input" v-if="params.keyword">{{params.keyword}}</p>
            </div>
          </div>
        </div>
        <servant-sort :sortData="sortData"
                      :position="50"
                      :useScroll="false"
                      @getSort="onSort($event)"
        ></servant-sort>
      </div>
    </div>
    <div slot="main">
      <div class="content"
      >
        <svc-ctgry-item :LocalServiceData="LocalServicelist"></svc-ctgry-item>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import Search from '@/service/commonSearch/commonSearch.service'
  import serviceCategoryItem from '@/components/serviceCategory/serviceCategoryItem.component'
  import goodService from '@/service/goodService/goodService.service'
  import locationService from '@/service/common/location/location'
  import noData from '@/components/noDataMark/noDataMark.component'
  import {mapMutations, mapState} from 'vuex'
  import servantSort from '@/components/servantSort/servantSort.component'
  import distanceService from '@/service/common/distance/distance'

  export default {
    name: 'serviceSearch',
    components: {
      'svc-ctgry-item': serviceCategoryItem,
      'no-data': noData,
      'servant-sort': servantSort
    },
    data() {
      return {
        LocalServicelist: [],
        sortData: [
          {
            type: 'location',
            default: '综合排序',
            defaultValue: -1,
            key: 'sortType',
            content: [{
              name: '综合排序',
              value: -1,
              check: false
            }, {
              name: '离我最近',
              value: 0,
              check: true
            }]
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
          pageNum: 1,
          pageSize: 20,
          position: {
            distance: null,
            latitude: null,
            longitude: null
          },
          sortType: -1,
          keyword: ''
        },
        dataFinish: false,
        pageFlag: false,
        noData: false
      }
    },
    computed: {
      ...mapState(['selectCity', 'showSearch'])
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      async getLocation() { // 获取定位
        let position = this.selectCity
        if (!position.latitude) {
          position = await locationService.getLocation().catch(() => {
            this.isLocation = false
            throw new Error('定位失败')
          })
        }
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      async getServiceSearchList(reset) { // 获取服务分类列表，reset是否重置列表true重置，false添加
        let data = await goodService.getServiceSearchList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取服务分类列表失败')
        })
        if (data.list.length === 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.LocalServicelist = data.list
        } else {
          this.LocalServicelist = this.LocalServicelist.concat(data.list)
        }
        this.computedDistance()
        return true
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getServiceSearchList(false)
        done && done()
      },
      initParams() {  // 重置搜索参数
        this.LocalServicelist = []
        this.noData = false
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.params.keyword = this.$route.params.keyword || null
        if (this.selectCity.city && (this.selectCity.city !== '') && (this.selectCity.city !== null)) {
          if (this.selectCity.country && (this.selectCity.country !== '') && (this.selectCity.country !== null)) {
            this.params['serviceAreaName'] = this.selectCity.province + ' ' + this.selectCity.city + ' ' + this.selectCity.country
          } else {
            this.params['serviceAreaName'] = this.selectCity.province + ' ' + this.selectCity.city
          }
        }
      },
      async init() {
        this.initParams()
        setTimeout(() => {
          if (this.showSearch) {
            this.onSearch()
          }
          this.showSearchMutation(false)
        }, 10)
        await this.getLocation()
        await this.getServiceSearchList(true)
      },
      onSearch() {
        Search(false, 3).then(keyWord => {
          this.$router.replace({
            name: 'serviceSearch',
            params: {keyword: keyWord.keyword || null}
          })
        }).catch(() => {
        })
      },
      computedDistance() {
        this.LocalServicelist.forEach(coupon => {
          if (coupon.location) {
            let location = coupon.location.split(',')
            let latitude = location[0]
            let longitude = location[1]
            let distance = distanceService.distanceFn(latitude, this.params.position.latitude, longitude, this.params.position.longitude)
            coupon.distance = distance * 1000
          }
        })
      },
      onSort(data) {
        this.dataFinish = false
        this.params.position.distance = data.distance
        this.params.sortType = data.sortType
        this.getServiceSearchList(true)
      }
    },
    created() {
      this.init().catch((err) => {
        console.log(err)
      })
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'serviceSearch') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
            if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .head-fixed {
    width: 100%;
    z-index: 10;
    background: #ffffff;
    .headSearch {
      position: relative;
      height: 50px;
      background-color: #f5f5f9;
      .search-box {
        height: 34px;
        position: absolute;
        display: flex;
        width: 94%;
        z-index: 2;
        top: 8px;
        margin: 0 3% 0 3%;
        background-color: white;
        font-size: 13px;
        border-radius: 3px;
        .search-icon {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-start;
          i {
            font-size: 20px;
            padding: 0;
            margin-left: 10px;
            margin-right: 10px;
            color: #b0b0b0;
          }
          p {
            height: 35px;
            line-height: 35px;
            margin: 0;
            color: #88888d;
          }
        }
      }
    }
  }

  .content {
    margin-top: 47px;
  }
</style>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .serviceSearchPage {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 87px !important;
      z-index: 11;
    }
  }
</style>
