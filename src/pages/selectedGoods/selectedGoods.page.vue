<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            class="selectGoodPage"
            :hasHeader="true"
            :class="{fix:carouselList&&carouselList.length==0}"
            v-show="show"
  >
    <div slot="header" class="header">
      <div class="top">
        <div class="top-first">

          <city-select class="city-select-container" @getSelectCity="onSelectCity($event)"></city-select>
          <goods-category :prdType="1" :city="selectCity.city" :country="selectCity.country" class="goods-category"
                          @getGoodsCate="onCategory($event)"
                          @onSearch="onSearch()" :doorCateMap="doorCateMap"></goods-category>
        </div>
        <servant-sort :sortData="sortData"
                      :useScroll="false"
                      :position="40"
                      :scrollPosition="scrollPosition"
                      :showSwitch="true"
                      :state="listState"
                      @getSort="onSort($event)"
                      @onSwitch="switchState()"
                      v-if="carouselList&&carouselList.length==0"
        ></servant-sort>
      </div>
    </div>
    <div slot="main">
      <div class="carousel" v-if="carouselList&&carouselList.length>0">
        <mt-swipe :showIndicators="carouselList.length === 1?false:true">
          <mt-swipe-item v-for="carouse in carouselList" :key="carouse.id">
            <img :src="carouse.imageUrl | imgPrefix" class="carouse-img" @click="showActiveAlert(carouse)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <servant-sort :sortData="sortData"
                    :useScroll="true"
                    :position="40"
                    :scrollPosition="scrollPosition"
                    :showSwitch="true"
                    :state="listState"
                    @getSort="onSort($event)"
                    @onSwitch="switchState()"
                    v-if="carouselList&&carouselList.length>0"
      ></servant-sort>
      <div class="prd-content"
           :class="{'prd-content-two': carouselList&&carouselList.length>0,'fixTop':carouselList&&carouselList.length==0}">
        <prd-list :prdListDate="prdList" :state="listState"></prd-list>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import goodsCategory from '@/components/goodsCategory/goodsCategory.component'
  import prdList from '@/components/product/productList.component'
  import locationService from '@/service/common/location/location'
  import prdService from '@/service/productList/productList.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import preferredService from '@/service/preferred/preferred.service'
  import {mapMutations, mapState} from 'vuex'
  import {mainActiveJump} from '@/service/activity/activeJump.service'
  import Util from '@/service/common/utils/util.service'
  import citySelect from '@/components/citySelect/citySelect.component'

  export default {
    name: 'selectedGoods',
    components: {
      'city-select': citySelect,
      'servant-sort': servantSort,
      'goods-category': goodsCategory,
      'prd-list': prdList,
      'no-data': noData
    },
    data() {
      return {
        show: false,
        sortData: [
          {
            type: 'normal',
            default: '综合排序',
            defaultValue: -1,
            key: 'sortType',
            content: [
              {
                name: '综合排序',
                value: -1
              },
              {
                name: '销量',
                value: 0
              },
              {
                name: '最近添加',
                value: 1
              }
            ]
          },
          {
            type: 'price',
            default: '价格'
          }/* ,
          {
            type: 'normal',
            default: '全部商品',
            defaultValue: null,
            key: 'prdType',
            content: [
              {
                name: '全部商品',
                value: null
              },
              {
                name: '送货上门',
                value: 0
              },
              {
                name: '到店消费',
                value: 1
              }
            ]
          },
          {
            type: 'location',
            default: '全部商家',
            defaultValue: false,
            key: 'isLocal',
            content: [
              {
                name: '全部商家',
                value: false,
                check: false
              },
              {
                name: '本地商家',
                value: true,
                check: true
              }
            ]
          } */
        ],
        prdList: [],
        params: {
          city: null,
          doorCateId: ['13285', '13286', '13619'],
          highPrice: null,
          lowPrice: null,
          pageNum: 1,
          pageSize: 20,
          prdType: 1,
          sortType: -1,
          fcName: null,
          scName: null
        },
        dataFinish: false,
        noData: false,
        pageFlag: false,
        listState: 1, // 1: 宫格方式，2：列表方式
        carouseHeight: 0,
        scrollPosition: 0,
        carouselList: [], // 轮播数据
        doorCateMap: ['地方特产', '批发采购', '网上商城']
      }
    },
    computed: {
      ...mapState(['selectCity'])
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      switchState() {
        this.listState = this.listState === 1 ? 2 : 1
      },
      async onSort(data) {
        this.noData = false
        this.dataFinish = false
        this.params.pageNum = 1
        this.params.sortType = data.sortType
        // this.params.prdType = data.prdType
        this.params.highPrice = data.highPrice
        this.params.lowPrice = data.lowPrice
      /*  if (data.isLocal) {
          await this.getLocation()
        } else {
          this.params.city = null
        } */
        this.params.city = this.selectCity.city
        this.getPrdList(true)
      },
      onCategory(data) {
        this.dataFinish = false
        this.noData = false
        this.params.pageNum = 1
        this.params.scName = data.scName
        this.params.fcName = data.fcName
        this.getPrdList(true)
      },
      onSelectCity(data) {
        this.getCaroucels()
        this.dataFinish = false
        this.noData = false
        this.params.pageNum = 1
        this.params.scName = null
        this.params.fcName = null
        this.getPrdList(true)
      },
      async getLocation() {
        let location = await locationService.getLocation().catch(() => {
          throw new Error(false)
        })
        this.params.city = location.city
      },
      async getCaroucels() {
        if (!this.selectCity) {
          return
        }
        await preferredService.getCaroucels({
          category: 4,
          proviceName: this.selectCity.province || null,
          cityName: this.selectCity.city || null
        }).then(data => {
          if (data.length === 0) {
            this.scrollPosition = 0
          } else {
            this.scrollPosition = 150
          }
          this.carouselList = data
        })
      },
      showActiveAlert(item) { // 跳转活动详情
        if (item.startTime && item.endTime) {
          if (item.category === 5) { // 促销活动
            let showConfirm = (year, month, day, hours) => {
              this.showConfirm('感谢您对本次活动的支持，本次活动将于' + year + '年' + month + '月' + day + '日' + hours + '时开始，详情查看活动说明！', '活动说明', '我知道了', this.goActInfo, item)
            }
            let endConfirm = () => {
              Util.confirm('活动已结束！', '', {
                confirmButtonText: '关闭',
                showCancelButton: false
              })
            }
            let startTime = new Date(item.startTime.replace(/-/g, '/')).getTime()
            let endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
            let nowTime = new Date().getTime()
            if ((nowTime > startTime && nowTime < endTime) && item.activityIsDelete === 0) {
              mainActiveJump(item)
            } else if ((nowTime < startTime) && item.activityIsDelete === 0) {
              showConfirm(new Date(startTime).getFullYear(), new Date(startTime).getMonth() + 1, new Date(startTime).getDate(), new Date(startTime).getHours())
            } else if (item.activityIsDelete === 1) {
              endConfirm()
            } else {
              endConfirm()
            }
          } else {
            mainActiveJump(item)
          }
        } else {
          mainActiveJump(item)
        }
      },
      showConfirm(message, ok, cancel, okCall, params) {
        Util.confirm({
          message: message,
          confirmButtonText: ok,
          cancelButtonText: cancel,
          showCancelButton: true
        }).then(() => {
          okCall(params)
        }).catch(() => {
        })
      },
      goActInfo(item) { // 跳转活动说明页
        if (item.isUrl === 1) {
          Util.openUrl(item.introduce)
        } else {
          this.$router.push({name: 'activityExplain', params: {activityId: item.id}})
        }
      },
      async getPrdList(reset) {
        if (!this.selectCity || !this.selectCity.city) {
          return
        }
        this.params.city = this.selectCity.city
        this.params.country = this.selectCity.country || null
        let data = await prdService.prdSearchList(this.params, {showLoading: true})
        this.show = true
        if (data.list.length === 0 && this.params.pageNum === 1) {
          console.log('没有数据')
          this.noData = true
          this.prdList = []
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          console.log('数据加载完毕')
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.prdList = data.list
        } else {
          this.prdList = this.prdList.concat(data.list)
        }
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getPrdList(false)
        done && done()
      },
      onSearch() {
        this.showSearchMutation(true)
        this.$router.push({
          name: 'selectedGoodSearch',
          params: {keyword: null, num: 0}
        })
      }
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'selectedGoods') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
          }
        }
      }
    },
    created() {
      this.getCaroucels()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import '../../assets/css/variables-primary.scss';

  .top {
    z-index: 10;
    width: 100%;
    background-color: white;
  }

  .carousel {
    height: 150px;
    .carouse-img {
      width: 100%;
      height: 100%;
    }
  }

  .prd-content {
    &.fixTop {
      margin-top: 36px;
    }
  }

  .switch-state {
    text-align: center;
    height: 40px;
    line-height: 40px;
    padding-right: 10px;
    border-bottom: 1px solid #efefef;
    max-width: 60px;
    position: relative;
    display: flex;
    align-items: center;
    &:after {
      position: absolute;
      content: '';
      display: block;
      height: 26px;
      top: 7px;
      left: 10px;
      width: 1px;
      background-color: map_get($ComBorderColor, dd);
    }
    i {
      padding-left: 30px;
      font-size: 20px;
      display: block;
    }
  }
</style>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .selectGoodPage {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 41px !important;
      z-index: 11;
    }
    &.fix {
      ._header {
        height: 81px;
      }
    }
  }

  .top {
    .top-first {
      background: #0164a6;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      justify-content: flex-start;
      -webkit-justify-content: flex-start;
      align-items: center;

      .city-select-container {
        /*flex: 0 0 80px;*/
        min-width: 23%;
        width: 23%;
        max-width: 100%;
        color: #ffffff;
        display: flex;
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-justify-content: flex-start;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
      }
      .goods-category {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        width: 77%;
      }
    }
  }
</style>
