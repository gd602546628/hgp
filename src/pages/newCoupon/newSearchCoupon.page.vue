<script src="../../config/config.js"></script>
<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div slot="main">
      <div class="top-wrap">
        <div class="top">
          <div class="search" @click="openSearchModal()">
            <i class="icon-zyt-search"></i>
            <p>{{keyword || '搜索优惠'}}</p>
          </div>
          <div class="my-coupon" @click="goMyCoupon()" v-if="!!!keyword">
            <i class="icon-zyt-new-coupon"></i>
            <p>我的券</p>
          </div>
          <div class="cancel" v-if="keyword" @click="goBack()">
            取消
          </div>
        </div>
        <servant-sort :sortData="sortData"
                      :useScroll="false"
                      :position="50"
                      @getSort="onSort($event)"
                      v-if="showServantSort"
        ></servant-sort>
      </div>
      <div class="coupon-list">
        <coupon :couponList="couponList"></coupon>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>
<script>
  import Search from '@/service/commonSearch/commonSearch.service'
  import {mapMutations, mapState} from 'vuex'
  // import coupon from '@/pages/newCoupon/newCoupon.component'
  import coupon from '@/components/coupon/coupon.component'
  import locationService from '@/service/common/location/location'
  import couponService from '@/service/coupon/coupon.service'
  import servantSort from '@/components/servantSort/servantSort.component'
  import noData from '@/components/noDataMark/noDataMark.component'
  import cy from '../../assets/img/newCoupon/cy.png'
  import dq from '../../assets/img/newCoupon/dq.png'
  import jc from '../../assets/img/newCoupon/jc.png'
  import jd from '../../assets/img/newCoupon/jd.png'
  import jj from '../../assets/img/newCoupon/jj.png'
  import jy from '../../assets/img/newCoupon/jy.png'
  import mj from '../../assets/img/newCoupon/mj.png'
  import ms from '../../assets/img/newCoupon/ms.png'
  import my from '../../assets/img/newCoupon/my.png'
  import mz from '../../assets/img/newCoupon/mz.png'
  import nz from '../../assets/img/newCoupon/nz.png'
  import qcfw from '../../assets/img/newCoupon/qcfw.png'
  import qcyp from '../../assets/img/newCoupon/qcyp.png'
  import xh from '../../assets/img/newCoupon/xh.png'
  import yl from '../../assets/img/newCoupon/yl.png'
  import yy from '../../assets/img/newCoupon/yy.png'
  import zb from '../../assets/img/newCoupon/zb.png'
  import computer from '../../assets/img/newCoupon/computer.png'

  export default {
    name: 'newSearchCoupon',
    components: {
      'no-data': noData,
      'coupon': coupon,
      'servant-sort': servantSort
    },
    data() {
      return {
        keyword: '',
        sortData: [
          {
            type: 'normal',
            default: '全部',
            defaultValue: null,
            key: 'fcName',
            content: [{
              name: '全部',
              value: null
            }]
          },
          {
            type: 'location',
            default: '离我最近',
            defaultValue: 0,
            key: 'sortType',
            content: [
              {
                name: '离我最近',
                value: 0,
                check: true
              },
              {
                name: '面额最高',
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
        category: [
          [{fcName: '美食', img: ms}, {fcName: '休闲娱乐', img: yl}, {fcName: '丽人美妆', img: mz}, {
            fcName: '茶/冲饮',
            img: cy
          }, {fcName: '汽车服务', img: qcfw}, {fcName: '教育培训', img: jy}, {fcName: '酒店', img: jd}, {
            fcName: '母婴用品',
            img: my
          }, {fcName: '医药保健', img: yy}, {fcName: '家居家纺', img: jj}], [{
            fcName: '汽车用品',
            img: qcyp
          }, {fcName: '珠宝配饰', img: zb}, {fcName: '家用电器', img: dq}, {fcName: '衣物洗护', img: xh}, {
            fcName: '女装',
            img: nz
          }, {fcName: '家电办公', img: computer}, {fcName: '建筑建材', img: jc}, {fcName: '美酒佳酿', img: mj}]
        ],
        couponList: [],
        params: {
          'pageNum': 1,
          'pageSize': 20,
          'doorCateName': null,
          'fcName': null,
          'position': {'distance': null, 'latitude': null, 'longitude': null},
          'sortType': 0,
          'city': '玉溪市',
          'country': null,
          'couponType': 1,
          'keyword': ''
        },
        dataFinish: false,
        noData: false,
        showServantSort: false,
        pageFlag: false
      }
    },
    computed: {
      ...mapState(['showSearch', 'selectCity'])
    },
    created() {
      this.category.forEach(out => {
        out.forEach(item => {
          let result = {
            value: item.fcName,
            name: item.fcName
          }
          this.sortData[0].content.push(result)
        })
      })
      this.init()
    },
    watch: {
      '$route': {
        handler() {
          if (this.$route.name !== 'newSearchCoupon') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
            if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      async init() {
        this.showServantSort = false
        this.params.pageNum = 1
        this.noData = false
        this.couponList = []
        await this.getLocation().then((position) => {
          this.params.sortType = 0
          this.sortData[1].default = '离我最近'
          this.sortData[1].defaultValue = 0
          this.params.position.latitude = position.latitude
          this.params.position.longitude = position.longitude
        }).catch(() => {
          this.sortData[1].default = '面额最高'
          this.sortData[1].defaultValue = 1
          this.params.sortType = 1
        })
        this.keyword = this.$route.params.keyword
        // 分类为全部时，路由参数是null,因为路由的两个keyword和fcName参数都是可选的
        this.params.fcName = this.$route.params.fcName === 'null' ? null : this.$route.params.fcName
        this.params.keyword = this.$route.params.keyword || ''
        this.sortData[0].default = this.params.fcName || '全部'
        this.sortData[0].defaultValue = this.params.fcName || null
        this.showServantSort = true
        if (this.params.fcName === '建筑建材') {
          this.params.fcName = '建筑、建材'
        }
        // vuex中showSearch为true,默认打开搜索框
        setTimeout(() => {
          if (this.showSearch) {
            this.openSearchModal()
          }
          this.showSearchMutation(false)
        }, 10)
        /* await this.getLocation().catch(() => {
         }) */
        await this.getCouponList(true)
      },
      onSort(category) {
        if (category.fcName === '建筑建材') {
          this.params.fcName = '建筑、建材'
        } else {
          this.params.fcName = category.fcName
        }
        this.params.sortType = category.sortType
        this.params.position.distance = category.distance
        this.params.pageNum = 1
        this.dataFinish = false
        this.getCouponList(true)
      },
      async getLocation() {
        let position = this.selectCity
        if (!position.latitude) {
          position = await locationService.getLocation().catch(() => {
            this.params.position.latitude = null
            this.params.position.longitude = null
            throw new Error(false)
          })
        }
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      async getCouponList(reset) {
        this.noData = false
        this.dataFinish = true
        let data = await couponService.searchCoupon(this.params, {showLoading: true})
        if (data.list.length === 0) {
          this.dataFinish = true
          this.couponList = []
          this.noData = true
          console.log('没有数据')
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum === data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.pageFlag = false
          this.dataFinish = false
        }
        if (reset) {
          this.couponList = data.list
        } else {
          this.couponList = this.couponList.concat(data.list)
        }
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        console.log('loadMore')
        await this.getCouponList(false)
        done && done()
      },
      openSearchModal() {
        Search(false, 5).then(keyword => {
          this.keyword = keyword.keyword
          this.$router.replace({
            name: 'newSearchCoupon',
            params: {
              fcName: this.$route.params.fcName || null,
              keyword: keyword.keyword || null
            }
          })
        }).catch(() => {
        })
      },
      goMyCoupon() {
        this.$router.push({name: 'newMyCoupon'})
      },
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .top-wrap {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 5;
  }

  .top {
    height: 50px;
    background: #f5f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border-bottom: 1px solid #d9d9d9;
    .search {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      background: #ffffff;
      height: 30px;
      flex: 1;
      color: #9e9d9d;
      i {
        margin-left: 10px;
        font-size: 20px;
      }
      p {
        margin-left: 10px;
      }
    }
    .my-coupon {
      color: #3d3e3e;
      margin-left: 10px;
      height: 30px;
      text-align: center;
      i {
        font-size: 26px;
      }
      p {
        margin-top: -4px;
        font-size: 12px;
      }
    }
    .cancel {
      margin-left: 10px;
    }
  }

  .coupon-list {
    padding-top: 10px;
    margin-top: 90px;
    background: #f4f4f4;
  }
</style>
