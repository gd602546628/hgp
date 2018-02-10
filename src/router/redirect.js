/**
 * Created by guooug on 2017/8/12.
 */
let routs = [
  {
    // todo 店铺首页
    path: '/:doorId/index/prdList',
    redirect: to => {
      return {
        name: 'indexDoor',
        params: {
          index: 0,
          doorId: to.params.doorId
        }
      }
    }
  },
  {
    // todo 我的收藏
    path: '/:doorId/index/tab/:goBack',
    redirect: to => {
      return {
        name: 'indexDoor',
        params: {
          index: 1,
          doorId: to.params.doorId
        }
      }
    }
  },
  {
    // todo 店铺收藏
    path: '/tab/:goBack/collect/shop',
    redirect: to => {
      return {
        name: 'collection',
        params: {
          type: 0
        }
      }
    }
  },
  {
    // todo 商品收藏
    path: '/tab/:goBack/collect/goods',
    redirect: to => {
      return {
        name: 'collection',
        params: {
          type: 1
        }
      }
    }
  },
  {
    // todo 购物车
    path: '/:doorId/index/shoppingCart',
    redirect: to => {
      return {
        name: 'cart',
        params: {
          index: 2,
          doorId: to.params.doorId
        }
      }
    }
  },
  {
    // todo 我的页面
    path: '/me/:source',
    redirect: to => {
      return {
        name: 'me'
      }
    }
  },
  {
    // todo 我的页面
    path: '/me/',
    redirect: to => {
      return {
        name: 'me'
      }
    }
  },
  {
    // todo 登录页面
    path: '/auth/login/:flag',
    redirect: to => {
      return {
        name: 'login'
      }
    }
  },
  {
    // todo 登录页面
    path: '/auth/login/',
    redirect: to => {
      return {
        name: 'login'
      }
    }
  },
  {
    // todo 注册页面
    path: '/auth/register',
    redirect: to => {
      return {
        name: 'register'
      }
    }
  },
  {
    // todo 修改密码
    path: '/auth/modify',
    redirect: to => {
      return {
        name: 'changePassword'
      }
    }
  },
  {
    // todo 订单确认
    path: '  /me/order/orderConfirm',
    redirect: to => {
      return {
        name: 'prdOrderConfirm'
      }
    }
  },
  {
    // todo 订单支付
    path: '/me/orderPay/:orderId/:token/:userId',
    redirect: to => {
      return {
        name: 'prdOrderPay',
        params: {
          orderId: to.params.orderId
        }
      }
    }
  },
  {
    // todo 我的线上/线下订单列表
    /**
     * 参数 state：0-线上  1-线下
     */
    path: '/me/order/:state/:orderType/:type',
    redirect: to => {
      let name = 'onlineMyOrder'
      if (to.params.state === 1) {
        name = 'offlineMyOrder'
      }
      return {
        name: name,
        params: {
          status: to.params.state
        }
      }
    }
  },
  {
    // todo 订单详情
    path: '/me/orderDetails/:orderId',
    redirect: to => {
      return {
        name: 'myOrderDetail',
        params: {
          id: to.params.orderId
        }
      }
    }
  },
  /* {
   // todo 订单物流
   path: '/me/orderLogistics/:userId/:orderId',
   redirect: to => {
   return {
   name: 'prizeLogistics',
   params: {
   winRecordId: to.params.orderId
   }
   }
   }
   }, */
  {
    // todo 账户信息
    path: '/me/account/accountInfo',
    redirect: to => {
      return {
        name: 'accountInfo'
      }
    }
  },
  {
    // todo 收货地址
    path: '/me/account/accountInfo-address/:addressId',
    redirect: to => {
      return {
        name: 'addressList'
      }
    }
  },
  {
    // todo 编辑收货地址
    /**
     * addressId:地址id
     */
    path: '/me/accountInfo-editAddress/:addressId',
    redirect: to => {
      return {
        name: 'addAddress',
        params: {
          addressId: to.params.addressId
        }
      }
    }
  },
  {
    // todo 产品详情
    /**
     * doorId: 店铺id， prdId：产品id
     */
    path: '/:doorId/prdInfo/:prdId',
    redirect: to => {
      return {
        name: 'productInfo',
        params: {
          doorId: to.params.doorId,
          prdId: to.params.prdId
        }
      }
    }
  },
  {
    // todo 评论列表
    path: '/:doorId/commentList/:prdId',
    redirect: to => {
      return {
        name: 'commentList',
        params: {
          doorId: to.params.doorId,
          prdId: to.params.prdId
        }
      }
    }
  },
  {
    // todo 发布评论
    /**
     * 参数： doorId：店铺id ，type：评论类型 ， commentId：评论id，
     * orderId：订单id， prdId：产品id， orderPrdId：订单产品id
     */
    path: '/:doorId/comment/:type/:commentId/:orderId/:prdId/:orderPrdId',
    redirect: to => {
      let name
      let params
      if (to.params.type === 'add') { // 发布评价
        name = 'addComment'
        params = {
          prdId: to.params.prdId,
          orderId: to.params.orderId,
          orderPrdId: to.params.orderPrdId
        }
      } else if (to.params.type === 'append') { // 追加评价
        name = 'appendComment'
        params = {
          prdId: to.params.prdId,
          orderId: to.params.orderId,
          orderPrdId: to.params.orderPrdId
        }
      } else if (to.params.type === 'update') { // 修改评价
        name = 'modifyComment'
        params = {
          doorId: to.params.doorId,
          prdId: to.params.prdId,
          orderId: to.params.orderId,
          orderPrdId: to.params.orderPrdId
        }
      } else if (to.params.type === 'reply') { // 回复评价
        name = 'replayComment'
        params = {
          doorId: to.params.doorId,
          commentId: to.params.commentId
        }
      }
      return {
        name: name,
        params: params
      }
    }
  },
  {
    // todo 我的收藏
    path: '/tab/:goBack',
    redirect: to => {
      return {
        name: 'commentList',
        params: {
          doorId: to.params.doorId,
          prdId: to.params.prdId
        }
      }
    }
  },
  {
    // todo 店铺详情
    path: '/:doorId/collect/collectShopHome',
    redirect: to => {
      return {
        name: 'doorDetail',
        params: {
          doorId: to.params.doorId
        }
      }
    }
  },
  {
    // todo 优惠券
    /**
     * 参数 state:优惠券状态类型
     */
    path: '/coupon/:state',
    redirect: to => {
      let name
      let index
      if (to.params.state === 'notUseCoupon') { // 未使用优惠券
        name = 'myCoupon'
        index = 0
      } else if (to.params.state === 'useedCoupon') { // 已使用优惠券
        name = 'myCoupon'
        index = 1
      } else if (to.params.state === 'failureCoupon') { // 已失效优惠券
        name = 'myCoupon'
        index = 2
      }
      return {
        name: name,
        params: {
          index: index
        }
      }
    }
  },
  {
    // todo 优惠券详情
    path: '/coupon/couponDetail/:couponId/:userCouponId',
    redirect: to => {
      return {
        name: 'wxCouponCenterDetail',
        params: {
          couponId: to.params.couponId,
          userCouponId: to.params.userCouponId
        }
      }
    }
  },
  {
    // todo 优惠券二维码详情页
    path: '/coupon/couponCode/:couponId/:userCouponId',
    redirect: to => {
      return {
        name: 'couponCenterDetail',
        params: {
          couponId: to.params.couponId,
          userCouponId: to.params.userCouponId
        }
      }
    }
  },
  {
    // todo 优惠券详情页
    path: '/:doorId/coupon/homeReceiveCoupon/:couponId',
    redirect: to => {
      return {
        name: 'wxCouponCenterDesc',
        params: {
          couponId: to.params.couponId,
          userCouponId: 0,
          num: '1'
        }
      }
    }
  },
  {
    // todo 消费券列表
    path: '/:doorId/per-order/per-order-list/:orderId',
    redirect: to => {
      return {
        name: 'offlineMyOrder',
        params: {
          status: 2
        }
      }
    }
  },
  {
    // todo 消费券详情
    path: '/:doorId/per-order/per-orderDetail/:orderId',
    redirect: to => {
      return {
        name: 'consumeDetail',
        params: {
          doorId: to.params.doorId,
          orderId: to.params.orderId
        }
      }
    }
  },
  {
    // todo 我的预约
    path: '/goodServers/myBespeak',
    redirect: to => {
      return {
        name: 'myService'
      }
    }
  },
  {
    // todo 我的预约详情
    path: '/goodServers/serviceBespeak/:id',
    redirect: to => {
      return {
        name: 'myServiceDetail',
        params: {
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 预约支付
    path: '/goodServers/appointmentServersPay/:oybOrderId/:token/:userId/:appointId',
    redirect: to => {
      return {
        name: 'serversPay',
        params: {
          id: to.params.oybOrderId
        }
      }
    }
  },
  {
    // todo 预约详情
    path: '/goodServers/serversDetail/:id',
    redirect: to => {
      return {
        name: 'serviceDetail',
        params: {
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 预约详情
    path: '/goodServers/serversOrderInfo/:id',
    redirect: to => {
      return {
        name: 'ServersOrderInfo',
        params: {
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 预约无数据
    path: '/goodServers/serversNoDetail/:id',
    redirect: to => {
      return {
        name: 'serversNoDetail',
        params: {
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 预约无数据
    path: '/:doorId/snatch/myWinYuan',
    redirect: to => {
      return {
        name: 'myYinYuan'
      }
    }
  },
  {
    // todo 抽奖列表页
    path: '/:doorId/drawActivityList',
    redirect: to => {
      return {
        name: 'indexDoor',
        params: {
          index: 0,
          doorId: to.params.doorId
        }
      }
    }
  },
  {
    // todo 大转盘
    path: '/:doorId/drawActivity/roundabout/:drawId',
    redirect: to => {
      return {
        name: 'drawActivity',
        params: {
          drawId: to.params.drawId
        },
        query: {
          _time: new Date().getTime()
        }
      }
    }
  },
  {
    // todo 老虎机跑马灯
    path: '/:doorId/drawActivity/slotMachines/:drawId',
    redirect: to => {
      return {
        name: 'drawActivity',
        params: {
          drawId: to.params.drawId
        },
        query: {
          _time: new Date().getTime()
        }
      }
    }
  },
  {
    // todo 砸金蛋
    path: '/:doorId/drawActivity/goldenEgg/:drawId',
    redirect: to => {
      return {
        name: 'drawActivity',
        params: {
          drawId: to.params.drawId
        },
        query: {
          _time: new Date().getTime()
        }
      }
    }
  },
  {
    // todo 刮刮卡
    path: '/:doorId/drawActivity/scratchCard/:drawId',
    redirect: to => {
      return {
        name: 'drawActivity',
        params: {
          drawId: to.params.drawId
        },
        query: {
          _time: new Date().getTime()
        }
      }
    }
  },
  {
    // todo 奖品详情
    path: '/:doorId/:drawId/:drawActivityType/prizeInfo',
    redirect: to => {
      return {
        name: 'drawActivity',
        params: {
          drawId: to.params.drawId
        },
        query: {
          _time: new Date().getTime()
        }
      }
    }
  },
  {
    // todo 领奖页面
    path: '/drawActivity/receiveprize/:drawId/:participateRecordId/:prizeId/:winRecordId/:userCouponId',
    redirect: to => {
      return {
        name: 'prizeDetail',
        params: {
          drawId: to.params.drawId,
          prizeId: to.params.prizeId,
          winRecordId: to.params.winRecordId,
          userCouponId: to.params.userCouponId
        }
      }
    }
  },
  {
    // todo 领奖物流
    path: '/drawActivity/prizeLogistics/:winRecordId',
    redirect: to => {
      return {
        name: 'prizeLogistics',
        params: {
          winRecordId: to.params.winRecordId
        }
      }
    }
  },
  {
    // todo 我的奖品
    path: '/drawActivity/myprize',
    redirect: to => {
      return {
        name: 'myPrize',
        params: {
          index: 0
        }
      }
    }
  },
  /* ***********************************************便民******************************************************/
  {
    // todo 便民首页
    path: '/servant',
    redirect: to => {
      return {
        name: 'servantMain'
      }
    }
  },
  {
    // todo 便民全部活动
    path: '/MainAllActivities',
    redirect: to => {
      return {
        name: 'allActivitie'
      }
    }
  },
  {
    // todo 便民全部活动
    path: '/ValuePreference',
    redirect: to => {
      return {
        name: 'couponCenter'
      }
    }
  },
  {
    // todo 领券中心搜索
    path: '/searchPreferential/:keyWord',
    redirect: to => {
      return {
        name: 'couponSearch',
        params: {
          keyword: to.params.keyWord
        }
      }
    }
  },
  {
    // todo 商品搜索
    path: '/searchProduct/:keyWord',
    redirect: to => {
      return {
        name: 'selectedGoodSearch',
        params: {
          keyword: to.params.keyWord,
          num: to.params.num
        }
      }
    }
  },
  {
    // todo 全部商品搜索
    path: '/allSearchProduct/:keyWord',
    redirect: to => {
      return {
        name: 'selectedGoodSearch',
        params: {
          keyword: to.params.keyWord,
          num: to.params.num
        }
      }
    }
  },
  {
    // todo 服务搜索
    path: '/searchService/:keyWord',
    redirect: to => {
      return {
        name: 'serviceSearch',
        params: {
          keyword: to.params.keyWord
        }
      }
    }
  },
  {
    // todo 店铺搜索
    path: '/searchDoor/:keyWord',
    redirect: to => {
      return {
        name: 'goodLifeSearch',
        params: {
          keyword: to.params.keyWord,
          num: to.params.num
        }
      }
    }
  },
  {
    // todo 更多店铺
    path: '/allSearchDoor/:keyWord',
    redirect: to => {
      return {
        name: 'goodLifeSearch',
        params: {
          keyword: to.params.keyWord,
          num: to.params.num
        }
      }
    }
  },
  {
    // todo 全部分类搜索
    path: '/searchAllResult/:keyWord',
    redirect: to => {
      return {
        name: 'servantMainSearch',
        params: {
          keyword: to.params.keyWord
        }
      }
    }
  },
  {
    // todo 好服务全部分类
    path: '/allServiceclassify',
    redirect: to => {
      return {
        name: 'allServiceclassify'
      }
    }
  },
  {
    // todo 好服务二级分类页面
    path: '/SecondaryService/:id',
    redirect: to => {
      return {
        name: 'secondaryService',
        params: {
          levelId: to.params.id
        }
      }
    }
  },
  {
    // todo 好服务分类列表页面
    path: '/ServiceCategoryList/:levelType/:id',
    redirect: to => {
      return {
        name: 'serviceCategoryList',
        params: {
          levelType: to.params.levelType,
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 吃喝玩乐页面
    path: '/GoodLife',
    redirect: to => {
      return {
        name: 'goodLife'
      }
    }
  },
  {
    // todo 好生活分类列表页面
    path: '/GoodLifeList/:level/:typeId',
    redirect: to => {
      return {
        name: 'goodLifeCategory',
        params: {
          level: to.params.level,
          id: to.params.id
        }
      }
    }
  },
  {
    // todo 精选商品
    path: '/SelectedGoods',
    redirect: to => {
      return {
        name: 'selectedGoods'
      }
    }
  },
  {
    // todo 精选商品全部分类
    path: '/AllSelectedGoods',
    redirect: to => {
      return {
        name: 'selectedGoods'
      }
    }
  },
  {
    // todo 精选商品分类页
    path: '/SelectedGoodsList/:level/:typeId',
    redirect: to => {
      return {
        name: 'selectedGoods'
      }
    }
  },
  {
    // todo 折扣活动
    path: '/discount/:activeId',
    redirect: to => {
      return {
        name: 'discountActivity',
        params: {
          activityId: to.params.activeId
        }
      }
    }
  },
  {
    // todo 秒杀
    path: '/seckill/:activeId',
    redirect: to => {
      return {
        name: 'seckill',
        params: {
          activeId: to.params.activeId
        }
      }
    }
  },
  {
    // todo 活动店铺
    path: '/activityShop/:activeId',
    redirect: to => {
      return {
        name: 'shopActivity',
        params: {
          activityId: to.params.activeId
        }
      }
    }
  },
  {
    // todo 活动说明
    path: '/activityExplain/:id',
    redirect: to => {
      return {
        name: 'activityExplain',
        params: {
          activityId: to.params.id
        }
      }
    }
  },
  {
    // todo 活动说明
    path: '/ios/me',
    redirect: to => {
      return {
        name: 'me'
      }
    }
  },
  {
    // 活动优惠券列表
    path: '/CouponExhibition/:activeId',
    redirect: to => {
      return {
        name: 'couponActivity',
        params: {
          activityId: to.params.activeId
        }
      }
    }
  }
]
export default routs
