<template>
  <div class="star-item" :style="heightFn()">
    <div class="score-box" :style="widthFn()">
      <div class="upBox" :style="upDivStyleFn()">
        <i class="icon-zyt-star-score" v-for="arr in arrs" :style="bgSizeFn()"></i>
      </div>
      <div class="downBox" :style="widthFn()">
        <i class="icon-zyt-star-score" v-for="arr in arrs" :style="bgSizeFn()"></i>
      </div>
      <div class="row" v-if="this.isShowInput">
        <button class="col" v-for="(val,i) in new Array(6)" @click.stop="setValue(i)" :key="i"></button>
      </div>
      <!--
            <input v-if="this.isShowInput" type="range" min="0" max="5" step="1" v-model="currentStart">
      -->
    </div>
    <div v-if="!this.isShowInput && this.isStar" class="score-praise score-aaa" :style="lineHeightFn()">{{start |
      startFn}}
    </div>
    <div v-if="this.isShowInput && !this.isStar" class="score-praise" :style="lineHeightFn()">好评率：{{(start * 10)}}%
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      bgSize: {
        type: Number,
        default: 20
      },
      value: {
        type: Number || String,
        default: 5
      },
      isShowInput: {
        type: Boolean,
        default: false
      },
      isStar: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        currentStart: parseFloat(this.value),
        arrs: new Array(5)
      }
    },
    watch: {
      currentStart (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentStart = parseFloat(val)
      }
    },
    computed: {
      start () {
        if (this.currentStart > 10) {
          return 10
        } else if (this.currentStart < 0) {
          return 0
        }
        return this.currentStart
      }
    },
    methods: {
      setValue(val){
        this.currentStart = val
      },
      /**
       * heightFn():高度
       */
      heightFn () {
        return {'height': this.bgSize + 'px'}
      },

      /**
       * widthFn():宽度
       */
      widthFn () {
        return {'width': (this.bgSize * 5) + 'px'}
      },

      /**
       * lineHeightFn():行高
       */
      lineHeightFn () {
        return {'line-height': this.bgSize >= 20 ? this.bgSize + 'px' : 20 + 'px', 'height': this.bgSize + 'px'}
      },

      /**
       * bgSizeFn():背景大小样式
       */
      bgSizeFn () {
        return {'font-size': this.bgSize + 'px'}
      },

      /**
       * upDivStyleFn():覆盖层样式
       */
      upDivStyleFn () {
        let start = 0
        start = parseInt(this.value) * 2
        start = this.value % 1 ? start + 1 : start
        start = parseInt(start)
        return {'width': (start * 10) + '%'}
        /*    if (this.isShowInput) {
         return {'width': (this.start * 10) + '%'}
         } else {
         return {'width': (this.star * 20) + '%'}
         } */
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .star-item {
    display: flex;
    align-content: center;
    min-height: 20px;
    /* pointer-events: none; */
    .score-box {
      pointer-events: none;
      position: relative;
      width: auto;
      z-index: 1;
      .row {
        pointer-events: auto;
        button {
          height: 100%;
          pointer-events: auto;
        }
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 999;
        top: 0;
        left: 0;
      }
      .upBox {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 2;
        color: #ffa902;
        overflow: hidden;
      }
      .downBox {
        color: #d6d3ce !important;
        i {
          color: #d6d3ce !important;
        }
      }
      input {
        width: 100%;
        pointer-events: auto;
        position: absolute;
        z-index: -1;
        top: 10%;
        left: 0px;
        height: 80%;
      }
      input[type=range] {
        -webkit-appearance: none;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1px;
        margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
        background: #ff4859;
        border-radius: 50%;
        border: none;
        box-shadow: none;
      }
    }
    .score-praise {
      margin-left: 6px;
    }
    .score-aaa {
      color: #aaaaaa;
    }
  }
</style>
