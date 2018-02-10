/**
 * Created by gd on 2017/6/21/021.
 */

export function seckillItem(item) {
  let result = {
    price: item.costPrice, // 秒杀商品原价
    name: item.prdName, // 秒杀商品名称
    prdImg: item.prdImg[0], // 秒杀商品图片
    doorId: item.doorId, // 店铺ID
    prdId: item.prdId, // 商品ID
    activetyId: item.activityInfo[0].activityId, // 活动ID
    activityPrice: item.activityInfo[0].activityPrice, // 活动价格
    session: parseInt(item.activityInfo[0].participationSession),
    tempStock: item.activityInfo[0].tempStock
  }
  return result
}
