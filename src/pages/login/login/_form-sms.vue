/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <form id="sms-form" class="login-form" onsubmit="javascript:return false">
    <mt-field label="手机号" type="tel" :attr="{ maxlength: 11}" placeholder="请输入手机号"
              v-model="data.mobile">
      <div class="msg-container">
        <countdown-component storage-key="login-countdown" ref="countdown" class="sms-btn" @click="getSmsMsg"
                             text="发送验证码" :disabled="disabled">
        </countdown-component>
      </div>
    </mt-field>
    <div class="blankDiv"></div>
    <mt-field label="验证码" :type="number" :attr="{ maxlength: 6}" placeholder="请输入短信验证码" v-model="data.smsCode">
    </mt-field>
    <p class="tip">温馨提示：未注册的手机号码，登录时将自动注册。</p>
    <div class="line line-padding">
      <button type="submit" class="btn" @click="submit()">登录</button>
    </div>
    <slot></slot>
  </form>
</template>

<script lang="babel">
  import Util from '@/service/common/utils/util.service'
  import Input from '@/components/input/input.component'
  import Countdown from '@/components/countDown/countdown-btn.component'
  /**
   * 父组件可以监听
   * submit 提交表单
   * getSmsMsg 获取验证码的请求
   */
  export default {
    props: {
      data: {
        default: () => {
          return {
            mobile: '',
            smsCode: '',
            source: 0
          }
        }
      }
    },
    computed: {
      disabled(){
        return !Util.check(this.data.mobile, Util.roles.mobile[0])
      }
    },
    methods: {
      submit(){
        let flag = Util.check(this.data.mobile, Util.roles.mobile[0], '请输入正确的手机号/互联网+服务账号')
        flag = flag && Util.check(this.data.smsCode, Util.roles.verification[0], '请输入正确的验证码')
        if (flag) {
          this.$emit('submit', this.data)
        }
      },
      getSmsMsg(){
        this.$emit('getSmsMsg', {
          mobile: this.data.mobile,
          type: 3, // 短信登录的验证码，类型为3
          source: 0
        })
      }
    },
    components: {
      'countdown-component': Countdown,
      'input-component': Input
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../common";

  form {
    p {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: map_get($ComColors, gray);
    }
  }
</style>
