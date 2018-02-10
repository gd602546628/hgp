<template>
  <div>
    <div class="couponCategory-select">
      <div class="scroll" ref="fcScroll">
        <ul class="scroll-ul">
          <li @click="allCateClick()" :class="{active:currentFcCateIndex==-1}">精选</li>
          <li class="jsLi"
              v-for=" (item,index) in allCategory"
              @click="fcCateClick(item)"
              :class="{active:index==currentFcCateIndex}"
              ref="fcCateEl"
          >{{item.cateName || item.name}}
          </li>
        </ul>
      </div>
      <div class="icon" @click="show()">
        <i class="icon-font icon-zyt-search1"></i>
      </div>
    </div>
    <transition name="draw">
      <div class="couponCategory-wrap"
           v-show="showList"
      >
        <div class="head">
          <div class="search forbidden-scroll" @click="onSearch()">
            <i name="search" class="icon-font icon-zyt-search"></i>
            <p class="forbidden-scroll">搜索</p>
          </div>
          <div class="cancel" @click="hide()">
            取消
          </div>
        </div>
        <div class="doorCate">
          <ul v-if="doorCate">
            <li
              v-for=" (item,index) in doorCate"
              @click="doorCateClick(item,index)"
              :class="{active:index==currentDoorCateIndex}"
              class="forbidden-scroll"
            >{{item.cateName}}
            </li>
          </ul>
        </div>
        <div class="fcCate">
          <ul v-for=" item in fcCate">
            <div class="tittle">{{item.cateName}}</div>
            <div class="goods-classify">
              <li v-for=" sc in item.nextCates" @click="fcCateClick(sc,item)">
                <div>{{sc.cateName}}</div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </transition>
    <div class="couponCategory-cover forbidden-scroll" v-show="showList" @click="hide()"></div>
  </div>
</template>
<script>
  import getCategory from '@/service/getCategory/getCategory.service'
  import Animation from '@/service/common/animation/animation'

  export default {
    data() {
      return {
        allCategory: [],
        doorCate: [],
        fcCate: [],
        showList: false,
        currentFcCateIndex: -1,
        currentDoorCateIndex: 0,
        currentFc: null,
        isSc: false,
        selectCategory: {
          scName: null,
          fcName: null
        },
        leftPosition: []
      }
    },
    props: {
      doorCateMap: {
        type: Array,
        default: null
      },
      prdType: {
        type: Number,
        default: 0
      },
      city: {
        type: String,
        default: ''
      },
      country: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      'position': 'init'
    },
    computed: {
      position() {
        return this.country || this.city
      }
    },
    methods: {
      init() {
        this.currentFcCateIndex = -1
        this.setFcPosition()
        let params = {
          doorCateNames: this.doorCateMap,
          prdType: this.prdType
        }
        if (this.city) {
          params.city = this.city
        }
        if (this.country) {
          params.country = this.country
        }
        getCategory.getGoodsCategory(params).then(data => {
          this.doorCate = data
          this.fcCate = this.doorCate[0].nextCates
          let allFirstCate = []
          data.forEach(doorCate => {
            doorCate.nextCates.forEach(fcCate => {
              allFirstCate.push(fcCate)
            })
          })
          this.allCategory = allFirstCate
          this.resetPositionArr()
          this.selectCategory.fcName = data[0].name
          this.$emit('getGoodsCate', this.selectCategory)
        })
      },
      fcCateClick(item, fcCate) {
        if (item.nextCates) { // 一级分类点击
          this.selectCategory.fcName = item.cateName
          this.selectCategory.scName = null
        } else { // 二级分类点击
          this.selectCategory.fcName = item.parent
          this.selectCategory.scName = item.cateName
        }
        if (fcCate) {
          this.currentFc = fcCate
          this.allCategory = this.currentFc.nextCates
        }
        this.currentFcCateIndex = this.allCategory.indexOf(item)
        this.$emit('getGoodsCate', this.selectCategory)
        this.resetPositionArr()
        this.hide()
      },
      allCateClick() {
        this.selectCategory.fcName = null
        this.selectCategory.scName = null
        this.currentFcCateIndex = -1
        this.$emit('getGoodsCate', this.selectCategory)
      },
      doorCateClick(item, index) {
        this.fcCate = item.nextCates
        this.currentDoorCateIndex = index
      },
      show() {
        document.addEventListener('touchmove', this.forbiddenScroll, {passive: false})
        this.showList = true
      },
      hide() {
        document.removeEventListener('touchmove', this.forbiddenScroll)
        this.showList = false
      },
      setFcPosition() { /* 设置外面一级分类位置，使其保持在容器中央 */
        if (this.currentFcCateIndex === -1) {
          if (this.$refs.fcScroll) {
            this.$refs.fcScroll.scrollLeft = 0
          }
          return
        }
        let currentLi = this.$refs.fcCateEl[this.currentFcCateIndex]
        let wrap = this.$refs.fcScroll
        let target = this.leftPosition[this.currentFcCateIndex] - (wrap.offsetWidth - currentLi.offsetWidth) / 2 - wrap.offsetLeft
        Animation.animation(wrap, {scrollLeft: target}, 300, 'Linear')
      },
      resetPositionArr() {
        this.leftPosition = []
        this.$nextTick(() => {
          if (this.$refs.fcCateEl) {
            this.$refs.fcCateEl.forEach(item => {
              this.leftPosition.push(item.offsetLeft)
            })
          }
          this.setFcPosition()
        })
      },
      forbiddenScroll(e) { // 阻值遮罩层下方滚动事件
        if (e.target.className.indexOf('forbidden-scroll') >= 0) {
          e.stopPropagation()
          e.preventDefault()
        }
      },
      onSearch() {
        this.$emit('onSearch')
        this.hide()
      }
    },
    activated(){
      this.setFcPosition()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .couponCategory-select {
    display: flex;
    height: 40px;
    width: 100%;
    background: #0164a6;
    .scroll {
      flex: 1;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      .scroll-ul {
        height: 100%;
        white-space: nowrap;
        font-size: 14px;
        li {
          height: 40px;
          line-height: 40px;
          color: #ffffff;
          list-style: none;
          display: inline-block;
          margin-left: 20px;
          &.active {
            border-bottom: 3px solid #ffffff;
          }
        }
      }
    }
    .icon {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-font {
        font-size: 24px;
        color: #ffffff;
      }
    }
  }

  .couponCategory-cover {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
  }

  .couponCategory-wrap {
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    right: 0;
    transition: all 0.2s ease;
    &.draw-enter, &.draw-leave-active {
      transform: translateY(-100%);
    }
    .head {
      display: flex;
      height: 44px;
      padding-left: 10px;
      border-bottom: 1px solid #efefef;
      .search {
        flex: 1;
        display: flex;
        margin: 9px 0;
        align-items: center;
        border-right: 1px solid #d9d9d9;
        .icon-font {
          font-size: 16px;
          color: #88888d;
        }
        p {
          margin-left: 10px;
          color: #88888d;
          font-size: 15px;
        }
      }
      .cancel {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #88888d;
        font-size: 15px;
      }
    }
    .doorCate {
      width: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      border-bottom: 1px solid #efefef;
      ul {
        display: flex;
        li {
          min-width: 80px;
          height: 44px;
          margin-left: 20px;
          color: #343434;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          &.active {
            color: #0164a6;
            border-bottom: 3px solid #0164a6;
          }
        }
      }
    }

    .fcCate {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      height: 330px;
      ul {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        -webkit-justify-content: center;
        -webkit-align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding-top: 15px;
        .tittle {
          height: 40px;
          /*width: 100%;*/
          line-height: 40px;
          color: #0164a6;
          margin-left: 10px;
          margin-bottom: 0;
          background-image: url('../../assets/img/biaoti.png');
          background-repeat: no-repeat;
          background-position: center left;
          background-size: 12px 12px;
          padding-left: 15px;
          font-size: 13px;
          display: block;
        }
        .goods-classify {
          width: 100%;
          display: flex;
          display: -webkit-flex;
          -webkit-flex-wrap: wrap;
          -webkit-justify-content: flex-start;
          -webkit-align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          li {
            /* display: -webkit-flex;
             display: flex;
             -webkit-justify-content: center;
             -webkit-align-items: center;
             align-items: center;
             justify-content: center;
             -webkit-flex-wrap: wrap;
             flex-wrap: wrap;*/
            display: block;
            width: 33.33%;
            list-style: none;
            color: #232326;
            padding: 0 10px;
            margin-bottom: 15px;
            div {
              background: #f0f2f5;
              border-radius: 4px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              padding: 0 6px;
              font-size: 13px;
              height: 30px;
              line-height: 30px;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
