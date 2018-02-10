<template>
  <zyt-page :hasHeader="false" class="screen">
    <!--<mt-header class="index-title screen1" title="筛选" slot="header">
    </mt-header>-->
    <div slot="main" class="cate-ion-content screen1">
      <div class="list">
        <div class="item-divider">
          价格区间
        </div>
        <div class="item-input">
          <div><input @change="checkNum(0)" type="number" placeholder="最低价" v-model="formData.startPrice"></div>
          <div><input @change="checkNum(1)" type="number" placeholder="最高价" v-model="formData.endPrice"></div>
        </div>
        <div class="item item-divider">
          <p>商品分类<span v-if="selectCate.selected">{{selectCate.name}}</span></p>
        </div>
      </div>
      <div :style="cateStyle()">
        <div class="list">
          <div class="cateList" v-for="(cate, index) in cateList">
            <div class="cateList-title" @click="getchildrenCate(cate)">
              <p class="item chose-cate-name">{{cate.name}}
              </p>
              <i class="icon-zyt-arrows-down" :class="{'icon-zyt-arrows-up' : cate.show}"></i>
            </div>
            <div class="s-transition chose-cate-container "
                 v-show="cate.scList &&　cate.scList.length>0"
                 :class="{active:cate.show}"
            >
              <div class="chose-cate-container-cell">
                <p class="zyt-center"
                   :class="{'cate-selected' : cate.selected}"
                   @click="changeSelectCate(cate)"><span>全部</span>
                </p>
              </div>
              <div class="chose-cate-container-cell"
                   v-for="child in cate.scList">
                <p class="zyt-center"
                   :class="{'cate-selected': child.selected}"
                   @click="changeSelectCate(cate,child)"><span>{{child.name}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div @click="reset">重置</div>
        <div @click="submit">确定</div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  /* eslint-disable*/
  export default {
    props: ['cateList'],
    data () {
      return {
        formData: {
          startPrice: '',
          endPrice: ''
        },
       selectCate: {}
      }
    },
    methods: {
      getchildrenCate(cate) {
        if (cate.show) {
          cate.show = false
        } else {
          cate.show = true
        }
      },
      /**
       * 单选  取消选择 商品分类
       * @param cate 一级分类
       * @param child 二级分类 如果传入二级分类就不考虑一级分类
       */
      changeSelectCate(cate, child){
        var temp = child || cate // 如果传入二级分类就不考虑一级分类
        /********
         *
         * 将之前选中的cate设置成当前点击的code，这里有两种情况
         * this.selectCate=temp;
         * this.selectCate!=temp;
         *
         * 从而达到取消选中的功能
         * *******/
        this.selectCate['selected'] = temp['selected']
        this.selectCate = temp // 设置 this.selectCate 为最后点击的code
        /**
         * 有两种情况，和两种状态
         * 状态
         * this.selectCate['selected']=true；
         * this.selectCate['selected']=false；
         * @type {boolean}
         */
        this.selectCate['selected'] = !this.selectCate['selected']
      },
      resetFun(data){
        if (data && !this.isEmpty(data)) {
          this.formData = {
            startPrice: data.startPrice,
            endPrice: data.endPrice
          }
          this.cateList.forEach(function (item, i, arr) {
            if (item.id === data.id) {
              this.selectCate = item
              this.selectCate['selected'] = true
            } else {
              item['selected'] = false
            }
            item.scList.forEach(function (item, i, arr) {
              if (item.id === data.id) {
                this.selectCate = item
                this.selectCate['selected'] = true
              } else {
                item['selected'] = false
              }
            })
          })
        } else {
          this.formData = {
            startPrice: '',
            endPrice: ''
          }
          this.selectCate['selected'] = false
        }
      },
      reset(){ // 重置按钮
        this.resetFun()
        this.submit()
      },
      submit(){ //确定按钮
        if (this.selectCate['selected']) {
          if (this.selectCate['scList']) {
            this.formData['secondCateId'] = ''
            this.formData['firstCateId'] = this.selectCate['id']
          } else {
            this.formData['firstCateId'] = ''
            this.formData['secondCateId'] = this.selectCate['id']
          }
        } else {
          this.formData['secondCateId'] = ''
          this.formData['firstCateId'] = ''
        }
        this.offScreen()
        this.$emit("refreshPrdList", this.formData)
      },

      checkNum(type){
        if (type === 1) {
          if (isNaN(parseInt(this.formData.endPrice))) {
            this.formData.endPrice = ''
          }
        } else {
          if (isNaN(parseInt(this.formData.startPrice))) {
            this.formData.startPrice = ''
          }
        }
      },
      cateStyle(){
        // return {height: (window.innerHeight || document.body.clientHeight) - 225 + 'px'}
      },
      offScreen(){ // 关闭筛选
        this.$emit('offScreen')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .index-title {
    border-bottom-width: 1px !important;
    background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
    border-bottom: 1px solid #b2b2b2;
    border-top: 1px solid #b2b2b2;
    color: #2d2d2d;
  }

  .screen1 {
    width: 100%;
    .item-divider {
      height: 33px;
      line-height: 33px;
      padding: 0px 10px;
    }
    .item-input {
      height: 44px;
      margin: 0px 10px 10px 10px;
      padding-left: 6px !important;
      padding-right: 6px !important;
      border: 0px;
      display: flex;
      align-items: center;
      > div {
        height: 100%;
        width: 50%;
        padding: 5px 0px;
        background-color: #efefef;
        input {
          width: 100%;
          height: 100%;
          border-radius: 6px;
          text-align: center;
          border: none;
          background-color: white;
        }
      }
      > div:first-child {
        padding-left: 8px;
        padding-right: 12px;
      }
      > div:last-child {
        padding-right: 8px;
        padding-left: 12px;
      }
    }
  }

  .screen {
    .cate-ion-content {
      .footer {
        position: fixed;
        bottom: 0px;
        left: 0px;
        height: 35px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          width: 50%;
          text-align: center;
          height: 35px;
          line-height: 35px;
          font-size: 15px;
          background: #066cc2;
          color: white;
        }
        > div:first-child {
          background: #e5f2fc;
          color: #066cc2;
          border-left-width: 1px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        >div:last-child{
          border-right-width: 1px;
          border-radius: 0 4px 4px 0;
        }
      }
    }

    .cate-ion-content .list {
      margin-bottom: 0px;
    }

  }

  .chose-cate-container {
    max-height: 0px;
    overflow: hidden;
    max-height: 0;
    &.active {
      max-height: 1000px;
      overflow-y: auto
    }
  }

  .cate-ion-content .list {
    margin-bottom: 0px;
  }

  .cate-ion-content .item-divider, .cate-ion-content .item-divider p, .cate-ion-content .item-divider span {
    line-height: 44px;
    height: 44px;
    color: #2d2d2d;
    font-size: 14px;
    background: white;
  }

  .cate-ion-content .price-chose.item {
    width: auto;
    height: 44px;
    margin: 0px 10px 10px 10px;
    padding-left: 6px !important;
    padding-right: 6px !important;
    border: 0px;
  }

  .cate-ion-content .price-chose.item > div {
    width: 50%;
  }

  .cate-ion-content .price-chose input {
    padding: 0px 5px;
    text-align: center;
    border-radius: 6px;
  }

  .cate-reset-btn {
    height: 100%;
    line-height: 35px !important;
    background: #ffd6d6;
    color: #FF3C3C;
    font-size: 15px !important;
  }

  .cate-ok-btn {
    height: 100%;
    line-height: 35px !important;
    background: #FF3C3C;
    color: #FFFFFF;
    font-size: 15px !important;
  }

  .cate-footer-bar {
    border: 0px;
    padding: 0px;
  }

  .cate-ion-content .item-divider:first-child {
    height: 33px;
    line-height: 33px;
  }

  .cate-ion-content .item-divider span {
    color: #066cc2;
    padding-left: 10px;
  }

  .chose-cate-container {
    padding: 0px 6px;
  }

  .chose-cate-container {
    font-size: 0px;
    letter-spacing: -3px;
  }

  .cate-ion-content .item {
    padding: 0px 10px !important;
  }

  .cate-ion-content .chose-cate-container-cell {
    font-size: 0px;
    letter-spacing: -3px;
    display: inline-block;
    vertical-align: middle;
    width: 50%;
    overflow: hidden;
    font-size: 12px;
    vertical-align: middle;
  }
  .zyt-center{
    line-height: 43px;
  }
  .cate-selected {
    background: #e5f2fc !important;
  }

  .cate-selected span {
    color: #066cc2;
  }

  .cate-selected:after {
    content: '';
    position: absolute;
    right: 0px;
    bottom: 0px;
    display: block;
    width: 33px;
    height: 25px;
    background-image: url("../../../assets/img/doorIndeximg/close2.png");
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .cate-ion-content .chose-cate-container-cell p {
    padding: 0px 5px;
    position: relative;
    vertical-align: middle;
    height: 43px;
    overflow: hidden;
    text-align: center;
    margin: 4px;
    font-size: 0px;
    letter-spacing: 1px;
    font-size: 12px;
    background: #f0f2f5;
    border-radius: 3px;
  }

  .cateList-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    i {
      font-size: 12px;
      color: rgb(82, 82, 82);
    }
  }

  .item.chose-cate-name {
    position: relative;
    height: 44px;
    line-height: 44px;
    color: #525252;
    font-size: 14px;
    padding: 0 0 0 0px !important;
  }

  .chose-cate-name::after {
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    width: 25px;
    right: 10px;
    top: 0px;
  }

  .chose-cate-name-active::after {
  }
</style>
