<template>
  <!--<transition name="flyOut">-->
  <div class="wrap common-search-wrap" v-show="visible" ref="wrap">
    <div class="commonSearch">
      <div class="search-head">
        <form class="form" @submit.prevent="close(searchStr)">
          <input type="search" autofocus="autofocus" placeholder="搜索" ref="search"
                 class="input"
                 v-model="searchStr"
          >
          <!-- <div class="icon-item">
             <i name="ios-search-outline" class="icon-zyt-search"></i>
           </div>-->
        </form>
        <div class="cancel" @click="close(searchStr)">搜索</div>
      </div>
    </div>
    <div class="content">

      <div class="main-searchWrap" v-show="isMain">
        <div class="title main-search">指定搜索内容</div>
        <div class="category">
          <div @click="selectType(1)">
            <i class="icon-zyt-favorable"></i>
            优惠
            <span></span>
          </div>
          <div @click="selectType(2)">
            <i class="icon-zyt-product"></i>
            商品
            <span></span>
          </div>
          <div @click="selectType(3)">
            <i class="icon-zyt-diamond"></i>
            服务
            <span></span>
          </div>
          <div @click="selectType(4)">
            <i class="icon-zyt-store2"></i>
            店铺
            <span></span>
          </div>
        </div>
        <div class="margin-bottom"></div>
      </div>

      <div class="title" v-show="historyArr.length!==0">历史记录</div>
      <div class="title" v-show="historyArr.length==0">暂无搜索记录</div>
      <ul class="list">
        <li class="list-item" v-for="(item,index) in historyArr">
          <p @click="search(item)">{{item}}</p>
          <span>
           <i class="icon-zyt-close-mark" @click="removeHistory(index)"></i>
         </span>
        </li>
        <p class="clean" @click="cleanHistory()" v-show="historyArr.length!==0">清除历史记录</p>
      </ul>
    </div>
  </div>
  <!--</transition>-->
</template>
<script>
  import {mapMutations} from 'vuex'
  import localStorage from '@/service/common/localStorage/localStorage.service'

  export default {
    data() {
      return {
        historyArr: [],
        searchStr: '',
        historyMap: ['servantMainSearch', 'couponSearch', 'selectedGoodSearch', 'serviceSearch', 'goodLifeSearch', 'newSearchCoupon', 'selectedGoodSearchOnline'],
        state: 0,
        visible: false,
        isMain: true,
        type: 0
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapMutations(['SelectCityMutation']),
      async init() {
        setTimeout(() => {
          this.state = this.historyMap[this.type]
          this.historyArr = localStorage.getStorage(this.state) || []
        }, 0)
      },
      close(str) {
        if (typeof str !== 'undefined') {
          if (this.historyArr.indexOf(str) >= 0) {
            this.historyArr.splice(this.historyArr.indexOf(str), 1)
          } else if (str !== '') {
            this.historyArr.unshift(str)
          }
          localStorage.setStorage(this.state, this.historyArr)
          this.$emit('close', {keyword: str, type: this.historyMap[this.type]})
        } else {
          this.$emit('close', undefined)
        }
      },
      selectType(type) {
        this.state = this.historyMap[type]
        this.type = type
        this.historyArr = localStorage.getStorage(this.state) || []
        this.isMain = false
      },
      removeHistory(index) {
        this.historyArr.splice(index, 1)
        localStorage.setStorage(this.state, this.historyArr)
      },
      cleanHistory() {
        this.historyArr = []
        localStorage.remove(this.state)
      },
      search(item) {
        this.historyArr.splice(this.historyArr.indexOf(item), 1)
        this.historyArr.unshift(item)
        localStorage.setStorage(this.state, this.historyArr)
        this.$emit('close', {keyword: item, type: this.historyMap[this.type]})
      }
    }
  }
</script>
<style rel='stylesheet/scss' lang="scss" type="text/scss" scoped>
  .flyOut-enter, .flyOut-leave-active {
    transform: translateX(100%);
  }

  .wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: scroll;
    background: #ffffff;
    z-index: 1000;
    transition: all 0.3s ease;
    background: black;
  }

  .common-search-wrap {
    background: #f2f2f2;
    .commonSearch {
      .search-head {
        display: flex;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        padding: 0 10px;
        .form {
          flex: 1;
          position: relative;
          padding-left: 10px;
          border-radius: 6px;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          height: 34px;
          .input {
            height: 100%;
            border: none;
            width: 96%;
            // padding-left: 30px;
            //line-height: 100%;
            /* line-height: 38px;*/
            font-size: 14px;
          }
          .icon-item {
            position: absolute;
            left: 10px;
            top: 0;
            display: flex;
            align-items: center;
            height: 100%;
            i {
              font-size: 20px;
            }
          }
        }
        .cancel {
          width: 31px;
          height: 38px;
          color: #0164a6;
          margin-left: 10px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .content {
      background: #ffffff;
      .main-searchWrap {
        .margin-bottom {
          height: 8px;
          background: #f2f2f2;;
        }
      }
      .category {
        display: flex;
        height: 50px;
        color: #0164a6;
        font-size: 16px;
        div {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          span {
            width: 1px;
            height: 26px;
            background-color: #efefef;
            position: absolute;
            right: 0px;
            top: 50%;
            margin-top: -13px;
          }
          i {
            font-size: 16px;
            margin-right: 6px;
            position: relative;
            top: 1px;
          }
        }
      }
      .title {
        display: flex;
        align-items: center;
        height: 44px;
        color: #88888d;
        padding-left: 18px;
        border-bottom: 1px solid #eeeeee;
        &.main-search {
          border-bottom: none;
        }
      }
      .list {
        .clean {
          text-align: center;
          color: #9b9b9b;
          height: 40px;
          line-height: 40px;
          background: #ffffff;
        }
        .list-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 6px 10px;
          border-bottom: 1px solid #eeeeee;
          background: #ffffff;
          color: #9b9b9b;
          p {
            flex: 1;
            margin: 0 10px;
            color: #000000;
            font-size: 15px;
            line-height: 30px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
            text-overflow: ellipsis;
          }
          span {
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: flex-end;
            width: 40px;
            i {
              font-size: 14px;
              color: #CBCBCB;
            }
          }
        }
      }
    }
  }
</style>
