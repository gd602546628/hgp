/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :enableRefresh="false">
    <div slot="main" class="page-container login-content">
    <div class="login-logo">
      <img src="../../../assets/img/by@2x.png" alt="a">
    </div>
      <!--使用密码登录-->
      <div v-if="!smsLogin">
        <login-component :data="formData" @submit="submit" :valueList="userNameList">
          <div class="line line-padding">
            <button type="submit" class="btn btn-empty bg-white" @click="goToRegister()">注册</button>
          </div>
          <div class="line space-between line-padding login-reminder">
            <button class="btn btn-empty btn-no-border" @click="changeLoginType(true)">短信验证登录</button>
            <button class="btn btn-empty btn-no-border" @click="goToChangePassword()">忘记密码</button>
          </div>
        </login-component>
      </div>

      <!--使用短信验证码登录-->
      <div v-if="smsLogin">
        <login-sms-component :data="smsLoginData" @submit="submitSms" @getSmsMsg="getSmsMsg">
          <div class="line space-between line-padding">
            <button class="btn btn-empty btn-no-border"></button>
            <button class="btn btn-empty btn-no-border" @click="changeLoginType(false)">使用账号登录</button>
          </div>
        </login-sms-component>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import Util from '@/service/common/utils/util.service'
  import WeixinService from '@/service/weixin/weixin.service'
  import {mapActions, mapGetters} from 'vuex'
  import {Codes} from '@/config/config'
  import LoginApi from '@/api/login/login.api'
  import LoginForm from './_form'
  import LoginBySmsForm from './_form-sms'

  export default {
    name: 'login',
    data () {
      return {
        resolve: null,
        reject: null,
        to: null,
        smsLogin: WeixinService.isWeixin() || this.$route.query.smsLogin === 'true',
        formData: {
          username: '',
          password: '',
          picCode: '111111'
        },
        smsLoginData: {
          mobile: '', // 页面中没有绑定这项数据，提交表单的时候赋值 formData.username
          smsCode: '',
          source: 0
        }
      }
    },
    watch: {
      // 让短信登录和密码登录的 用户名保持一致
      'formData.username': {
        handler(val){
          this.smsLoginData.mobile = val
        }
      },
      'smsLoginData.mobile': {
        handler(val){
          this.formData.username = val
        }
      }
    },
    mounted(){
      if (this.$route.params && this.$route.params.reject) {
        this.resolve = this.$route.params.resolve
        this.reject = this.$route.params.reject
        this.to = this.$route.params.to
      }
    },
    destroyed(){
      if (this.resolve) {
        if (this.userInfo && this.userInfo.token) {
          this.resolve(this.userInfo)
        } else {
          this.reject(null)
        }
      }
    },
    deactivated(){
      if (this.$route.path.indexOf('login') === -1) {
        if (this.resolve) {
          if (this.userInfo && this.userInfo.token) {
            this.resolve(this.userInfo)
          } else {
            this.reject(null)
          }
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'userNameList'])
    },
    methods: {
      ...mapActions(['login', 'getUserToken']),
      back(){
        this.$router.back()
      },
      changeLoginType(type){
        this.smsLogin = type
        this.$router.replace({
          name: this.$route.name,
          query: {
            smsLogin: this.smsLogin
          }
        })
      },
      goToRegister(){
        this.$router.push({
          name: 'register',
          params: {
            mobile: this.formData.username
          }
        })
      },
      goToChangePassword(){
        this.$router.push({
          name: 'changePassword',
          params: {
            mobile: this.formData.username
          }
        })
      },
      submit(data){
        this._login(data, false)
      },
      submitSms(data){
        this._login(data, true)
      },
      async _login(params, isSmsLogin){
        // this.login 是store中的login
        let data = await this.login({
          params: params,
          isSmsLogin: isSmsLogin
        })
        console.info(data)
        if (data && data.code === Codes.success) {
          this._loginSuccess()
        } else if (data && data.code === Codes.notRegister) {
          let showConfirmResult = await Util.confirm({message: '未注册，是否跳转到注册界面'}).catch((e) => {
            console.info(e)
          })
          if (showConfirmResult === 'confirm') {
            this.goToRegister()
          }
        } else {
          Util.alert({
            message: data.mesg
          })
        }
      },
      // 登录成功
      _loginSuccess(){
        let page = Object.assign({}, this.to)
        if (this.to) {
          this.$router.replace(page)
        } else {
          this.back()
        }
      },
      /**
       * 获取短信登录的短信验证码
       * @returns {Promise.<void>}
       */
      async getSmsMsg(data){
        let result = await LoginApi.getSmsMsg(data)
        if (result.code !== Codes.success) {
          Util.alert({message: result.mesg})
        }
      }
    },
    components: {
      'login-component': LoginForm,
      'login-sms-component': LoginBySmsForm
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../common";
  .login-content{
    .login-logo{
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        display: block;
        height: 55px;
        width: auto;
        max-width: 80%;
        margin: 50px auto;
      }
    }
  }
</style>
