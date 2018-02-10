<template>
  <div v-if="doorList">
    <div v-for="RecommendData in doorList">
      <!--显示店铺-->
      <div class="pref-item" @click="goToDoor(RecommendData)">
        <img class="img-box" :src="RecommendData.logo">
        <div class="pref-right">
          <pre class="pref-H" v-ueditor v-html="RecommendData.doorName"></pre>
          <div>
            <zyt-star :bgSize="14" :value="Number(RecommendData.star)" :isShowInput="false"></zyt-star>
          </div>
          <div class="pref-distance-box">
            <div class="pref-adds">{{RecommendData.districtName || RecommendData.cityName || RecommendData.provinceName}}
            </div>
            <span class="pref-distance"
                  v-if="RecommendData.distance && parseInt(RecommendData.distance) >= 1 && RecommendData.distance !=='' && RecommendData.distance !==0 && isLocation"
            >{{distance(RecommendData.distance)}}</span>
          </div>
          <div class="pref-maxDisc-box" v-if="RecommendData.doorActivityList">
          <span
            v-if="RecommendData.doorActivityList.length >= 1 && RecommendData.doorActivityList[0].spendAmount !== 0">消费满<strong
            class="newMList-strong">¥{{RecommendData.doorActivityList[0].spendAmount}}</strong>可参与抽奖</span>
            <span
              v-if="RecommendData.doorActivityList.length >= 1 && RecommendData.doorActivityList[0].spendAmount == 0">消费即可参与抽奖</span>
          </div>
          <div class="pref-maxDisc-box"
               v-if="!RecommendData.doorActivityList && (RecommendData.maxDiscountPrice !== null && RecommendData.maxDiscountPrice>0)">
            <span>今日最高优惠<strong>¥ {{ RecommendData.maxDiscountPrice }}</strong>元</span>
          </div>
        </div>
      </div>
      <!--显示商品 默认两条-->
      <div class="prdBox" v-if="showMoreData && RecommendData.prdList && RecommendData.prdList.length>0">
        <div class="good-life-product-list"
             v-for="(prd, index) in RecommendData.prdList" v-if="index < 2 && !RecommendData.openPrdList"
             @click="goProduct(prd)">
          <div class="good-life-door-price">
            <strong
              :class="prd.lowestPrice == prd.originalPrice || prd.originalPrice == null?'good-life-price-original1':'good-life-price-original'">¥{{prd.lowestPrice}}</strong>
            <span class="good-life-visitor"
                  v-show="prd.lowestPrice !== prd.originalPrice && prd.originalPrice !== null">门市价:<strong
              class="">¥ {{prd.originalPrice}}</strong></span>
          </div>
          <pre v-ueditor class="good-life-price-content" v-html="prd.prdName"></pre>
        </div>
        <div class="good-life-product-list"
             v-for="(prd, index) in RecommendData.prdList" v-if="RecommendData.openPrdList"
             @click="goProduct(prd)">
          <div class="good-life-door-price">
            <strong
              :class="prd.lowestPrice == prd.originalPrice || prd.originalPrice == null?'good-life-price-original1':'good-life-price-original'">¥{{prd.lowestPrice}}</strong>
            <span class="good-life-visitor"
                  v-show="prd.lowestPrice !== prd.originalPrice && prd.originalPrice !== null">门市价:<strong
              class="">¥ {{prd.originalPrice}}</strong></span>
          </div>
          <pre v-ueditor class="good-life-price-content" v-html="prd.prdName"></pre>
        </div>
        <div v-if="RecommendData.prdList && RecommendData.prdList.length>2 && !RecommendData.openPrdList"
             class="searchAllR-btn good-life-more"
             @click="showMoreProduct(RecommendData)">
          更多商品<i class="icon-zyt-arrows-down"></i></div>
        <div class="good-life-sort1"></div>
      </div>
    </div>
  </div>

</template>

<script>
  import star from '@/components/score/star.component'
  export default{
    props: {
      secondWebView: {
        type: Boolean,
        default: false
      },
      doorList: {},
      isLocation: {
        type: Boolean,
        default: true
      },
      isFilter: {
        type: Boolean,
        default: false
      },
      showMoreData: { // 是否显示商品
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
      }
    },
    components: {
      'zyt-star': star
    },
    methods: {
      distance(distance){
        let str = ''
        if (this.isFilter) {
          return distance
        }
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else {
            let result = Math.floor(distance / 1000) + '.' + str.substring.call(Math.floor(distance % 1000), 0, 1) + 'km'
            return result
          }
        } else {
          return null
        }
      },

      goToDoor(doorInfo){
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: 0,
            doorId: doorInfo.doorId,
            secondWebView: this.secondWebView
          }
        })
      },

      goProduct(it){
        this.$router.push({name: 'productInfo', params: {doorId: it.doorId, prdId: it.id}})
      },

      showMoreProduct(item) { // 点击展示更多商品
        item.openPrdList = true
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">

  @import "../../assets/css/variables-primary";

  .pref-item {
    display: flex;
    align-items: center;
    height: 102px;
    background: map_get($ComColors, white);
    border-bottom: solid 1px map_get($ComColors, 'gray-ef');
    .img-box {
      display: inline-block;
      border-radius: 5px;
      width: 84px;
      height: 84px;
      line-height: 0px;
      margin: 0px 9px;
    }
    .pref-right {
      flex-grow: 1;
      width: calc(100% - 102px);
      .pref-H {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 600;
        margin: 0 0 0px 0;
      }
      .pref-distance-box {
        padding: 2px 0px 2px 0px;
        position: relative;
        .pref-adds {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*padding-right: 105px;*/
          font-size: 13px;
          color: map_get($ComColors, 'gray-a');
          width: 70%;
        }
        .pref-distance {
          position: absolute;
          right: 10px;
          top: 1px;
          display: inline-block;
          height: map_get($ComHeight, 'height20');
          line-height: map_get($ComHeight, 'height20');
          padding: 0px 8px !important;
          border-radius: 10px;
          background-color: map_get($ComColors, 'gray-ef');
          color: map_get($ComColors, 'gray-8d');
        }
      }
      .pref-maxDisc-box {
        font-size: 13px;
        strong {
          color: map_get($ComColors, red);
          padding: 0px 2px;
          font-weight: 500;
        }
      }
    }
  }

  .prdBox {
    .good-life-product-list {
      width: 100%;
      display: flex;
      align-items: center;
      border-top: 1px solid #efefef;
      height: 50px;
    }
    .good-life-door-price {
      width: 100px;
      text-align: center;
      .good-life-price-original {
        color: #0164a6;
        font-size: 16px;
      }
      .good-life-price-original1 {
        color: #0164a6;
        font-size: 16px;
      }
      .good-life-visitor {
        display: block;
        font-size: 12px;
        color: #aaaaaa;
      }

      .good-life-visitor strong {
        font-weight: 400;
      }

      .good-life-sort1 {
        height: 6px;
        background: #efefef;
        margin-top: 4px;
      }
    }

    .good-life-price-content {
      width: calc(100% - 110px);
      overflow: hidden;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 16px;
    }

    .good-life-more {
      border-top: 1px solid #efefef;
      text-align: center;
      position: relative;
      padding: 10px 10px;
      color: #0164a6;
      font-size: 14px;
    }
    .good-life-sort1 {
      height: 6px;
      background: #efefef;
      margin-top: 4px;
    }

  }


</style>
