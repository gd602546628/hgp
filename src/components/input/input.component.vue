/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="container">
    <div class="relative " :class="{'z-index-top':showValues}">
      <div class="row input-container">
        <div class="col label-container" v-if="label"><label v-for="item in label">{{item}}</label></div>
        <div class="col">
          <input v-if="checkType('text')"
                 type="text"
                 class="input"
                 autocomplete="off"
                 ref="input" @focus="onFocus(true)"
                 @blur="onFocus(false)"
                 :maxlength="maxlength"
                 v-model="currentValue"
                 :placeholder="placeholder">
          <input v-if="checkType('number')"
                 type="number"
                 class="input"
                 autocomplete="off"
                 ref="input"
                 @focus="onFocus(true)"
                 @blur="onFocus(false)"
                 :maxlength="maxlength"
                 v-model="currentValue"
                 :placeholder="placeholder">
          <input v-if="checkType('password')"
                 type="password"
                 class="input"
                 autocomplete="off"
                 ref="input"
                 @focus="onFocus(true)"
                 @blur="onFocus(false)"
                 :maxlength="maxlength"
                 v-model="currentValue"
                 :placeholder="placeholder">
        </div>
        <!--清除按钮-->
        <div class="col input-extend" v-if="showClear()">
          <input v-if="checkType('text')" @click="clearValue()" type="text" class="input-empty">
          <input v-if="checkType('password')" @click="clearValue()" type="password" class="input-empty">
          <input v-if="checkType('number')" @click="clearValue()" type="number" class="input-empty">
          <input v-if="checkType('tel')" @click="clearValue()" type="tel" class="input-empty">
          <i class="icon-zyt-close"></i>
        </div>
        <!--显示影藏密码按钮-->
        <div class="col input-eye input-extend " :class="{disable:currentType==='password'}" v-if="eye">
          <input @click="changePassword" v-if="checkType('text')" type="text" class="input-empty">
          <input @click="changePassword" v-if="checkType('password')" type="password" class="input-empty">
          <input @click="changePassword" v-if="checkType('number')" type="number" class="input-empty">
          <i :class="getEyeClass"></i>
        </div>

        <!--下拉内容按钮-->
        <div class="col  input-extend " v-if="values.length>0">
          <input @click="switchShowValue" v-if="checkType('text')" type="text" class="input-empty">
          <input @click="switchShowValue" v-if="checkType('password')" type="password" class="input-empty">
          <input @click="switchShowValue" v-if="checkType('number')" type="number" class="input-empty">
          <i class="icon-zyt-arrows-down"></i>
        </div>

      </div>
      <div class="value-list" ref="valueList">
        <div ref="valueContainer">
          <p v-for="val in values" @click="setValue(val)">{{val}}</p>
        </div>
      </div>
    </div>
    <div class="bg" :class="{'hide':!showValues}" ref="bg" @clcik="switchShowValue"></div>
  </div>
</template>

<script lang="babel">
  export default {
    props: {
      value: {
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      maxlength: {
        type: String,
        default: '100'
      },
      placeholder: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      eye: {
        type: Boolean,
        default: false
      },
      values: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      getEyeClass(){
        if (this.currentType === 'password') {
          return 'icon-zyt-hidden'
        } else {
          return 'icon-zyt-show'
        }
      }
    },
    methods: {
      checkType(type){
        return type === this.currentType
      },
      clearValue(){
        this.$refs.input.focus()
        this.currentValue = ''
      },
      changePassword(){
        let password = 'password'
        let text = 'text'
        this.currentType = this.currentType === password ? text : password
        setTimeout(() => {
          this.$refs.input.focus()
        }, 10)
      },
      onFocus(state){
        setTimeout(() => {
          this.focus = state
        }, 0)
      },
      showClear(){
        return this.focus && (this.currentValue || this.currentValue === 0)
      },
      switchShowValue(){
        this.showValues = !this.showValues
        this.$refs.input.focus()
        if (this.showValues) {
          this.$refs.valueList.style.height = this.$refs.valueContainer.offsetHeight + 'px'
        } else {
          this.$refs.valueList.style.height = 0 + 'px'
        }
      },
      setValue(val){
        this.currentValue = val
        this.switchShowValue()
      }
    },
    watch: {
      value(val){
        this.currentValue = val
      },
      currentValue(val) {
        val = val.toString().slice(0, this.maxlength)
        this.currentValue = val
        this.$emit('input', val)
      }
    },
    data(){
      return {
        currentValue: this.value,
        currentType: this.type,
        focus: false,
        showValues: false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .container {
    .relative {
      padding: 0 10px;
      position: relative;
      z-index: 2;
      background: white;
      &.z-index-top {
        z-index: 9;
      }
    }
    .input-container {
      height: 40px;
      .col {
        display: flex;
        align-items: center;
      }
      input.input {
        font-size: 15px;
        width: 100%;
        border: 0;
        &:active {
          background: transparent;
        }
        &:focus {
          background: transparent;
        }
      }
      .label-container {
        justify-content: space-between;
        max-width: 80px;
        padding-right: 20px;
        label {
          display: flex;
          justify-content: space-between;
        }
      }
      .input-extend {
        pointer-events: none;
        justify-content: center;
        max-width: 30px;
        color: map_get($ComColors, gray);
        input {
          pointer-events: auto;
          height: 100%;
          width: 100%;
          border: 0px;
        }
        i {
          pointer-events: none;
          margin-left: -20px;
          display: block;
        }
        &.input-eye {
          color: map_get($ComColors, wathet-blue);
          &.disable {
            color: map_get($ComColors, gray);
          }
        }
      }
    }
    .bg {
      position: fixed;
      width: 100%;
      top: 0;
      bottom: 0;
      background: black;
      opacity: .5;
      z-index: 3;
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
    }
    .value-list {
      z-index: 9;
      left: -10px;
      right: -10px;
      height: 0px;
      overflow: hidden;
      position: absolute;
      transition: all .5s cubic-bezier(.55, 0, .1, 1);
      p {
        &:first-child {
          border-top: 1px solid map_get($ComBorderColor, ef);
        }
        border-bottom: 1px solid map_get($ComBorderColor, ef);
        width: 100%;
        height: 35px;
        line-height: 35px;
        background: white;
        padding-left: 100px;
        font-size: 15px;
      }
    }
  }
</style>
