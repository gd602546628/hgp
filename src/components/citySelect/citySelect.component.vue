<template>
  <div class="wrap">
    <div class="selected" @click="openPop()">
      <div>{{selectCity.country || selectCity.city}}</div>
      <i class="icon-zyt-arrows-down"></i>
    </div>
    <mt-popup v-model="popupVisible" :position="'right'" class="city-select" :modal="false">
      <div class="header">
        <div class="top">
          <p>定位城市</p>
          <i class="icon-zyt-close close" @click="closePop()"></i>
        </div>
        <div class="reLocation" @click="setLocationCity()">{{locationCity.city}}</div>
      </div>
      <div class="content">
        <div class="content-top">城市选择</div>
        <ul class="content-tab">
          <li :class="{active:currentArea==1}" @click="tabClick(1)">{{tabName.province}}</li>
          <li :class="{active:currentArea==2}" @click="tabClick(2)">{{tabName.city}}</li>
          <li :class="{active:currentArea==3}" @click="tabClick(3)">{{tabName.country}}</li>
        </ul>
        <div class="content-city">
          <ul v-show="currentArea==1">
            <li v-for="item in province" @click="getOtherArea(2,item)">{{item.name}}</li>
          </ul>
          <ul v-show="currentArea==2">
            <li v-for="item in city" @click="getOtherArea(3,item)">{{item.name}}</li>
          </ul>
          <ul v-show="currentArea==3">
            <li v-for="item in country" @click="getSelect(item)">{{item.name}}</li>
            <li @click="getSelect()">不限</li>
          </ul>
        </div>
      </div>
    </mt-popup>
    <div class="join-pop" v-show="popupJoinVisible">
      <img class="wushuju-img" src="../../assets/img/wushuju.png" alt="">
      <p class="desc">您所在的城市暂时没有数据，帮您切换到示范城市玉溪市体验完整功能</p>
      <button class="common-btn" @click="setDefaultCity()">我知道了</button>
      <button class="common-btn join-btn" @click="showJoinAlert()">成为本市代理商</button>
    </div>
  </div>
</template>
<script>
  import getArea from '@/service/getArea/getArea.service'
  import Location from '@/service/common/location/location'
  import {mapState, mapMutations} from 'vuex'
  import native from '@/service/common/native/native.service'
  import Util from '@/service/common/utils/util.service'
  import LocalStorageService from '@/service/common/localStorage/localStorage.service'

  export default {
    data() {
      return {
        appSelected: false,
        popupJoinVisible: false,
        popupVisible: false,
        province: [],
        city: [],
        country: [],
        tabCn: '请选择',
        currentArea: 1, // 当前区域，1省，2市，3县区
        defaultCity: Location.defaultCity, // 默认城市
        tabName: {
          province: '请选择',
          city: '请选择',
          country: '请选择'
        },
        currentCity: {
          province: null,
          city: null,
          country: null
        },
        locationCity: {
          province: null,
          city: '定位中',
          country: null
        },
        openCities: [],
        userSelectCity: {}
      }
    },
    props: {
      hasLocationTip: {
        type: Boolean,
        default: true
      },
      hasOpenCityTip: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState(['selectCity'])
    },
    created() {
      this.init()
    },
    watch: {
      '$route': {
        handler() {
          if (this.popupJoinVisible) {
            this.popupJoinVisible = false
            this.setDefaultCity()
          }
        }
      }
    },
    destroyed() {
    },
    methods: {
      ...mapMutations(['SelectCityMutation']),
      async init() {
        // 获取省份
        getArea.getFirstArea({}).then(data => {
          this.province = data.data
        })
        // 获取老的定位，如果没有老的定位，就返回最新的定位
        let data = await Promise.all([Location.getOldLocation(), this.getOpenCityList()])
        let oldLocation = data[0]
        if (oldLocation) {
          // 获取app 切换的城市
          if (native.isApp()) {
            let city = await native.todoNative('common_native', 'switchCity', {showSwitchCity: '0'}).catch((e) => {
              this.popupJoinVisible = false
            })
            if (city) {
              city.country = city.country || city.county || null
              if (city.rank !== -1) {
                this.appSelected = true
              } else {
                city.country = null
              }
            }
            oldLocation = Object.assign({}, oldLocation, city)
          }
          this.currentCity = oldLocation
          this.SelectCityMutation(this.currentCity)
          this.$emit('getSelectCity', this.currentCity)
        }
        if (this.hasOpenCityTip && !this.isOpenCity(this.currentCity, data[1])) {
          this.popupJoinVisible = true
        }
//        获取定位校验上一次的城市
        this.checkLocation()
      },
      async setDefaultCity() {
        if (native.isApp()) {
          await native.todoNative('common_native', 'switchCity', {showSwitchCity: '2'}).catch((e) => {
            this.popupJoinVisible = false
          })
        }
        this.switchCity(this.defaultCity)
        this.popupJoinVisible = false
      },
      async openPop() {
        if (native.isApp()) {
          let data = await native.todoNative('common_native', 'switchCity', {showSwitchCity: '1'}).catch((e) => {
            this.popupVisible = true
          })
          if (data) {
            data.country = data.country || data.county
          }
          this.switchCity(data)
        } else {
          this.popupVisible = true
        }
      },
      async checkLocation() {
        // 获取最新的城市
        this.locationCity = await Location.getLocation().catch(e => {
          Util.alert('定位失败')
          this.locationCity.city = '定位失败'
        })
        let flag = this.locationCity && this.locationCity.city
        flag = flag && (this.currentCity.country || this.currentCity.city) !== this.locationCity.city
        flag = flag && this.hasLocationTip && !this.popupJoinVisible
        if (native.isApp()) {
          // flag = flag && !this.appSelected
          flag = false
        }
        //  第一次进入的时候才弹框
        let fistEnter = LocalStorageService.getMemory('fistEnter')
        flag = flag && !(fistEnter && fistEnter.cityTip)
        LocalStorageService.setMemory('fistEnter', {
          cityTip: true
        })
        //        第一次进入的时候才弹框
        if (this.currentCity.country && this.locationCity.county) {
          flag = flag && this.currentCity.country !== this.locationCity.county
        }
        if (flag) {
          this.showSwitch(this.locationCity)
        } else {
        }
      },
      closePop() {
        this.popupVisible = false
      },
      tabClick(type) {
        this.currentArea = type
      },
      isOpenCity(city, openCities) {
        if (city && openCities && openCities.length) {
          for (let i = 0; i < openCities.length; i++) {
            let openProvince = openCities[i].province
            let openCity = openCities[i].city
            if (openProvince === city.province && openCity === city.city) {
              return true
            }
          }
        }
        return false
      },
      async getOpenCityList() { // 获取开放城市
        let data = await getArea.getOpenCityList({}).catch(() => {
          throw new Error('getOpenCityList接口调用失败')
        })
        if (!data || data.code !== '000000') {
          throw new Error('getOpenCityList接口调用失败')
        }
        this.openCities = data.data.openCities
        return this.openCities
      },
      getOtherArea(type, item) {
        getArea.getOtherArea({
          type: type,
          id: item.id
        }).then(data => {
          if (type === 2) {
            this.tabName.province = item.name
            this.tabName.city = this.tabCn
            this.tabName.country = this.tabCn
            this.currentArea = 2
            this.city = data.data
            this.country = []
            this.userSelectCity.province = item.name
            // this.selectCity.province = item.name
          } else if (type === 3) {
            this.tabName.city = item.name
            this.currentArea = 3
            this.country = data.data
            this.tabName.country = this.tabCn
            // this.selectCity.city = item.name
            this.userSelectCity.city = item.name
          }
        })
      },
      async getSelect(country) {
        if (country) {
          this.userSelectCity.country = country.name
          // this.selectCity.country = country.name
          this.currentArea = 3
          this.tabName.country = country.name
        } else {
          this.userSelectCity.country = null
          // this.selectCity.country = null
          this.currentArea = 2
          this.tabName.country = this.tabCn
        }
        this.userSelectCity = Object.assign({}, this.currentCity, this.locationCity, this.userSelectCity)
        this.switchCity(this.userSelectCity)
      },
      switchCity(city) {
        city = Object.assign({}, this.currentCity, this.locationCity, city)
        Location.setLocationInfo(city)
        this.currentCity = city
        this.SelectCityMutation(city) // 跟新store，让所有用到这个状态的组件更新
        this.closePop()
        this.$emit('getSelectCity', city) // 派发事件
        if (this.hasOpenCityTip && !this.isOpenCity(city, this.openCities)) {
          this.popupJoinVisible = true
        } else {
          this.popupJoinVisible = false
        }
      },
      setLocationCity() {
        if (!this.locationCity || !this.locationCity.city || this.locationCity.city === '定位中') {
          return
        }
        this.switchCity(this.locationCity)
      },
      async showSwitch(city) {
//        设置一个城市之提示一次
        await Util.confirm({
          message: `您当前所在的城市为${this.locationCity.city},是否切换到${this.locationCity.city}`,
          confirmButtonText: '切换',
          cancelButtonText: '取消',
          showCancelButton: true
        }).catch(() => {
          throw String('取消切换')
        })
        this.switchCity(city)
        await native.todoNative('common_native', 'switchCity', {showSwitchCity: '3'}).catch((e) => {
          this.popupJoinVisible = false
        })
      },
      showJoinAlert() {
        Util.alert({
          message: '<p class="join-tip">代理商加盟电话</p><p class="join-a"><a href="tel:4001591615">400-159-1615</a></p>',
          confirmButtonText: '关闭'
        })
      }
      /* showConfirm() {
       Util.confirm({
       message: '您所在的城市暂时没有数据，帮你切换到示范城市体验完整功能',
       confirmButtonText: '成为本市代理商',
       cancelButtonText: '我知道了',
       showCancelButton: true
       }).then(() => {
       this.$router.push({name: 'noDataOpenCity'})
       }).catch(() => {
       this.reLocation()
       // this.$router.push({name: 'servantMain'})
       })
       } */
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  @import '../../assets/css/variables-primary.scss';

  .wrap {
    width: 100%;
    .selected {
      display: flex;
      border-right: 1px solid #ffffff;
      width: 100%;
      padding: 0 6px;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
      i {
        display: flex;
        font-size: 10px;
        align-items: center;
      }
    }
    .city-select {
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      .header {
        padding-left: 16px;
        color: #88888d;
        width: 100%;
        .top {
          display: flex;
          font-size: 16px;
          margin-top: 20px;
          margin-bottom: 0;
          position: relative;
          p {
            flex: 1;
          }
          .close {
            font-size: 24px;
            margin-right: 20px;
          }
        }
        .reLocation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 34px;
          width: 100px;
          background: #efefef;
          color: #0164a6;
          border-radius: 4px;
          margin-top: 14px;
          margin-bottom: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 0 4px 0 4px;
          font-size: 14px;
        }
      }
      .content {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        .content-top {
          font-size: 16px;
          color: #88888d;
          margin: 30px 0 0 16px;
        }
        .content-tab {
          display: flex;
          height: 60px;
          padding-top: 6px;
          background: #eeeeee;
          margin-top: 20px;
          color: #5f666c;
          li {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            &.active {
              color: #0164a6;
              background: #ffffff;
            }
          }
        }
        .content-city {
          flex: 1;
          overflow: scroll;
          ul {
            li {
              width: 25%;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              height: 70px;
              line-height: 70px;
              text-align: center;
              color: #696f74;
              font-size: 14px;
              padding: 0 4px;
            }
          }
        }
      }
    }
  }

  .join-pop {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: white;
    .wushuju-img {
      width: 70%;
      height: auto;
      margin-top: 50px;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
    .desc {
      line-height: 25px;
      font-size: 16px;
      color: #aaaaaa;
      text-align: center;
      width: 70%;
      margin: 0 auto;
      word-break: break-all;
      display: -webkit-box;
      /* -webkit-line-clamp: 2; */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .common-btn {
      border-radius: 2px;
      background-color: #e6f3f9;
      display: block;
      height: 40px;
      width: 150px;
      margin: 20px auto;
      color: #0c6aa9;
      &.join-btn {
        background-color: #0164a6;
        color: white;
        margin-bottom: 60px;
      }
    }
  }
</style>
<style lang='scss' rel='stylesheet/scss'>
  .join-a {
    margin-top: 10px;
    font-size: 22px;
    a {
      text-decoration: none;
    }
  }

  .join-tip {
    padding-left: 9px;
    text-align: left;
  }

</style>
