<template>
  <div class="prize-fall-container" v-if="drawActivitydDetail">
    <div class="prize-fall-row"
         v-for="(prize, index) in  drawActivitydDetail.drawSalesPrizeList"
         :style="prize.fallRowRunning" v-if="prize.id!=-1">
      <div>
        <div class="prize-fall-col"
             :style="{backgroundImage:'url('+topicImg(prize.prizeImg?prize.prizeImg:prize.couponImg)+')'}"
             @click="goPrizeInfo(drawActivitydDetail.drawSalesPrizeList[index])">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Config} from '@/config/config'
  export default {
    props: {
      drawActivitydDetail: {
        default: null,
        type: Object
      }
    },
    data() {
      return {
        list: []
      }
    },
    created(){
      this.initFall()
    },
    methods: {
      async goPrizeInfo(item){
        if (item.id === -1) {
          /* 谢谢参与 */
          return
        } else if (item.prizeType === 2 || item.prizeType === 1) {
          /* 奖品信息 */
          this.$router.push({
            name: 'drawPrizeInfo',
            params: {
              drawId: item.drawSalesId,
              prizeId: item.id
            }
          })
        }
      },
      topicImg(img){ // 图片添加前缀
        if (!img) {
          return null
        }
        if (img.indexOf('http') >= 0) {
          return img
        } else {
          return Config.imgPrefix + img
        }
      },
      initFall() {
        if (!this.drawActivitydDetail) {
          return
        }
        this.list = this.list.concat(this.drawActivitydDetail.drawSalesPrizeList)
        this.list.forEach((item, i) => {
          if (item.id !== -1) {
            item['startFall'] = true
            let random = 15 + 10 * Math.random()
            item['fallRowRunning'] = {
              'animation': 'prize-fall-keyframes ' + random + 's linear ' + (3 * i + 3 * Math.random()) + 's infinite',
              /* Firefox: */
              '-moz-animation': 'prize-fall-keyframes ' + random + 's linear ' + (3 * i + 3 * Math.random()) + 's infinite',
              /* Safari 和 Chrome: */
              '-webkit-animation': 'prize-fall-keyframes ' + random + 's linear ' + (3 * i + 3 * Math.random()) + 's infinite',
              '-o-animation': 'prize-fall-keyframes ' + random + 's linear ' + (3 * i + 3 * Math.random()) + 's infinite'
            }
          }
        })
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .prize-fall-container {
    position: fixed;
    top: 0px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  @keyframes prize-fall-keyframes {
    0% {
      top: -10%;
    }
    100% {
      top: 110%;
    }
  }

  @keyframes prize-fall-round {
    0% {
    }
    100% {
    }
  }

  .prize-fall-container .prize-fall-row-running {

    animation: prize-fall-keyframes 15s linear 0s infinite;
    /* Firefox: */
    -moz-animation: prize-fall-keyframes 15s linear 0s infinite;
    /* Safari 和 Chrome: */
    -webkit-animation: prize-fall-keyframes 15s linear 0s infinite;
    -o-animation: prize-fall-keyframes 15s linear 0s infinite;
  }

  .prize-fall-container .prize-fall-row {
    perspective: 150;
    -webkit-perspective: 150; /* Safari and Chrome */
    pointer-events: none;
    top: -10%;
    position: fixed;
    height: 50px;
    width: 100%;
  }

  .prize-fall-container .prize-fall-col {
    animation: prize-fall-round 4s linear 0s infinite;
    /* Firefox: */
    -moz-animation: prize-fall-round 4s linear 0s infinite;
    /* Safari 和 Chrome: */
    -webkit-animation: prize-fall-round 4s linear 0s infinite;
    -o-animation: prize-fall-round 4s linear 0s infinite;
    box-shadow: 0px 0px 5px #999 inset;
    pointer-events: auto;
    transition: all 15s;
    transition-duration: 15s;
    transition-timing-function: linear;
    -webkit-transition-duration: 15s;
    -webkit-transition-timing-function: linear;
    -webkit-transition: all 15s;
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .prize-fall-container > div:after {
    content: "";
    display: block;
    width: 50px;
    height: 50px;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
</style>
