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
          <goods-category :prdType="0" class="goods-category" @getGoodsCate="onCategory($event)"
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
        <prd-list :prdListDate="prdList" :state="listState" :secondWebView="secondWebView"></prd-list>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import goodsCategory from '@/components/goodsCategory/goodsCategory.component'
  import prdList from '@/components/product/productList.component'
  import prdService from '@/service/productList/productList.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import { mapMutations } from 'vuex'
  import { mainActiveJump } from '@/service/activity/activeJump.service'
  import Util from '@/service/common/utils/util.service'

  export default {
    name: 'selectedGoodsOnline',
    components: {
      'servant-sort': servantSort,
      'goods-category': goodsCategory,
      'prd-list': prdList,
      'no-data': noData
    },
    data () {
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
          doorCateId: ['13285', '13286', '13619'],
          highPrice: null,
          lowPrice: null,
          pageNum: 1,
          pageSize: 20,
          prdType: 0,
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
        doorCateMap: ['网上商城', '批发采购', '地方特产'],
        secondWebView: true
      }
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      switchState () {
        this.listState = this.listState === 1 ? 2 : 1
      },
      async onSort (data) {
        this.noData = false
        this.dataFinish = false
        this.params.pageNum = 1
        this.params.sortType = data.sortType
        // this.params.prdType = data.prdType
        this.params.highPrice = data.highPrice
        this.params.lowPrice = data.lowPrice
        this.getPrdList(true)
      },
      onCategory (data) {
        this.dataFinish = false
        this.noData = false
        this.params.pageNum = 1
        this.params.scName = data.scName
        this.params.fcName = data.fcName
        this.getPrdList(true)
      },
      showActiveAlert (item) { // 跳转活动详情
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
      showConfirm (message, ok, cancel, okCall, params) {
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
      goActInfo (item) { // 跳转活动说明页
        if (item.isUrl === 1) {
          Util.openUrl(item.introduce)
        } else {
          this.$router.push({
            name: 'activityExplain',
            params: {activityId: item.id, secondWebView: this.secondWebView}
          })
        }
      },
      async getPrdList (reset) {
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
      async loadMore (done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getPrdList(false)
        done && done()
      },
      onSearch () {
        this.showSearchMutation(true)
        this.$router.push({
          name: 'selectedGoodSearchOnline',
          params: {keyword: null, num: 0, secondWebView: this.secondWebView}
        })
      }
    },
    watch: {
      '$route': {
        handler () {
          if (this.$route.name !== 'selectedGoodsOnline') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
          }
        }
      }
    },
    created () {
      if (this.$route.query.secondWebView === 0 || this.$route.query.secondWebView === '0') {
        this.secondWebView = false
      }
      this.getPrdList(true)
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

  .top-first {
    background: #0164a6;
    width: 100%;
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .goods-category {
      width: 0px;
      flex: 1;
      width: 77%;
    }
  }
</style>
