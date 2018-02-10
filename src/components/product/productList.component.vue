<template>
  <!--宫格模式-->
  <div v-if="state==1">
    <div class="product-list">
      <div class="product-list-box" :content="item" v-for="item in prdListDate" @click="goDetails(item)"
           :key="item.prdId">
        <div class="product-list-img-box">
          <img-component :img-src="imgsUrl(item)" :add-prefix="item.prdImg.length>0"></img-component>
          <!--<img :style=""/>-->
          <div class="product-list-dztj-box" v-if="showLabel(item)">
            <img class="product-list-dztj" src="../../assets/img/doorIndeximg/dztj_bg.png">
            <span>{{getPrdLabelName(item)}}</span>
          </div>

          <!--折扣-->
          <div class="product-list-circle"
               v-if="showDiscount(item)">
            <div class="product-list-circle2"></div>
            <p class="product-list-discount">
              {{getDiscount(item) | discountFilter}}<span>折</span>
            </p>
          </div>
          <div v-if="showAlreadySack(item)"
               class="already-sack-box">
            <img class="already-sack" src="../../assets/img/yqg.png">
          </div>
        </div>

        <div class="product-list-name-box">
          <span v-if="isPromotion(item)">促销</span>
          <!--<i class="icon-zyt-promotion" v-if="item.isActivity==1"></i>-->
          <!--<span class="product-list-name">{{item.prdName}}</span>-->
          <pre class="product-list-name" v-html="item.prdName"></pre>
        </div>
        <!--规格显示 standard:0-单规格1-多规格-->
        <div v-if="item.standard===1" class="activity-classify">
          <span class="activity-classify-first-name">{{item.firstPriceName}}</span>:
          <span class="activity-classify-first"> {{item.firstPriceStandard}}</span>
          <span class="activity-classify-second-name">{{item.secondPriceName}}</span>:
          <span class="activity-classify-second"> {{item.secondPriceStandard}}</span>
        </div>
        <div v-if="item.isActivity&&item.isActivity===0">
          <span class="product-list-discountprice">
            <price-component :price="getDiscountPrice(item)"></price-component>
          </span>
          <span class="product-list-price"
                v-if="getDiscountPrice(item)!=getPrice(item)">
             <price-component :price="getPrice(item)"></price-component>
          </span>
        </div>
        <div class="product-list-discountprice-box" v-else="item.isActivity&&item.isActivity===1">
          <span class="product-list-discountprice">
            <price-component :price="getDiscountPrice(item)"></price-component>
          </span>
          <span class="product-list-price"
                v-if="getDiscountPrice(item)!=getPrice(item)">
             <price-component :price="getPrice(item)"></price-component>
          </span>
        </div>
      </div>
    </div>
  </div>
  <!--列表模式-->
  <div v-else-if="state==2">
    <div v-for="item in prdListDate" class="product-list-other-box" @click="goDetails(item)">
      <div class="product-list-other-img-box">
        <img-component :img-src="imgsUrl(item)" :add-prefix="item.prdImg.length>0" class="samll-img"></img-component>
        <div class="product-list-other-circle"
             v-if="showDiscount(item)">
          <div class="product-list-other-circle2"></div>
          <p class="product-list-other-discount">
            {{getDiscount(item) | discountFilter}}<span>折</span>
          </p>
        </div>
        <!--<div v-if="showDiscount(item) && item.activityInfo && item.activityInfo[0].tempStock<=0" class="already-sack-other-box">-->
        <!--<img class="already-other-sack" src="../../assets/img/yqg.png">-->
        <!--</div>-->
      </div>
      <div class="product-list-other-content-box">
        <div class="product-list-other-name-box">
          <span v-if="item.isActivity==1"></span>
          <!--<span class="product-list-other-name">{{item.prdName}}</span>-->
          <pre class="product-list-other-name" v-html="item.prdName"></pre>
        </div>
        <div class="product-list-other-price-box">
          <div class="product-list-other-discountPrice">
            <price-component :price="getDiscountPrice(item)" class="other-discountPrice"></price-component>
            <div class="product-list-other-recommend-box" v-if="showLabel(item)">
              <span class="product-list-other-recommend">{{getPrdLabelName(item)}}</span>
            </div>
          </div>
          <div class="product-list-other-price">
            <span class="product-list-other-cost"
                  v-if="getDiscountPrice(item)!=getPrice(item)">
              <price-component :price="getPrice(item)"></price-component>
            </span>
            <!--            <span class="product-list-other-buy"
                              v-if="showSaleCount&&item.saleCount&&item.saleCount!=0">已售{{item.saleCount}}件</span>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {Config} from '@/config/config'
  import PriceComponent from '@/components/common/price/price.component'
  import ImgComponent from '@/components/common/img/img.component'
  import pic from '@/assets/img/wutu.png'
  import ProductApi from '@/api/product/product.api'

  export default {
    props: {
      prdListDate: {
        type: Array,
        default: () => []
      },
      state: {
        type: Number,
        default: 1
      },
      secondWebView: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showSaleCount: false,
        imgPre: Config.imgPrefix,
        imgBox: {
          height: '138px',
          width: '100%'
        }
      }
    },
    methods: {
      /* 推荐标签 */
      getPrdLabelName(product) {
        if (product.isActivity && product.isActivity === 1) {
          if (product.activityInfo[0].type === 0) {
            return '限时折扣'
          } else if (product.activityInfo[0].type === 2) {
            return '限时秒杀'
          }
        } else if (product.isActivity === 0 && product.prdLabels && product.prdLabels.length > 0) {
          let label = product.prdLabels[0].prdLabelName || product.prdLabels[0]
          return label
        }
      },
      showLabel(product) {
        if (product.isActivity && product.isActivity === 1) {
          if (product.activityInfo[0].type === 0 || product.activityInfo[0].type === 2) {
            return true
          }
        } else if (product.isActivity === 0) {
          if (product.prdLabels && product.prdLabels.length > 0) {
            return true
          } else if (product.prdLabels.length === 0) {
            return false
          }
        }
      },
      /* 折扣判断 */
      showDiscount(item) {
        let discount = this.getDiscount(item)
        let flag = discount >= 0.5 && discount < 9.5
        if (item && item.activityInfo && item.activityInfo.length) {
          flag = flag && item.activityInfo[0].tempStock > 0
        }
        return flag
      },
      // 显示已抢光
      showAlreadySack(item) {
        if (item && item.activityInfo && item.activityInfo.length) {
          return item.activityInfo[0].tempStock === 0
        }
        return false
      },

      /* 折扣 */
      getDiscount(item) {
        let isDiscount = item.isDiscount
        if (item.isActivity === 1 && item.activityInfo && item.activityInfo[0].discount) {
          isDiscount = item.activityInfo[0].discount
        }
        return isDiscount
      },
      getDiscountPrice(item) {
        let discountPrice = item.discountPrice
        if (item.isActivity === 1 && item.activityInfo && item.activityInfo.length) {
          discountPrice = item.activityInfo[0].activityPrice
        }
        return discountPrice
      },
      getPrice(item) {
        let price = item.costPrice
        if (item.isActivity === 1 && item.activityInfo && item.activityInfo.length) {
          price = item.activityInfo[0].price
        }
        return price
      },
      /* 产品图片 */
      imgsUrl: function (product) {
        if (product.prdImg.length) {
          return product.prdImg[0]
        } else {
          return pic
        }
      },
      goDetails(item) {  /* 跳转产品详情 */
        this.$router.push({
          name: 'productInfo',
          params: {doorId: item.doorId, prdId: item.prdId, product: item, secondWebView: this.secondWebView}
        })
      },
      isPromotion(product) {
        if (product.isActivity) {
          return true
        }
        let result = false
        if (typeof product.activityInfo === 'object') {
          product.activityInfo.forEach(item => {
            result = result || ProductApi.disTimeout(item)
          })
        }
        return result
      }
    },
    components: {
      'price-component': PriceComponent,
      'img-component': ImgComponent
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
  .product-list {
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    -webkit-flex-wrap: wrap;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    justify-content: flex-start;
    .product-list-box {
      border: 2px solid #efefef;
      width: 50%;
      padding: 7px;
      margin: 0;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      -webkit-flex-direction: column;
      -webkit-justify-content: center;
      -webkit-align-items: flex-start;
      align-items: flex-start;
      justify-content: center;
      .product-list-img-box {
        width: 100%;
        position: relative;
        display: flex;
        .product-list-dztj-box {
          height: 54px;
          width: 50px;
          position: absolute;
          top: 0;
          left: 0;
          .product-list-dztj {
            height: 100%;
            width: 48px;
            display: block;
          }
          span {
            position: absolute;
            top: 0px;
            left: 9px;
            color: #fff;
            width: 31px;
            font-size: 15px;
          }
        }
        .product-list-circle {
          background-color: #0164a6;
          height: 48px;
          width: 48px;
          position: absolute;
          right: 4px;
          top: 4px;
          border-radius: 29px;
        }
        .already-sack-box {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          .already-sack {
            display: block;
            height: 68%;
            width: 68%;
          }
        }
        .product-list-circle2 {
          border: 1px dashed white;
          height: 42px;
          width: 42px;
          position: absolute;
          right: 3px;
          top: 3px;
          border-radius: 29px;
        }
        .product-list-discount {
          position: absolute;
          font-size: 26px;
          top: 6px;
          color: white;
          right: 9px;
          span {
            font-size: 12px;
          }
        }
      }
      .product-list-name-box {
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0 5px 0;
        width: 100%;
        span {
          background-color: #f8311e;
          color: #ffffff;
          border-radius: 3px;
          font-size: 11px;
          padding: 0px;
          display: -webkit-flex;
          -webkit-justify-content: center;
          -webkit-align-items: center;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 5px;
          width: 30px;
        }
        .product-list-name {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          width: 100%;
        }
      }
      .activity-classify {
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: flex-start;
        -webkit-align-items: center;
        justify-content: flex-start;
        align-items: center;
        font-size: 13px;
        color: #88888d;
        .activity-classify-first {
          margin-right: 10px;
          margin-left: 5px;
        }
        .activity-classify-second {
          margin-left: 5px;
        }
      }

      .product-list-discountprice-box {
        width: 100%;
        /*display: flex;*/
        .product-list-discountprice {
          color: #0164a6;
          font-size: 15px;
        }
        .product-list-price {
          font-size: 10px;
          color: #9e9e9e;
          text-decoration: line-through;
          margin-left: 5px;
        }
      }

      .product-list-buy-people {
        font-size: 10px;
        color: #2d2d2d;
      }
    }
  }

  .product-list-other-box {
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    border: solid #f4f4f4;
    border-width: 5px 10px;
    .product-list-other-img-box {
      display: flex;
      position: relative;
      width: 33%;
      img {
        height: 94px;
        width: 90px;
      }
      .product-list-other-circle {
        position: absolute;
        top: 3px;
        left: 3px;
        background-color: #0164a6;
        height: 38px;
        width: 38px;
        border-radius: 19px;
        .product-list-other-circle2 {
          border: 1px dashed white;
          height: 32px;
          width: 32px;
          position: absolute;
          top: 3px;
          left: 3px;
          border-radius: 19px;
        }
      }
      .already-sack-other-box {
        .already-other-sack {

        }
      }
      .product-list-other-discount {
        position: absolute;
        font-size: 19px;
        top: 7px;
        color: white;
        left: 8px;
        span {
          font-size: 12px;
        }
      }
    }
    .product-list-other-content-box {
      display: -webkit-flex;
      -webkit-flex-direction: column;
      -webkit-justify-content: space-between;
      -webkit-align-items: flex-start;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      width: 65%;
      margin: 10px 10px 25px 10px;
      .product-list-other-name-box {
        display: -webkit-flex;
        -webkit-justify-content: flex-start;
        -webkit-align-items: center;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        span {
          background-color: #f8311e;
          color: #ffffff;
          border-radius: 3px;
          font-size: 11px;
          padding: 0 3px;
        }
        .product-list-other-name {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          width: 100%;
        }
      }
      .product-list-other-price-box {
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-flex-direction: column;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .product-list-other-discountPrice {
          display: -webkit-flex;
          -webkit-justify-content: flex-start;
          -webkit-align-items: center;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          align-self: center;
          .other-discountPrice {
            color: #066cc2;
            font-size: 15px;
          }
          .product-list-other-recommend-box {
            .product-list-other-recommend {
              color: #ffc001;
              font-size: 11px;
              margin-left: 10px;
              border: 1px dashed #ffc001;
              border-radius: 5px;
              padding: 1px 2px;

            }
          }
        }
        .product-list-other-price {
          display: -webkit-flex;
          -webkit-justify-content: space-between;
          display: flex;
          justify-content: space-between;
          .product-list-other-cost {
            font-size: 12px;
            color: #9e9e9e;
            text-decoration: line-through;
          }
          .product-list-other-buy {
            font-size: 12px;
            color: #9e9e9e;
          }
        }
      }
    }
  }

  .samll-img {
    width: 90%;
  }
</style>
