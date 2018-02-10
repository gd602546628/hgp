<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div slot="main" class="mainWrap">
      <div class="top">
        <div class="search" @click="goSearch()">
          <i class="icon-zyt-search"></i>
          <p>搜索优惠</p>
        </div>
        <div class="my-coupon" @click="goMyCoupon()">
          <i class="icon-zyt-new-coupon"></i>
          <p>我的券</p>
        </div>
      </div>
      <mt-swipe :auto="0" class="swipe-wrap" :style="{height:swipeHeight}">
        <mt-swipe-item v-for="out,i in category" class="swipe-page" :key="i">
          <div v-for="inner in out" class="swipe-item" ref="categoryItem" @click="goCategory(inner)">
            <img :src="inner.img">
            <p>{{inner.fcName}}</p>
          </div>
        </mt-swipe-item>
      </mt-swipe>

      <!--<servant-sort :sortData="sortData"
                    :useScroll="true"
                    :scrollPosition="scrollPosition"
                    @getSort="onSort($event)"
                    v-if="showServantSort"
      ></servant-sort>-->
      <div class="coupon-list">
        <coupon :couponList="couponList"></coupon>
        <no-data v-if="noData" style="margin-top: 20px"></no-data>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import {mapMutations, mapState} from 'vuex'
  // import coupon from '@/pages/newCoupon/newCoupon.component'
  import coupon from '@/components/coupon/coupon.component'
  import locationService from '@/service/common/location/location'
  import couponService from '@/service/coupon/coupon.service'
  import servantSort from '@/components/servantSort/servantSort.component'
  import noData from '@/components/noDataMark/noDataMark.component'
  import cy from '../../assets/img/newCoupon/cy.png'
  import dq from '../../assets/img/newCoupon/dq.png'
  import jc from '../../assets/img/newCoupon/jc.png'
  import jd from '../../assets/img/newCoupon/jd.png'
  import jj from '../../assets/img/newCoupon/jj.png'
  import jy from '../../assets/img/newCoupon/jy.png'
  import mj from '../../assets/img/newCoupon/mj.png'
  import ms from '../../assets/img/newCoupon/ms.png'
  import my from '../../assets/img/newCoupon/my.png'
  import mz from '../../assets/img/newCoupon/mz.png'
  import nz from '../../assets/img/newCoupon/nz.png'
  import qcfw from '../../assets/img/newCoupon/qcfw.png'
  import qcyp from '../../assets/img/newCoupon/qcyp.png'
  import xh from '../../assets/img/newCoupon/xh.png'
  import yl from '../../assets/img/newCoupon/yl.png'
  import yy from '../../assets/img/newCoupon/yy.png'
  import zb from '../../assets/img/newCoupon/zb.png'
  import computer from '../../assets/img/newCoupon/computer.png'
  import distanceService from '@/service/common/distance/distance'

  export default {
    name: 'newCoupon',
    components: {
      'coupon': coupon,
      'servant-sort': servantSort,
      'no-data': noData
    },
    computed: {
      ...mapState(['selectCity'])
    },
    data() {
      return {
        show: false,
        // 排序数据
        sortData: [
          {
            type: 'normal',
            default: '全部',
            defaultValue: null,
            key: 'fcName',
            content: [{
              name: '全部',
              value: null
            }]
          },
          {
            type: 'location',
            default: '离我最近',
            defaultValue: 0,
            key: 'sortType',
            content: [
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
        // 写死的分类
        category: [
          [{fcName: '美食', img: ms},
            {fcName: '休闲娱乐', img: yl},
            {fcName: '丽人美妆', img: mz},
            {fcName: '茶/冲饮', img: cy},
            {fcName: '汽车服务', img: qcfw},
            {fcName: '教育培训', img: jy},
            {fcName: '酒店', img: jd},
            {fcName: '母婴用品', img: my},
            {fcName: '医药保健', img: yy},
            {fcName: '家居家纺', img: jj}],
          [{fcName: '汽车用品', img: qcyp},
            {fcName: '珠宝配饰', img: zb},
            {fcName: '家用电器', img: dq},
            {fcName: '衣物洗护', img: xh},
            {fcName: '女装', img: nz},
            {fcName: '家电办公', img: computer},
            {fcName: '建筑建材', img: jc},
            {fcName: '美酒佳酿', img: mj}]
        ],
        // 优惠券列表
        couponList: [],
        swipeHeight: '150px',
        // 滚动距离，滚动150后将servantSort组件置于顶部
        scrollPosition: 150,
        // 上啦加载完成标识
        dataFinish: true,
        // 没有数据标识
        noData: false,
        // 缓存的上啦加载标识
        pageFlag: true,
        // couponSearch接口入参
        params: {
          'pageNum': 1,
          'pageSize': 20,
          'doorCateName': null,
          'fcName': null,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': 0,
          'city': '玉溪市',
          'country': null,
          'couponType': 1
        },
        advertParams: {
          'proviceName': '云南省',
          'cityName': '玉溪市',
          'category': 17, // 17-优惠券首页轮播
          'pageNum': 1,
          'pageSize': 20
        },
        showServantSort: false
      }
    },
    created() {
      this.category.forEach(out => {
        out.forEach(item => {
          let result = {
            value: item.fcName,
            name: item.fcName
          }
          this.sortData[0].content.push(result)
        })
      })
      this.init()
    },
    mounted() {
      // 动态计算swipe的高度
      let itemImg = this.$refs.categoryItem[0].querySelector('img')
      let itemOffsetHeight = itemImg.offsetWidth + 26
      this.swipeHeight = itemOffsetHeight * 2 + 44 + 'px'
      this.scrollPosition = itemOffsetHeight * 2 + 100
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      async init() {
        // 先不创建servantSort组件，等组件需要的sortData准备完后再创建组件
        // this.showServantSort = false
        // 定位成功默认显示离我最近，否则面额最高
        await this.getLocation().then(() => {
          this.params.sortType = 0
          this.sortData[1].default = '离我最近'
          this.sortData[1].defaultValue = 0
        }).catch(() => {
          this.sortData[1].default = '面额最高'
          this.sortData[1].defaultValue = 1
          this.params.sortType = 1
        })
        // this.showServantSort = true
       /* await this.getLocation().catch(() => {
        }) */
        await this.getAdvertCouponList(true)
        /* await this.getCouponList().catch(() => {
         }) */
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
      },
      goCategory(category) {
        this.$router.push({
          name: 'newSearchCoupon',
          params: {fcName: category.fcName, keword: null, secondWebView: true}
        })
      },
      goSearch() {
        // vuex中showSearch设置为true，下级页面会将搜索框打开
        this.showSearchMutation(true)
        this.$router.push({name: 'newSearchCoupon', params: {keword: null, fcName: 'null', secondWebView: true}})
      },
      goMyCoupon() {
        this.$router.push({name: 'newMyCoupon', params: {secondWebView: true}})
      },
      onSort(category) {
        // 分类名为 建筑建材 接口入参特殊处理
        if (category.fcName === '建筑建材') {
          this.params.fcName = '建筑、建材'
        } else {
          this.params.fcName = category.fcName
        }
        this.params.sortType = category.sortType
        this.params.position.distance = category.distance
        this.params.pageNum = 1
        this.dataFinish = false
        this.getCouponList(true)
      },
      async getLocation() {
        let position = this.selectCity
        if (!position.latitude) {
          position = await locationService.getLocation().catch(() => {
            this.params.position.latitude = null
            this.params.position.longitude = null
            throw new Error(false)
          })
        }
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
        // await this.getCouponList(false)
        await this.getAdvertCouponList(false)
        done && done()
      },
      async getCouponList(reset) {
        // reset参数，true则重置 couponList，否则是在原有基础上添加
        this.noData = false
        this.dataFinish = true
        let data = await couponService.searchCoupon(this.params, {showLoading: true}).catch(() => {
        })
        if (data.list.length === 0) {
          this.dataFinish = true
          this.couponList = []
          this.noData = true
          console.log('没有数据')
          return
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
          this.couponList = data.list
        } else {
          this.couponList = this.couponList.concat(data.list)
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">

  .mainWrap {
    background: #f4f4f4;
  }

  .top {
    height: 50px;
    background: #f5f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border-bottom: 1px solid #d9d9d9;

    .search {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      background: #ffffff;
      height: 32px;
      flex: 1;
      color: #9e9d9d;

      i {
        margin-left: 10px;
        font-size: 20px;
      }

      p {
        margin-left: 10px;
      }

    }
    .my-coupon {
      color: #3d3e3e;
      margin-left: 10px;
      height: 30px;
      text-align: center;
      margin-top: -6px;

      i {
        font-size: 26px;
      }

      p {
        margin-top: -4px;
        font-size: 12px;
      }

    }
  }

  .swipe-wrap {
    background: #ffffff;
    margin-bottom: 6px;
    height: 150px;
    padding: 10px 0 20px 0;

    .mint-swipe-indicators {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      position: static;
      transform: translateX(0);
      .mint-swipe-indicator {
        background: #cccccc;
        opacity: 1;
        width: 6px;
        height: 6px;
        &.is-active {
          background: #066cc2 !important;
        }

      }
    }
    .swipe-page {

      .swipe-item {
        width: 20%;
        display: inline-block;
        text-align: center;
        margin-bottom: 14px;

        img {
          width: 50%;
        }

        p {
          font-size: 12px;
          color: #343434;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

      }
    }
  }

  .coupon-list {
    margin-top: 6px;
  }
</style>
