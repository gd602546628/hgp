<template>
  <zyt-page :has-header="true"
            :on-infinite="loadMore"
            :enable-infinite="!dataFinish">
    <div slot="main">
      <!--商品收藏-->
      <!--<div v-if="showDelete" class="main-btn" @click="cancelCollection">取消收藏</div>-->
      <div v-if="!isData" class="shop-no-data">
        <img src="../../assets/img/doorIndeximg/car_K.png" alt="">
        <span>还未收藏任何商品</span>
      </div>
      <div class="prdClass" v-if="(prdListData.length>0)">
        <div class="prdClassItem" v-for="prdItem in prdListData">
          <mt-cell-swipe
            v-if="prdItem"
            :key="prdItem.prdId"
            class="coupon-swipe"
            :rightWidth="80"
            :right="rightDel(prdItem)"
          >
            <div class="prdBox">
              <!--<div class="inputBox">
              <span class="checkbox mint-checkbox" @click.stop="onCheck(prdItem)">
                <input type="checkbox" class="mint-checkbox-input"
                       v-model="prdItem.checked" name="prdItemChecked"
                       :checked="prdItem.totalStock===0?disabled:prdItem.checked">
                <span class="mint-checkbox-core"></span>
              </span>
              </div>
              <div class="bor-bottom"></div>-->
              <div class="concent">
                <div class="box" @click.prevent="goToPrdDetail(prdItem)">
                  <div class="imgBox">
                    <img :src="prdItem.prdImg | imgPrefix" alt="">
                  </div>
                  <div class="txt">
                    <p>{{prdItem.prdName}}</p>
                    <!--<span>{{prdItem.saleCount ? prdItem.saleCount : 0}}人购买</span>-->
                  </div>
                  <div class="price" :class="{active:showDelete}">
              <span class="text-redtext-m">￥</span
              ><span class="text-redtext-b">{{disCountPriceFn1(prdItem.disCountPrice)}}</span
                  ><span class="text-redtext-c">.{{disCountPriceFn2(prdItem.disCountPrice)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </mt-cell-swipe>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import ProductApi from '@/api/product/product.api'
  import {Codes} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  export default {
    data () {
      return {
        changed: false,
        prdListData: [], // 收藏的商品
        params: {
          pageNum: 1,
          pageSize: 10
        },
        dataFinish: false,
        pageFlag: false,
        isData: true // 是否有数据
      }
    },
    props: ['showDelete', 'active'],
    created(){
      this.init()
    },
    computed: {
      ...mapGetters(['collectPrd'])
    },
    watch: {
      collectPrd(){
        this.changed = true
      },
      '$route': {
        handler(){
          let flag = this.$route.name === 'indexDoor' && this.$route.params.index === '1' || this.$route.params.index === 1
          flag = flag && this.active
          flag = flag && this.changed
          if (flag) {
            this.init()
          }
        }
      }
    },
    methods: {
      parmasFn(){
        this.params.pageNum = 1
        this.prdListData = []
        this.dataFinish = false
        this.pageFlag = false
        this.isData = true
      },
      init(){
        Object.assign(this, this.$options.data())
        this.getPrdList(true)
      },
      async getPrdList(reset){ // 获取用户所有的商品收藏信息 reset是否重置列表true重置，false添加
        let data = await ProductApi.getPrdList(this.params).catch(() => {
          throw new Error('获取用户所有的店铺收藏信息失败')
        })
        if (!data.data.prdList || data.data.prdList.length < 1) { // 没有数据
          this.isData = false
        }
        if (!data.data || !data.data.prdList || data.data.prdList.length <= 0) {
          this.dataFinish = true
          return
        }
        if (this.params.pageNum >= data.data.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.prdListData = data.data.prdList
        } else {
          this.prdListData = this.prdListData.concat(data.data.prdList)
        }
        return true
      },
      onCheck(item){ // 选择取消商品
        item.checked = !item.checked
      },
      async cancelCollection(item){ // 取消商品收藏
        let removeCollectGoodsData = {'prdList': [], itemList: []}
        removeCollectGoodsData.prdList.push({'doorId': item.doorId, 'prdId': item.prdId})
        removeCollectGoodsData.itemList.push(item)
        /* this.prdListData.forEach(item => {
         if (item.checked) {
         removeCollectGoodsData.prdList.push({'doorId': item.doorId, 'prdId': item.prdId})
         removeCollectGoodsData.itemList.push(item)
         }
         })
         if (this.prdListData.length <= 0) {
         Util({
         title: '',
         message: '暂无可以取消的商品！',
         showCancelButton: false
         })
         return
         }
         if (removeCollectGoodsData.prdList.length <= 0) {
         Util({
         title: '',
         message: '请选择需要取消的商品！',
         showCancelButton: false
         })
         return
         } */
        let data = await ProductApi.getDelPrd(removeCollectGoodsData).catch(() => {
          throw new Error('取消商品收藏失败')
        })
        if (data.code === Codes.success) {
          this.prdListData = this.prdListData.filter((prd) => {
            return removeCollectGoodsData.itemList.indexOf(prd) === -1
          })
        }
        if (this.prdListData.length < 1) { // 没有数据
          this.isData = false
        }
      },
      goToPrdDetail(item){ // 跳转商品详情
        this.$router.push({name: 'productInfo', params: {doorId: item.doorId, prdId: item.prdId}})
      },
      async loadMore(done){ // 加载跟多产品
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getPrdList(false)
        done()
      },
      disCountPriceFn1(num){
        if (num === null || num === 0) {
          num = 0
          return num
        }
        if (num) {
          let numstr = num.toString()
          if (numstr.indexOf('.') < 0) {
            return parseInt(numstr)
          } else {
            return parseInt(numstr.substring(0, numstr.indexOf('.')))
          }
        }
      },
      disCountPriceFn2(num){
        if (num === null || num === 0) {
          num = '00'
          return num
        }
        if (num) {
          let toFixed2 = parseFloat(num).toFixed(2)
          let vals = toFixed2.toString().split('.')
          if (vals.length >= 2) {
            return vals[1]
          }
        }
      },
      rightDel(item){
        return [
          {
            content: '删除',
            style: {
              background: 'red',
              color: '#fff',
              display: 'flex',
              'align-items': 'center',
              '-webkit-align-items': 'center',
              'justify-content': 'center',
              '-webkit-justify-content': 'center',
              width: '80px'
            },
            handler: () => {
              Util.confirm('确定删除吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true
              }).then(() => {
                this.cancelCollection(item)
              }).catch(() => {
              })
            }
          }]
      }
    },
    components: {}
  }
</script>

<style lang='scss' rel='stylesheet/scss' type="text/scss">

  .prdClass {
    .coupon-swipe {
      width: 100%;
      background: none !important;
      .mint-cell-right {
      }
      .mint-cell-wrapper {
        margin: 0;
        padding: 0;
        background: none;
        border: none;
      }
      .mint-cell-title {
        display: none;
      }
      .mint-cell-value {
        width: 100%;
      }
      .prdBox {
        /*transition: all 0.3s ease;
        &.active {
          transform: translateX(28px);
        }*/
        width: 100%;
        border-bottom: solid #efefef 1px;
        .bor-bottom {
          width: 28px;
          position: absolute;
          display: inline-block;
          left: -28px;
          top: 100%;
          z-index: 1;
          height: 1px;
          background-color: #efefef;
        }
        .inputBox {
          display: inline-block;
          position: absolute;
          left: -20px;
          top: 40%;
          z-index: 1;
          .checkbox {
            .mint-checkbox-core {
              width: 18px;
              height: 18px;
            }
            .mint-checkbox-core::after {
              top: 2px;
              left: 5px;
            }
          }
        }
        .concent {
          position: relative;
          z-index: 0;
          height: 90px;
          .box {
            display: flex;
            align-items: center;
            .imgBox {
              display: flex;
              align-items: center;
              img {
                width: 70px;
                height: 70px;
                margin: 10px 10px;
                border: 1px solid #e7e7e7;
              }
            }
            .txt {
              width: calc(100% - 120px);
              p {
                height: 50px;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 13px;
                color: #2d2d2d
              }
              span {
                font-size: 11px;
                color: #2d2d2d
              }
            }
            .price {
              position: absolute;
              z-index: 1;
              right: 10px;
              bottom: 10px;
              &.active {
                right: 38px;
              }
              span {
                color: #0164a6;
              }
              .text-redtext-m {
                font-size: 12px;
              }
              .text-redtext-b {
                font-size: 15px;
              }
              .text-redtext-c {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }

  .shop-no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: calc(50%);
    img {
      height: 100px;
      width: 100px;
    }
    span {
      color: #9e9e9e;
    }
  }

  .main-btn {
    position: fixed;
    z-index: 3;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    color: white;
    font-size: 14px;
    background-color: #0164a6;
    text-align: center;
    line-height: 48px;
  }
</style>
