/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
<zyt-page :hasFooter="false" :enableRefresh="false">
<div slot="main">
<form id="password-form" class="login-form" onsubmit="javascript:return false">

    <mt-field label="手机号" type="tel" :attr="{ maxlength: 11}" placeholder="请输入手机号"
              v-model="data.mobile">
    </mt-field>

    <div class="blankDiv"></div>

    <mt-field  label="验证码" :type="number" :attr="{ maxlength: 6}" placeholder="验证码" v-model="data.smsCode">
      <div class="msg-container">
        <countdown-component ref="countdown" storage-key="register-countdown" class="sms-btn" @click="getSmsMsg"
                             text="获取验证码" :disabled="disabled">
        </countdown-component>
      </div>
    </mt-field>

    <div class="blankDiv"></div>

    <mt-field label="密码" :type="password" :attr="{ maxlength: 20}" placeholder="请输入密码" v-model="data.password">
      <button @click="changePassword()" class="right-btn-container">
        <i :class="getEyeClass"></i>
      </button>
    </mt-field>

    <p class="tip">密码由6-20位英文字母，数字或字符组成</p>
    <div class="line line-padding">
      <button type="submit" class="btn" @click="submit()">立即注册</button>
    </div>
  </form>
</div>
</zyt-page>
</template>
<script lang="babel">
  import Util from '@/service/common/utils/util.service'
  import Input from '@/components/input/input.component'
  import Countdown from '@/components/countDown/countdown-btn.component'
  export default {
    props: {
      data: {
        type: Object,
        default: () => {
          return {
            mobile: '',
            smsCode: '',
            password: '',
            source: 0,
            type: 0
          }
        }
      }
    },
    data: () => {
      return {
        isPassword: true
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
      },
      disabled(){
        return !Util.check(this.data.mobile, Util.roles.mobile[0])
      }
    },
    methods: {
      changePassword(){
        this.isPassword = !this.isPassword
      },
      getSmsMsg(){
        this.$emit('getSmsMsg', {
          mobile: this.data.mobile,
          type: this.data.type,
          source: this.data.source
        })
      },
      submit(){
        let flag = Util.check(this.data.mobile, Util.roles.mobile[0], '请输入正确的手机号/互联网+服务账号')
        flag = flag && Util.check(this.data.smsCode, Util.roles.verification[0], '请输入正确的验证码')
        flag = flag && Util.check(this.data.password, Util.roles.password[0], '输入的密码格式不正确')
        if (flag) {
          this.$emit('submit', this.data)
        }
      }
    },
    components: {
      'input-component': Input,
      'countdown-component': Countdown
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../common";

  form {
    p {
      text-align: left;
      padding: 10px;
      padding-bottom: 0px;
      font-size: 13px;
      margin-bottom: 10px;
      color: map_get($ComColors, gray);
    }
    .right-btn-container {
      height: 100%;
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
  }
</style>
