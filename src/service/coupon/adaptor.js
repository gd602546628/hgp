/**
 * Created by gd on 2017/6/17/017.
 */
export function couponSearchAdaptor(item) {
  let result = {
    doorId: item.doorId, // 店铺ID
    couponId: item.couponId || item.id, //  || item.couponActivityId  // 优惠券ID ,(店铺和活动优惠券 为item.id)
    couponName: item.couponName, // 优惠券名称
    couponType: item.couponType || item.type || 0, // 优惠券类型，0线上，1线下  (店铺优惠券  item.type)
    doorName: item.doorName, // 店铺名称
    money: item.money, // 面额
    discountMoney: item.discountMoney || item.disCountMoney, // 减免条件
    scName: item.scName, // 二级分类名称
    topicImg: item.topicImg, // 优惠券图片URL
    category: item.category, // 0优惠券，1代金券
    num: item.num, // 剩余数量
    distance: item.distance, // 距离
    endTime: item.endTime, // 结束时间
    startTime: item.startTime, // 开始时间
    userCouponId: item.userCouponId, // 用户领取的优惠券id
    location: item.location,
    receive: false, // 是否领取过（自定义）
    checked: false, // 是否被选中（自定义）
    receiveTime: item.robTime || null, // 开抢时间
    // receiveTime: '14:00:00', // 开抢时间
    canReceive: false, // 是否能抢（自定义）
    startInterval: false, // 开始倒计时（自定义）
    receiveDisTime: null, // 倒计时时差（自定义）
    intervalMinute: 0, // 倒计时分（自定义）
    intervalSecond: 0, // 倒计时秒（自定义）
    isActivity: item.isActivity || null, // 是否是优惠活动（优惠活动里有这个字段）
    couponActivityId: item.couponActivityId || null, // 优惠活动id
    companyInfo: item.companyInfo
  }
  return result
}
