/**
 * Created by guooug on 2017/6/27.
 */

/**

 * @param item
 * @returns {{prdId: *, prdName: *, prdType: *, priceList: *, saleStock: *, discountType: *, standard: (*|standard|{extends, plugins}), firstPriceName: *, imgList: (*|Array), isFreePost: *, prdCommentList: *, prdDescription: *, prdExpireDate: *, secondPriceName: *}}
 */
let product = {
  'prdId': 634,
  'prdName': '秒杀商品测试0001',
  'prdType': 0,
  'standard': 1,
  'prdDescription': '<p>秒杀商品测试</p>',
  'discountType': 0,
  'firstPriceName': '尺码',
  'imgList': [
    'super/img/20170517/1495018709487484.jpg',
    'super/img/20170517/1495018712733204.jpg'
  ],
  'isFreePost': 1,
  'prdCommentList': {},
  'prdExpireDate': '测试内容064d',
  'priceList': [
    {
      'activityInfo': {
        'activityEndTime': '2017-05-31 00:00:00',
        'activityId': 51,
        'activityName': '秒杀活动测试000001',
        'activityPrice': 1,
        'activityStartTime': '2017-05-17 00:00:00',
        'buyCount': 0,
        'discount': 1,
        'discountType': 1,
        'id': 84,
        'isTime': 0,
        'limitCount': 1,
        'prdId': 634,
        'price': 99,
        'priceId': 1931,
        'seckillEndTime': '2017-05-31 00:00:00',
        'seckillStartTime': '2017-05-17 00:00:00',
        'tempStock': 20,
        'type': 2
      },
      'priceImg': 1
    }
  ],
  'saleStock': 0,
  'secondPriceName': '颜色'
}
export function productAdaptor (item) {

}
