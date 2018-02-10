<template>
  <div>
    <!--店铺信息-->
    <div class="main-head" v-if="doorInfo"
         @click.stop="goToDoorDetails(doorInfo)">
      <div class="conent"
           :class="{'conent-noimg': isTopBackgroundImg}"
           :style="getBackgroundImage(doorInfo.topImg )">
        <div class="txt">
          <img :src="doorInfo.logo | imgPrefix">
          <div class="txt-txt">
            <div class="door-name">{{doorInfo.name}}</div>
            <div>评分 {{doorInfo.star |startFn}}</div>
          </div>
        </div>
        <div :class='showScore(collectText)'
             @click.stop="onScore()">
          <i :class="showStar(collectText)"></i>
          <div>{{collectText}}</div>
        </div>
      </div>
    </div>
    <!--定位信息-->
    <div class="address" v-if="doorInfo && doorInfo.contactInfoShowType != 1">
      <div class="concent">
        <i class="icon-zyt-location" @click="navigation()"></i>
        <div @click="navigation()">
          {{doorInfo.provinceName+doorInfo.cityName + doorInfo.districtName +doorInfo.address}}
          <span v-if="parseInt(distance)&& parseInt(distance)>0">
            {{distance}}
          </span>
        </div>
        <a v-if="doorInfo"
           :href="'tel:' + doorInfo.tel">
          <i class="icon-zyt-phone"></i>
        </a>
      </div>
    </div>
    <!--最高优惠-->
    <div class="HighestOffer" v-if="HighestOffer&&(HighestOffer.maxDiscountPrice || HighestOffer.doorActivityList)">
      <span v-if="(doorActivityList.length<=0) && HighestOffer.maxDiscountPrice !== null"
      >今日最高优惠
        <strong class="newMList-strong">¥{{HighestOffer.maxDiscountPrice}}</strong>元
      </span>
      <div class="door-activity-list"
           v-if="doorActivityList.length > 0" v-for="item in doorActivityList" :key="item.doorId">
        <span
          v-if="doorActivityList[0].spendAmount && doorActivityList[0].spendAmount>0"
          @click="openUrl(item.drawUrl)"
        >消费满<strong class="newMList-strong">¥{{doorActivityList[0].spendAmount}}</strong
        >获得{{doorActivityList[0].drawNum}}次抽奖机会
        </span>
        <span
          v-if="doorActivityList[0].spendAmount<=0 || !doorActivityList[0].spendAmount"
          @click="openUrl(item.drawUrl)"
        >消费即可获得{{doorActivityList[0].drawNum}}次抽奖机会
        </span>
        <!--<button @click="openUrl(doorActivityList[0].drawUrl)">查看奖品</button>-->
      </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations} from 'Vuex'
  import {Codes} from '@/config/config'
  import ProductApi from '@/api/product/product.api'
  import Util from '@/service/common/utils/util.service'
  import NavigationServices from '@/service/navigation/navigation.service'
  import Picture from '@/assets/img/beijing.png'
  export default {
    props: [
      'doorInfo', 'isTopBackgroundImg',
      'isCollected', 'distance',
      'HighestOffer', 'doorActivityList'
    ],
    computed: {
      collectText () {
        return this.isCollected ? '已收藏' : '收藏'
      }
    },
    methods: {
      ...mapMutations(['changeCollectDoor']),
      async onScore () {
        let data = await ProductApi.getsDDoor({
          doorId: this.$route.params.doorId,
          type: this.isCollected ? 1 : 0 // 1: 移除收藏，0:加入收藏
        }).catch(() => {
          throw new Error('添加或取消收藏失败')
        })
        if (data && data.code === Codes.success) {
          //  不能直接修改props中的属性
          this.$emit('isCollected', !this.isCollected)
          // 刷新收藏的店铺列表
          this.changeCollectDoor()
        } else if (data && data.code === Codes.code01 && data.mesg.indexOf('已收藏过') > -1) {
          // 如果用户没有登录，且用户已经收藏过该店铺
          this.isCollected = true
        }
      },
      showScore(isCollected) {
        if (isCollected === '收藏'){
          return 'score-right1'
        } else if (isCollected === '已收藏'){
          return 'score-right'
        }
      },
      showStar(isCollected){
        if (isCollected === '收藏'){
          return 'icon-zyt-collect'
        } else if (isCollected === '已收藏'){
          return 'icon-zyt-star-score'
        }
      },
      openUrl (url) {
        if (url) {
          window.location.href = url
        }
      },
      getBackgroundImage (imgUrl) {
        if (imgUrl) {
          let url = Util.addImgPrefix(imgUrl)
          return {
            'background-image': `url('${url}')`
          }
        } else {
          return {
            'background-image': `url('${Picture}')`
          }
        }
      },
      navigation () {
        let params = {
          destinationLat: this.doorInfo.lattitude,
          destinationLng: this.doorInfo.longitude,
          destinationName: this.doorInfo.name,
          region: this.doorInfo.address
        }
        NavigationServices.navigation(params)
      },
      goToDoorDetails (item) {
        if (item.siteUrl) {
          Util.openUrl(item.siteUrl)
        } else {
          this.$router.push({name: 'doorDetail', params: {doorId: item.id}})
        }
        // this.$router.push({name: 'doorDetail', params: {doorId: item.id}})
      }
    },
    components: {}
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .main-head {
    height: 130px;
    .conent-noimg {
      background-image: url("../../../assets/img/beijing.png");
    }
    .conent {
      height: 100%;
      display: -webkit-flex;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: cover;
      background-position: center center;
      color: white;
      position: relative;
      &:after{
        content: '';
        display: block;
        /*background-color: rgba(45, 45, 45, 0.3);*/
        position: absolute;
        height: 100%;
        width: 100%;
        top:0;
        left:0;
      }
      .txt {
        z-index: 3;
        width: calc(100% - 84px);
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        margin-top:60px;
        .txt-txt {
          width: calc(100% - 76px);
          height: 100%;
          div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          div:first-child {
            margin-top: 3px;
            margin-bottom: 4px;
            font-size: 15px;

          }
          div:last-child {
            font-size: 12px;
          }
          .door-name{
            display: inline-block;
            padding-right: 50px;
            position: relative;
            max-width: 90%;
            &:after{
              position: absolute;
              content: '官网';
              right: 0px;
              display: block;
              background-color: #387be0;
              width: 38px;
              height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 13px;
              text-align: center;
              top: 0px;
            }
          }
        }
        img {
          width: 56px;
          height: 56px;
          margin: 0px 10px;
        }
      }
      .score-right {
        z-index: 4;
        width: calc(100% - (100% - 75px));
        /*width: 90px;*/
        margin-right: 10px;
        text-align: center;
        border-radius: 4px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 70px;
        position: relative;
        background-color: #ffffff;
        padding: 3px;
        i {
          font-size: 21px;
        }
        i.score {
          color: #ffffff;
        }
        i.icon-zyt-star-score {
          color: #066cc2 !important;
        }
        div {
          font-size: 14px;
          color: #066cc2;
          margin-left: 5px;
        }
      }
      .score-right1 {
        z-index: 4;
        width: calc(100% - (100% - 75px));
        /*width: 90px;*/
        margin-right: 10px;
        text-align: center;
        border-radius: 4px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 70px;
        position: relative;
        background-color: #066cc2;
        padding: 3px;
        i {
          font-size: 21px;
        }
        i.score {
          color: #ffffff;
        }
        i.icon-zyt-star-score {
          color: #066cc2 !important;
        }
        div {
          margin-left: 10px;
          font-size: 14px;
          color: #ffffff;
        }
      }
    }
  }

  .address {
    .concent {
      height: 46px;
      display: flex;
      align-items: center;
      border-bottom: solid #efefef 1px;
      div {
        width: calc(100% - 80px);
        padding-right: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        z-index: 1;
        span {
          position: absolute;
          right: 6px;
          top: 0px;
          text-indent: 0px;
          background: rgb(239, 239, 239);
          color: rgb(170, 170, 170);
          padding: 0px 8px;
          border-radius: 8px;
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      a {
        text-decoration: none;
        i {
          border-left: solid #efefef 1px;
          margin: 0px 10px 0 0;
          padding-left: 10px;
        }
      }
      i {
        font-size: 28px;
        color: #0164a6;
        margin: 0px 10px;
      }
    }
  }

  .HighestOffer {
    padding: 5px 10px;
    background: white;
    > span {
      font-size: 12px;
      strong {
        color: red;
        padding: 0px 2px;
        font-weight: 500;
      }
    }
    .door-activity-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        font-size: 12px;
        strong {
          color: red;
          padding: 0px 2px;
          font-weight: 500;
        }
      }
      button {
        color: white;
        background: #0b6aa9;
        border-radius: 3px;
        padding: 3px 10px;
        border: 0px;
        margin-right: 10px;
      }
    }
  }
</style>
