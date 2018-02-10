/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div>
    <div class="row" ref="row" :class="className">
      <div class="col" :class="active(0)" @click="toTop()">商品</div>
      <div class="col" :class="active(1)" @click="toDetail()" ref="detail">详情</div>
      <div class="col" :class="active(2)" v-if="hasComment" @click="toComment()" ref="comment">评价</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      hasComment: {
        type: Boolean,
        default: false
      },
      opacityHeight: {
        type: Number,
        default: 150
      },
      currentTop: {
        type: Number,
        default: 0
      },
      scrollPosition: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        className: {},
        top: 44
      }
    },
    computed: {},
    watch: {
      'currentTop': 'onScroll'
    },
    methods: {
      onScroll(top){
        this.$refs.row.style.opacity = top / this.opacityHeight
        if (this.top < top) {
          this.className = {
            active: true
          }
        } else {
          this.className = {
            active: false
          }
        }
      },
      toTop(){
        this.$emit('scrollTop')
      },
      toDetail(){
        this.$emit('scrollDetail')
      },
      toComment(){
        this.$emit('scrollComment')
      },
      active(position){
        return {
          active: this.scrollPosition === position
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .row {
    box-sizing: border-box;
    padding: 0 44px;
    height: 44px;
    position: fixed;
    width: 100%;
    background: white;
    opacity: 0;
    pointer-events: none;
    font-size: 16px;
    z-index: 9;
    background-color: white;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    &.active {
      pointer-events: auto;
    }
    .col {
      /* border-bottom: 2px solid transparent; */
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      &.active {
        color: map_get($ComColors, wathet-blue);
        /* border-bottom: 2px solid map_get($ComColors, wathet-blue); */
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  @import '../../../assets/css/variables-primary.scss';

  .product-right-top-menu {
    .right-menu-icon {
      .menu-icon {
        color: map_get($ComColors, wathet-blue) !important;
        font-size: 18px;
      }
      &:after {
        background: transparent !important;
      }
    }
  }
</style>
