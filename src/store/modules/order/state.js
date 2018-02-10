/**
 * Created by guooug on 2017/6/20.
 */
export default {
  /*
    订单确认的参数
   [{
   doorInfo: {}, // {} 可由前一个界面传过来
   doorName: '',
   doorId: 0,
   userCouponId: null, // 优惠券id 传null
   couponList: [], // [] 页面初始化之后，从后台的接口中获取
   prdList: [{ // 以下字段是参照购物车接口返回
   id: null, // 购物车id 从购物车到订单确认界面的时候，成功提交订单要删除相应的购物车
   prdId: 0,
   prdName: '', // 产品名称
   discountPrice: 0, // 价格
   num: 0, // 数量
   prdType: 0, // 商品类型
   prdImg: '', // 产品图片
   priceId: null, // 规格id
   firstPriceName: '',
   secondPriceName: '',
   firstPriceValue: '',
   secondPriceValue: ''
   }]
   }]
   */
  confirmOrders: null
}
