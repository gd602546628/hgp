<template>
  <zyt-page>
    <div slot="main">
      <div class="headSearch">
        <city-select v-show="false"
                     @getSelectCity="getSelectCity"></city-select>
        <div class="search-box">
          <div class="search-icon" @click="onSearch()">
            <i class="icon-zyt-search"></i>
            <p class="good-life-search-input" v-if="!couponParams.keyword">搜索</p>
            <p class="good-life-search-input" v-if="couponParams.keyword">{{couponParams.keyword}}</p>
          </div>
        </div>
      </div>
      <div class="main-box" v-if="!noData">
        <!--优惠-->
        <div class="type-item">
          <div class="searchAllR-title" v-show="couponList.length>0">优惠</div>
          <coupon :couponList="couponList"></coupon>
          <div v-if="couponList.length>0">
            <div class="blankDiv2"></div>
            <div class="searchAllR-btn" @click="goToSearchMore(1)">
              <span>更多优惠</span><i class="icon-zyt-arrows-right"></i>
            </div>
            <div class="blankDiv"></div>
          </div>
        </div>
        <!--商品-->

        <div class="type-item">
          <div class="searchAllR-title" v-show="prdList.length > 0">商品</div>
          <prd-list :prdListDate="prdList" :state="1"></prd-list>
          <div v-if="prdList.length > 0">
            <div class="blankDiv2"></div>
            <div class="searchAllR-btn" @click="goToSearchMore(2)">
              <span>更多商品</span><i class="icon-zyt-arrows-right"></i>
            </div>
            <div class="blankDiv"></div>
          </div>
        </div>
        <!--服务-->
        <div class="type-item">
          <div class="searchAllR-title" v-show="LocalServicelist.length>0">服务</div>
          <svc-ctgry-item :LocalServiceData="LocalServicelist"></svc-ctgry-item>
          <div v-if="LocalServicelist.length>0">
            <div class="blankDiv2"></div>
            <div class="searchAllR-btn" @click="goToSearchMore(3)">
              <span>更多服务</span><i class="icon-zyt-arrows-right"></i>
            </div>
            <div class="blankDiv"></div>
          </div>
        </div>
        <!--店铺-->
        <div class="type-item">
          <div class="searchAllR-title" v-show="doorList.length>0">店铺</div>
          <door :doorList="doorList"></door>
          <div v-if="doorList.length>0">
            <div class="blankDiv2"></div>
            <div class="searchAllR-btn" @click="goToSearchMore(4)">
              <span>更多店铺</span><i class="icon-zyt-arrows-right"></i>
            </div>
          </div>
        </div>
      </div>
      <no-data v-else></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import Search from '@/service/commonSearch/commonSearch.service'
  import serviceCategoryItem from '@/components/serviceCategory/serviceCategoryItem.component'
  import goodService from '@/service/goodService/goodService.service'
  import locationService from '@/service/common/location/location'
  import noData from '@/components/noDataMark/noDataMark.component'
  import couponService from '@/service/coupon/coupon.service'
  import prdService from '@/service/productList/productList.service'
  import prdList from '@/components/product/productList.component'
  import coupon from '@/components/coupon/coupon.component'
  import preferredService from '@/service/preferred/preferred.service'
  import door from '@/components/preferred/preferred.component'
  import {mapMutations, mapState} from 'vuex'
  import Native from '@/service/common/native/native.service'
  import citySelect from '@/components/citySelect/citySelect.component'

  export default {
    name: 'servantMainSearch',
    destroyed() {
      console.info(1111112)
    },
    components: {
      'city-select': citySelect,
      'svc-ctgry-item': serviceCategoryItem,
      'prd-list': prdList,
      'no-data': noData,
      'coupon': coupon,
      'door': door
    },
    data() {
      return {
        couponParams: {
          'pageNum': 1,
          'pageSize': 3,
          'doorCateName': null,
          'fcName': null,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': -1,
          'city': '玉溪市',
          'country': null,
          'keyword': ''
        },
        prdParams: {
          keyword: '',
          doorCateId: ['13285', '13286', '13530', '13619'],
          pageNum: 1,
          pageSize: 4,
          prdType: -1,
          province: null,
          city: null,
          country: null
        },
        serviceParams: {
          pageNum: 1,
          pageSize: 3,
          position: {
            latitude: null,
            longitude: null
          },
          keyword: ''
        },
        doorParams: {
          'pageNum': 1,
          'pageSize': 3,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': -1,
          'city': '玉溪市',
          'country': null,
          'keyword': '',
          'doorCateId': ['13285', '13286', '13530', '13619']
        },
        couponList: [],
        prdList: [],
        LocalServicelist: [],
        doorList: [],
        noData: false,
        couponNoData: false,
        serviceNoData: false,
        doorNoData: false,
        prdNoData: false
      }
    },
    computed: {
      ...mapState(['selectCity', 'showSearch'])
    },
    methods: {
      ...mapMutations(['showSearchMutation', 'SelectCityMutation']),
      async getLocation() { // 获取定位
        let position = this.selectCity
        if (!this.selectCity.latitude) {
          position = await locationService.getLocation().catch(() => {
            throw new Error('定位失败')
          })
        }
        this.couponParams.position.latitude = position.latitude
        this.couponParams.position.longitude = position.longitude
        this.serviceParams.position.latitude = position.latitude
        this.serviceParams.position.longitude = position.longitude
        this.doorParams.position.latitude = position.latitude
        this.doorParams.position.longitude = position.longitude
        return true
      },
      async getCouponList() { // 优惠券列表获取
        let data = await couponService.searchCoupon(this.couponParams).catch(() => {
          throw new Error('优惠券列表获取')
        })
        if (data.list.length === 0) {
          this.couponNoData = true
          this.couponList = []
          return
        } else {
          this.couponNoData = false
        }
        this.couponList = data.list
        return true
      },
      async getPrdList() { // 商品列表获取
        this.prdParams.keyword = this.$route.params.keyword
        let data = await prdService.prdSearchList(this.prdParams).catch(() => {
          throw new Error('获取商品搜索失败')
        })
        if (data.list.length === 0) {
          this.prdNoData = true
          this.prdList = []
          return
        } else {
          this.prdNoData = false
        }
        this.prdList = data.list
        return true
      },
      async getServiceSearchList() { // 获取服务分类列表
        let data = await goodService.getServiceSearchList(this.serviceParams).catch(() => {
          throw new Error('获取服务分类列表失败')
        })
        if (data.list.length === 0) {
          this.serviceNoData = true
          this.LocalServicelist = []
          return
        } else {
          this.serviceNoData = false
        }
        this.LocalServicelist = data.list
        return true
      },
      async getDoorList() { // 店铺列表
        let data = await preferredService.searchDoor(this.doorParams).catch(() => {
          throw new Error('店铺列表失败')
        })
        if (data.list.length === 0) {
          this.doorNoData = true
          this.couponList = []
          console.log('没有数据')
          return
        } else {
          this.doorNoData = false
        }
        this.doorList = data.list
        return true
      },
      initParams() { // 重置搜索参数
        this.noData = false
        this.couponNoData = false
        this.serviceNoData = false
        this.doorNoData = false
        this.couponList = []
        this.prdList = []
        this.LocalServicelist = []
        this.doorList = []
        this.couponParams.keyword = this.$route.params.keyword || ''
        this.couponParams.province = this.selectCity.province
        this.couponParams.city = this.selectCity.city
        this.couponParams.country = this.selectCity.country || null
        this.doorParams.keyword = this.$route.params.keyword || ''
        this.doorParams.province = this.selectCity.province
        this.doorParams.city = this.selectCity.city
        this.doorParams.country = this.selectCity.country || null
        this.prdParams.province = this.selectCity.province
        this.prdParams.city = this.selectCity.city
        this.prdParams.country = this.selectCity.country || null
        this.serviceParams.keyword = this.$route.params.keyword || ''
        if (this.selectCity.city && (this.selectCity.city !== '') && (this.selectCity.city !== null)) {
          if (this.selectCity.country && (this.selectCity.country !== '') && (this.selectCity.country !== null)) {
            this.serviceParams['serviceAreaName'] = this.selectCity.province + ' ' + this.selectCity.city + ' ' + this.selectCity.country
          } else {
            this.serviceParams['serviceAreaName'] = this.selectCity.province + ' ' + this.selectCity.city
          }
        }
      },
      isNoData() {
        if (this.couponNoData && this.serviceNoData && this.doorNoData && this.prdNoData) {
          this.noData = true
        } else {
          this.noData = false
        }
      },
      async allFn() {
        /* if (typeof this.$route.params.keyword === 'undefined') {
         return
         } */
        this.initParams()
        await this.getLocation()
        await Promise.all([this.getCouponList(), this.getPrdList(), this.getServiceSearchList(), this.getDoorList()])
        /* this.getCouponList()
        this.getPrdList()
        this.getServiceSearchList()
        this.getDoorList() */
      },
      async setCity() {
        if (Native.isApp()) {
          let city = await Native.todoNative('common_native', 'switchCity', {showSwitchCity: '0'})
          if (city) {
            city.country = city.country || city.county || null
          }
          locationService.setLocationInfo(city)
          this.SelectCityMutation(city) // 跟新store，让所有用到这个状态的组件更新
        }
      },
      getSelectCity() {
       // this.initParams()
      },
      async init() {
        if (this.$route.name !== 'servantMainSearch') {
          return
        }
        setTimeout(() => {
          /* if (this.showSearch || this.$route.params.showSearch) {
           this.onSearch()
           } */
          if (this.$route.params.showSearch === '_shouldShowSearch') {
            this.onSearch()
          }
          this.showSearchMutation(false)
        }, 10)
        await this.allFn()
        this.isNoData()
      },
      goToSearchMore(it) {
        // 跳转更多
        if (it === 1) {
          this.$router.push({
            name: 'couponSearch',
            params: {keyword: this.$route.params.keyword || null}
          })
        } else if (it === 2) {
          this.$router.push({
            name: 'selectedGoodSearch',
            params: {keyword: this.$route.params.keyword || null, num: 1}
          })
        } else if (it === 3) {
          this.$router.push({
            name: 'serviceSearch',
            params: {keyword: this.$route.params.keyword || null}
          })
        } else {
          this.$router.push({
            name: 'goodLifeSearch',
            params: {keyword: this.$route.params.keyword || null, num: 1}
          })
        }
      },
      onSearch() {
        Search(true, 0).then(keyWord => {
          if ((keyWord.type === 'goodLifeSearch') || (keyWord.type === 'selectedGoodSearch')) {
            this.$router.replace({
              name: keyWord.type,
              params: {keyword: keyWord.keyword || null, showSearch: 'noShowSearch', num: 0}
            })
          } else {
            this.$router.replace({
              name: keyWord.type,
              params: {keyword: keyWord.keyword || null, showSearch: 'noShowSearch'}
            })
          }
        }).catch(() => {
        })
      }
    },
    created() {
      this.init().catch((err) => {
        console.log(err)
      })
    },
    watch: {
      '$route': 'init'
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
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

  .main-box {
    .type-item {
      .searchAllR-title {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        color: #aaaaaa;
        font-size: 14px;
        border-bottom: solid 1px #efefef;
      }
      .searchAllR-btn {
        display: flex;
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px;
        color: #0164a6;
        font-size: 14px;
      }
      .blankDiv {
        height: 6px;
        width: 100%;
        background-color: #efefef;
      }
      .blankDiv2 {
        height: 2px;
        width: 100%;
        background-color: #efefef;
      }
    }
  }

</style>
