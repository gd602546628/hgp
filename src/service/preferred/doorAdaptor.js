/**
 * Created by lqj on 2017/6/19
 */

export function doorAdaptor(item) {
  let result = {
    // 店铺ID
    doorId: item.id || item.doorId,
    // 店铺名称
    doorName: item.name || item.doorName,
    // 最高优惠
    maxDiscountPrice: item.maxDiscountPrice,
    // 店铺logo(url)
    logo: item.logo || item.doorImg,
    // 评分："2.0"
    star: Number(item.star),
    // 距离:"5.0km"
    distance: item.distance,
    // 详细地址
    address: item.address || (item.province + item.city + item.country),
    // 区："红塔区"
    districtName: item.districtName || item.country,
    // 城市名称："玉溪市"
    cityName: item.cityName || item.city,
    // 省份："云南省"
    provinceName: item.provinceName || item.province,
    // 纬度
    lattitude: item.lattitude || null,
    // 经度
    longitude: item.longitude || null,
    // 商品列表
    prdList: item.prdList || null,
    // 是否展开商品列表
    openPrdList: false
  }
  return result
}
