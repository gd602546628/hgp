<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div class="goodLife" slot="main" v-show="show">
      <div class="top" :class="{active:carouselList&&carouselList.length<=0}">
        <div class="top-wrap">
          <city-select class="city-select" @getSelectCity="onSelectCity($event)"></city-select>
          <div class="search" @click="onSearch()">
            <i class="icon-zyt-search"></i>
            <p>点击搜索</p>
          </div>
        </div>
      </div>
      <div class="carousel" v-if="carouselList&&carouselList.length>0">
        <mt-swipe :showIndicators="carouselList.length === 1?false:true">
          <mt-swipe-item v-for="carouse in carouselList" :key="carouse.id">
            <img :src="imgPre+carouse.imageUrl" class="carouse-img" @click="showActiveAlert(carouse)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="category" v-if="categoryList && categoryList.length>0">
        <ul class="category-ul">
          <li v-for="category in categoryList" class="category-li" @click="goLifeCategory(category)">
            <img :src="imgUrl+category.imgUrl">
            <p>{{category.name}}</p>
          </li>
          <li class="category-li" @click="goAllCategory()" v-if="categoryList">
            <img :src="imgUrl+'resource/serviceType/qb.png'">
            <p>全部</p>
          </li>
        </ul>
      </div>
      <div class="good-life-sort" style="height: 8px;background: #efefef"></div>
      <servant-sort :sortData="sortData"
                    :scrollPosition="scrollPosition"
                    @getSort="onSort($event)"
                    ref="servantSort"
      ></servant-sort>
      <div class="doorList"
           v-if="!noData">
        <door :doorList="doorList" :showMoreData="true"></door>
      </div>
      <no-data v-if="noData" :isGoodLife="true"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import citySelect from '@/components/citySelect/citySelect.component'
  import preferredService from '@/service/preferred/preferred.service'
  import {Config} from '@/config/config'
  import servantSort from '@/components/servantSort/servantSort.component'
  import door from '@/components/preferred/preferred.component'
  import locationService from '@/service/common/location/location'
  import {mapMutations} from 'vuex'
  import {mainActiveJump} from '@/service/activity/activeJump.service'
  import Util from '@/service/common/utils/util.service'
  import noData from '@/components/noDataMark/noDataMark.component'

  export default {
    name: 'goodLife',
    components: {
      'city-select': citySelect,
      'servant-sort': servantSort,
      'door': door,
      'no-data': noData
    },
    created() {
      preferredService.getCategory({id: 13530}).then(data => {
        if (!data) {
          return
        }
        if (data.length >= 9) {
          data.length = 9
        }
        this.categoryList = data
      })
    },
    data() {
      return {
        show: false,
        sortData: [
          {
            type: 'location',
            default: '综合排序',
            defaultValue: -1,
            key: 'sortType',
            content: [
              {
                name: '综合排序',
                value: -1,
                check: false
              },
              {
                name: '离我最近',
                value: 0,
                check: true
              },
              {
                name: '评分最高',
                value: 1,
                check: false
              }
            ]
          },
          {
            type: 'location',
            default: '全城',
            defaultValue: null,
            key: 'distance',
            content: [
              {
                name: '1千米',
                value: 1000,
                check: true
              },
              {
                name: '3千米',
                value: 3000,
                check: true
              },
              {
                name: '5千米',
                value: 5000,
                check: true
              },
              {
                name: '10千米',
                value: 10000,
                check: true
              },
              {
                name: '全城',
                value: null,
                check: false
              }
            ]
          }
        ],
        carouselList: [],
        categoryList: [],
        doorList: [],
        imgUrl: Config.imgUrl,
        imgPre: Config.imgPrefix,
        carouseHeight: 0,
        scrollPositionDefault: 352,
        scrollPosition: 352,
        dataFinish: false,
        noData: false,
        params: {
          'pageSize': 20,
          'pageNum': 1,
          'sortType': -1,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'doorCateId': ['13530'],
          'city': null,
          'country': null,
          'province': null
        }
      }
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      async getDoorList(reset) {
        this.dataFinish = false
        let data = await preferredService.searchDoor(this.params)
        this.show = true
        if (!data || !data.list || data.list.length === 0) {
          this.dataFinish = true
          this.noData = true
          this.show = true
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
        }
        if (reset) {
          this.doorList = data.list
        } else {
          this.doorList = this.doorList.concat(data.list)
        }
      },
      async getLocation() {
        let position = await locationService.getLocation(true).catch(() => {
          return null
        })
        return position
        /*   let position = await locationService.getLocation().catch(() => {
         throw new Error(false)
         })
         this.params.position.latitude = position.latitude
         this.params.position.longitude = position.longitude
         return true */
      },
      async onSort(sort) {
        this.params.pageNum = 1
        this.params.sortType = sort.sortType
        this.params.position.distance = sort.distance
        if (this.params.position.longitude === null) {
          await this.getLocation()
        }
        this.getDoorList(true)
      },
      async onSelectCity(data) {
        let position = data
        if (!position.longitude) {
          position = await this.getLocation()
        }
        if (position) {
          this.params.position.latitude = position.latitude
          this.params.position.longitude = position.longitude
          this.params.pageNum = 1
          this.params.city = position.city
          this.params.province = position.province
          this.params.country = position.country
          this.getCaroucels()
          this.getDoorList(true)
        }
      },
      async getCaroucels() {
        await preferredService.getCaroucels({
          category: 8,
          cityName: this.params.city,
          provinceName: this.params.province
        }).then(data => {
          if (data.length === 0) {
            this.scrollPosition = this.scrollPositionDefault - 150
          }
          this.carouselList = data
        })
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
              mainActiveJump(item)
            } else if ((nowTime < startTime) && item.activityIsDelete === 0) {
              showConfirm(new Date(startTime).getFullYear(), new Date(startTime).getMonth() + 1, new Date(startTime).getDate(), new Date(startTime).getHours())
            } else if (item.activityIsDelete === 1) {
              endConfirm()
            } else {
              endConfirm()
            }
          } else {
            mainActiveJump(item)
          }
        } else {
          mainActiveJump(item)
        }
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
          this.$router.push({name: 'activityExplain', params: {activityId: item.id}})
        }
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getDoorList(false)
        done && done()
      },
      goLifeCategory(item) {
        this.$router.push({
          name: 'goodLifeCategory',
          params: {
            level: 1,
            id: item.id
          }
        })
      },
      goAllCategory() {
        this.$router.push({
          name: 'goodLifeCategoryList'
        })
      },
      onSearch() {
        this.showSearchMutation(true)
        this.$router.push({
          name: 'goodLifeSearch',
          params: {keyword: null, num: 0}
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .goodLife {

    .top {
      height: 50px;
      display: flex;
      align-items: center;
      width: 100%;
      top: 0;
      z-index: 10;

      &.active {
        background-color: #f5f5f9;
      }
      .top-wrap {
        display: flex;
        align-items: center;
        height: 35px;
        margin: 0 3%;
        width: 100%;
        background: #ffffff;

        .city-select {
          color: #88888d;
          width: 80px;
          font-size: 14px;
        }

        .search {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #88888d;
          border-left: 1px solid #e1e1e1;

          i {
            font-size: 20px;
          }

          p {
            font-size: 14px;
            margin-left: 6px;
          }

        }
      }
    }
    .carousel {
      height: 150px;

      .carouse-img {
        width: 100%;
        height: 100%;
      }

    }
    .category {
      margin-top: 10px;

      .category-ul {
        display: flex;
        -webkit-flex-wrap: wrap;
        display: -webkit-flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: 100%;

        .category-li {
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          -webkit-flex-direction: column;
          align-items: center;
          -webkit-align-items: center;
          justify-content: center;
          -webkit-justify-content: center;
          width: 20%;
          margin-bottom: 14px;

          img {
            width: 50%;
            display: block;
          }

          p {
            font-size: 12px;
            color: #343434;
            margin-top: 4px;
          }

        }
      }
    }
  }
</style>
