/**
 * Created by ljl on 2017/6/20.
 */
export function ProductListAdaptor (item) {
  let getImg = () => {
    let arr = []
    if (item.img) {
      return arr.concat(item.img)
    } else if (item.prdImg) {
      return arr.concat(item.prdImg)
    }
    return []
  }
  if (item.isActivity === 1 && item.activityInfo.length >= 1) {
    let result = {
      prdImg: getImg(), // 商品图片
      doorId: item.doorId, // 店铺ID
      prdId: item.prdId, // 商品ID
      prdName: item.prdName, // 商品名称
      discountPrice: item.activityInfo[0].activityPrice, // 打折价
      costPrice: item.activityInfo[0].price, // 原价
      saleCount: item.saleCount, // 已售件数
      isDiscount: item.activityInfo[0].discount, // 折扣数
      isActivity: item.isActivity, // 是否活动
      activityInfo: item.activityInfo || null, // 活动详情
      firstPriceName: item.firstPriceName, // 一级分类名称
      secondPriceName: item.secondPriceName, // 二级分类名称
      firstPriceStandard: item.firstPriceStandard, // 活动规格一级类
      secondPriceStandard: item.secondPriceStandard, // 活动规格二级类
      standard: item.standard // 多规格单规格标识 0-单规格1-多规格
    }
    return result
  }
  let result = {
    prdImg: getImg(), // 商品图片
    doorId: item.doorId, // 店铺ID
    prdId: item.prdId || item.id, // 商品ID
    prdName: item.prdName, // 商品名称
    discountPrice: item.discountprice || item.lowestPrice, // 打折价
    costPrice: item.costPrice || item.originalPrice, // 原价
    saleCount: item.saleCount, // 已售件数
    isDiscount: item.discount || item.isDiscount, // 折扣数
    prdLabels: item.prdLabels  // 火爆热销、店长推荐标签
  }
  return result
}
