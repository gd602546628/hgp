<template>
  <zyt-page :hasHeader="true" class="good-life-category-page">
    <div class="top" slot="header">
      <div class="search" @click="onSearch()">
        <div class="wrap">
          <i class="icon-zyt-search"></i>
          <p>搜索</p>
        </div>
      </div>
      <servant-sort :sortData="sortData" :useScroll="false" @getSort="onSort($event)" :position="46"></servant-sort>
    </div>
    <div slot="main" class="good-life-category">
      <div class="door-list">
        <door :doorList="doorList"></door>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import door from '@/components/preferred/preferred.component'
  import locationService from '@/service/common/location/location'
  import preferredService from '@/service/preferred/preferred.service'
  import {mapState} from 'vuex'
  import noData from '@/components/noDataMark/noDataMark.component'
  import Search from '@/service/commonSearch/commonSearch.service'
  export default{
    name: 'goodLifeCategory',
    components: {
      'servant-sort': servantSort,
      'door': door,
      'no-data': noData
    },
    data(){
      return {
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
        level: 1,
        params: {
          'pageSize': 20,
          'pageNum': 1,
          'sortType': -1,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'city': null,
          'country': null,
          'province': null,
          'doorCateId': ['13530']
        },
        doorList: [],
        dataFinish: false,
        noData: false
      }
    },
    computed: {
      ...mapState(['selectCity'])
    },
    created(){
      this.init()
    },
    /* watch: {
     '$route': 'init'
     }, */
    methods: {
      init(){
        console.info('$routechange')
        if (parseInt(this.$route.params.level) === 1) {
          this.params.fcId = this.$route.params.id
        } else if (parseInt(this.$route.params.level) === 2) {
          this.params.scId = this.$route.params.id
        } else {
          return
        }
        this.params.province = this.selectCity.province
        this.params.city = this.selectCity.city
        this.params.country = this.selectCity.country
        this.getLocation().then(() => {
          this.getDoorList(true)
        })
      },
      async getDoorList(reset){
        this.dataFinish = false
        let data = await preferredService.searchDoor(this.params, {showLoading: true})
        if (data.list.length === 0) {
          this.dataFinish = true
          this.doorList = []
          this.noData = true
          console.log('没有数据')
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          console.log('所有数据加载完毕')
        }
        if (reset) {
          this.doorList = data.list
        } else {
          this.doorList = this.doorList.concat(data.list)
        }
      },
      async onSort(sort){
        this.params.pageNum = 1
        this.params.sortType = sort.sortType
        this.params.position.distance = sort.distance
        if (this.params.position.longitude === null) {
          await this.getLocation()
        }
        this.getDoorList(true)
      },
      async getLocation(){
        let position = await locationService.getLocation().catch(() => {
          throw new Error(false)
        })
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      onSearch(){
        Search(false, 4).then(keyWord => {
          this.$router.push({
            name: 'goodLifeSearch',
            params: {keyword: keyWord.keyword || null, num: 0}
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .good-life-category {
    .door-list {
      // margin-top: 87px;
      margin-top: 40px;
    }
  }
  .top {
    // position: fixed;
    z-index: 10;
    width: 100%;
    //top: 0;
    .search {
      padding: 6px 10px;
      background: #f2f2f2;

      .wrap {
        display: flex;
        background: #ffffff;
        height: 34px;
        border-radius: 4px;
        align-items: center;
        color: #88888d;

        i {
          font-size: 20px;
          margin: 0 10px;
        }

        p {
          font-size: 14px;
        }

      }
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss">
  .good-life-category-page {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 81px !important;
      z-index: 11;
    }
  }
</style>
