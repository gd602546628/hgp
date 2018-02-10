/**
* Created by guooug on 2017/6/16.
*/
<template>
  <zyt-page :hasHeader="false"
            :hasFooter="true"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll">
    <div slot="main">
      <div class="prdClass" v-if="(cartListData.length>0)">
        <div class="cartItem" v-for="prdItem in cartListData">
          <div class="upItem" v-if="prdItem.prdList.length>0">
            <div class="left">
                <span class="checkbox mint-checkbox" @click.stop="checkAll(prdItem)">
                  <input type="checkbox" class="mint-checkbox-input"
                         v-model="prdItem.checked" name="prdItemChecked"
                         :checked="prdItem.totalStock===0?disabled:prdItem.checked">
                  <span class="mint-checkbox-core"></span>
                </span>
              <i class="icon-zyt-home3"></i>
              <p>{{ prdItem.doorName }}</p>
            </div>
            <div class="right" v-show="itemRight" @click="clickEdit(prdItem)">{{ prdItem.isEdit ? '完成' : '编辑'}}</div>
          </div>
          <div class="concent" v-for="prdIt in prdItem.prdList" :key="prdIt.id">
            <mt-cell-swipe v-if="prdIt &&!prdItem.isEdit"
                           class="coupon-swipe"
                           :right="rightDel(prdIt)"
                           :rightWidth="55"
                           ref="swipe">
              <div class="box" @click.prevent="goToPrdDetail(prdItem, prdIt)">
                <div class="imgBox">
              <span class="checkbox mint-checkbox" @click.stop="checkItem(prdItem, prdIt, $event)">
                <input type="checkbox" class="mint-checkbox-input"
                       v-model="prdIt.checked" name="prdItemChecked"
                       :checked="prdIt.totalStock===0?disabled:prdIt.checked">
                <span class="mint-checkbox-core"></span>
              </span>
                  <img :src="prdIt.prdImg | imgPrefix" alt="">
                </div>
                <div class="txt" v-show="!prdItem.isEdit">
                  <div class="name">
                    <p>{{prdIt.prdName}}</p>
                  </div>
                  <div class="standard">
                    <span
                      v-if="prdIt.firstPriceName">{{prdIt.firstPriceName == "" ? "" : (prdIt.firstPriceName + ":")}}</span>
                    <span>{{prdIt.firstPriceValue}}&nbsp;</span>
                    <span
                      v-if="prdIt.secondPriceName">{{prdIt.secondPriceName == "" ? "" : (prdIt.secondPriceName + ":")}}</span>
                    <span>{{prdIt.secondPriceValue}}</span>
                  </div>
                  <div class="price">
                    <span class="text-redtext-m">￥</span
                    ><span class="text-redtext-b">{{disCountPriceFn1(prdIt.money)}}</span
                  ><span class="text-redtext-c">.{{disCountPriceFn2(prdIt.money)}}</span>
                  </div>
                </div>
                <div class="num" :class="prdItem.isEdit?'numEditY':'numEditN'">
                  <span @click.stop="sumPrdNumByUser(prdIt.id)">-</span><span>{{prdIt.num}}</span><span
                  @click.stop="addPrdNumByUser(prdIt.id)">+</span>
                </div>
                <div class="delDiv"
                     v-show="prdItem.isEdit"
                     @click.stop="delItem(prdIt)">删除
                </div>
              </div>
            </mt-cell-swipe>

            <div class="coupon-swipe">
              <div class="box" @click.prevent="goToPrdDetail(prdItem, prdIt)" v-if="prdIt &&prdItem.isEdit">
                <div class="imgBox">
              <span class="checkbox mint-checkbox" @click.stop="checkItem(prdItem, prdIt, $event)">
                <input type="checkbox" class="mint-checkbox-input"
                       v-model="prdIt.checked" name="prdItemChecked"
                       :checked="prdIt.totalStock===0?disabled:prdIt.checked">
                <span class="mint-checkbox-core"></span>
              </span>
                  <img :src="prdIt.prdImg | imgPrefix" alt="">
                </div>
                <div class="txt" v-show="!prdItem.isEdit">
                  <div class="name">
                    <p>{{prdIt.prdName}}</p>
                  </div>
                  <div class="standard">
                    <span
                      v-if="prdIt.firstPriceName">{{prdIt.firstPriceName == "" ? "" : (prdIt.firstPriceName + ":")}}</span>
                    <span>{{prdIt.firstPriceValue}}&nbsp;</span>
                    <span
                      v-if="prdIt.secondPriceName">{{prdIt.secondPriceName == "" ? "" : (prdIt.secondPriceName + ":")}}</span>
                    <span>{{prdIt.secondPriceValue}}</span>
                  </div>
                  <div class="price">
                    <span class="text-redtext-m">￥</span
                    ><span class="text-redtext-b">{{disCountPriceFn1(prdIt.money)}}</span
                  ><span class="text-redtext-c">.{{disCountPriceFn2(prdIt.money)}}</span>
                  </div>
                </div>
                <div class="num" :class="prdItem.isEdit?'numEditY':'numEditN'">
                  <span @click.stop="sumPrdNumByUser(prdIt.id)">-</span><span>{{prdIt.num}}</span><span
                  @click.stop="addPrdNumByUser(prdIt.id)">+</span>
                </div>
                <div class="delDiv"
                     v-show="prdItem.isEdit"
                     @click.stop="delItem(prdIt)">删除
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-if="!hasData" class="cart-no-data-box">
        <img src="../../assets/img/me/car_k02.png" alt="">
        <span>购物车竟然是空的</span>
        <div @click="goLook()">去挑选好货</div>
      </div>
    </div>
    <div slot="footer" class="bottomBtn">
      <div class="concent" v-show="!data.showEdit">
        <div class="txt">金额：</div>
        <div class="price">
                  <span class="text-redtext-m">￥</span
                  ><span class="text-redtext-b">{{disCountPriceFn1(Money)}}</span
        ><span class="text-redtext-c">.{{disCountPriceFn2(Money)}}</span>
        </div>
      </div>
      <div class="btn1"
           v-show="!data.showEdit"
           @click="submit()"
           :class="isBtnStyle?'cartBtnStyleY':'cartBtnStyleN'">
        去结算
      </div>
      <!--<div class="btn2" v-show="data.showEdit" @click="delMuch">删除</div>-->
    </div>
  </zyt-page>
</template>

<script>
  import {mapMutations, mapGetters} from 'Vuex'
  import UserApi from '@/api/user/user.api'
  import {Codes} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  export default {
    name: 'cart',
    data () {
      return {
        show: false,
        needRefresh: false,
        cartListData: [], // 购物车数据
        dataFinish: false,
        pageFlag: false,
        showDelete: false,
        isBtnStyle: false,
        itemRight: true, // 每一项的右边编辑完成
        canSelectMoreDoor: true,
        hasData: true, // 接口是否有数据
        Money: 0,
        data: {
          showEdit: false
        },
        Params: {
          pageNum: 1,
          pageSize: 10
        },
        orders: []
      }
    },
    /* watch: {
     cartState(){
     this.needRefresh = true
     },
     '$route': function () {
     let flag = this.$route.name === 'indexDoor' && this.$route.params.index === '2' || this.$route.params.index === 2
     flag = flag && this.needRefresh
     if (flag) {
     this.init()
     }
     }
     }, */
    created(){
      this.init()
    },
    methods: {
      ...mapMutations(['setConfirmOrders', 'changeCartState']),
      onScroll(obj){
        console.info(obj)
      },
      async init(){
        Object.assign(this, this.$options.data())
        await this.getCartPrdList()
        this.show = true
      },
      paramsFn(){
        this.Params.pageNum = 1
        this.cartListData = []
        this.dataFinish = false
        this.pageFlag = false
        this.showDelete = false
        this.isBtnStyle = false
        this.itemRight = true
        this.canSelectMoreDoor = true
        this.hasData = true
        this.Money = 0
        this.data.showEdit = false
        this.orders = []
      },
      async getCartPrdList(){
        let data = await UserApi.getCartPrdList(this.Params)
        if (data.code === Codes.success && data.data.doorPrdList) {
          if (data.data.doorPrdList.length < 1) {
            this.hasData = false
          }
          if (this.Params.pageNum >= data.data.page.allPage) {
            this.dataFinish = true
            this.pageFlag = true
            console.log('所有数据加载完毕')
          } else {
            this.dataFinish = false
            this.pageFlag = false
          }
          for (let i = 0; i < data.data.doorPrdList.length; i++) {
            this.cartListData.push(data.data.doorPrdList[i])
          }
        }
        this.isCheckedStyle()
        return true
      },
      isCheckedStyle() { // 选择商品后的按钮样式
        if (this.cartListData === '') {
          this.isBtnStyle = false
        } else {
          for (let i = 0; i < this.cartListData.length; i++) {
            for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
              if (this.cartListData[i].prdList[j].checked === true) {
                this.isBtnStyle = true
                return
              }
            }
          }
          this.isBtnStyle = false
        }
      },
      async delCartPrd(params, delData){ // 删除购物车的商品
        let data = await UserApi.getdelCartPrd(params)
        this.changeCartState()
        setTimeout(() => {
          // 该页面内删除购物车的内容，不需要刷新页面
          this.needRefresh = false
        }, 100)
        let result = []
        if (data.code === Codes.success) {
          for (let i = 0; i < this.cartListData.length; i++) {
            this.cartListData[i].prdList = this.cartListData[i].prdList.filter((prd) => {
              return delData.itemList.indexOf(prd) === -1
            })
            if (this.cartListData[i].prdList.length > 0) {
              result.push(this.cartListData[i])
            }
          }
          this.cartListData = result
          if (this.cartListData.length < 1) {
            this.hasData = false
          }
          this.allMoney()
        }
      },
      allMoney() { // 计算总的金额
        this.Money = 0
        for (let i = 0; i < this.cartListData.length; i++) {
          for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
            if (this.cartListData[i].prdList[j].checked === true) {
              this.Money += (this.cartListData[i].prdList[j].discountPrice * this.cartListData[i].prdList[j].num)
            }
          }
        }
      },
      understock(){
        Util.alert('该商品库存不足!', '')
      },
      addPrdNumByUser(id) { // 添加商品量
        for (let i = 0; i < this.cartListData.length; i++) {
          for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
            if (this.cartListData[i].prdList[j].id === id) {
              if (this.cartListData[i].prdList[j].isActivity === 1 && this.cartListData[i].prdList[j].limitCount) {
                if (this.cartListData[i].prdList[j].num < this.cartListData[i].prdList[j].totalStock && this.cartListData[i].prdList[j].num < this.cartListData[i].prdList[j].limitCount && this.cartListData[i].prdList[j].limitCount < this.cartListData[i].prdList[j].totalStock) {
                  this.cartListData[i].prdList[j].num += 1
                  if (this.cartListData[i].prdList[j].num > this.cartListData[i].prdList[j].limitCount) {
                    this.cartListData[i].prdList[j].num = this.cartListData[i].prdList[j].limitCount
                    if (this.cartListData[i].prdList[j].num === this.cartListData[i].prdList[j].limitCount || (this.cartListData[i].prdList[j].num === this.cartListData[i].prdList[j].totalStock === this.cartListData[i].prdList[j].limitCount)) {
                      Util.alert('该商品仅限购买' + this.cartListData[i].prdList[j].limitCount + '件!', '').then(action => {
                      })
                      return
                    }
                  }
                } else {
                  if (this.cartListData[i].prdList[j].totalStock > 0) {
                    if (this.cartListData[i].prdList[j].num === this.cartListData[i].prdList[j].limitCount || (this.cartListData[i].prdList[j].num === this.cartListData[i].prdList[j].totalStock === this.cartListData[i].prdList[j].limitCount)) {
                      // 弹窗
                      Util.alert('该商品仅限购买' + this.cartListData[i].prdList[j].limitCount + '件!', '').then(action => {
                      })
                      return
                    } else {
                      this.cartListData[i].prdList[j].num = this.cartListData[i].prdList[j].totalStock
                    }
                  } else {
                    this.cartListData[i].prdList[j].num = this.cartListData[i].prdList[j].totalStock
                    this.understock()
                  }
                }
              } else {
                if (this.cartListData[i].prdList[j].totalStock > 0) {
                  if (this.cartListData[i].prdList[j].num < this.cartListData[i].prdList[j].totalStock) {
                    this.cartListData[i].prdList[j].num += 1
                  } else {
                    this.cartListData[i].prdList[j].num = this.cartListData[i].prdList[j].totalStock
                    Util.alert('该商品库存仅剩：' + this.cartListData[i].prdList[j].totalStock + '件!', '')
                  }
                } else {
                  this.cartListData[i].prdList[j].num = this.cartListData[i].prdList[j].totalStock
                  this.understock()
                }
              }

              this.cartListData[i].prdList[j]['money'] = this.cartListData[i].prdList[j].discountPrice * this.cartListData[i].prdList[j].num

              UserApi.geteditCartPrd({
                prdList: [{
                  'id': id,
                  'doorId': this.cartListData[i].doorId,
                  'prdId': this.cartListData[i].prdList[j].prdId,
                  'priceId': this.cartListData[i].prdList[j].priceId,
                  'num': this.cartListData[i].prdList[j].num
                }]
              }).then(function (data) {
                if (data.code !== Codes.success) {
                  return
                }
              })
            }
          }
        }
        this.allMoney()
      },
      sumPrdNumByUser(id) { // 减少商品量
        for (let i = 0; i < this.cartListData.length; i++) {
          for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
            if (this.cartListData[i].prdList[j].id === id) {
              if (this.cartListData[i].prdList[j].num > 1) {
                this.cartListData[i].prdList[j].num -= 1
                this.cartListData[i].prdList[j]['money'] = this.cartListData[i].prdList[j].discountPrice * this.cartListData[i].prdList[j].num

                UserApi.geteditCartPrd({
                  prdList: [{
                    'id': id,
                    'doorId': this.cartListData[i].doorId,
                    'prdId': this.cartListData[i].prdList[j].prdId,
                    'priceId': this.cartListData[i].prdList[j].priceId,
                    'num': this.cartListData[i].prdList[j].num
                  }]
                }).then(function (data) {
                  if (data.code !== Codes.success) {
                    return
                  }
                })
              }
            }
          }
        }
        this.allMoney()
      },
      async loadMore(done){ // 获取更多商品
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.Params.pageNum++
        await this.getCartPrdList()
        done && done()
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
      clickEdit(item){
        item.isEdit = !item.isEdit
      },
      delItem(item){ // 删除每一项
        let removeCollectGoodsData = {'prdList': [], itemList: []}
        removeCollectGoodsData.itemList.push(item)
        Util.confirm('确定删除吗？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true
        }).then(() => {
          this.delCartPrd({ids: item.id}, removeCollectGoodsData)
        }).catch(() => {
        })
      },
      checkItem(item, it, event){ // 选择单个商品 doorid  店铺id
        it.checked = !it.checked
        if (it.totalStock === 0) {
          this.understock()
        } else {
          this.selectEvent(item, it, event)
        }
      },
      checkAll(item) { // 全选某个店铺里的所有商品 id 店铺id
        item.checked = !item.checked
        for (let i = 0; i < this.cartListData.length; i++) {
          if (this.cartListData[i].doorId === item.doorId) {
            if (this.cartListData[i].checked === true) {
              for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
                if (this.cartListData[i].prdList[j].isValid === 0 && this.cartListData[i].prdList[j].totalStock > 0) {
                  this.cartListData[i].prdList[j].checked = true
                }
              }
            } else {
              for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
                this.cartListData[i].prdList[j].checked = false
              }
            }
          } else if (!this.canSelectMoreDoor) {
            this.cartListData[i].checked = false
            for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
              this.cartListData[i].prdList[j].checked = false
            }
          }
        }
        this.allMoney()
        this.isCheckedStyle()
      },
      selectEvent(item, it, event) {
        item.checked = !item.checked
        if (it.isValid !== 0) {
          this.delPopup(item, it)
          event.preventDefault()
          return
        }
        for (let i = 0; i < this.cartListData.length; i++) {
          if (this.cartListData[i].doorId === item.doorId) {
            let checkedTrueNum = 0
            for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
              if (this.cartListData[i].prdList[j].checked === true) {
                checkedTrueNum += 1
              }
            }
            if (this.cartListData[i].prdList.length === checkedTrueNum) {
              this.cartListData[i].checked = true
            } else {
              this.cartListData[i].checked = false
            }
          } else if (!this.canSelectMoreDoor) {
            this.cartListData[i].checked = false
            for (let j = 0; j < this.cartListData[i].prdList.length; j++) {
              this.cartListData[i].prdList[j].checked = false
            }
          }
        }
        this.allMoney()
        this.isCheckedStyle()
      },
      goToPrdDetail(item, it){ // 跳转商品详情
        this.$router.push({name: 'productInfo', params: {doorId: item.doorId, prdId: it.prdId}})
      },
      goLook(){
        this.$router.push({
          name: 'selectedGoodsOnline',
          query: {
            secondWebView: 0
          }
        })
      },
      submit() { // 提交哦结算按钮
        this.orders = []
        if (this.Money > 0) {
          let canSubmit = true
          this.cartListData.forEach(item => {
            let state = false
            // let totalPrice = 0
            let list = []
            item.prdList.forEach(prd => {
              state = state || prd['checked']
              if (prd['checked'] && canSubmit) {
                if (prd.num > prd.totalStock) {
                  Util.alert('购物车中有库存不足的商品!', '')
                  canSubmit = false
                  return false
                }
                let p = {
                  id: prd.id, // 购物车id 从购物车到订单确认界面的时候，成功提交订单要删除相应的购物车
                  prdName: prd.prdName, // 产品名称
                  prdType: prd.prdType,
                  prdId: prd.prdId,
                  discountPrice: prd.discountPrice, // 价格
                  num: prd.num || 1, // 数量
                  prdImg: prd.prdImg || '', // 产品图片
                  priceId: prd.priceId, // 规格id
                  firstPriceName: prd.firstPriceName,
                  secondPriceName: prd.secondPriceName,
                  firstPriceValue: prd.firstPriceValue,
                  secondPriceValue: prd.secondPriceValue
                }
                // totalPrice += prd.discountPrice * prd.num
                if (prd.firstPriceName !== null && prd.firstPriceName !== '') {
                  p['fpName'] = prd.firstPriceName
                  p['fpValue'] = prd.firstPriceValue
                }
                if (prd.secondPriceName !== null && prd.secondPriceName !== '') {
                  p['spName'] = prd.secondPriceName
                  p['spValue'] = prd.secondPriceValue
                }
                list.push(p)
              }
            })
            if (list.length > 0) {
              this.orders.push({
                doorInfo: {},
                doorId: item.doorId,
                doorName: item.doorName,
                couponList: [], // 传入 []
                userCouponId: null, // 优惠券id 传null
                prdList: list
              })
            }
          })

          if (canSubmit) {
            this.setConfirmOrders(this.orders)
            this.$router.push({name: 'prdOrderConfirm'})
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
              width: '55px'
            },
            handler: () => {
              Util.confirm('确定删除吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true
              }).then(() => {
                // this.delItem(item)
                let ids = item.id
                let removeCollectGoodsData = {'prdList': [], itemList: []}
                removeCollectGoodsData.itemList.push(item)
                this.delCartPrd({ids: ids}, removeCollectGoodsData)
              }).catch(() => {
              })
            }
          }]
      }
    },
    computed: {
      ...mapGetters(['cartState']),
      isCartPage(){
        this.$route.name = 'indexDoor' && this.$route.params.index === '2'
      }
    },
    components: {}
  }
</script>

<style lang='scss' rel='stylesheet/scss' type="text/scss">
  /*.index-title {
    border-bottom-width: 1px !important;
    background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
    border-bottom: 1px solid #b2b2b2;
    border-top: 1px solid #b2b2b2;
    color: #2d2d2d;
    .title-left {
      i {
        font-size: 19px;
        font-weight: bold;
        padding-left: 8px;
        color: #343434;
        margin-right: 2px;
      }
    }
    .title-right {
      color: #066cc2;
      .mint-button-text {
        color: #066cc2;
      }
    }
  }*/

  .prdClass {
    margin-bottom: 59px;
    .cartItem {
      .upItem {
        height: 35px;
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .left {
          display: -webkit-flex;
          -webkit-align-items: center;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          display: flex;
          align-items: center;
          width: 85%;
          span.checkbox {
            margin-left: 6px;
            margin-right: 6px;
          }
          i {
            font-size: 20px;
            color: #2d2d2d;
            margin-right: 6px;
          }
          p {
            font-size: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: block;
            word-wrap: break-word;
            word-break: break-all;
            width: 80%;
          }
          .mint-checkbox-core {
            width: 18px;
            height: 18px;
          }
          .mint-checkbox-core::after {
            top: 2px;
            left: 5px;
          }
        }
        .right {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          color: #066cc2;
        }
      }
      .concent {
        position: relative;
        z-index: 0;
        height: 85px;
        border-bottom: solid #efefef 1px;
        background-color: #f0f2f5;
        margin-bottom: 10px;
        .coupon-swipe {
          background: none !important;
          .mint-cell-right {
            .mint-cell-swipe-button {
              background-color: #ff3c3c !important;
            }
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
          .box {
            display: flex;
            align-items: center;
            width: 100%;
            .imgBox {
              display: flex;
              align-items: center;
              .checkbox {
                margin-left: 6px;
                span {
                  width: 18px;
                  height: 18px;
                }
                .mint-checkbox-core::after {
                  top: 2px;
                  left: 5px;
                }
              }
            }
            img {
              width: 70px;
              height: 70px;
              margin: 7px 7px;
              border: 1px solid #e7e7e7;
            }
            .txt {
              width: calc(100% - 120px);
              .name {
                width: 100%;
                p {
                  height: 36px;
                  line-height: 18px;
                  font-size: 13px;
                  color: #2d2d2d;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
              }
              .standard {
                font-size: 11px;
                color: #525252;
                height: 16px;
                line-height: 16px;
              }
              .price {
                width: calc(100% - 100px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
            .num {
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #b2b2b2;
              border-radius: 3px;
              overflow: hidden;
              span {
                display: -webkit-flex;
                -webkit-justify-content: center;
                -webkit-align-items: center;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
                width: 26px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                color: #6b6b6b;
                font-size: 12px;
              }
              span:nth-of-type(2) {
                display: -webkit-flex;
                -webkit-justify-content: center;
                -webkit-align-items: center;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 46px;
                border-left: 1px solid #b2b2b2;
                border-right: 1px solid #b2b2b2;
              }
            }
            .numEditN {
              display: -webkit-flex;
              -webkit-justify-content: center;
              -webkit-align-items: center;
              justify-content: center;
              align-items: center;
              position: absolute;
              right: 10px;
              bottom: 4px;
              z-index: 1;
              display: flex;
              width: 100px;

            }
            .numEditY {
              position: absolute;
              left: 120px;
              top: 18px;
              z-index: 1;
            }
            .delDiv {
              width: 55px;
              height: 85px;
              position: absolute;
              right: 0;
              top: 0;
              color: #ffffff;
              background: #ff3c3c;
              line-height: 85px;
              text-align: center;
              font-size: 15px;
            }
          }
        }
      }
      .concent:last-child {
        margin-bottom: 0px;
      }
    }
  }

  .bottomBtn {
    width: 100%;
    height: 49px;
    left: 0px;
    z-index: 2;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: solid 1px #b2b2b2;
    .concent {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .txt {
        font-size: 11px;
      }
      .price {
        span {
          color: #0164a6;
        }
        .text-redtext-m {
          font-size: 13px;
        }
        .text-redtext-b {
          font-size: 20px;
        }
        .text-redtext-c {
          font-size: 18px;
        }
      }
    }
    .btn1 {
      width: 100px;
      height: 49px;
      line-height: 49px;
      text-align: center;
      color: #ffffff;
      font-size: 15px;
    }
    .btn2 {
      width: 100px;
      height: 49px;
      line-height: 49px;
      text-align: center;
      color: #ffffff;
      font-size: 15px;
      background-color: #FF3C3C;
    }
    .cartBtnStyleY {
      background-color: #066cc2;
    }

    .cartBtnStyleN {
      background-color: #bebdbd;
    }
  }

  .cart-no-data-box {
    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: calc(50% + 40px);
    img {
      height: 80px;
      width: 80px;
      display: block;
    }
    span {
      color: #9e9e9e;
      margin: 10px 0px;
    }
    div {
      height: 38px;
      width: 160px;
      border: 1px solid #066cc2;
      padding: 5px;
      color: #066cc2;
      border-radius: 5px;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
  }

</style>
