<template>
  <div v-if="drawActivitydDetail">
    <!--轮播抽中到的奖品-->
    <div class="carouselBox"
         v-if="drawActivitydDetail.drawSalesBase.showSetup===0 && drawActivitydDetail.winningInfoResList">
      <div class="slideBox"
           :class="{'sixSty': isSixSty, 'eightSty': isEightSty,
            'twelveSty':isTwelveSty, 'goldenEggSty': isGoldenEgg}">
        <mt-swipe class="swipeBox" :auto="2000"
                  :speed="2000"
                  :prevent="false" :stopPropagation="true"
                  :showIndicators="false">
          <mt-swipe-item v-for="(item,index) in drawActivitydDetail.winningInfoResList" :key="index">
            <p>用户{{item.userName}}抽中{{item.winningPrizeName}}</p>
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>

    <!--轮播所有的奖品-->
    <div class="carouselBox" v-if="drawActivitydDetail.drawSalesBase.showSetup===1">
      <div class="slideBox" :class="{'sixSty': isSixSty, 'eightSty': isEightSty}">
        <mt-swipe class="swipeBox" :auto="5000"
                  :prevent="false" :stopPropagation="true"
                  :showIndicators="false">
          <mt-swipe-item v-if="item.id!=-1" v-for="(item,index) in drawActivitydDetail.drawSalesPrizeList" :key="index">
            <p>大奖等你抽！{{item.prizeCount}}个{{item.prizeName}}</p>
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      drawActivitydDetail: {
        default: null,
        type: Object
      },
      isEightSty: {
        default: false,
        type: Boolean
      },
      isSixSty: {
        default: false,
        type: Boolean
      },
      isTwelveSty: {
        default: false,
        type: Boolean
      },
      isGoldenEgg: {
        default: false,
        type: Boolean
      }
    },
    data() {
      return {}
    },
    created(){
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .carouselBox {
    width: 100%;
    height: 28px;
    margin: 17px 0px;
    .slideBox {
      margin: 0px 10px;
      height: 28px;
      background-color: #FED871;
      border: 1px solid #fd9191;
      border-radius: 30px;
      height: 100%;
      .swipeBox {
        width: 100%;
      }
      .mint-swipe {
        text-align: center;
        div.mint-swipe-items-wrap {
          .mint-swipe-item {
            p {
              width: 100%;
              height: 28px;
              padding: 0px 20px;
              line-height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #fe5c5c;
              text-align: center;
            }
          }
        }
      }
    }
    .sixSty {
      background-color: #000000 !important;
      border: 1px solid #ff1cf4 !important;
      p {
        color: #eeb42a !important;
      }
    }
    .eightSty {
      background-color: #FDB628 !important;
      border: 1px solid #F39B38 !important;
      p {
        color: #C35B01 !important;
      }
    }
    .twelveSty {
      background-color: #fee08f !important;
      border: 1px solid #fe5c5c !important;
      p {
        color: #fe5c5c !important;
      }
    }
    .goldenEggSty {
      background-color: #FC5089 !important;
      border: 1px solid #FC9D6B !important;
      p {
        color: #FEE6A2 !important;
      }
    }
  }
</style>
