<template>
  <div class="servant-sort-box" ref="sortBox">
    <div style="height:41px; " v-show="onTop"></div>
    <div class="servant-sort" :class="{onTop:onTop}" ref="wrap">
      <div class="servant-sort-wrap">
        <div class="tab">
          <ul class="tab-ul">
            <li class="tab-ul-li forbidden-scroll" v-for=" item in sortData" @click="tabClick(item)"
                :class="{active:item==currentSort}">
              {{item.default}}
              <i class="icon icon-zyt-triangle-down"></i>
            </li>
          </ul>
          <div class="switch-icon"
               v-if="showSwitch"
               @click.stop="switchClick()"
          >
            <span class="line"></span>
            <i v-if="state===2" class="icon-zyt-classify"></i>
            <i v-if="state===1" class="icon-zyt-menu2"></i>
          </div>
        </div>
        <div class="content" ref="content">
          <transition name="draw">
            <div class="content-wrap" v-if="showContent.show">
              <ul class="content-ul" v-show='showContent.type!=="price"' ref="contentUl">
                <li class="content-ul-li " v-for=" item in currentSort.content"
                    @click='sortItemClick(item)'>
                  {{item.name}}
                  <i class="checkmark icon-zyt-draw forbidden-scroll" v-show="item.name==currentSort.default"></i>
                </li>
              </ul>
              <ul class="content-price" v-show='showContent.type=="price"' @submit="priceClick()" ref="contentPrice">
                <li class="content-price-li forbidden-scroll">
                  <div class="price-select-form">
                    <form>
                      <div class="price-select-div">
                        <label>¥</label>
                        <input placeholder="请输入" v-model="lowPrice">
                      </div>
                    </form>
                    <div class="line"></div>
                    <form>
                      <div class="price-select-div">
                        <label>¥</label>
                        <input placeholder="请输入" v-model="highPrice">
                      </div>
                    </form>
                  </div>
                  <div class="price-select-search" @click="priceClick()">
                    <div class="button">搜索</div>
                  </div>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="servant-sort-cover forbidden-scroll" v-show="showContent.showCover" @click="coverClick()"
         ref="sortCover" @touchmove.prevent></div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import location from '@/service/common/location/location'
  export default{
    name: 'servantSort',
    props: {
      sortData: {
        type: Array,
        required: true
      },
      position: {
        type: Number,
        default: 0
      },
      scrollPosition: {
        type: Number,
        default: 0
      },
      useScroll: {
        type: Boolean,
        default: true
      },
      showSwitch: {
        type: Boolean,
        default: false
      },
      state: {
        type: Number,
        default: 1
      }
    },
    data(){
      return {
        showContent: {
          show: false,
          type: 'normal',
          showCover: false
        },
        currentSort: {},
        selectSort: {
          highPrice: null,
          lowPrice: null
        },
        highPrice: null,
        lowPrice: null,
        onTop: false,
        scrollWrap: null
      }
    },
    mounted(){
      this.initSelectSort()
      setTimeout(() => {
        // this.scrollWrap = document.body
        this.scrollWrap = this.$parent.$el.querySelector('._main') || this.$router.app.$el.querySelector('._main')
        if (this.useScroll) {
          this.scrollEvent()
        }
      }, 1000)
    },
    methods: {
      initSelectSort(){
        this.sortData.forEach(item => {
          if (item.key) {
            this.selectSort[item.key] = item.defaultValue
          }
        })
      },
      tabClick(item){
        if (this.showContent.show && item === this.currentSort) {
          this.hide()
        } else {
          this.currentSort = item
          this.$nextTick(() => {
            this.show(item)
          })
        }
      },
      coverClick(){
        this.hide()
      },
      priceClick(){
        let isNumber = /^\d*$/
        let highPrice = parseInt(this.highPrice)
        let lowPrice = parseInt(this.lowPrice)
        let highPriceTest = isNumber.test(this.highPrice)
        let lowPriceTest = isNumber.test(this.lowPrice)
        let flag = (highPriceTest && lowPriceTest && highPrice > lowPrice) ||
          (highPriceTest && this.lowPrice == null && highPrice > 0) ||
          (lowPriceTest && this.highPrice == null && lowPrice > 0) ||
          (this.highPrice == null && this.lowPrice == null)
        if (!flag) {
          Toast({
            message: '请输入正确的价格',
            position: 'bottom',
            duration: 3000
          })
          return
        }
        this.selectSort.highPrice = this.highPrice
        this.selectSort.lowPrice = this.lowPrice
        this.highPrice = null
        this.lowPrice = null
        this.hide()
        this.$emit('getSort', this.selectSort)
      },
      sortItemClick(item){
        if (this.currentSort.type === 'location' && item.check === true) {
          location.getLocation()
            .then(() => {
              this.selectSort[this.currentSort.key] = item.value
              this.$emit('getSort', this.selectSort)
              this.currentSort.default = item.name
              this.hide()
            })
            .catch(() => {
              Toast({
                message: '定位失败',
                position: 'bottom',
                duration: 3000
              })
              this.hide()
            })
        } else {
          this.selectSort[this.currentSort.key] = item.value
          this.currentSort.default = item.name
          this.$emit('getSort', this.selectSort)
          this.hide()
        }
      },
      show(item){
        this.scrollWrap.addEventListener('touchmove', this.forbiddenScroll, {passive: false})
        this.showContent.show = true
        this.showContent.type = item.type
        this.showContent.showCover = true
        this.$refs.sortCover.style.top = this.position + 'px'
        if (!this.onTop) {
          this.scrollWrap.scrollTop = this.scrollPosition
        }
      },
      hide(){
        this.onTop = false
        this.scrollWrap.removeEventListener('touchmove', this.forbiddenScroll)
        this.$refs.wrap.style.top = 0
        this.showContent.showCover = false
        this.showContent.show = false
        this.currentSort = this.sortData
      },
      scrollEvent(){
        setTimeout(() => {
          this.scrollWrap.onscroll = () => {
            if (this.scrollWrap.scrollTop >= this.scrollPosition) {
              this.onTop = true
              this.$refs.wrap.style.top = this.position + 'px'
            } else {
              if (!this.showContent.show) {
                this.onTop = false
                this.$refs.wrap.style.top = 0
              }
            }
          }
        }, 0)
      },
      forbiddenScroll(e){ // 阻值遮罩层下方滚动事件
        if (e.target.className.indexOf('forbidden-scroll') >= 0) {
          e.stopPropagation()
          e.preventDefault()
        }
      },
      switchClick(){
        this.$emit('onSwitch')
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  @import "servantSort.component.scss";

  .servant-sort-box {
    z-index: 9;
    position: relative;
    background: #ffffff;
    display: flex;
  }
</style>
