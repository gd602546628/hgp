<template>
  <transition name="transition">
    <div class="container" ref="container" v-if="show" :class="{show:show}">
      <div class="root" ref="root" v-if="product.priceList">
        <div class="header" ref="header">
          <div class="close-btn" @click="close()"><i class="icon-zyt-close-mark"></i></div>
          <!--产品图-->
          <div class='img-container' @click.stop="openFile(selectedImg)">
            <img-component :imgSrc='selectedImg'></img-component>
            <photoSwipe-component ref="photoSwiper" :aImg="selectedImg"></photoSwipe-component>
          </div>
          <!--价格和剩余库存展示-->
          <div class='price-container'>
            <div>
              <p class='price'>
                <price-component :price='showPrice'></price-component>
              </p>
              <div class="stock">
                <p class="sufficient-stock">剩余{{selectedTotalStock}}件</p>
                <p class="understock" v-if="selectedTotalStock<=0">库存不足</p>
              </div>
            </div>
          </div>
        </div>

        <!--已选规格-->
        <div class='tip-container' v-if="hasSelected||isOffLine">
          <p v-if="hasSelected">已选：
            <span v-if="selected[first]">“{{selected[first]}}”</span>
            <span v-if="selected[second]">“{{selected[second]}}”</span>
          </p>
          <p v-if='isOffLine' class='off-line'>该商品为到店消费商品，需要到线下店铺进行消费</p>
        </div>

        <div ref="scroll" class="over-scroll" :style="maxHeight">
          <!--规格分类1-->
          <div v-if='product.firstPriceName' class='specification-container'>
            <p>{{product.firstPriceName}}</p>
            <button v-for='item in getSpecifications(this.first)' class='select-btn' @click='select(first,item)'
                    :class='isActive(first,item)'
                    :disabled='disabled(first,item)'>{{item}}
            </button>
          </div>
          <!--规格分类2-->
          <div v-if='product.secondPriceName' class='specification-container'>
            <p>{{product.secondPriceName}}</p>
            <button v-for='item in getSpecifications(this.second)' class='select-btn' @click='select(second,item)'
                    :class='isActive(second,item)'
                    :disabled='disabled(second,item)'>{{item}}
            </button>
          </div>
          <!--购买数量-->
          <div class='number-container'>
            <span>数量</span>
            <number-input v-model='number' :class='showInput()' :max='numberMax'></number-input>
          </div>
          <!--限购和包邮条件-->
          <div class='limit-count'>
            <span v-if='limitCount'>每人限购{{limitCount}}件</span>
            <span v-if='priceCondition&&!isOffLine'>{{limitCount ? '，' : ''}}满￥{{priceCondition}}包邮</span>
          </div>
        </div>
        <!--用户操作按钮-->
        <div ref="btn" class='btn-container row'>
          <button v-if="!isOffLine&&btnType==-1" class='col add-cart' :disabled="submitDisabled" @click="submit(0)">
            加入购物车
          </button>
          <button v-if="btnType==-1" class='col buy' :disabled="submitDisabled" @click="submit(1)">立即购买</button>
          <button v-if="btnType!=-1" class='col buy' :disabled="submitDisabled" @click="submit(btnType)">确定</button>
        </div>
      </div>
      <div class="bg" @click="close()"></div>
    </div>
  </transition>
</template>
<script>
  import PriceComponent from '@/components/common/price/price.component'
  import ImgComponent from '@/components/common/img/img.component'
  import NumberInput from '@/components/input/input-number.component'
  import ProductApi from '@/api/product/product.api'
  import PhotoSwipeComponent from '@/components/photoSwipe/photoSwipe.component'
  import PhotoSwiperService from '@/service/photo-swiper/photo-swiper.service.js'

  export default {
    props: {
      //  包邮的价格条件
      priceCondition: {
        type: Number,
        default: 0
      },
      product: {
        type: Object,
        /* eslint-disable no-dupe-keys */
        default: () => {
          return {}
        }
      },
      selected: {
        type: Object,
        default: () => {
          return {
            firstPriceValue: '',
            secondPriceValue: ''
          }
        }
      },
      btnType: {
        type: Number,
        default: -1 // -1：显示 加入购物车和立即购买，其他的，显示确定按钮
      }
    },
    watch: {
      'product': function () {
        this.number = 1
      }
    },
    data () {
      return {
        number: 1,
        first: 'firstPriceValue',
        second: 'secondPriceValue',
        show: false,
        promiseHandler: null,
        resolve: null,
        reject: null
      }
    },
    computed: {
      maxHeight () {
        let height = window.screen.height - 250
        return {
          'max-height': `${height}px`
        }
      },
      showPrice () {
        return ProductApi.getPrice(this.selectedFirstPrice)
      },
      hasSelected () {
        // standard 1:多规格
        return this.product.standard && this.selected.firstPriceValue || this.selected.secondPriceValue
      },
      isOffLine () {
        return !ProductApi.isOnline(this.product.prdType)
      },
      selectedFirstPrice () {
        let priceList = this.getEnabledSpecifications()
        return priceList[0]
      },
      selectedImg () {
        if (this.product.imgList) {
          let img = this.selectedFirstPrice.priceImg
          return img || this.product.imgList[0]
        }
      },
      selectedTotalStock () {
        let stock = 0
        let priceList = this.getEnabledSpecifications() // 筛选规格
        let flag = this.isSelected() && this.isActivity(priceList[0]) // 用户已经确定了规格，并且该规格在活动中
        if (flag) {
          stock = priceList[0].activityInfo.tempStock
        } else {
          priceList.forEach((item) => {
            stock += item.totalStock
          })
        }
        return stock
      },
      limitCount () {
        let priceList = this.getEnabledSpecifications() // 筛选规格
        let flag = this.isSelected() && this.isActivity(priceList[0]) // 用户已经确定了规格，并且该规格在活动中
        if (flag) {
          return priceList[0].activityInfo.limitCount
        }
        return 0
      },
      numberMax () {
        if (this.limitCount > 0) {
          return Math.min(this.limitCount, this.selectedTotalStock)
        }
        return this.selectedTotalStock
      },
      submitDisabled () {
        return !this.isSelected()
      }
    },
    methods: {
      /**
       * 判断规格是否可以点击
       * key string [firstPriceValue,secondPriceValue]
       * value 需要进行判断的规格
       **/
      disabled (key, value) {
        let tempSelected = Object.assign({}, this.selected)
        tempSelected[key] = value
        let list = this.getEnabledSpecifications(tempSelected)
        return list.length === 0
      },
      // 判断是否被选中
      isActive (key, value) {
        if (this.selected[key] === value) {
          return 'active'
        }
        return ''
      },
      // 用户点击选择
      select (key, value) {
        if (this.selected[key] === value) {
          this.selected[key] = ''
        } else {
          this.selected[key] = value
        }
      },
      openFile (imgs) {
        PhotoSwiperService.show(imgs)
      },
      /**
       * 获取规格分类列表
       * @param key string  [this.first,this.second]
       * @returns {Array}
       */
      getSpecifications (key = this.first) {
        let list = []
        let temp = {}
        if (this.product.priceList) {
          this.product.priceList.forEach((item) => {
            if (!temp[item[key]]) {
              list.push(item[key])
              temp[item[key]] = true
            }
          })
        }
        return list
      },
      /**
       * 筛选出可用的规格
       * @param keyValue {key,value}
       * @returns {Array}
       */
      getEnabledSpecifications (selected = this.selected) {
        let list = []
        let filter = (data) => {
          let result = true
          if (selected[this.first]) {
            result = result && data[this.first] === selected[this.first]
          }
          if (selected[this.second]) {
            result = result && data[this.second] === selected[this.second]
          }
          return result
        }
        if (this.product.priceList) {
          this.product.priceList.filter(filter).forEach((item) => {
            list.push(item)
          })
        }
        return list
      },
      // 规格在活动过程中
      isActivity (specification) {
        return ProductApi.isActivity(specification)
      },
      isSelected () {
        let priceList = this.getEnabledSpecifications()
        if (priceList.length === 1) {
          return true
        } else {
          return false
        }
      },
      showInput () {
        if (this.selectedTotalStock > 0) {
          return 'number-input'
        } else {
          return 'number-input1'
        }
      },
      open () {
        this.number = 1
        this.show = true
        let finallyFun = (data) => {
          this.resolve = null
          this.reject = null
          this.promiseHandler = null
          return data
        }
        if (!this.promiseHandler) {
          this.promiseHandler = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
          }).then(finallyFun).catch(finallyFun)
        }
        return this.promiseHandler
      },
      close () {
        this.show = false
        if (this.reject) {
          this.reject(null)
        }
      },
      submit (type) {
        this.show = false
        if (this.isSelected() && this.selectedTotalStock > 0) {
          let data = {
            type: type,
            num: this.number,
            priceId: this.selectedFirstPrice.priceId,
            price: this.showPrice,
            specification: this.selectedFirstPrice
          }
          this.$emit('submit', data)
          if (this.resolve) {
            this.resolve(data)
          }
        } else if (this.reject) {
          this.reject(null)
        }
      }
    },
    components: {
      'img-component': ImgComponent,
      'price-component': PriceComponent,
      'number-input': NumberInput,
      'photoSwipe-component': PhotoSwipeComponent
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type='text/scss' scoped>
  @import '../../assets/css/variables-primary.scss';

  .container.transition-enter,
  .container.transition-leave-to {
    top: 100%;
  }

  .container {
    z-index: 999;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    transition: all .4s cubic-bezier(.55, 0, .1, 1);
    &.show {
      .bg {
        opacity: .4;
      }
    }
    .bg {
      pointer-events: auto;
      z-index: -1;
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
    }
  }

  .root {
    z-index: 999;
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-top: 30px solid transparent;
    .header {
      padding-bottom: 10px;
      /* border-bottom: 1px solid map_get($ComBorderColor, dd); */
    }
    & > div {
      background: white;
    }
    .tip-container {
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      padding: 10px 10px;
      border-bottom: 1px solid map_get($ComBorderColor, dd);
      // border-bottom: .55px solid map_get($ComBorderColor, dd);
      .off-line {
        color: map_get($ComColors, gray);
        font-size: 12px;
      }
    }
    .specification-container {
      padding-bottom: 10px;
      border-bottom: 1px solid map_get($ComBorderColor, dd);
      // border-bottom: .55px solid map_get($ComBorderColor, dd);
      p {
        font-size: 15px;
        padding-top: 5px;
        padding-left: 10px;
      }
      .select-btn {
        font-size: 12px;
        display: inline-block;
        margin: 5px;
        margin-bottom: 0px;
        border: 0;
        border-radius: 5px;
        padding: 5px 10px;
        background-color: map_get($ComColors, gray-c);
        &.active {
          color: white;
          background-color: map_get($ComColors, wathet-blue);
        }
        &[disabled] {
          background-color: map_get($ComColors, gray-ef);
        }
      }
    }
    .img-container {
      padding: 3px;
      position: absolute;
      top: -30px;
      left: 10px;
      width: 120px;
      border-radius: 3px;
      background-color: white;
      border: .55px solid #eee;
      & > div {
        border-radius: 3px;
      }
    }
    .price-container {
      display: flex;
      align-items: center;
      height: 90px;
      padding-left: 140px;
      padding-bottom: 5px;
      p {
        font-size: 13px;
      }
      .price {
        line-height: 25px;
        color: map_get($ComColors, Wathet);
        font-size: 18px;
      }
      .stock {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .sufficient-stock {

        }
        .understock {
          margin-left: 10px;
          color: #066cc2;
        }
      }
    }
    .btn-container {
      height: 40px;
      width: 100%;
      position: absolute;
      bottom: 0px;
      button {
        display: block;
        height: 100%;
        color: white;
        border: 0px;
        font-size: 16px;
        &.add-cart {
          background-color: map_get($ComColors, yellow-f);
        }
        &.buy {
          background-color: map_get($ComColors, wathet-blue);
        }
        &[disabled] {
          background-color: map_get($ComColors, gray-a);
        }
      }
    }
    .number-container {
      display: flex;
      display: -webkit-flex;
      padding: 10px;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      align-items: center;
      justify-content: space-between;
      .number-input {
        width: 150px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #dddddd;
      }
      .number-input1 {
        width: 150px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #f8311e;
      }
    }
    .limit-count {
      padding: 5px 10px;
      text-align: right;
    }
    .over-scroll {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      max-height: 250px;
      padding-bottom: 40px;
    }
  }

  .close-btn {
    position: absolute;
    height: 20px;
    width: 20px;
    border: 1px solid #88888d;
    border-radius: 10px;
    right: 10px;
    top: 10px;
    i {
      font-size: 12px;
      display: block;
      color: #88888d;
      position: absolute;
      top: 4px;
      right: 3px;
    }
  }
</style>
