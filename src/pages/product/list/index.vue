/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasFooter="true"
            :enableInfinite="!dataFinish"
            :enableRefresh="false"
            :onInfinite="loadMore"
            :onRefresh="onRefresh"
            @onScroll="onScroll"
  >
    <div slot="main" v-show="show">
      <!--店铺信息-->
      <doorInfo-list
        :doorInfo="doorInfo"
        :isTopBackgroundImg="isTopBackgroundImg"
        :distance="distance"
        :isCollected="isCollected"
        @isCollected="val=>isCollected=val"
        :HighestOffer="HighestOffer"
        :doorActivityList="doorActivityList">
      </doorInfo-list>
      <!--活动轮播-->
      <div v-if="lunboData && lunboData.length>0" class="carouselBox">
        <div class="blackDIV"></div>
        <mt-swipe class="swipeBox" :auto="5000"
                  :showIndicators="lunboData.length === 1?false:true">
          <mt-swipe-item v-for="it,i in lunboData" :key="i">
            <img :src="it.img | imgPrefix"  @click="showActiveAlert(it)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <!--优惠券-->
      <coupon-list v-if="couponInfo&&couponInfo.length>0" :couponInfo="couponInfo" :couponStyle="couponStyle"></coupon-list>
      <!--产品列表-->
      <div v-if="prdList&&prdList.length>0" class="blackDIV2"></div>
      <prd-list :prdListDate="prdList"></prd-list>
      <!--

            <div v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="dataFinish"
                 infinite-scroll-distance="0"
                 infinite-scroll-immediate-check="true">
            </div>
      -->

    </div>

    <div slot="footer">
      <div class="tab-bar row">
        <div class="col active" @click="onRefresh()"><p class="icon icon-zyt-home"></p>
          <p class="title">店铺</p></div>
        <div class="col" @click="goToCollection()"><p class="icon icon-zyt-collect"></p>
          <p class="title">我的收藏</p></div>
        <div class="col" @click="goToCart()"><p class="icon icon-zyt-shopping-cart"></p>
          <p class="title">购物车</p></div>
        <div class="col" @click="goToMe()"><p class="icon icon-zyt-myself"></p>
          <p class="title">我的</p></div>
      </div>
    </div>

    <div slot="other">

      <right-top-container :currentTop="currentTop" @click.native="handleClick">
        <i class="icon-zyt-screen"></i>
      </right-top-container>
      <!--筛选-->
      <mt-popup class="popup" v-model="popupVisible" position="right">
        <zyt-screen
          @offScreen="offScreen"
          @refreshPrdList="refreshPrdList"
          :cateList="cateList">
        </zyt-screen>
      </mt-popup>
    </div>
  </zyt-page>
</template>
<script>
  import ProductApi from '@/api/product/product.api'
  import prdList from '@/components/product/productList.component'
  import {Popup} from 'mint-ui'
  import Util from '@/service/common/utils/util.service'
  import screen from './_screen'
  import couponlist from './_list-coupon'
  import doorInfolist from './_list-doorInfo'
  import locationService from '@/service/common/location/location'
  import preferred from '@/service/preferred/preferred.service'
  import couponService from '@/service/coupon/coupon.service'
  import {mapGetters} from 'vuex'
  import {allActiveJump} from '@/service/activity/activeJump.service'
  import RightTopContainer from '@/components/menu/right-top-container.component'
  import DistaceService from '../../../service/common/distance/distance'
  import TimeService from '@/service/time/time.service'
  export default {
    name: 'indexDoor',
    data () {
      return this.initData()
    },
    computed: {
      ...mapGetters(['userInfo', 'hasAuth'])
    },
    mounted(){
      this.init()
    },
    /*    watch: {
     '$route': function () {
     if (this.$route.name === 'indexDoor' && this.$route.params.index === '0' || this.$route.params.index === 0) {
     if (('' + this.doorId) !== ('' + this.$route.params.doorId)) {
     this.onRefresh()
     }
     }
     }
     }, */
    methods: {
      test(){
        alert(1)
      },
      initData(){
        return {
          show: false,
          onInfinite: null,
          currentTop: 0,
          allLoaded: false,
          routeParams: {},
          prdList: [], // 产品列表
          doorId: this.$route.params.doorId,
          lunboData: [],
          popupVisible: false,
          doorInfo: null, // 店铺详情
          infoTitle: '',
          isTopBackgroundImg: false,
          prdParams: {
            pageNum: 1,
            pageSize: 20,
            doorId: this.$route.params.doorId
          },
          dataFinish: false,
          pageFlag: false,
          distance: -1, // 距离
          isCollected: false, // true: 已收藏，false:没有收藏
          HighestOffer: null, // 最高优惠
          doorActivityList: [], // 店铺活动信息
          cateList: [], // 商品分类
          couponInfo: [], // 优惠卷
          couponStyle: 0
        }
      },
      async onRefresh(done){
        Object.assign(this.$data, this.initData())
        await this.init()
        done && done()
      },
      /***********************************/
      /***********************************/
      /***********************************/
      async init(){
        if (this.hasAuth) {
          this.getDoorList()
        }
        await Promise.all([
          this.getDoorInfo(),
          this.getHighestDiscount(),
          this.getListByDoorId(),
          this.getCouponList(),
          this.getProductList(true, this.prdParams),
          this.getScreenList()
        ])
        this.getLocation()
      },
      async getDoorInfo(){ // 获取店铺信息
        let data = await ProductApi.getDoorInfo({
          doorId: this.doorId
        }).catch(() => {
          throw new Error('获取店铺信息失败')
        })
        if (data) {
          this.doorInfo = data
          Util.setTitle(this.doorInfo.name)
          this.infoTitle = data.name.toString()
          if (data.topImg && data.topImg !== null && data.topImg !== '') {
            this.isTopBackgroundImg = false
          } else {
            this.isTopBackgroundImg = true
          }
        }
        return true
      },
      async getDoorList(){ // 获取用户所有的店铺收藏信息
        let data = await ProductApi.getDoorList({
          doorId: this.doorId,
          notRedirect: true,
          pageNum: 1,
          pageSize: 20,
          userId: this.userInfo.userId
        }).catch(() => {
          throw new Error('获取用户所有的店铺收藏信息失败')
        })
        if (data && data.data && data.data.doorList) {
          data.data.doorList.forEach(item => {
            if (parseInt(item.doorId) === parseInt(this.doorId)) {
              this.isCollected = true
            }
          })
        } else {
          console.log('没有返回店铺收藏信息')
        }
        return true
      },
      async getLocation(){ // 获取定位
        let position = await locationService.getLocation().catch(() => {
          throw new Error('定位失败')
        })
        if (!position) {
          return
        }
        // this.address.address = position.province + position.city + position.country + position.street

        // 获取两地之间的距离
        if (position.latitude && position.longitude) {
          let distance = DistaceService.distanceFn(position.latitude, this.doorInfo.lattitude, position.longitude, this.doorInfo.longitude)
          if (distance >= 1) {
            this.distance = distance.toFixed(1) + 'km'
          } else if (distance < 1 && distance > 0) {
            this.distance = (distance * 1000).toFixed(0) + 'm'
          } else {
            this.distance = -1
          }
        }
        return true
      },
      async getHighestDiscount(){ // 获取最高优惠
        let data = await preferred.getHighestDiscount([this.doorId]).catch(() => {
          throw new Error('获取最高优惠失败')
        })
        if (data && data.data && data.data.length > 0) {
          this.HighestOffer = data.data[0]
          if (data.data[0].doorActivityList) {
            this.doorActivityList = this.doorActivityList.concat(data.data[0].doorActivityList)
          } else {
            this.doorActivityList = []
          }
        } else {
          console.log('没有返回获取最高优惠')
        }
      },
      async getProductList(reset, params){ // 获取产品信息 reset是否重置列表true重置，false添加
        let data = await ProductApi.getProductList(params)
        this.show = true
        if (!data) {
          return
        }
        if (params.pageNum >= data.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.prdList = data.prdList
        } else {
          this.prdList = this.prdList.concat(data.prdList)
        }
      },
      async getListByDoorId(){ // 发布到店铺的活动列表
        let data = await ProductApi.getListByDoorId({doorId: this.doorId})
        if (data && data.data) {
          for (let i = 0; i < data.data.length; i++) {
            let jsonData = Object.assign({}, data.data[i], {
              'img': data.data[i].image,
              'category': 5,
              'isShow': true
            })
            this.lunboData.push(jsonData)
          }
        }
        let data2 = await ProductApi.getDrawActivityList(
          {pageNum: 1, pageSize: 20, siteId: this.doorId})
        if (data2 && data2.data.drawSalesBaseList) {
          for (let i = 0; i < data2.data.drawSalesBaseList.length; i++) {
            let jsonData = Object.assign({}, data2.data.drawSalesBaseList[i], {
              'img': data2.data.drawSalesBaseList[i].titleImg,
              'category': 3,
              'isShow': true
            })
            this.lunboData.push(jsonData)
          }
        }
      },
      async getCouponList(){ // 获取店铺优惠劵列表
        let data = await couponService.getCouponList(this.doorId)
        if (data) {
          for (let i = 0; i < data.length; i++) {
            this.couponInfo.push(data[i])
            if (this.couponInfo[i].category === 0) {
              this.couponInfo[i]['showName'] = '满' + this.couponInfo[i].money + '使用'
            } else {
              this.couponInfo[i]['showName'] = '无门槛使用'
            }
          }
          switch (this.couponInfo.length) {
            case 8:
              this.couponStyle = 835
              break
            case 7:
              this.couponStyle = 730
              break
            case 6:
              this.couponStyle = 625
              break
            case 5:
              this.couponStyle = 525
              break
            case 4:
              this.couponStyle = 420
              break
          }
        } else {
          console.log('没有返回店铺优惠劵列表')
        }
      },
      async getScreenList(){
        let cate = await ProductApi.getDoorSelectCategory({siteId: this.doorId}).catch(() => {
          throw new Error('获取店铺筛选分类失败')
        })
        this.cateList = cate
      },
      extend(destination, source) {
        for (var property in source) {
          destination[property] = source[property]
        }
        return destination
      },
      refreshPrdList(data){ // 点击筛选按钮执行的操作
        this.prdParams.pageNum = 1
        var result = this.extend(this.prdParams, data)
        this.getProductList(true, result)
      },
      async loadMore(done){ // 加载跟多产品
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.prdParams.pageNum++
        await this.getProductList(false, this.prdParams)
        done && done()
      },
      handleClick() {
        this.popupVisible = true
      },
      offScreen(){
        this.popupVisible = false
      },
      productClick(product){
        this.$router.push({
          name: 'productInfo',
          params: {
            product: product,
            doorId: this.doorId,
            prdId: product.prdId
          }
        })
      },
      showActiveAlert (item) { // 轮播跳转
        console.info(item)
        let startTime = ''
        let endTime = ''
        let nowTime
        let showConfirm = (year, month, day, hours) => {
          this.showConfirm('感谢您对本次活动的支持，本次活动将于' + year + '年' + month + '月' + day + '日' + hours + '时开始，详情查看活动说明！', '活动说明', '我知道了', item)
        }
        let endConfirm = () => {
          Util.confirm('活动已结束！', '', {
            confirmButtonText: '关闭',
            showCancelButton: false
          })
        }
        nowTime = TimeService.sysTime()
        if (item.startTime && item.startTime !== null) {
          startTime = new Date(item.startTime.replace(/-/g, '/')).getTime()
        }
        if (item.endTime && item.endTime !== null) {
          endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
        }
        if (item.isTime === 1) {
          allActiveJump(item)
        } else if (item.isTime === 0) {
          if (nowTime > startTime && nowTime < endTime) {
            allActiveJump(item)
          } else if (nowTime < startTime) {
            showConfirm(new Date(startTime).getFullYear(), new Date(startTime).getMonth() + 1, new Date(startTime).getDate(), new Date(startTime).getHours())
          } else {
            endConfirm()
          }
        }
      },
      showConfirm(message, ok, cancel, params){
        Util.confirm({
          message: message,
          confirmButtonText: ok,
          cancelButtonText: cancel,
          showCancelButton: true
        }).then(() => {
          this.goActInfo(params)
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
      onScroll(top){
        this.currentTop = top
      },
      goToCollection(){
        this.$router.push({
          name: 'collection',
          params: {
            type: 0
          }
        })
      },
      goToCart(){
        this.$router.push({
          name: 'cart'
        })
      },
      goToMe(){
        this.$router.push({
          name: 'me'
        })
      }
    },
    components: {
      'prd-list': prdList,
      'mt-popup': Popup,
      'zyt-screen': screen,
      'coupon-list': couponlist,
      'doorInfo-list': doorInfolist,
      'right-top-container': RightTopContainer
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .blackDIV {
    background: #efefef;
    height: 6px;
  }
  .blackDIV2 {
    background: #efefef;
    height: 4px;
  }

  .index-title {
    border-bottom-width: 1px !important;
    background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
    border-bottom: 1px solid #b2b2b2;
    border-top: 1px solid #b2b2b2;
    color: #2d2d2d;
  }

  .popup {
    width: 85%;
    height: 100%;
  }

  .carouselBox {
    height: 120px;
    .swipeBox {
      div.mint-swipe-indicators {
        left: 89%;
        display: flex;
        div.is-active {
          background: #fff;
          opacity: 1;
        }
        div.mint-swipe-indicator {
          background: transparent;
          border-radius: 50%;
          border: 1px solid #fff;
        }
      }
    }
    div.mint-swipe {
      text-align: center;
      div.mint-swipe-items-wrap {
        div.mint-swipe-item {
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      div.mint-swipe-indicators {
        left: 89%;
        display: flex;
        div.mint-swipe-indicator {
          background: transparent;
          border-radius: 50%;
          border: 1px solid #fff;
        }
        div.is-active {
          background: #fff;
          opacity: 1;
        }
      }
    }
  }

  .product-table {
    .row {
      padding-top: 5px;
      padding-left: 5px;
      .col {
        padding-right: 5px;
        padding-bottom: 10px;
        img {
          width: 100%;
        }
      }
    }
  }

  .icon-zyt-screen {
    margin-top: 4px;
    font-size: 20px;
    color: white;
    display: block;
  }

  .tab-bar {
    z-index: 9;
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 49px;
    background: white;
    border: 1px solid map_get($ComBorderColor, dd);
    .col {
      border-bottom: 2px solid transparent;
      height: 100%;
      border-right: 1px solid map_get($ComBorderColor, dd);
      // border-right: .55px solid map_get($ComBorderColor, dd);
      text-align: center;
      .icon {
        padding-top: 3px;
        font-size: 28px;
      }
      .title {
        font-size: 12px;
      }
      &:last-child {
        border-right: 0px
      }
      &.active {
        color: map_get($ComColors, wathet-blue);
        border-bottom: 2px solid map_get($ComColors, wathet-blue);
      }
    }
  }
</style>
