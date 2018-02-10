/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="row">
    <button :class="showCol()" @click="sub()" :disabled="subDisabled">-</button>
    <div class="col">
      <input type="number" :class="showHint()" v-model="currentValue" readonly>
    </div>
    <button :class="showCol()" @click="sum()" :disabled="sumDisabled">+</button>
  </div>

</template>

<script lang="babel">
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 0
      },
      min: {
        type: Number,
        default: 1
      }
    },
    computed: {
      subDisabled(){
        return this.currentValue <= this.min
      },
      sumDisabled(){
        return this.max > 0 && this.currentValue >= this.max
      }
    },
    methods: {
      showHint(){
        if (this.max > 0) {
          return 'number'
        } else {
          return 'number1'
        }
      },
      showCol(){
        if (this.max > 0){
          return 'col'
        } else {
          return 'col1'
        }
      },
      sum(){
        if (this.max > 0 || this.max > 0 && this.currentValue < this.max) {
          this.currentValue++
        } else {
        }
      },
      sub(){
        if (!this.min || this.max > 0 && this.currentValue > this.min) {
          if (this.currentValue > 0) {
            this.currentValue--
          }
        } else {
        }
      }
    },
    watch: {
      max(val){
        if (this.currentValue > val) {
          this.currentValue = val
        }
      },
      value(val){
        if (this.max > 0){
          this.currentValue = val
        } else {
          this.currentValue = 1
        }
      },
      currentValue(val) {
        try {
          this.currentValue = parseInt(val)
          this.$emit('input', val)
        } catch (e) {
        }
      }
    },
    data(){
      return {
        currentValue: this.value
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .row {
    border: 1px solid map_get($ComBorderColor, dd);
    // border: .55px solid map_get($ComBorderColor, dd);
    border-radius: 3px;
    height: 30px;
    .col {
      height: 100%;
      /*display: -webkit-flex;*/
      /*-webkit-justify-content: center;*/
      /*-webkit-align-items: center;*/
      /*display: flex;*/
      /*align-items: center;*/
      /*justify-content: center;*/
      font-size: 22px;
    }
    button.col {
      width: 30px;
      max-width: 30px;
      height: 30px;
      /*font-weight: 800;*/
      flex-shrink: 1;
      border: 0;
      background-color: transparent;
      /*display: -webkit-flex;*/
      /*display: flex;*/
      /*-webkit-justify-content: center;*/
      /*-webkit-align-items: center;*/
      /*justify-content: center;*/
      /*align-items: center;*/
      text-align: center;
      &:active {
        background-color: map_get($ComColors, gray-c);
      }
    }
    button.col1 {
      width: 30px;
      max-width: 30px;
      height: 30px;
      /*font-weight: 800;*/
      flex-shrink: 1;
      border: 0;
      background-color: transparent;
      /*display: -webkit-flex;*/
      /*display: flex;*/
      /*-webkit-justify-content: center;*/
      /*-webkit-align-items: center;*/
      /*justify-content: center;*/
      /*align-items: center;*/
      text-align: center;
      color: #f8311e;
    }
    div.col {
      flex-shrink: 2;
      /*display: block;*/
      .number {
        display: block;
        height: 100%;
        width: 88px;
        font-size: 16px;
        border: 1px solid map_get($ComBorderColor, dd);
       // border: .55px solid map_get($ComBorderColor, dd);
        border-top: 0;
        border-radius: 0;
        border-bottom: 0;
        text-align: center;
      }
      .number1{
        display: block;
        height: 100%;
        width: 88px;
        font-size: 16px;
        border: 1px solid #f8311e;
        color: #f8311e;
        // border: .55px solid map_get($ComBorderColor, dd);
        border-top: 0;
        border-radius: 0;
        border-bottom: 0;
        text-align: center;
      }
    }
  }
</style>
