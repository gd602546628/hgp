<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!RecommenddataFinish">
    <div slot="main" v-show="show">
      <div>
        <head-search :lunboData="lunboData"
                     :isServantMain="true"
                     :searchNum="0"
                     :secondWebView="true"
                     @selectCity="onSelectCity"
        ></head-search>
      </div>
      <div id="Advertisement" v-show="showAdv" @click="indexAdvClick()"
      ><img v-if="indexAdvItm" :src="indexAdvItm.imageUrl | imgPrefix" alt="">
        <div class="time" @click.stop="closeAdv($event)" v-if="indexAdvItm">
          跳过{{countDown}}S
        </div>
      </div>
      <div v-if="lunboData && lunboData.length>0" class="carouselBox">
        <mt-swipe class="swipeBox" :style="getLunBoHeight()" :auto="5000"
                  :prevent="false" :stopPropagation="true"
                  :showIndicators="showCricle(lunboData)">
          <mt-swipe-item v-for="it,i in lunboData" :key="i">
            <img :src="it.imageUrl | imgPrefix" @click="showActiveAlert(it)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="pref-list-box">
        <div class="imgText">
          <ul>
            <li @click="goToSecond(1)">
              <img src="../../assets/img/mainImg/quan.png">
              <span>领券中心</span>
            </li>
            <li @click="goToSecond(2)">
              <img src="../../assets/img/mainImg/hai.png">
              <span>吃喝玩乐</span>
            </li>
            <li @click="goToSecond(3)">
              <img src="../../assets/img/mainImg/mai.png">
              <span>附近商超</span>
            </li>
            <li @click="goToSecond(4)">
              <img src="../../assets/img/mainImg/bang.png">
              <span>分类服务</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="blankDiv"></div>
      <div class="active-title" v-if="activeList.length > 0 || showAllBtn" @click="goToComPage()">
        <div class="name"><span></span>&nbsp;&nbsp;首推活动&nbsp;&nbsp;<span></span></div>
        <div class="total">
          <div>查看更多<i class="icon-zyt-arrows-right"></i></div>
        </div>
      </div>

      <div class="activeBox" v-if="activeList.length > 0">
        <!--<div class="active-head" v-if="activeList.length > 0 || showAllBtn">
          <div class="name">首推活动</div>
          <div class="total">
            <div v-if="showAllBtn" @click="goToComPage()">全部 >></div>
          </div>
        </div>-->
        <div v-if="activeList.length > 0" class="index-active row" v-for="item in activeList">
          <div class="col active-item" v-for="innerItem in item"
               :style="activeItemStyle(item.length,innerItem.imageUrl)"
               @click="showActiveAlert(innerItem)">
          </div>
        </div>
      </div>

      <!--<div class="pref-RecommendDiv" v-if="RecommendData.length > 0">
        <i class="icon-zyt-praise"></i>&nbsp;&#45;&#45;优选推荐&#45;&#45;
      </div>-->
      <div class="blankDiv" v-if="RecommendData.length > 0"></div>
      <div class="active-title active-title2" v-if="RecommendData.length > 0">
        <div class="name"><span></span>&nbsp;&nbsp;优选推荐&nbsp;&nbsp;<span></span></div>
      </div>
      <div class="pref-list-box">
        <div>
          <zyt-preferred :secondWebView="true" :doorList='RecommendData' :isLocation="isLocation"
                         :isFilter="true"></zyt-preferred>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import preferred from '@/components/preferred/preferred.component'
  import citySelect from '@/components/citySelect/citySelect.component'
  import allActivityService from '@/service/activity/allActivity.service'
  import preferredService from '@/service/preferred/preferred.service'
  /*  import locationService from '@/service/common/location/location' */
  import headSearch from '@/components/commonSearch/headSearch.component'
  import Util from '@/service/common/utils/util.service'
  import {mainActiveJump} from '@/service/activity/activeJump.service'
  import DistaceService from '@/service/common/distance/distance'
  import {mapState, mapMutations} from 'vuex'
  /* import localStorageService from '@/service/common/localStorage/localStorage.service' */

  export default {
    name: 'servantMain',
    components: {
      'city-select': citySelect,
      'zyt-preferred': preferred,
      'head-search': headSearch
    },
    computed: {
      ...mapState(['selectCity'])
    },
    watch: {
      'selectCity': 'init'
    },
    data() {
      return {
        initHandler: null,
        show: false,
        pageNum: 1,
        RecommendData: [], // 优选推荐数据
        RecommendParams: {
          pageNum: 1,
          pageSize: 20
        },
        RecommenddataFinish: false,
        lunboData: [], // 轮播数据
        activeList: [], // 获取首推活动
        advertisementList: [], // 首屏广告
        isLocation: true, // 是否得成功
        showAllBtn: true, // 是否显示全部按钮
        showAdv: true, // 显示首屏广告
        indexAdvItm: null,
        countDown: -1, // 广告显示时间
        location: {
          province: null,
          city: null,
          country: null,
          street: null,
          latitude: null,
          longitude: null
        } // 定位信息
      }
    },
    methods: {
      ...mapMutations(['SelectCityMutation', 'addExclude', 'removeInclude']),
      async getLocation() { // 获取定位
        /*  let position = await locationService.getLocation().catch(() => {
            this.isLocation = false
            throw new Error('定位失败')
          })
          if (!position) {
            return false
          }
          this.location = position

          let _this = this

          function changeFn() {
            let selectCityParams = {
              province: position.province,
              city: position.city,
              country: null
            }
            localStorageService.setStorage('selectCity', selectCityParams) // 跟新缓存数据
            _this.SelectCityMutation(selectCityParams)
            _this.init()
          }

          if (this.selectCity.province !== position.province || this.selectCity.city !== position.city) {
            this.showConfirm('您当前所在城市为' + this.selectCity.city + '，是否切换到' + position.city + '市？', '切换', '取消', changeFn)
          }
  */
        return true
      },
      async getRecommendList(reset) { // 优选推荐列表获取
        if (reset) {
          this.RecommendParams.pageNum = 1
        }
        let data = await preferredService.getPrefdList({
          pageNum: this.RecommendParams.pageNum,
          pageSize: this.RecommendParams.pageSize,
          proviceName: this.selectCity.province || null,
          cityName: this.selectCity.city || null
        }).catch(() => {
          throw new Error('获取优选推荐列表失败')
        })
        if (data.list.length === 0) {
          this.RecommendData = []
          this.RecommenddataFinish = true
          return
        }
        if (this.RecommendParams.pageNum >= data.page.totalPage) {
          this.RecommenddataFinish = true
          console.log('所有数据加载完毕')
        } else {
          this.RecommenddataFinish = false
        }
        data.list.forEach(item => {
          // 获取两地之间的距离
          if (this.location.latitude && this.location.longitude) {
            let distance = DistaceService.distanceFn(this.location.latitude, item.lattitude, this.location.longitude, item.longitude)
            if (distance >= 1) {
              item.distance = distance.toFixed(1) + 'km'
            } else if (distance < 1 && distance > 0) {
              item.distance = (distance * 1000).toFixed(0) + 'm'
            } else {
              item.distance = -1
            }
          }
        })
        if (reset) {
          this.RecommendData = data.list
        } else {
          this.RecommendData = this.RecommendData.concat(data.list)
        }
        return true
      },
      async loadMore(done) { // 加载更多
        if (this.RecommenddataFinish) {
          done && done(true)
          return
        }
        this.RecommendParams.pageNum++
        await this.getRecommendList(false)
        done && done()
      },
      async getCarouseList() { // 获取轮播
        let data = await preferredService.getCaroucels({
          category: 9,
          proviceName: this.selectCity.province || null,
          cityName: this.selectCity.city || null
        }).catch(() => {
          throw new Error('获取轮播失败')
        })
        if (data.length === 0) {
          this.lunboData = []
          this.lunboData = []
          return
        }
        this.lunboData = data
        return true
      },
      showCricle(lunboData) {
        if (lunboData.length === 1) {
          return false
        } else if (lunboData.length > 0) {
          return true
        }
      },
      async getActiveList() { // 获取首推活动
        let data = await preferredService.getCaroucels({
          category: 15,
          proviceName: this.selectCity.province || null,
          cityName: this.selectCity.city || null
        }).catch(() => {
          throw new Error('获取首推活动失败')
        })
        if (data.length === 0) {
          this.activeList = []
          return
        }

        function reverseData(data) {
          var result = []
          data.reverse()
          let colNum = 3
          if (data.length === 4) {
            colNum = 2
          }
          for (let i = 0; i < data.length; i += colNum) {
            result.unshift(data.slice(i, i + colNum).reverse())
          }
          return result
        }

        this.activeList = reverseData(data)
        return true
      },
      async getFirstAdvertisement() { // 获取首屏广告
        let data = await preferredService.getCaroucels({
          category: 16,
          proviceName: this.selectCity.province || null,
          cityName: this.selectCity.city || null
        }).catch(() => {
          throw new Error('获取首屏广告失败')
        })
        if (data.length === 0) {
          this.showAdv = false
          return
        }
        this.indexAdv(data)
      },
      indexAdv(data) {
        sessionStorage.showAdv = sessionStorage.showAdv || 'false'
        this.indexAdvItm = data[0]
        this.countDown = this.indexAdvItm.showTime
        if (sessionStorage.showAdv === 'true') {
          this.showAdv = false
        } else {
          this.showAdv = true
        }

        var timer = setInterval(() => {
          this.countDown = this.countDown - 1
          if (parseInt(this.countDown) === 0) {
            clearInterval(timer)
            this.showAdv = false
            sessionStorage.showAdv = 'true'
          }
        }, 1000)
      },
      indexAdvClick() {
        this.showActiveAlert(this.indexAdvItm)
      },
      closeAdv(e) {
        e.stopPropagation()
        this.showAdv = false
        sessionStorage.showAdv = 'true'
      },
      async getAllActiveList() { // 获取全部活动
        let data = await allActivityService.getAllActive({pageNum: 1, pageSize: 10}).catch(() => {
          throw new Error('获取全部活动失败')
        })
        if (data.list.length <= 0) {
          this.showAllBtn = false
          return false
        } else {
          this.showAllBtn = true
          return true
        }
        // return true
      },
      goToSecond(item) { // 跳转分类入口
        if (item === 1) {
          this.$router.push({name: 'couponCenter', params: {secondWebView: true}})
        } else if (item === 2) {
          this.$router.push({name: 'goodLife', params: {secondWebView: true}})
        } else if (item === 3) {
          this.$router.push({name: 'selectedGoods', params: {secondWebView: true}})
        } else {
          this.$router.push({name: 'allServiceclassify', params: {secondWebView: true}})
        }
      },
      goToComPage() {
        this.$router.push({name: 'allActivitie', params: {secondWebView: true}})
      },
      showConfirm(message, ok, cancel, okCall, params) {
        Util.confirm({
          message: message,
          confirmButtonText: ok,
          cancelButtonText: cancel,
          showCancelButton: true
        }).then(() => {
          okCall(params)
        }).catch(() => {
        })
      },
      goActInfo(item) { // 跳转活动说明页
        if (item.isUrl === 1) {
          Util.openUrl(item.introduce)
        } else {
          this.$router.push({name: 'activityExplain', params: {activityId: item.id, secondWebView: true}})
        }
      },
      showActiveAlert(item) { // 跳转活动详情
        if (item.startTime && item.endTime) {
          if (item.category === 5) { // 促销活动
            let showConfirm = (year, month, day, hours) => {
              this.showConfirm('感谢您对本次活动的支持，本次活动将于' + year + '年' + month + '月' + day + '日' + hours + '时开始，详情查看活动说明！', '活动说明', '我知道了', this.goActInfo, item)
            }
            let endConfirm = () => {
              Util.confirm('活动已结束！', '', {
                confirmButtonText: '关闭',
                showCancelButton: false
              })
            }
            let startTime = new Date(item.startTime.replace(/-/g, '/')).getTime()
            let endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
            let nowTime = new Date().getTime()

            if ((nowTime > startTime && nowTime < endTime) && item.activityIsDelete === 0) {
              mainActiveJump(item, true)
            } else if ((nowTime < startTime) && item.activityIsDelete === 0) {
              showConfirm(new Date(startTime).getFullYear(), new Date(startTime).getMonth() + 1, new Date(startTime).getDate(), new Date(startTime).getHours())
            } else if (item.activityIsDelete === 1) {
              endConfirm()
            } else {
              endConfirm()
            }
          } else {
            mainActiveJump(item, true)
          }
        } else {
          mainActiveJump(item, true)
        }
      },
      fixedImgHeightFn(num) {
        let width = parseInt(window.screen.width / num)
        if (num === 1) {
          return parseInt(width / 4) + 'px'
        } else if (num === 2) {
          return parseInt(width * 3 / 5) + 'px'
        } else if (num === 3) {
          return parseInt(width) + 'px'
        }
      },
      getLunBoHeight() { // 轮播高度设置
        return {
          width: window.screen.width + 'px',
          height: (window.screen.width * 2 / 5) + 'px'
        }
      },
      async init() {
        if (this.initHandler) {
          return
        }
        this.initHandler = true
        setTimeout(() => {
          this.initHandler = false
        }, 100)
        this.RecommendParams.pageNum = 1
        if (!sessionStorage.showSwitchAlert) {
          /* await this.getLocation().catch(() => {
          }) */
          sessionStorage.showSwitchAlert = true
        }
        await this.getFirstAdvertisement()
        this.getCarouseList()
        // this.getActiveList()
        // this.getAllActiveList()
        // this.getRecommendList()

        await Promise.all([this.getRecommendList(true), this.getActiveList()]).then(() => {
          this.show = true
        }).catch(e => {
          this.show = true
        })
      },
      activeItemStyle(length, img) {
        let url = Util.addImgPrefix(img)
        return {
          'height': this.fixedImgHeightFn(length),
          'background-image': `url('${url}')`
        }
      },
      onSelectCity(data) {
        this.init()
      }
    },
    created() {
      /*   this.init().catch((err) => {
           console.log(err)
         }) */
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type='text/scss'>
  @import "../../assets/css/variables-primary";

  .pref-list-box {
    .imgText {
      background: white;
      ul {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        padding: 0px 10px 10px 10px;
        width: 100%;
        li {
          list-style: none;
          text-align: center;
          margin-top: 10px;
          width: 25%;
          img {
            width: 50%;
            text-align: center;
            vertical-align: middle;
          }
          span {
            font-size: 12px;
            padding: 0 6px;
            display: block;
            margin-top: 4px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }

  .center {
    text-align: center;
  }

  .border-bottom {
    border-bottom: solid 1px map_get($ComColors, 'gray-c');
  }

  .fullLine {
    ion-col > div {
      text-align: center;
      font-size: 12px;
    }
    img {
      font-size: 0;
      width: 55%;
      margin-bottom: map_get($ComSpacing, 'spac4');
    }
  }

  .activeBox {
    .index-active {
      display: -webkit-flex;
      display: flex;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      justify-content: center;
      align-items: center;
      .active-item {
        .active-item-img {
          height: 100%;
        }
      }
    }
    .index-active .active-item {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      width: 100%;

      border-bottom: 1px solid #efefef;
      border-right: 1px solid #efefef;
      &:last-child {
        border-right: 0px solid #efefef;
      }
    }

    .active-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      height: 44px;
      border-bottom: solid 1px map_get($ComColors, 'gray-ef');
      .name {
        width: 100px;
        padding-left: map_get($ComSpacing, 'spac10');
        font-size: 14px;
      }
      .total {
        flex: 1;
        display: flex;
        padding-right: map_get($ComSpacing, 'spac10');
        justify-content: flex-end;
        div {
          color: #2772ad;
          font-size: 14px;
        }
      }
    }

  }

  .pref-RecommendDiv {
    height: 44px;
    background-color: map_get($ComColors, 'gray-ef');
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 20px;
      height: map_get($ComHeight, 'height20');
      font-size: 0px;
    }
    i {
      color: map_get($ComColors, 'wathet-blue');
      font-size: 21px;
      font-weight: bold;
    }
  }

  .carouselBox {
    .swipeBox {
      .mint-swipe-indicators {
        left: 89%;
        display: flex;
        .is-active {
          background: #fff;
          opacity: 1;
        }
        .mint-swipe-indicator {
          background: transparent;
          border-radius: 50%;
          border: 1px solid #fff;
        }
      }
    }
    .mint-swipe {
      text-align: center;

      div.mint-swipe-items-wrap {
        .mint-swipe-item {
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      div.mint-swipe-indicators {
        left: 89%;
        display: flex;
        .mint-swipe-indicator {
          background: transparent;
          border-radius: 50%;
          border: 1px solid #fff;
        }
        .is-active {
          background: #fff;
          opacity: 1;
        }
      }
    }
  }

  #Advertisement {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    img {
      width: 100%;
      height: 100%;
    }
    .time {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 70px;
      height: 30px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;

    }
  }

  .active-title2 {
    height: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active-title {
    padding: 8px 0px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #066cc2;
    border-bottom: solid 1px #d9d9d9;
    .name {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: block;
        width: 20px;
        height: 1px;
        background-color: #202530;
      }
    }
    .total {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #88888d;
      font-weight: normal;
      font-size: 11px;
      i {
        font-size: 12px;
        margin-left: 3px;
      }
    }
  }

</style>
