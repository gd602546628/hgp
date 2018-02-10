<template>
  <div v-if="drawActivitydDetail">
    <scratch-card-page :drawActivitydDetail="drawActivitydDetail" v-if="drawType==0"
                       :refreshNum="refreshNum"></scratch-card-page>
    <twelve-draw-page :drawActivitydDetail="drawActivitydDetail" v-if="drawType==4"
                      :refreshNum="refreshNum"></twelve-draw-page>
    <eight-draw-page :drawActivitydDetail="drawActivitydDetail" v-if="drawType==3"
                     :refreshNum="refreshNum"></eight-draw-page>
    <six-draw-page :drawActivitydDetail="drawActivitydDetail" v-if="drawType==2"
                   :refreshNum="refreshNum"></six-draw-page>
    <goldenEgg-draw-page :drawActivitydDetail="drawActivitydDetail" v-if="drawType==1"
                         :refreshNum="refreshNum"></goldenEgg-draw-page>
    <div class="share-container" @click="share()" v-if="showShare">
      <div class="bg"></div>
      <i class="icon-zyt-share"></i>
    </div>
  </div>
</template>
<script>
  import drawService from '@/api/draw/draw.api'
  import {Codes} from '@/config/config'
  import scratchCardPage from './scratchCard.page.vue'
  import twelveDrawPage from './twelveDraw.page.vue'
  import eightDrawPage from './eightDraw.page.vue'
  import sixDrawPage from './sixDraw.page.vue'
  import goldenEggDrawPage from './goldenEgg.page.vue'
  import ShareService from '@/service/share/share.service'
  import Utils from '@/service/common/utils/util.service'
  import WeixinService from '@/service/weixin/weixin.service'

  export default {
    name: 'drawActivity',
    components: {
      'scratch-card-page': scratchCardPage,
      'twelve-draw-page': twelveDrawPage,
      'eight-draw-page': eightDrawPage,
      'six-draw-page': sixDrawPage,
      'goldenEgg-draw-page': goldenEggDrawPage
    },
    data() {
      return {
        drawActivitydDetail: null,
        refreshNum: 0
      }
    },
    activated() {
      this.refreshNum = this.refreshNum + 1
    },
    computed: {
      drawType() {
        let typeMap = {
          0: 0,
          1: {
            0: 2,
            1: 3,
            2: 4
          },
          2: 1
        }
        let saleType = parseInt(this.drawActivitydDetail.drawSalesBase.saleType)
        let style = parseInt(this.drawActivitydDetail.drawSalesBase.style)
        /* 0刮刮卡 1 砸金蛋 2六分转盘 3八分转盘 4十二分转盘 */
        let resultType = typeMap[saleType][style] || typeMap[saleType]
        return resultType
      },
      shareData() {
        let title = this.drawActivitydDetail.drawSalesBase.name
        let imgUrl = Utils.addImgPrefix(this.drawActivitydDetail.drawSalesBase.name)
        let desc = title
        let link = window.location.href
        return {
          title: title,
          imgUrl: imgUrl,
          desc: desc,
          link: link
        }
      },
      showShare() {
        return WeixinService.isWeixin()
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        await this.getDrawDetail()
      },
      async getDrawDetail() {
        let data = await drawService.getDrawDetail({
          drawId: this.$route.params.drawId
        })
        if (data.code !== Codes.success) {
          return
        }
        this.drawActivitydDetail = data.data
        setTimeout(() => {
          ShareService.setWxShare(this.shareData)
        }, 100)
      },
      share() {
        ShareService.doShare(this.shareData)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .share-container {
    height: 36px;
    width: 36px;
    position: fixed;
    right: 4px;
    top: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 100%;
      opacity: .5;
      background-color: black;
      border-radius: 50%;
      z-index: -1;
    }
    i {
      font-size: 24px;
      color: white;
    }
  }
</style>
