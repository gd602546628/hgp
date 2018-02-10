<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            :hasHeader="true"
            class="goodSearchPage"
  >
    <div class="header" slot="header">
      <div class="top">
        <div class="headSearch">
          <div class="search-box">
            <div class="search-icon" @click="onSearch()">
              <i class="icon-zyt-search"></i>
              <p class="good-life-search-input" v-if="!params.keyword">搜索</p>
              <p class="good-life-search-input" v-if="params.keyword">{{params.keyword}}</p>
            </div>
          </div>
        </div>
        <servant-sort :sortData="sortData" :useScroll="false" :state="listState" :position="40"
                      :showSwitch="true" @getSort="onSort($event)" @onSwitch="switchState()">
          <!--  <li @click="switchState" class="tab-ul-li">
              </li>-->
        </servant-sort>
      </div>
    </div>
    <div slot="main">
      <div class="prd-content">
        <prd-list :prdListDate="prdList" :state="listState"></prd-list>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import servantSort from '@/components/servantSort/servantSort.component'
  import goodsCategory from '@/components/goodsCategory/goodsCategory.component'
  import prdList from '@/components/product/productList.component'
  import locationService from '@/service/common/location/location'
  import prdService from '@/service/productList/productList.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import Search from '@/service/commonSearch/commonSearch.service'
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: 'selectedGoodSearch',
    components: {
      'servant-sort': servantSort,
      'goods-category': goodsCategory,
      'prd-list': prdList,
      'no-data': noData
    },
    data() {
      return {
        sortData: [
          {
            type: 'normal',
            default: '综合排序',
            defaultValue: -1,
            key: 'sortType',
            content: [
              {
                name: '综合排序',
                value: -1
              },
              {
                name: '销量',
                value: 0
              },
              {
                name: '最近添加',
                value: 1
              }
            ]
          },
          {
            type: 'price',
            default: '价格'
          } /* ,
          {
            type: 'normal',
            default: '全部商品',
            defaultValue: null,
            key: 'prdType',
            content: [
              {
                name: '全部商品',
                value: null
              },
              {
                name: '送货上门',
                value: 0
              },
              {
                name: '到店消费',
                value: 1
              }
            ]
          },
          {
            type: 'location',
            default: '全部商家',
            defaultValue: false,
            key: 'isLocal',
            content: [
              {
                name: '全部商家',
                value: false,
                check: false
              },
              {
                name: '本地商家',
                value: true,
                check: true
              }
            ]
          } */
        ],
        prdList: [],
        params: {
          keyword: null,
          doorCateId: ['13285', '13286', '13619'],
          pageNum: 1,
          pageSize: 20,
          prdType: 1,
          sortType: -1
        },
        dataFinish: true,
        pageFlag: true,
        noData: false,
        listState: 1
      }
    },
    computed: {
      ...mapState(['showSearch', 'selectCity'])
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      switchState() {
        this.listState = this.listState === 1 ? 2 : 1
      },
      async onSort(data) {
        this.noData = false
        this.dataFinish = false
        this.pageFlag = true
        this.params.pageNum = 1
        this.params.sortType = data.sortType
        // this.params.prdType = data.prdType
        this.params.highPrice = data.highPrice
        this.params.lowPrice = data.lowPrice
        if (data.isLocal) {
          await this.getLocation().catch(() => {
          })
        } else {
          this.params.city = null
          this.params.country = null
        }
        this.getPrdList(true)
      },
      async getLocation() {
        let location = this.selectCity
        if (!location.city) {
          location = await locationService.getLocation().catch(() => {
            throw new Error(false)
          })
        }
        this.params.city = location.city
        this.params.country = location.country || null
        return true
      },
      async getPrdList(reset) {
        if (!this.selectCity || !this.selectCity.city) {
          return
        }
        this.params.city = this.selectCity.city
        this.params.country = this.selectCity.country || null
        this.params.keyword = this.$route.params.keyword
        if (parseInt(this.$route.params.num) === 1) {
          this.params.doorCateId = ['13285', '13286', '13530', '13619']
        } else {
          this.params.doorCateId = ['13285', '13286', '13619']
        }
        let data = await prdService.prdSearchList(this.params, {showLoading: true}).catch(() => {
          throw new Error('回去商品搜索失败')
        })
        if (data.list.length === 0 && this.params.pageNum === 1) {
          this.noData = true
          this.prdList = []
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.prdList = data.list
        } else {
          this.prdList = this.prdList.concat(data.list)
        }
        return true
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getPrdList(false)
        done && done()
      },
      async init() {
        this.prdList = []
        this.dataFinish = true
        this.pageFlag = true
        this.noData = false
        setTimeout(() => {
          if (this.showSearch) {
            this.onSearch()
          }
          this.showSearchMutation(false)
        }, 10)
        /* await this.getLocation().catch(() => {
         }) */
        await this.getPrdList(true)
      },
      onSearch() {
        Search(false, 2).then(keyWord => {
          this.$router.replace({
            name: 'selectedGoodSearch',
            params: {keyword: keyWord.keyword || null, num: this.$route.params.num}
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.init().catch((err) => {
        console.log(err)
      })
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'selectedGoodSearch') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
            if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import '../../assets/css/variables-primary.scss';

  .top {
    background-color: white;
    z-index: 2;
    width: 100%;
    .headSearch {
      z-index: 99;
      position: relative;
      height: 50px;
      background-color: #f5f5f9;
      .search-box {
        height: 34px;
        position: absolute;
        display: flex;
        width: 94%;
        z-index: 2;
        top: 8px;
        margin: 0 3% 0 3%;
        background-color: white;
        font-size: 13px;
        border-radius: 3px;
        .search-icon {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-start;
          i {
            font-size: 20px;
            padding: 0;
            margin-left: 10px;
            margin-right: 10px;
            color: #b0b0b0;
          }
          p {
            height: 35px;
            line-height: 35px;
            margin: 0;
            color: #88888d;
          }
        }
      }

    }
  }

  .prd-content {
    margin-top: 47px;
  }

  .tab-ul-li {
    position: relative;
    max-width: 50px;
    justify-content: flex-end !important;
    padding-right: 10px;
    &:after {
      position: absolute;
      content: '';
      display: block;
      height: 26px;
      top: 7px;
      left: 10px;
      width: 1px;
      background-color: map_get($ComBorderColor, dd);
    }
    i {
      font-size: 20px;
    }
  }
</style>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .goodSearchPage {
    ._header {
      left: 0px;
      top: 0px !important;
      position: absolute !important;
      height: 87px !important;
      z-index: 11;
    }
  }
</style>
