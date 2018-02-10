<template>
  <zyt-page :hasHeader="false">
    <!--<mt-header class="index-title" title="店铺详情" slot="header">
      <mt-button class="title-left" slot="left" @click.native="goBack">
        <i class="icon-zyt-arrows-left"></i>
      </mt-button>
      <mt-button class="title-right" slot="right" @click="onMenu">
        <i class="icon-zyt-menu2"></i>
      </mt-button>
    </mt-header>-->
    <div slot="main">
      <!--店铺信息头部-->
      <div class="main-head" v-if="doorInfo"
           @click="goToDoor(1)">
        <div class="conent">
          <div class="txt">
            <img :src="doorInfo.logo">
            <div class="txt-txt">
              <div>{{doorInfo.name}}</div>
              <div>评分 {{num(doorInfo.star)}}</div>
            </div>
          </div>
          <div class="score-right"
               @click.stop="onScore()">
            <i class="icon-zyt-star-score score"
               :class="{'scoreSty': isCollected}"></i>
            <div>{{collectText}}</div>
          </div>
        </div>
      </div>
      <div class="cantent" v-if="doorInfo">
        <div class="doorintroduc">
          <div class="doorintroduc-title title">·&nbsp店铺信息</div>
          <div class="doorintroduc-title" v-if="doorInfo.tel">
            <span>联系电话：</span>
            <span class="tel">{{doorInfo.tel}}</span>
            <a :href="'tel:' + parseInt(doorInfo.tel)">拨打电话</a>
          </div>
          <div class="doorintroduc-title" v-if="doorInfo.qq"><span>QQ：</span><span>{{doorInfo.qq}}</span></div>
          <div class="doorintroduc-title" v-if="doorInfo.webChat"><span>微信：</span><span>{{doorInfo.webChat}}</span>
          </div>
          <div class="doorintroduc-title"><span>联系地址：</span><span>{{doorInfo.address}}</span></div>
          <div class="doorintroduc-title"><span>店铺介绍：</span><span>{{doorInfo.introduction}}</span></div>
          <div class="doorintroduc-title title">·&nbsp投诉举报</div>
          <div class="doorintroduc-title"><span>举报电话：</span><span>400-159-1615</span></div>
          <div class="doorintroduc-title"><span>举报邮箱：</span><span>service@jointem.com</span></div>
        </div>
      </div>
      <!--头部菜单栏-->
      <mt-popup class="popup" v-model="popupVisible" position="right">
        <i class="topIcon icon-zyt-triangle-up"></i>
        <div class="list1"></div>
        <div class="list">
          <div class="item" @click="goToDoor(1)"><i class="icon icon-zyt-home"></i><span>首页</span></div>
          <div class="item" @click="goToCart(doorInfo)"><i class="icon-zyt-shopping-cart"></i><span>购物车</span></div>
          <div class="item" @click="goToMe(doorInfo)"><i class="icon-zyt-myself"></i><span>我的</span></div>
          <div class="item" @click="goToDoor(2)"><i class="icon-zyt-home3"></i><span>商家网站</span></div>
        </div>
      </mt-popup>
    </div>
  </zyt-page>
</template>
<script>
  import ProductApi from '@/api/product/product.api'
  import { Codes } from '@/config/config'
  import { mapGetters, mapMutations } from 'vuex'
  import Util from '@/service/common/utils/util.service'
  // import RightTop from '@/components/menu/right-top.component'
  export default {
    name: 'doorDetail',
    data () {
      return {
        doorInfo: null,
        doorId: null,
        isCollected: false, // true: 已收藏，false:没有收藏
        popupVisible: false // 菜单弹框
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'hasAuth']),
      collectText(){
        return this.isCollected ? '取消收藏' : '加入收藏'
      }
    },
    created(){
      if (this.hasAuth) {
        this.init()
        this.getDoorList()
      }
    },
    methods: {
      ...mapMutations(['changeCollectDoor']),
      init(){
        if (this.$route.name !== 'doorDetail') {
          return
        }
        this.popupVisible = false
        this.doorInfo = null
        this.doorId = parseInt(this.$route.params.doorId)
        this.getDoorInfo()
      },
      async getDoorInfo(){
        this.doorId = parseInt(this.$route.params.doorId)
        let data = await ProductApi.getDoorInfo({
          doorId: this.doorId
        })
        if (data) {
          this.doorInfo = data
        }
      },
      async getDoorList(){ // 获取用户所有的店铺收藏信息
        this.doorId = parseInt(this.$route.params.doorId)
        let data = await ProductApi.getDoorList({
          doorId: this.doorId,
          notRedirect: true,
          pageNum: 1,
          pageSize: 20,
          userId: this.userInfo.userId
        }).catch(() => {
          throw new Error('获取用户所有的店铺收藏信息失败')
        })
        if (data && data.data && data.data.doorList) {
          data.data.doorList.forEach(item => {
            if (item.doorId === this.doorId) {
              this.isCollected = true
            }
          })
        } else {
          console.log('没有返回店铺收藏信息')
        }
        return true
      },
      async onScore(){ // 添加或取消收藏
        let data = await ProductApi.getsDDoor({
          doorId: this.doorId,
          type: this.isCollected ? 1 : 0 // 1: 移除收藏，0:加入收藏
        }).catch(() => {
          throw new Error('添加或取消收藏失败')
        })
        if (data && data.code === Codes.success) {
          this.isCollected = !this.isCollected
//          刷新收藏列表
          this.changeCollectDoor()
        } else if (data && data.code === Codes.code01 && data.mesg.indexOf('已收藏过') > -1) {
          // 如果用户没有登录，且用户已经收藏过该店铺
          this.isCollected = true
        }
      },
      goToDoor(num){ // num；1跳转店铺首页 2：商家网站站点
        this.offMenu()
        if (num === 1) {
          this.$router.push({name: 'indexDoor', params: {index: 0, doorId: this.$route.params.doorId}})
        } else {
          if (this.doorInfo.siteUrl) {
            Util.openUrl(this.doorInfo.siteUrl)
          } else {
            this.$router.push({name: 'indexDoor', params: {index: 0, doorId: this.$route.params.doorId}})
          }
        }
      },
      goToCart(){ // 跳转购物车
        this.offMenu()
        this.$router.push({name: 'indexDoor', params: {index: 2, doorId: this.$route.params.doorId}})
      },
      goToMe(){ // 跳转我的
        this.offMenu()
        this.$router.push({name: 'indexDoor', params: {index: 3, doorId: this.$route.params.doorId}})
      },
      goBack(){ // 返回
        this.$router.go(-1)
      },
      onMenu() {
        this.popupVisible = true
      },
      offMenu(){
        this.popupVisible = false
      },
      num (value) {
        if (!value) {
          return
        }
        if (value.length === 1) {
          return value + '.0'
        } else {
          return value
        }
      }
    },
    components: {
     // 'right-top': RightTop
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../assets/css/variables-primary.scss';
  .index-title {
    border-bottom-width: 1px !important;
    background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
    border-bottom: 1px solid #b2b2b2;
    border-top: 1px solid #b2b2b2;
    color: #2d2d2d;
    font-weight: bold;
    font-size: 15px;
    .mint-header-title {
      color: #2d2d2d;
      font-weight: bold;
      font-size: 15px;
    }
    .title-left {
      i {
        font-size: 24px;
        font-weight: bold;
        color: #343434;
      }
    }
    .title-right {
      i {
        font-size: 24px;
        font-weight: bold;
        color: #066cc2;
        margin-right: 6px;
      }
    }
  }

  .main-head {
    height: 68px;
    min-height: 68px;
    .conent-noimg {
      background-image: url("../../assets/img/beijing.png");
    }
    .conent {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: cover;
      background-position: center center;
      color: #2d2d2d;
      border-bottom: solid 1px #ddd;
      margin: 0 10px;
      .txt {
        width: calc(100% - 74px);
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        .txt-txt {
          width: calc(100% - 50px);
          height: 100%;
          div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          div:first-child {
            margin-top: 3px;
            margin-bottom: 4px;
            font-size: 14px;
          }
          div:last-child {
            font-size: 11px;
          }
        }
        img {
          width: 46px;
          height: 46px;
          margin: 0px 10px 0px 1px;
        }
      }
      .score-right {
        width: 64px;
        padding-left: 10px;
        margin-right: 1px;
        text-align: center;
        border-left: 1px dotted #cfcfcf;
        i {
          font-size: 25px;
        }
        i.score {
          color: #c1c1c1;
        }
        i.scoreSty {
          color: #FFC001 !important;
        }
        div {
          font-size: 11px;
        }
      }
    }
  }

  .cantent {
    padding: 0px 10px;
    .doorintroduc {
      margin-top: 12px;
    }
    .doorintroduc .title {
      margin-top: 2px;
      margin-bottom: 5px;
      color: #066cc2;
    }
    .doorintroduc-title {
      font-size: 15px;
      font-weight: bold;
    }
    .doorintroduc-title span:first-child {
      margin-left: 10px;
      font-weight: normal;
      line-height: 30px;
      font-size: 15px;
      text-align: right;
      width: 85px;
      display: inline-block;
    }
    .doorintroduc-title span:last-child {
      width: 66%;
      display: inline-flex;
      font-weight: normal;
      margin-bottom: 5px;
    }
    .doorintroduc-title .tel {
      color: #066cc2;
      font-weight: normal;
    }
    .doorintroduc-title a {
      display: inline-block;
      width: 66px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border-radius: 3px;
      position: absolute;
      right: 15px;
      text-decoration: none;
      color: #ffffff;
      background: #066cc2;
      font-weight: normal;
      font-size: 12px;
    }
    .doorintroduc .introduction {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 25px;
    }
  }

  .popup {
    width: 138px;
    border-radius: 10px;
    background: transparent;
    top: 136px;
    right: 6px;
    .topIcon {
      font-size: 26px;
      color: #000;
      opacity: 0.5;
      filter: alpha(opacity=50);
      position: relative;
      z-index: 1;
      right: -108px;
      top: -2px;
    }
    .list1 {
      width: 100%;
      height: 176px;
      background-color: #000;
      opacity: 0.5;
      filter: alpha(opacity=50);
      border-radius: 10px;
      margin-top: -12px;
    }
    .list {
      position: relative;
      z-index: 1;
      margin-top: -176px;
      border-radius: 10px;
      .item {
        height: 44px;
        display: flex;
        align-items: center;
        border-bottom: solid 1px #797879;
        padding-left: 28px;
        i {
          margin-right: 10px;
          font-size: 22px;
          color: white;
        }
        span {
          font-size: 15px;
          color: white;
        }
      }
      .item:last-child {
        border: none;
      }
    }
  }

</style>
