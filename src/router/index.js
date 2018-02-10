import Vue from 'vue'
import Router from 'vue-router'
import RedirectRout from './redirect'

const Demo = r => require.ensure([], () => r(require('@/pages/demo/demo.page')), 'demo')
const Index = r => require.ensure([], () => r(require('@/pages/index/index.page')), 'index')

const Login = r => require.ensure([], () => r(require('@/pages/login/login')), 'group-login')
const Register = r => require.ensure([], () => r(require('@/pages/login/register')), 'group-login')
const ChangePassword = r => require.ensure([], () => r(require('@/pages/login/password')), 'group-login')

const AddressList = r => require.ensure([], () => r(require('@/pages/user/address/list')), 'group-addressList')
const addAddress = r => require.ensure([], () => r(require('@/pages/user/address/add')), 'group-addressList')

const myYinYuan = r => require.ensure([], () => r(require('@/pages/me/myYinYuan.page')), 'myYinYuan')

const PayResult = r => require.ensure([], () => r(require('@/pages/order/payResult')), 'PayResult')

const commentList = r => require.ensure([], () => r(require('@/pages/comment/commentList.page')), 'group-comment')
const addComment = r => require.ensure([], () => r(require('@/pages/comment/addComment.page')), 'group-comment')
const appendComment = r => require.ensure([], () => r(require('@/pages/comment/appendComment.page')), 'group-comment')
const modifyComment = r => require.ensure([], () => r(require('@/pages/comment/modifyComment.page')), 'group-comment')
const replayComment = r => require.ensure([], () => r(require('@/pages/comment/replayComment.page')), 'group-comment')

const oneIndiana = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndiana.page')), 'group-oneIndiana')
const oneIndianaDetails = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndianaDetails.page')), 'group-oneIndiana')
const oneIndianaAnnounce = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndianaAnnounce.page')), 'group-oneIndiana')
const oneIndianaRobRecord = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndianaRobRecord.page')), 'group-oneIndiana')
const oneIndianaGrabRecord = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndianaGrabRecord.page')), 'group-oneIndiana')
const oneIndianaCountRule = r => require.ensure([], () => r(require('@/pages/oneIndiana/oneIndianaCountRule.page')), 'group-oneIndiana')
const myPrize = r => require.ensure([], () => r(require('@/pages/drawActivity/myPrize.page')), 'group-all')

const AccountInfo = r => require.ensure([], () => r(require('@/pages/user/accountInfo')), 'group-user')
const myServiceList = r => require.ensure([], () => r(require('@/pages/goodService/myServiceList.page')), 'group-user')
const myServiceDetail = r => require.ensure([], () => r(require('@/pages/goodService/myServiceDetail.page')), 'group-user')
const onlineMyOrder = r => require.ensure([], () => r(require('@/pages/user/myOrder/onlineMyOrder.page')), 'group-user')
const offlineMyOrder = r => require.ensure([], () => r(require('@/pages/user/myOrder/offlineMyOrder.page')), 'group-user')
const myOrderDetail = r => require.ensure([], () => r(require('@/pages/user/myOrder/myOrderDetail.page')), 'group-user')
const me = r => require.ensure([], () => r(require('@/pages/user/index')), 'group-user')
const cart = r => require.ensure([], () => r(require('@/pages/cart/cart.page')), 'group-user')
const collection = r => require.ensure([], () => r(require('@/pages/collection/collection.page')), 'group-user')

const myCoupon = r => require.ensure([], () => r(require('@/pages/CouponCenter/myCoupon.page')), 'group-all')

const CouponCenter = r => require.ensure([], () => r(require('@/pages/CouponCenter/CouponCenter.page')), 'group-all')
const ServantMain = r => require.ensure([], () => r(require('@/pages/servantMain/servantMain.page')), 'group-all')
const seckill = r => require.ensure([], () => r(require('@/pages/seckill/seckill.page')), 'group-all')
const goodLife = r => require.ensure([], () => r(require('@/pages/goodLife/goodLife.page')), 'group-all')
const goodLifeCategory = r => require.ensure([], () => r(require('@/pages/goodLife/goodLifeCategory.page')), 'group-all')
const AllActivitie = r => require.ensure([], () => r(require('@/pages/activity/allActivitie.page')), 'group-all')
const AllServiceclassify = r => require.ensure([], () => r(require('@/pages/goodService/allServiceclassify.page')), 'group-all')
const SecondaryService = r => require.ensure([], () => r(require('@/pages/goodService/secondaryService.page')), 'group-all')
const ServiceCategoryList = r => require.ensure([], () => r(require('@/pages/goodService/serviceCategoryList.page')), 'group-all')
const goodLifeCategoryList = r => require.ensure([], () => r(require('@/pages/goodLife/categoryList.page')), 'group-all')
const goodLifeCategoryDetail = r => require.ensure([], () => r(require('@/pages/goodLife/categoryDetail.page')), 'group-all')
const couponSearch = r => require.ensure([], () => r(require('@/pages/searchResult/couponSearch.page')), 'group-all')
const goodLifeSearch = r => require.ensure([], () => r(require('@/pages/searchResult/goodLifeSearch.page')), 'group-all')
const orderList = r => require.ensure([], () => r(require('@/pages/orderList/orderList.page')), 'group-all')
const ServiceDetail = r => require.ensure([], () => r(require('@/pages/goodService/serviceDetail.page')), 'group-all')
const ServersNoDetail = r => require.ensure([], () => r(require('@/pages/goodService/serversNoDetail.page')), 'group-all')
const ServersOrderInfo = r => require.ensure([], () => r(require('@/pages/goodService/serversOrderInfo.page')), 'group-all')
const ServersPay = r => require.ensure([], () => r(require('@/pages/goodService/serversPay.page.vue')), 'group-all')
const CouponCenterDetail = r => require.ensure([], () => r(require('@/pages/CouponCenter/couponCenterDetail.page')), 'group-all')
const selectedGoods = r => require.ensure([], () => r(require('@/pages/selectedGoods/selectedGoods.page')), 'group-all')
const selectedGoodsOnline = r => require.ensure([], () => r(require('@/pages/selectedGoods/selectedGoods-online.page.vue')), 'group-all')
const ActivityExplain = r => require.ensure([], () => r(require('@/pages/activity/activityExplain.page')), 'group-all')
const DiscountActivity = r => require.ensure([], () => r(require('@/pages/activity/discountActivity.page')), 'group-all')
const CouponActivity = r => require.ensure([], () => r(require('@/pages/activity/couponActivity.page')), 'group-all')
const ShopActivity = r => require.ensure([], () => r(require('@/pages/activity/shopActivity.page')), 'group-all')
const newMyCoupon = r => require.ensure([], () => r(require('@/pages/newCoupon/myCoupon.page')), 'group-all')
const newCoupon = r => require.ensure([], () => r(require('@/pages/newCoupon/newCoupon.page')), 'group-all')
const ServiceSearch = r => require.ensure([], () => r(require('@/pages/searchResult/serviceSearch.page')), 'group-all')
const ServantMainSearch = r => require.ensure([], () => r(require('@/pages/searchResult/servantMainSearch.page')), 'group-all')
const newSearchCoupon = r => require.ensure([], () => r(require('@/pages/newCoupon/newSearchCoupon.page')), 'group-all')
const SelectedGoodSearch = r => require.ensure([], () => r(require('@/pages/searchResult/selectedGoodSearch.page')), 'group-all')
const SelectedGoodSearchOnline = r => require.ensure([], () => r(require('@/pages/searchResult/selectedGoodSearch-online.page.vue')), 'group-all')
const commonSearch = r => require.ensure([], () => r(require('@/pages/commonSearch/commonSearch.page')), 'group-all')
const wxCouponDetail = r => require.ensure([], () => r(require('@/pages/newCoupon/couponDetail.page')), 'group-all')
const wxCouponDesc = r => require.ensure([], () => r(require('@/pages/newCoupon/couponDesc.page')), 'group-all')
const doorDetail = r => require.ensure([], () => r(require('@/pages/door/doorDetail.page')), 'group-all')
const consumeDetail = r => require.ensure([], () => r(require('@/pages/user/myOrder/consumeDetail.page')), 'group-all')
const consumeList = r => require.ensure([], () => r(require('@/pages/user/myOrder/consumeList.page')), 'group-all')
const prizeDetail = r => require.ensure([], () => r(require('@/pages/drawActivity/prizeDetail.page')), 'group-all')
const drawActivity = r => require.ensure([], () => r(require('@/pages/drawActivity/drawIndex.page')), 'group-all')
const prizeLogistics = r => require.ensure([], () => r(require('@/pages/drawActivity/prizeLogistics.page')), 'group-all')
const drawPrizeInfo = r => require.ensure([], () => r(require('@/pages/drawActivity/drawPrizeInfo.page')), 'group-all')
const couponShare = r => require.ensure([], () => r(require('@/pages/newCoupon/couponShare.page')), 'group-all')
const noDataOpenCity = r => require.ensure([], () => r(require('@/pages/noDataOpenCity/noDataOpenCity.page')), 'group-all')

const IndexDoor = r => require.ensure([], () => r(require('@/pages/product/list')), 'group-all')
const ProductInfo = r => require.ensure([], () => r(require('@/pages/product/info')), 'group-all')
const selectCoupon = r => require.ensure([], () => r(require('@/pages/order/confirm/select-coupon.page')), 'group-all')
const PrdOrderConfirm = r => require.ensure([], () => r(require('@/pages/order/confirm')), 'group-all')
const PrdOrderPay = r => require.ensure([], () => r(require('@/pages/order/prdOrderPay')), 'group-all')

const couponActivityDetail = r => require.ensure([], () => r(require('@/pages/activity/couponActivityDetail.page')), 'group-all') // 活动优惠券详情
const complimentaryCoupons = r => require.ensure([], () => r(require('@/pages/newCoupon/complimentaryCoupons.page')), 'group-all') // 赠送优惠券
const votePage = r => require.ensure([], () => r(require('@/pages/vote/vote.page')), 'group-all') // 活动优惠券详情
const voteTranslate = r => require.ensure([], () => r(require('@/pages/vote/translate.page')), 'group-all') // 活动优惠券详情
Vue.use(Router)

let pushOrigin = Router.prototype.push
Router.prototype.pushOrigin = pushOrigin
Router.prototype.push = function () {
  // 打开一个新的 webview
  if (arguments[0]) {
    if (typeof arguments[0] === 'object') {
      if (arguments[0]['query']) {
        arguments[0]['query']['_time'] = arguments[0]['query']['_time'] || new Date().getTime()
      } else {
        arguments[0]['query'] = {
          _time: new Date().getTime()
        }
      }
    }
  }
  route.isPush = true
  pushOrigin.call(this, ...arguments)
}
let replaceOrigin = Router.prototype.replace
Router.prototype.replaceOrigin = replaceOrigin
Router.prototype.replace = function () {
  if (arguments[0]) {
    if (typeof arguments[0] === 'object') {
      if (arguments[0]['query']) {
        arguments[0]['query']['_time'] = arguments[0]['query']['_time'] || new Date().getTime()
      } else {
        arguments[0]['query'] = {
          _time: new Date().getTime()
        }
      }
    }
  }
  route.isPush = true
  replaceOrigin.call(this, ...arguments)
}
let route = new Router({
  saveScrollPosition: true,
  routes: [
    ...RedirectRout,
    {
      path: '',
      redirect: '/newCoupon'
    },
    {
      path: '/index/:index',
      name: 'index',
      component: Index
    },
    {
      path: '/indexDoor/:doorId',
      name: 'indexDoor',
      component: IndexDoor,
      meta: {
        title: '店铺'
      }
    },
    {
      path: '/accountInfo',
      name: 'accountInfo',
      component: AccountInfo,
      meta: {
        title: '我的信息',
        requireAuth: true
      }
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: AddressList,
      meta: {
        title: '收货地址列表',
        requireAuth: true
      }
    },
    {
      path: '/addAddress/:addressId',
      name: 'addAddress',
      component: addAddress,
      meta: {
        title: '收货地址列表',
        requireAuth: true
      }
    },
    {
      /* 订单列表 */
      path: '/orderList',
      name: '/orderList',
      component: orderList,
      meta: {
        title: '订单列表'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    },
    { // 领券中心
      path: '/couponCenter',
      name: 'couponCenter',
      component: CouponCenter,
      meta: {
        title: '领券中心'
      }
    },
    { // 秒杀页
      path: '/seckill/:activeId',
      name: 'seckill',
      component: seckill,
      meta: {
        title: '活动'
      }
    },
    { // 便民首页
      path: '/servantMain',
      name: 'servantMain',
      component: ServantMain,
      meta: {
        title: '生活'
      }
    },
    { // 好生活，吃喝玩乐页
      path: '/goodLife',
      name: 'goodLife',
      component: goodLife,
      meta: {
        title: '吃喝玩乐'
      }
    },
    { // 好生活分类页 level 一级分类1 ，二级分类2 ，id对应分类ID
      path: '/goodLifeCategory/:level/:id',
      name: 'goodLifeCategory',
      component: goodLifeCategory,
      meta: {
        title: '吃喝玩乐'
      }
    },
    { // 全部活动页面
      path: '/allActivitie',
      name: 'allActivitie',
      component: AllActivitie,
      meta: {
        title: '活动'
      }
    },
    {// 登录界面
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        wxShareDefaultUrl: true
      }
    },
    {// 修改密码
      path: '/login/changePassword',
      name: 'changePassword',
      component: ChangePassword,
      meta: {
        title: '修改密码',
        wxShareDefaultUrl: true
      }
    },
    {// 注册界面
      path: '/login/register',
      name: 'register',
      component: Register,
      meta: {
        title: '注册',
        wxShareDefaultUrl: true
      }
    },
    { // 好服务页面
      path: '/allServiceclassify',
      name: 'allServiceclassify',
      component: AllServiceclassify,
      meta: {
        title: '分类服务'
      }
    },
    { // 好服务二级页面
      path: '/secondaryService/:levelId',
      name: 'secondaryService',
      component: SecondaryService,
      meta: {
        title: '分类服务'
      }
    },
    { // 好服务列表页面
      path: '/serviceCategoryList/:levelType/:id',
      name: 'serviceCategoryList',
      component: ServiceCategoryList,
      meta: {
        title: '分类服务'
      }
    },
    { // 好生活分类列表
      path: '/goodLifeCategoryList',
      name: 'goodLifeCategoryList',
      component: goodLifeCategoryList,
      meta: {
        title: '吃喝玩乐'
      }
    },
    { // 好生活分类详情
      path: '/goodLifeCategoryDetail/:id',
      name: 'goodLifeCategoryDetail',
      component: goodLifeCategoryDetail,
      meta: {
        title: '吃喝玩乐'
      }
    },
    { // 优惠券搜索
      path: '/couponSearch/:keyword?',
      name: 'couponSearch',
      component: couponSearch,
      meta: {
        /* title: '优惠券' */
        title: '搜索'
      }
    },
    { // 好生活搜索  num:1 搜索全部类型,0 单一类型
      path: '/goodLifeSearch/:num/:keyword?',
      name: 'goodLifeSearch',
      component: goodLifeSearch,
      meta: {
        /* title: '吃喝玩乐' */
        title: '搜索'
      }
    },
    { // 好服务详情页面
      path: '/serviceDetail/:id',
      name: 'serviceDetail',
      component: ServiceDetail,
      meta: {
        noSetShare: true,
        title: '本地服务'
      }
    },
    { // 好服务详情已删除页面
      path: '/serversNoDetail',
      name: 'serversNoDetail',
      component: ServersNoDetail,
      meta: {
        title: '分类服务'
      }
    },
    { // 好服务在线预约页面
      path: '/ServersOrderInfo/:id',
      name: 'ServersOrderInfo',
      component: ServersOrderInfo,
      meta: {
        title: '预约',
        requireAuth: true
      }
    },
    {
      path: '/serversPay/:id',
      name: 'serversPay',
      component: ServersPay,
      meta: {
        title: '支付',
        requireAuth: true
      }
    },
    { // 优惠券详情
      path: '/couponCenterDetail/:couponId/:userCouponId/:type',
      name: 'couponCenterDetail',
      component: CouponCenterDetail,
      meta: {
        title: '优惠券'
      }
    },
    { // 产品详情页
      path: '/productInfo/:doorId/:prdId',
      name: 'productInfo',
      component: ProductInfo,
      meta: {
        title: '商品详情'
      }
    },
    { // 附近商超
      path: '/selectedGoods',
      name: 'selectedGoods',
      component: selectedGoods,
      meta: {
        title: '附近商超'
      }
    },
    { // 精选商品
      path: '/selectedGoodsOnline',
      name: 'selectedGoodsOnline',
      component: selectedGoodsOnline,
      meta: {
        title: '商城'
      }
    },
    { // 活动说明
      path: '/activityExplain/:activityId',
      name: 'activityExplain',
      component: ActivityExplain,
      meta: {
        title: '活动说明'
      }
    },
    { // 活动-折扣
      path: '/discountActivity/:activityId',
      name: 'discountActivity',
      component: DiscountActivity,
      meta: {
        title: '活动'
      }
    },
    { // 活动-优惠券
      path: '/couponActivity/:activityId',
      name: 'couponActivity',
      component: CouponActivity,
      meta: {
        title: '活动'
      }
    },
    { // 活动-店铺
      path: '/shopActivity/:activityId',
      name: 'shopActivity',
      component: ShopActivity,
      meta: {
        title: '活动'
      }
    },
    { // 微信-我的券
      path: '/newMyCoupon',
      name: 'newMyCoupon',
      component: newMyCoupon,
      meta: {
        title: '我的优惠券',
        requireAuth: true
      }
    },
    { // 微信-优惠券首页
      path: '/newCoupon',
      name: 'newCoupon',
      component: newCoupon,
      meta: {
        title: '全城聚惠',
        wxShareDefaultUrl: true
      }
    },
    { // 微信-优惠券搜索
      path: '/newSearchCoupon/:fcName?/:keyword?',
      name: 'newSearchCoupon',
      component: newSearchCoupon,
      meta: {
        /* title: '全城聚惠' */
        title: '搜索'
      }
    },
    { // 好服务搜索
      path: '/serviceSearch/:keyword?',
      name: 'serviceSearch',
      component: ServiceSearch,
      meta: {
        /* title: '分类服务' */
        title: '搜索'
      }
    },
    { // 便民主页搜索
      path: '/servantMainSearch/:showSearch?/:keyword?',
      name: 'servantMainSearch',
      component: ServantMainSearch,
      meta: {
        /* title: '生活' */
        title: '搜索'
      }
    },
    { // 搜索页0:主页搜索  1:优惠券，2商品，3服务，4店铺,5微信优惠券搜索
      path: '/commonSearch/:type',
      name: 'commonSearch',
      component: commonSearch,
      meta: {
        title: '搜索'
      }
    },
    { // 精选商品搜索 num:1 搜索全部类型,0 单一类型
      path: '/selectedGoodSearch/:num/:keyword?',
      name: 'selectedGoodSearch',
      component: SelectedGoodSearch,
      meta: {
        /* title: '精选商品' */
        title: '搜索'
      }
    },
    { // 精选商品搜索 num:1 搜索全部类型,0 单一类型
      path: '/selectedGoodSearchOnline/:num/:keyword?',
      name: 'selectedGoodSearchOnline',
      component: SelectedGoodSearchOnline,
      meta: {
        /* title: '精选商品' */
        title: '搜索'
      }
    },
    { // 微信-优惠券详情
      path: '/wxCouponDetail/:couponId/:userCouponId',
      name: 'wxCouponCenterDetail',
      component: wxCouponDetail,
      meta: {
        title: '优惠券详情',
        requireAuth: true,
        wxShareDefaultUrl: true
      }
    },
    { // 优惠券分享
      path: '/couponShare/:couponId/:couponCode/:type',
      name: 'couponShare',
      component: couponShare,
      meta: {
        title: '全城聚惠'
      }
    },
    {
      path: '/wxCouponDesc/:couponId/:userCouponId/:num', // num:0我的优惠券信息，1其他优惠券信息
      name: 'wxCouponCenterDesc',
      component: wxCouponDesc,
      meta: {
        title: '优惠券详情',
        wxShareDefaultUrl: true
      }
    },
    {
      path: '/prdOrderConfirm',
      name: 'prdOrderConfirm',
      component: PrdOrderConfirm,
      meta: {
        title: '订单确认',
        requireAuth: true
      }
    },
    {
      path: '/prdOrderPay/:orderId',
      name: 'prdOrderPay',
      component: PrdOrderPay,
      meta: {
        title: '确认支付'
      }
    },
    {
      path: '/payResult/:params',
      name: 'payResult',
      component: PayResult,
      meta: {
        title: '支付成功',
        requireAuth: true
      }
    },
    { // 我的赢元
      path: '/myYinYuan',
      name: 'myYinYuan',
      component: myYinYuan,
      meta: {
        title: '我的赢元',
        requireAuth: true
      }
    },
    { // 店铺详情
      path: '/doorDetail/:doorId',
      name: 'doorDetail',
      component: doorDetail,
      meta: {
        title: '店铺详情'
      }
    },
    { // 我的服务列表
      path: '/myService',
      name: 'myService',
      component: myServiceList,
      meta: {
        title: '我的预约',
        requireAuth: true
      }
    },
    { // 我的服务详情
      path: '/myServiceDetail/:id',
      name: 'myServiceDetail',
      component: myServiceDetail,
      meta: {
        title: '我的服务',
        requireAuth: true
      }
    },
    { // 我的在线订单
      path: '/onlineMyOrder/:status',
      name: 'onlineMyOrder',
      component: onlineMyOrder,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    { // 我的线下订单
      path: '/offlineMyOrder/:status',
      name: 'offlineMyOrder',
      component: offlineMyOrder,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    { // 我的订单详情
      path: '/myOrderDetail/:id',
      name: 'myOrderDetail',
      component: myOrderDetail,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    { // 我的优惠券
      path: '/myCoupon/:index',
      name: 'myCoupon',
      component: myCoupon,
      meta: {
        title: '优惠券',
        requireAuth: true
      }
    },
    { // 全部评价列表
      path: '/commentList/:doorId/:prdId',
      name: 'commentList',
      component: commentList,
      meta: {
        title: '全部评价'
      }
    },
    { // 发布评价
      path: '/addComment/:doorId/:orderPrdId/:orderId/:priceId',
      name: 'addComment',
      component: addComment,
      meta: {
        title: '评价'
      }
    },
    { // 追加评价
      path: '/ appendComment/:orderId/:orderPrdId/:priceId',
      name: 'appendComment',
      component: appendComment,
      meta: {
        title: '评价'
      }
    },
    { // 修改评价
      path: '/ modifyComment/:doorId/:orderPrdId/:orderId/:priceId',
      name: 'modifyComment',
      component: modifyComment,
      meta: {
        title: '评价'
      }
    },
    { // 回复评价
      path: '/replayComment/:doorId/:commentId',
      name: 'replayComment',
      component: replayComment,
      meta: {
        title: '评价'
      }
    },
    { // 消费券详情
      path: '/consumeDetail/:doorId/:orderId',
      name: 'consumeDetail',
      component: consumeDetail,
      meta: {
        title: '消费券',
        requireAuth: true
      }
    },
    { // 消费券列表
      path: '/consumeList/:doorId/:orderId',
      name: 'consumeList',
      component: consumeList,
      meta: {
        title: '消费券',
        requireAuth: true
      }
    },
    { // 我的奖品页面
      path: '/myPrize/:index',
      name: 'myPrize',
      component: myPrize,
      meta: {
        title: '我的奖品',
        requireAuth: true
      }
    },
    { // 奖品详情页面
      path: '/prizeDetail/:drawId/:prizeId/:winRecordId/:userCouponId',
      name: 'prizeDetail',
      component: prizeDetail,
      meta: {
        title: '奖品信息',
        requireAuth: true
      }
    },
    { // 抽奖页
      path: '/drawActivity/:drawId',
      name: 'drawActivity',
      component: drawActivity,
      meta: {
        title: '天天有奖'
      }
    },
    { // 奖品物流页
      path: '/prizeLogistics/:winRecordId',
      name: 'prizeLogistics',
      component: prizeLogistics,
      meta: {
        title: '奖品物流',
        requireAuth: true
      }
    },
    { // 奖品信息
      path: '/drawPrizeInfo/:drawId/:prizeId',
      name: 'drawPrizeInfo',
      component: drawPrizeInfo,
      meta: {
        title: '奖品信息'
      }
    },
    { // 一元夺宝页
      path: '/oneIndiana',
      name: 'oneIndiana',
      component: oneIndiana,
      meta: {
        title: '一元夺宝'
      }
    },
    { // 一元夺宝详情页
      path: '/oneIndianaDetails/:doorId/:code/:prdId',
      name: 'oneIndianaDetails',
      component: oneIndianaDetails,
      meta: {
        title: '商品详情'
      }
    },
    { // 往期揭晓页
      path: '/oneIndianaAnnounce/:doorId/:prdId',
      name: 'oneIndianaAnnounce',
      component: oneIndianaAnnounce,
      meta: {
        title: '往期揭晓'
      }
    },
    { // 抢宝纪录页
      path: '/oneIndianaRobRecord/:doorId/:phaseId',
      name: 'oneIndianaRobRecord',
      component: oneIndianaRobRecord,
      meta: {
        title: '抢宝纪录'
      }
    },
    { // 我的夺宝记录列表页
      path: '/oneIndianaGrabRecord/:doorId/:userId',
      name: 'oneIndianaGrabRecord',
      component: oneIndianaGrabRecord,
      meta: {
        title: '一元夺宝'
      }
    },
    { // 计算规则页
      path: '/oneIndianaCountRule/:doorId/:prdId/:code',
      name: 'oneIndianaCountRule',
      component: oneIndianaCountRule,
      meta: {
        title: '计算规则'
      }
    },
    { // 我的
      path: '/me',
      name: 'me',
      component: me,
      meta: {
        title: '我的'
      }
    },
    { // 购物车
      path: '/cart',
      name: 'cart',
      component: cart,
      meta: {
        title: '购物车',
        requireAuth: true
      }
    },
    { // 收藏夹
      path: '/collection/:type',
      name: 'collection',
      component: collection,
      meta: {
        title: '收藏',
        requireAuth: true
      }
    },
    { // 非开放城市提示页面
      path: '/noDataOpenCity',
      name: 'noDataOpenCity',
      component: noDataOpenCity,
      meta: {
        // clearBeforeRouteCache: true
        // title: '非开放城市'
      }
    },
    { // 非开放城市提示页面
      path: '/selectCoupon',
      name: 'selectCoupon',
      component: selectCoupon,
      meta: {
        title: '选择优惠券'
      }
    },
    { // 活动优惠券详情
      path: '/couponActivityDetail/:couponId/:userCouponId/:couponActivityId/1',
      name: 'couponActivityDetail',
      component: couponActivityDetail,
      meta: {
        title: '优惠券详情'
      }
    },
    { // 赠送优惠券
      path: '/complimentaryCoupons/:couponId',
      name: 'complimentaryCoupons',
      component: complimentaryCoupons,
      meta: {
        title: '赠送优惠券'
      }
    },
    { // 投票
      path: '/vote/:voteId',
      name: 'vote',
      component: votePage,
      meta: {
        title: '投票'
      }
    },
    { // 投票
      path: '/voteTranslate/:voteId',
      name: 'voteTranslate',
      component: voteTranslate,
      meta: {
        title: '投票'
      }
    }
  ]
})
route.isPush = true
export default route
