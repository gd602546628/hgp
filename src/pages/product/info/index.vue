/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasFooter="true" @onScroll="onScroll" ref="page">
    <!--    <mt-header title="产品详情" slot="header"></mt-header>-->
    <div slot="main" v-if="product.prdId">
      <!--轮播-->
      <div>
        <slide-component :imgs="imgs"></slide-component>
      </div>
      <!--倒计时-->
      <count-down-component :product="product" :activityInfo="activityInfo" :isShow="isShowActivityInfo"
                            :selected="selected" :sysTime="sysTime"></count-down-component>

      <!--标题价格-->
      <div>
        <title-component :product="product" :showPrice="!isShowActivityInfo" :selected="selected"
                         :isActive="isActive"></title-component>
        <div class="split"></div>
      </div>
      <!--分割线-->
      <!--活动模块优惠展示模块-->
      <div>
        <activity-component :couponList="couponListFilter" :product="product" :doorInfo="doorInfo"
                            :selected="selected"
                            @openSelect="openSelect(-1)"
                            @getCoupon="openCouponList()">
        </activity-component>
      </div>


      <!--分割线-->
      <div class="split"></div>

      <p class="title-tip" ref="detail">商品详情</p>
      <div class="ueditor-container" v-html="product.prdDescription" v-ueditor></div>
      <!--进店逛逛-->
      <div class="split"></div>
      <div class="product-info-go-shop-box">
        <div class="product-info-go-shop-left-box">
          <img :src="doorInfo.logo | imgPrefix"/>
          <div class="product-info-shop-info">
            <span class="product-info-shop-name">{{doorInfo.name}}</span>
            <span>评分：{{doorInfo.star | startFn}}</span>
          </div>
        </div>
        <div class="product-info-go-shop" @click="goToDoor()">进店逛逛</div>
      </div>
      <!--分割线-->
      <div ref='comment'>
        <div class="split" v-if="commentList.length>0"></div>
        <comment-detail-list :commentListData="commentList" :doorId="doorId"
                             :prdId="prdId">
        </comment-detail-list>
      </div>
    </div>
    <!--页脚-->
    <div slot="footer" @touchmove.prevent>
      <!--
         collect ：加入收藏
         addCart：加入购物车
         buy：购买
         goToDoor：跳转到店铺
         -->
      <footer-component
        :disabledAddCart="!isOnline||prdInfoError"
        :disabledBuy="prdInfoError"
        :isCollected="isCollected"
        @collect="collect"
        @addCart="openSelect(0)"
        @buy="openSelect(1)"
        @goToDoor="goToDoor">
      </footer-component>
    </div>
    <!--弹框-->
    <div slot="other">
      <!--规格列表-->
      <select-specifications @submit="selectPrice" ref="specification" :product="product"
                             :priceCondition="doorInfo.priceCondition" :selected="selected" :btnType="btnType">
      </select-specifications>

      <coupon-list-component :couponList="couponListFilter" ref="couponList"
                             @receiveCoupon="receiveCoupon">
      </coupon-list-component>
      <header-component @scrollTop="scrollToTop()" @scrollDetail="scrollTolDetail()"
                        @scrollComment="scrollToComment()" :scrollPosition="scrollPosition"
                        :currentTop="currentTop"
                        :hasComment="commentList.length>0">
      </header-component>
      <!--右上角的按钮-->
      <right-top class="product-right-top-menu" :scrollTop="currentTop"></right-top>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'Vuex'
  import {Config, Codes} from '@/config/config'
  import ProductApi from '@/api/product/product.api'
  import DoorApi from '@/api/door/door.api'
  import CouponService from '@/service/coupon/coupon.service'
  import SelectSpecifications from '@/components/product/select-specifications.component'
  import UserApi from '@/api/user/user.api'
  import Slide from './_slide'
  import Title from './_title'
  import Activity from './_activity'
  import CouponListComponent from './_coupon-list'
  import FooterComponent from './_footer'
  import PhotoSwipeComponent from '@/components/photoSwipe/photoSwipe.component'
  import CommentDetailList from '@/components/comment/commentDetailList.component'
  import Header from './_header'
  import Animation from '@/service/common/animation/animation'
  import CountDownComponent from './_count-down.vue'
  import Utils from '@/service/common/utils/util.service'
  import TimeService from '@/service/time/time.service'
  import RightTop from '@/components/menu/right-top.component'
  import Toast from '@/service/toast/toast.service'
  export default {
    name: 'productInfo',
    data () {
      return {
        currentTop: 0,
        product: this.$route.params.product || {}, // 产品详情，有列表页传入，字段不全，得重新调用接口获取
        doorInfo: this.$route.params.doorInfo || {}, // 店铺详情，有列表页传入，或从接口获取
        couponList: this.$route.params.couponList || [],
        isCollected: false, // 用户是否收藏过改商品
        prdId: this.$route.params.prdId,
        doorId: this.$route.params.doorId,
        scrollPosition: 0, // 0 顶部，1:产品详情，2：评论
        aImg: [],
        discountPrice: null,
        price: null,
        commentList: [],
        imgUrl: Config.imgUrl, // 图片地址
        selected: { // 用户选择的规格
          firstPriceValue: '',
          secondPriceValue: '',
          num: 1,
          priceId: '',
          price: 0,
          specification: null
        },
        sysTime: '',
        btnType: -1,
        prdInfoError: false
      }
    },
    computed: {
      ...mapGetters(['hasAuth']),
      // 过滤在可用的优惠券
      couponListFilter(){
        return this.couponList.filter((item) => {
          /* let endTime = Utils.date(item.endTime)
           let startTime = Utils.date(item.startTime)
           let now = TimeService.sysTime()
           return endTime >= now && startTime <= now */
          return true
        })
      },
      isOnline(){
        return ProductApi.isOnline(this.product.prdType)
      },
      imgs(){
        if (this.product.prdImg) {
          return [].concat(this.product.prdImg)
        } else if (this.product.imgList) {
          return [].concat(this.product.imgList)
        } else {
          return []
        }
      },
      isShowActivityInfo(){
        if (this.activityInfo) {
          let flag = this.activityInfo.tempStock > 0 // 临时库存大于0
          if (this.activityInfo.type === 2) { // 秒杀
            flag = flag && this.activityInfo.seckillEndTime
          } else if (this.activityInfo.type === 0) {
            flag = flag && this.activityInfo.activityEndTime
          }
          flag = flag && ProductApi.disTimeout(this.activityInfo)
          return flag
        }
        return false
      },
      isEnd(){
        return TimeService.sysTime() > TimeService.date(this.activityInfo.activityEndTime).getTime()
      },
      activityInfo(){
        let selected = null
        if (this.selected.specification) {
          selected = this.selected.specification
        } else if (this.product && this.product.priceList && this.product.priceList.length) {
          selected = this.product.priceList[0]
        }
        if (selected && selected.activityInfo) {
          return selected.activityInfo
        }
        return {}
      },
      isActive(){
        if (this.selected && this.selected.specification) {
          return ProductApi.isActivity(this.selected.specification, TimeService.sysTime())
        }
        return false
      }
    },
    methods: {
      ...mapMutations(['setConfirmOrders', 'changeCartState', 'changeCollectPrd']),
      ...mapActions(['getUserToken']),
      init(){
        this.getProductInfo(this.doorId, this.prdId) // 获取商品详情
        this.getDoorInfo(this.doorId) // 获取店铺信息
        this.getCouponList(this.doorId) // 获取店铺的优惠券列表
        // 如果已经登录
        if (this.hasAuth) {
          this.judgePrdIsCollection()
        }
      },
      async getProductInfo(doorId, prdId){
        let data = await ProductApi.getProductInfo({
          doorId: doorId,
          prdId: prdId
        })
        if (data.code !== Codes.success) {
          Utils.alert(data.mesg)
          this.prdInfoError = true
        }
        if (data.data) {
          this.product = data.data
          this.commentList = data.data.prdCommentList
          this.sysTime = data.timestamp
          this.setDefaultSelected()
        }
      },
      async getDoorInfo(doorId){
        let doorInfo = await DoorApi.getDoorInfo(doorId)
        if (doorInfo) {
          this.doorInfo = doorInfo
        }
      },
      async getCouponList(doorId){
        let data = await CouponService.getCouponList(doorId, 1)
        if (data) {
          this.couponList = data
          this.getReceivedCoupon(this.couponList)
        }
      },
      async getReceivedCoupon(couponList){
        if (this.hasAuth) {
          await CouponService.getReceivedCoupon(couponList)
        }
      },
      openSelect(type){
        this.btnType = type
        this.$refs.specification.open().catch((e) => {
          console.info('用户取消规格选择', e)
        })
      },
      selectPrice(data){
        if (data && data.specification) {
          let specification = data.specification
          this.selected = {
            price: data.price,
            firstPriceValue: specification.firstPriceValue,
            secondPriceValue: specification.secondPriceValue,
            num: data.num,
            priceId: data.priceId,
            specification: specification
          }
          // 根据条件判断是加入购物车还是直接购买
          if (data.type === 0) { // 加入购物车
            this.addCart()
          } else if (data.type === 1) { // 直接购买
            this.buy()
          }
        }
      },
      openCouponList(){
        this.$refs.couponList.open()
      },
      async receiveCoupon(coupon){
        let data = await CouponService.receiveCoupon({
          couponId: coupon.couponId,
          type: 0
        })
        if (data.code === Codes.success) {
          this.couponList.forEach((item) => {
            if (coupon === item) {
              coupon.receive = true
            }
          })
          Toast.bottom('领取成功')
        }
      },
      scrollTolDetail(){
        let el = this.$refs.page.getMain() // 获取到滚动对象
        let top = this.$refs.detail.offsetTop - 44
        let style = {
          scrollTop: top
        }
        Animation.animation(el, style, 300, 'Expo.easeInOut')
        // this.$router.app.$el.querySelector('._scroll').scrollTop = top
      },
      scrollToComment(){
        let el = this.$refs.page.getMain() // 获取到滚动对象
        let top = this.$refs.comment.offsetTop - 44
        let style = {
          scrollTop: top
        }
        Animation.animation(el, style, 300, 'Expo.easeInOut')
      },
      scrollToTop(){
        let el = this.$refs.page.getMain() // 获取到滚动对象
        let style = {
          scrollTop: 0
        }
        Animation.animation(el, style, 300, 'Expo.easeInOut')
      },
      onScroll(top){
        this.currentTop = top
        let commentTop = 0
        if (this.commentList.length > 0) { // 产品有评论
          commentTop = this.$refs.comment.offsetTop
        }
        let detailTop = this.$refs.detail.offsetTop
        let clientHeight = document.body.clientHeight - 49
        this.scrollPosition = 0
        if (top > 200) {
          if (top > (detailTop - clientHeight)) { // 商品详情已经出现在视野里
            this.scrollPosition = 1
          }
          if (this.commentList.length && top > (commentTop - clientHeight)) { // 评论已经出现在视野里
            this.scrollPosition = 2
          }
        }
      },
      // 设置默认的规格
      setDefaultSelected(){
        let price = this.product.priceList[0]
        let activityList = []
        let activityStartList = []
        let priceList = this.product.priceList
        activityList = this.product.priceList.filter(item => {
          return item.activityInfo
        })
        activityStartList = activityList.filter(item => {
          return ProductApi.isActivity(item, TimeService.sysTime())
        })
        if (activityStartList.length > 0) {
          priceList = activityStartList
        } else if (activityList.length > 0) {
          priceList = activityList
        }
        let getPrice = (item) => {
          if (item.activityInfo) {
            return item.activityInfo.discountPrice
          }
          return item.discountPrice
        }
        price = priceList[0]
        priceList.forEach(item => {
          if (getPrice(price) > getPrice(item)) {
            price = item
          }
        })
        let data = { // 用户选择的规格
          firstPriceValue: price.firstPriceValue,
          secondPriceValue: price.secondPriceValue,
          num: 1,
          priceId: price.priceId,
          price: ProductApi.getPrice(price),
          specification: price
        }
        this.selected = data
      },
      /* 页脚操作按钮的事件 begin */
      async collect(){
        if (this.isCollected) {
          //  取消收藏
          let data = await ProductApi.getDelPrd({
            prdList: [{
              doorId: this.$route.params.doorId,
              prdId: this.$route.params.prdId
            }]
          })
          if (data.code === Codes.success) {
            this.isCollected = false
          }
        } else {
          //  收藏
          let data = await UserApi.collectPrd({
            doorId: this.doorId,
            prdId: this.prdId
          })
          if (data.code === Codes.code01 || data.code === Codes.success) {
            this.isCollected = true
          }
        }
        // 刷新收藏的产品列表
        this.changeCollectPrd()
      },
      goToDoor(){
        this.$router.push({
          name: 'indexDoor',
          params: {
            doorId: this.doorId,
            index: 0
          }
        })
      },
      buy(data){
        let orders = [{
          from: 'prdInfo',
          doorInfo: this.doorInfo,
          doorName: this.doorInfo.name,
          doorId: this.doorInfo.id,
          test: () => {
            this.from
          },
          couponList: [], // 传入 []
          userCouponId: null, // 优惠券id 传null
          prdList: [{ // 以下字段是参照购物车接口返回
            id: null, // 购物车id 从购物车到订单确认界面的时候，成功提交订单要删除相应的购物车
            prdName: this.product.prdName, // 产品名称
            prdType: this.product.prdType, // 0：线上，1：线下
            prdId: this.prdId,
            discountPrice: this.selected.price, // 价格
            num: this.selected.num, // 数量
            prdImg: this.selected.specification.priceImg || this.product.imgList[0], // 产品图片
            priceId: this.selected.priceId, // 规格id
            firstPriceName: this.product.firstPriceName,
            secondPriceName: this.product.secondPriceName,
            firstPriceValue: this.selected.firstPriceValue,
            secondPriceValue: this.selected.secondPriceValue
          }]
        }]
        this.setConfirmOrders(orders)
        this.$router.push({
          name: 'prdOrderConfirm'
        })
      },
      async addCart(){
        await UserApi.saveCart({
          doorId: this.doorId,
          prdId: this.prdId,
          num: this.selected.num,
          priceId: this.selected.priceId
        })
        // 告诉vux 购物车有变化
        this.changeCartState()
      },
      async judgePrdIsCollection(){
        let data = await UserApi.judgePrdIsCollection({
          prdId: this.prdId,
          doorId: this.doorId
        })
        if (data.code === Codes.code01) { // 000001 收藏过
          this.isCollected = true
        }
      }
      /* 页脚操作按钮的事件 end */
    },
    created(){
      this.init()
    },
    components: {
      'photoSwipe-component': PhotoSwipeComponent,
      'slide-component': Slide,
      'select-specifications': SelectSpecifications,
      'title-component': Title,
      'activity-component': Activity,
      'coupon-list-component': CouponListComponent,
      'footer-component': FooterComponent,
      'comment-detail-list': CommentDetailList, // 产品详情评论列表
      'header-component': Header,
      'count-down-component': CountDownComponent,
      'right-top': RightTop
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .split {
    margin: 10px 0px;
    height: 7px;
    background-color: map_get($ComColors, gray-ef);
  }

  .ueditor-container {
    padding: 10px;
    img {
      max-width: 100%;
    }
  }

  .product-info-go-shop-box {
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4% 2%;
    width: 100%;
    .product-info-go-shop-left-box {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 75%;
      img {
        height: 46px;
        width: 46px;
      }
      .product-info-shop-info {
        display: -webkit-flex;
        -webkit-justify-content: flex-start;
        -webkit-flex-direction: column;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        margin-left: 10px;
        width: 75%;
        .product-info-shop-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          font-size: 14px;
          display: block;
          word-break: break-all;
        }
      }
    }
    .product-info-go-shop {
      background-color: #066cc2;
      color: #fff;
      padding: 7px 7px;
      border-radius: 4px;
      box-shadow: 1px 0.9px 0px 0.7px #9e9e9e;
    }

  }

  .title-tip {
    font-size: 16px;
    padding-left: 5px;
    border-left: 5px solid map_get($ComColors, wathet-blue);
  }
</style>
