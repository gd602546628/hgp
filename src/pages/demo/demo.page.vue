<template>
  <zyt-page :hasHeader="true">
    <div slot="header">header</div>
    <div slot="main" ref="scrollWrap">
      <h1>demo页</h1>
      <!-- <p @click="mutationTest('mutation触发,数据改变更新视图')">mutationTest测试</p>
       <p @click="testAction(222)">action测试</p>
       <store-test></store-test>-->
      <i class="icon-zyt-select">图标测试</i>
      <p @click="licationTest()">定位测试</p>
      <div class="demo">
        <p>城市选择</p>
        <city-select @getSelectCity="getSelectCity"></city-select>
      </div>
      <div>
        <h1>demo页</h1>

        <i class="icon-zyt-angle-star1 door-star3"></i>
        <p @click="licationTest()">定位测试</p>
        <div class="demo">
          <p>城市选择</p>
          <city-select @getSelectCity="getSelectCity"></city-select>
        </div>

        <div class="demo">
          <fixed-top :coverHeader="true">
            <p style="color: #0d7ac2">滚动固定在头部</p>
          </fixed-top>
        </div>

        <div class="demo">
          <fixed-top :coverHeader="false">
            <p>滚动固定在头部下面</p>
          </fixed-top>
        </div>


        <div class="demo">
          <p>筛选组件</p>
          <servant-sort :sortData="sortData" @getSort="getSort" :scrollPosition="490" :position="44"></servant-sort>
        </div>
        <p v-for="item in testArr" style="height: 20px">1</p>


        <div class="demo">
          <p>商品分类组件</p>
          <goods-category @getGoodsCate="getGoodsCate"></goods-category>
        </div>

        <div class="demo">
          <p @click="openSearch()">打开搜索框</p>
        </div>

        <div class="demo">
          <p>秒杀tab组件</p>
          <seckill-tab @getSession="getSession"></seckill-tab>
        </div>
        <div class="demo">
          <p>star评分(bgSize:星大小(font-size控制),star:评分,isShowInput:是否可评分)</p>
          <zyt-star :bgSize="20" :star="5.6" :isShowInput="true"></zyt-star>
        </div>
        <div class="demo">
          <p>优选推荐列表项</p>
          <zyt-preferred :doorList="RecommendData" :isFilter="true"></zyt-preferred>
        </div>
        <div class="demo">
          <p>图文结合组件： liWidth: 每项宽%，imgWidth：图片宽%，hideAll：隐藏全部图标,isImgUrl是否拼接URL</p>
          <img-text :liWidth="25" :imgWidth="50" :hideAll="true" :isImgUrl="false"></img-text>
        </div>
        <div class="demo">
          <p>服务列表项组件</p>
          <svc-ctgry-item :isShowRight="false" :isCut="false"></svc-ctgry-item>
        </div>
        <div class="demo">
          <p>服务入口项组件</p>
          <svc-ctgry-inlet :isShowRight="true" :isCut="true"></svc-ctgry-inlet>
        </div>
        <!--     <div class="demo">
               <p @click="goLjl(data)">商品列表</p>
               <product-List></product-List>
             </div>-->
        <div class="demo">
          <p>头部搜索框:lunboData轮播数据 :isServantMain是否是主页搜索 :searchNum0:主页搜索 1:优惠券，2商品，3服务，4店铺</p>
          <head-search :lunboData="[]" :isServantMain="true" :searchNum="0"></head-search>
        </div>
        <div class="demo">


          <scratch-card :btnClick="begin" @done="done()" :prizeName="prizeName" ref="scratchCard"></scratch-card>
        </div>
        <div class="demo">
          <comment-list></comment-list>
        </div>

        <div @click="toast()">toast测试</div>

        <div @click="changeImg()">
          改变aimg测试
        </div>
        <div class="demo" @click="openPhotoSwipe">
          <div>photoSwipe点击测试</div>
          <photo-swipe :aImg="aImg" ref="photoSwipe"></photo-swipe>
        </div>
        <div class="demo">
          <p style="border-bottom: 1px solid #2d2d2d">全部评论</p>
          <comment-look-more></comment-look-more>
        </div>
        <div class="demo">
          <right-top></right-top>
        </div>

        <div class="demo">
          <p style="border-bottom: 1px solid #2d2d2d">六分转盘</p>
          <six-draw :prizeList="prizeList"
                    @pointerClick="pointerClick('six')"
                    ref="six"
                    @end="end()"
          ></six-draw>
        </div>


        <div class="demo">
          <p style="border-bottom: 1px solid #2d2d2d">八分转盘</p>
          <eight-draw :prizeList="prizeList"
                      @pointerClick="pointerClick('eight')"
                      ref="eight"
                      @end="end()"
          ></eight-draw>
        </div>

        <div class="demo">
          <p style="border-bottom: 1px solid #2d2d2d">十二分跑马灯</p>
          <twelve-draw :prizeList="prizeList"
                       @pointerClick="pointerClick('twelve')"
                       ref="twelve"
                       @end="end()"
          ></twelve-draw>
        </div>

      </div>
    </div>


  </zyt-page>


</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import storeTest from '@/components/storeTest'
  import citySelect from '@/components/citySelect/citySelect.component'
  import locationService from '@/service/common/location/location'
  import servantSort from '@/components/servantSort/servantSort.component'
  import couponCategory from '@/components/couponCategory/couponCategory.component'
  import goodsCategory from '@/components/goodsCategory/goodsCategory.component'
  import Search from '@/service/commonSearch/commonSearch.service'
  import seckillTab from '@/components/seckillTab/seckillTab.component'
  import {FixedTop} from '@/components/page'
  import star from '@/components/score/star.component'
  import preferred from '@/components/preferred/preferred.component'
  import productList from '@/components/product/productList.component'
  import imgText from '@/components/imgText/imgText.component'
  import serviceCategoryInlet from '@/components/serviceCategory/serviceCategoryInlet.component'
  import serviceCategoryItem from '@/components/serviceCategory/serviceCategoryItem.component'
  import headSearch from '@/components/commonSearch/headSearch.component'
  import scratchCard from '@/components/draw/scratchCard.component'
  import commentList from '@/components/comment/commentDetailList.component'
  import Toast from '@/service/toast/toast.service'
  import photoSwipe from '@/components/photoSwipe/photoSwipe.component'
  import sixDraw from '@/components/draw/sixDraw.component'
  import drawApi from '@/api/draw/draw.api'
  import eightDraw from '@/components/draw/eightDraw.component'
  import twelveDraw from '@/components/draw/twelveDraw.component'
  import RightTop from '@/components/menu/right-top.component'
  export default {
    name: 'demo',
    data() {
      return {
        sortData: [
          {
            type: 'normal',
            default: '销量',
            defaultValue: 1,
            key: 'sortType',
            content: [
              {
                name: '销量',
                value: 1
              },
              {
                name: '最近添加',
                value: 2
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
          },
          {
            type: 'price',
            default: '价格'
          }
        ],
        testArr: new Array(50),
        RecommendData: [{
          logo: 'http://172.31.60.188/entsite/Collection/img/20170208/1486544872687215.jpg',
          cityName: '曲靖市',
          star: '3.2',
          maxDiscountPrice: 100,
          provinceName: '云南省',
          advertId: 940,
          id: 570,
          distance: '128.0km',
          districtName: '陆良县',
          address: '云南省曲靖市陆良县云南省 曲靖市 陆良县',
          doorName: 'CollectionJTM',
          lattitude: '25.060527',
          longitude: '103.566185'
        }],
        endTime: '2017/08/01 09:17:00', /* 倒计时 */
        prizeName: null,
        aImg: ['http://m.jointem.com/mdymmx/img/20170105/1483608648756892.jpg', 'http://m.jointem.com/gihx/img/20170419/1492583989646263.jpg'],
        prizeList: [] // 奖品列表
      }
    },
    created(){
      drawApi.getDrawDetail({drawId: '861'}).then(data => {
        this.prizeList = data.data.drawSalesPrizeList
      })
    },
    components: {
      'store-test': storeTest,
      'city-select': citySelect,
      'servant-sort': servantSort,
      'coupon-category': couponCategory,
      'goods-category': goodsCategory,
      'seckill-tab': seckillTab,
      'fixed-top': FixedTop,
      'zyt-star': star,
      'zyt-preferred': preferred,
      'img-text': imgText,
      'product-List': productList,
      'svc-ctgry-inlet': serviceCategoryInlet,
      'svc-ctgry-item': serviceCategoryItem,
      'head-search': headSearch,
      'scratch-card': scratchCard,
      'comment-list': commentList,
      'photo-swipe': photoSwipe,
      'six-draw': sixDraw,
      'eight-draw': eightDraw,
      'twelve-draw': twelveDraw,
      'right-top': RightTop
    },
    methods: {
      ...mapMutations(['mutationTest']),
      ...mapActions(['testAction']),
      onScrollEvent(e, top){
        console.info(11111, top)
      },
      licationTest(){
        locationService.getLocation().then(data => {
          console.log(data)
        })
      },
      getSelectCity(data){
        console.log(data)
      },
      getSort(data){
        console.log(data)
      },
      getCouponCate(data){
        console.log(data)
      },
      getGoodsCate(data){
        console.log(data)
      },
      openSearch(){
        // 打开搜索框，主页搜索第一个参数为true，反之false，第二参为number，标识搜索框0:主页搜索  1:优惠券，2商品，3服务，4店铺,
        Search(true, 0).then(data => {
          console.log(data)
        }).catch(err => {
          console.log(err)
        })
      },
      getSession(data){
        console.log(data)
      },
      goLjl(data){
        this.$router.push('/ljl')
      },
      begin(){
        let a = true
        if (a) {
          this.prizeName = '测试测试'
          this.$refs.scratchCard.begin() // 调用子组件方法
        }
      },
      done(){
        console.log('done')
      },
      toast(){
        Toast.success('使用失败')
      },
      changeImg(){
        this.aImg = ['http://m.jointem.com/mdymmx/img/20170105/1483608648756892.jpg']
      },
      openPhotoSwipe(){
        this.$refs.photoSwipe.open(0)
      },
      pointerClick(ref){
        // 抽奖按钮点击事件,begin 方法为开始旋转转盘，传入中奖奖品ID，未中奖传-1
        this.$refs[ref].begin(1184)
      },
      end(){
        console.log('转盘转动完毕')
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .demo {
    margin-top: 20px;
  }

  .door-star3 {
    color: #ffc001;
  }
</style>
