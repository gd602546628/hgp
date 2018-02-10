/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <form id="password-form" class="login-form" onsubmit="javascript:return false">
    <div class="tel-container">
      <mt-field label="手机号" type="tel" :attr="{ maxlength: 11}" placeholder="请输入手机号/互联网+服务账号"
                v-model="data.username">
        <button v-if="valueList.length>0" @click="switchShowValue()" class="right-btn-container">
          <i class="icon-zyt-arrows-down"></i>
        </button>
      </mt-field>
    </div>
    <div class="blankDiv"></div>
    <mt-field label="密码" :type="password" :attr="{ maxlength: 20}" placeholder="请输入密码" v-model="data.password">
      <button @click="changePassword()" class="right-btn-container">
        <i :class="getEyeClass"></i>
      </button>
    </mt-field>
    <div class="blankDiv"></div>
    <div class="line line-padding">
      <button type="submit" class="btn submit" @click="submit()">登录</button>
    </div>

    <div class="value-list" :class="{show:showValues}">
      <div ref="valueList" class="limit-height">
        <div class="value-item-container" ref="valueContainer">
          <button class="value-item" v-for="val in valueList" @click="setValue(val)">{{val}}</button>
        </div>
      </div>
      <div class="bg" ref="bg">
      </div>
    </div>
    <slot></slot>
  </form>
</template>

<script lang="babel">
  import Util from '@/service/common/utils/util.service'
  import Input from '@/components/input/input.component'
  /**
   * 父组件可以监听 submit
   */
  export default {
    props: {
      valueList: {
        default: () => []
      },
      data: {
        default: () => {
          return {
            username: '18213837544',
            password: '111111',
            picCode: '111111'
          }
        }
      }
    },
    data: () => {
      return {
        isPassword: true,
        showValues: false
      }
    },
    computed: {
      password(){
        if (this.isPassword) {
          return 'password'
        } else {
          return 'text'
        }
      },
      getEyeClass(){
        if (this.isPassword) {
          return 'icon-zyt-hidden'
        } else {
          return 'icon-zyt-show'
        }
      }
    },
    methods: {
      changePassword(){
        this.isPassword = !this.isPassword
      },
      submit(){
        let flag = Util.check(this.data.username, Util.roles.mobile[0], '请输入正确的手机号/互联网+服务账号')
        flag = flag && Util.check(this.data.password, Util.roles.password[0], '输入的密码格式不正确')
        if (flag) {
          this.$emit('submit', this.data)
        }
      },
      switchShowValue(){
        this.showValues = !this.showValues
        setTimeout(() => {
          if (this.showValues) {
            this.$refs.valueList.style.height = this.$refs.valueContainer.offsetHeight + 'px'
          } else {
            this.$refs.valueList.style.height = 0 + 'px'
          }
        }, 10)
      },
      setValue(val){
        this.data.username = val
        this.switchShowValue()
      }
    },
    components: {
      'input-component': Input
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../common";

  .line {
    .submit {
      margin-top: 10px;
    }
  }

  .right-btn-container {
    width: 40px;
    text-align: right;
    i {
      cursor: pointer;
      font-size: 18px;
      &.icon-zyt-show {
        color: map_get($ComColors, wathet-blue);
      }
    }
  }

  .tel-container {
    position: relative;
    z-index: 10;
  }

  .value-list {
    z-index: 9;
    position: absolute;
    top: 0px;
    box-sizing: border-box;
    padding-top: 202px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    pointer-events: none;
    &.show {
      pointer-events: auto;
      .bg {
        opacity: .6;
      }
    }
    .value-item {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-left: 80px;
      background: white;
      height: 40px;
      text-align: left;
      font-size: 15px;
      border-top: 1px solid map_get($ComBorderColor, ef);
    }
    .bg {
      opacity: 0;
      z-index: -1;
      position: fixed;
      top: 0px;
      width: 100%;
      bottom: 0px;
      background: black;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
    }
  }

  .limit-height {
    height: 0px;
    overflow: hidden;
    transition: all .4s cubic-bezier(.55, 0, .1, 1);
  }
</style>
