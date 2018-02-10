/**
 * Created by LQJ on 2017/7/13.
 */
import router from '@/router/index'
class ActiveJumpService {
  constructor () {
    this.$router = router
  }

  goPrd (item, secondWebView = false) { // 跳转商品详情页
    this.$router.push({
      name: 'productInfo',
      params: {doorId: item.siteId, prdId: item.id, secondWebView: secondWebView}
    })
  }

  goHomeCopon (item, secondWebView = false) { // 优惠券详情跳转
    this.$router.push({name: 'wxCouponCenterDesc', params: {userCouponId: item.userCouponId || 250, num: 1, couponId: item.id, secondWebView: secondWebView}})
  }

  goServiceDetail (item, secondWebView = false) { // 服务详情跳转
    this.$router.push({name: 'serviceDetail', params: {id: item.id, secondWebView: secondWebView}})
  }

  goactivity (item, secondWebView = false) { // 抽奖活动页面
    this.$router.push({name: 'drawActivity', params: {drawId: item.id, secondWebView: secondWebView}})
  }

  /*  goScratchCard (item) { // 刮刮卡跳转
   console.log('刮刮卡跳转')
   this.$router.push({name: 'drawActivity', params: {drawId: item.id, secondWebView: secondWebView}})
   }

   goGoldenEgg (item) { // 金蛋跳转
   console.log('金蛋跳转')
   this.$router.push({name: 'drawActivity', params: {drawId: item.id, secondWebView: secondWebView}})
   }

   goSlotMachines (item) { // 十二分转盘
   console.log('十二分转盘')
   this.$router.push({name: 'drawActivity', params: {drawId: item.id}})
   }

   goRoundabout (item) { // 经典款转盘
   console.log('经典款转盘')
   this.$router.push({name: 'drawActivity', params: {drawId: item.id}})
   } */

  goToDoor (item, secondWebView = false) { // 店铺详情
    this.$router.push({name: 'indexDoor', params: {index: 0, doorId: item.siteId, secondWebView: secondWebView}})
  }

  goActivityShop (item, secondWebView = false) { // 店铺活动
    this.$router.push({name: 'shopActivity', params: {activityId: item.id, secondWebView: secondWebView}})
  }

  goActivityDiscount (item, secondWebView = false) { // 折扣活动
    this.$router.push({name: 'discountActivity', params: {activityId: item.id, secondWebView: secondWebView}})
  }

  goActivityCouponExhibition (item, secondWebView = false) { // 优惠活动
    this.$router.push({name: 'couponActivity', params: {activityId: item.id, secondWebView: secondWebView}})
  }

  goActivitySeckill (item, secondWebView = false) { // 秒杀活动
    this.$router.push({name: 'seckill', params: {activeId: item.id, secondWebView: secondWebView}})
  }
}
let activeJump = new ActiveJumpService()

let linkArr = {
  0: {// 商品
    fn: activeJump.goPrd
  },
  1: {// 优惠券
    fn: activeJump.goHomeCopon
  },
  2: {// 服务
    fn: activeJump.goServiceDetail
  },
  3: {// 营销活动
    fn: activeJump.goactivity
  },
  4: {// 店铺详情
    fn: activeJump.goToDoor
  },
  5: {// 首推活动
    0: {// 折扣
      fn: activeJump.goActivityDiscount
    },
    1: {// 优惠
      fn: activeJump.goActivityCouponExhibition
    },
    2: {// 秒杀
      fn: activeJump.goActivitySeckill
    },
    3: {// 店铺活动
      fn: activeJump.goActivityShop
    }
  }
}

let allActiveJump = function (item) {
  let fn = null
  if (item.category === 5) {
    fn = linkArr[item.category].fn ||
      linkArr[item.category][item.type].fn ||
      linkArr[item.category][item.type][item.style].fn
  } else if (item.category === 3) {
    fn = linkArr[item.category].fn
  } else {
    fn = linkArr[item.category].fn ||
      linkArr[item.category][item.type].fn ||
      linkArr[item.category][item.type][item.style].fn
  }
  fn.call(activeJump, item)
}

let mainActiveJump = function (item, secondWebView = false) {
  let fn = null
  if (item.category === 5) {
    fn = linkArr[item.category].fn ||
      linkArr[item.category][item.activityType].fn ||
      linkArr[item.category][item.activityType][item.style].fn
  } else if (item.category === 3) {
    fn = linkArr[item.category].fn
  } else {
    fn = linkArr[item.category].fn ||
      linkArr[item.category][item.saleType].fn ||
      linkArr[item.category][item.saleType][item.style].fn
  }
  fn.call(activeJump, item, secondWebView)
}

export {allActiveJump, mainActiveJump}
