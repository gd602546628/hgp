<template>
  <div>
    <div class="couponCategory-select">
      <div class="scroll" ref="fcScroll">
        <ul class="scroll-ul">
          <li :class="{active:currentFcCateIndex==-1}" @click="allCateClick()">精选</li>
          <li class="jsLi"
              v-for=" (item,index) in allCategory"
              @click="fcCateClick(item)"
              :class="{active:index==currentFcCateIndex}"
              ref="fcCateEl"
          >{{item.cateName}}
          </li>
        </ul>
      </div>
      <div class="icon" @click="show()">
        <i class="icon-font icon-zyt-search1"></i>
      </div>
    </div>
    <transition name="draw">
      <div class="couponCategory-wrap"
           v-if="showList"
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
            >{{item.cateName}}
            </li>
          </ul>
        </div>
        <div class="fcCate forbidden-scroll">
          <ul>
            <li v-for=" (item,index) in fcCate" @click="fcCateClick(item)" class="forbidden-scroll">
              <div class="forbidden-scroll">{{item.cateName}}</div>
            </li>
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
  import {mapState} from 'vuex'
  export default{
    data(){
      return {
        allCategory: [],
        doorCate: [],
        fcCate: [],
        showList: false,
        currentFcCateIndex: -1,
        currentDoorCateIndex: 0,
        selectCategory: {
          doorCateName: null,
          fcName: null
        },
        leftPosition: [],
        allCateParams: {
          city: '玉溪市',
          country: '红塔区'
        }
      }
    },
    computed: {
      ...mapState(['selectCity'])
    },
    watch: {
      selectCity: {
        handler: function () {
          this.init()
        }
      }
    },
    created(){
      this.init()
    },
    methods: {
      fcCateClick(item){
        // this.currentFcCateIndex = this.allCategory.indexOf(item)
        for (let i = 0; i < this.allCategory.length; i++) {
          if (this.allCategory[i].cateName === item.cateName) {
            this.currentFcCateIndex = i
            break
          }
        }
        this.selectCategory.doorCateName = item.doorCateName
        this.selectCategory.fcName = item.cateName
        this.$emit('getCouponCate', this.selectCategory)
        this.setFcPosition()
        this.hide()
      },
      allCateClick(){
        this.currentFcCateIndex = -1
        this.selectCategory.doorCateName = null
        this.selectCategory.fcName = null
        this.$emit('getCouponCate', this.selectCategory)
      },
      doorCateClick(item, index){
        this.fcCate = item.nextCates
        this.currentDoorCateIndex = index
      },
      show(){
        document.addEventListener('touchmove', this.forbiddenScroll, {passive: false})
        this.showList = true
      },
      hide(){
        document.removeEventListener('touchmove', this.forbiddenScroll)
        this.showList = false
      },
      setFcPosition(){ /* 设置外面一级分类位置，使其保持在容器中央 */
        if (this.leftPosition[0] === 0 || this.leftPosition.length === 0) {
          let leftPosition = []
          if (!this.$refs.fcCateEl) return
          this.$refs.fcCateEl.forEach(item => {
            leftPosition.push(item.offsetLeft)
          })
          this.leftPosition = leftPosition
        }
        let currentLi = this.$refs.fcCateEl[this.currentFcCateIndex]
        let wrap = this.$refs.fcScroll
        console.log(this.$refs.fcScroll.offsetWidth, wrap.offsetWidth)
        if (!currentLi) return
        let target = this.leftPosition[this.currentFcCateIndex] - (wrap.offsetWidth - currentLi.offsetWidth) / 2 - wrap.offsetLeft
        Animation.animation(wrap, {scrollLeft: target}, 300, 'Linear')
      },
      forbiddenScroll(e){ // 阻值遮罩层下方滚动事件
        if (e.target.className.indexOf('forbidden-scroll') >= 0) {
          e.stopPropagation()
          e.preventDefault()
        }
      },
      async init(){
        let params = {
          city: this.selectCity.city,
          country: this.selectCity.country || null
        }
        this.allCateParams.city = this.selectCity.city
        this.allCateParams.country = this.selectCity.country || null
        this.allCategory = []
        this.doorCate = []
        this.fcCate = []
        this.currentFcCateIndex = -1
        this.selectCategory.doorCateName = null
        this.selectCategory.fcName = null
        getCategory.getCouponAllCate(this.allCateParams).then((data) => {
          this.allCategory = data
        })
        let data = await getCategory.getCouponCategory(params)
        this.doorCate = data
        this.fcCate = this.doorCate[0] && this.doorCate[0].nextCates
        // this.$emit('getCouponCate', this.selectCategory)
      },
      onSearch(){
        this.hide()
        this.$emit('onSearch')
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
        display: flex;
        padding-top: 15px;
        flex-wrap: wrap;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
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
</style>
