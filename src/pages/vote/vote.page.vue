<template>
  <zyt-page ref="page">
    <div slot="main" v-if="voteInfo">
      <div class="vote-wrap">
        <div class="title-img" :style="{backgroundImage:'url('+topicImg(voteInfo.titleImgUrl)+')'}"></div>
        <div class="vote-title">{{voteInfo.title}}</div>
        <div class="vote-time">

          <div>
            <span>投票开始时间：</span>
            <p>{{voteInfo.issuedTime | dateFormat('yyyy年MM月dd日 hh时')}}</p>
          </div>

          <div>
            <span>投票结束时间：</span>
            <p>{{voteInfo.endTime | dateFormat('yyyy年MM月dd日 hh时')}}</p>
          </div>

          <div>
            <span>投票规则：</span>
            <p>每人每天可投{{voteInfo.maxTimesPerDay}}票,活动期间最多可投{{voteInfo.maxTimes}}票</p>
          </div>
        </div>

        <div class="vote-area">
          <div class="commonSearch">
            <div class="search-head">
              <form class="form" @submit.prevent="search(searchStr)">
                <input type="search" placeholder="搜索"
                       class="input"
                       v-model="searchStr"
                       ref="searchRef"
                >
                <div class="icon-item">
                  <i name="ios-search-outline" class="icon-zyt-search"></i>
                </div>
              </form>
              <div class="cancel" @click="search(searchStr)">搜索</div>
            </div>
          </div>
          <div class="style1" v-if="voteInfo.styleId==1">
            <div class="options">
              <div class="option-item"
                   v-for="(option,index) in voteInfo.options"
                   :class="{active:option.checked}"
                   @click.stop="selectOption(option)"
                   ref="option"
              >
                <span>{{option.code}}</span>
                <p>{{option.optionName}}</p>
              </div>
            </div>
            <div class="result" v-if="showResult">
              <div class="title">
                <p>投票次数</p>
                <span>共{{voteInfo.voteNum}}票</span>
              </div>
              <div class="content">
                <div class="content-item" v-for="item in voteInfo.options">
                  <div class="item">
                    <span>{{item.optionName}}</span>
                    <p>{{item.percentage}}({{item.countNum}}票)</p>
                  </div>
                  <div class="progress" :style="{width:item.percentage}"></div>
                </div>
              </div>
            </div>
            <!--   <div class="confirm-btn">
                 <div>确定</div>
               </div>-->
          </div>

          <div class="style2" v-if="voteInfo.styleId==2">
            <div class="title" v-if="showResult">
              <p>投票次数</p>
              <span>共{{voteInfo.voteNum}}票</span>
            </div>
            <div class="options">
              <div class="option" v-for="(item,index) in voteInfo.options" ref="option">
                <div class="left">
                  <div class="content">
                    <div class="image"
                         :style="{backgroundImage:'url('+topicImg(item.imageUrl)+')'}"
                         @click.stop="goOutLine(item)"
                    ></div>
                    <div class="info">
                      <div>{{item.optionName}}</div>
                      <p>({{item.code}})</p>
                      <p>{{item.theme}}</p>
                    </div>
                  </div>
                  <div class="progress" v-if="showResult">
                    <div :style="{width:item.percentage}"></div>
                  </div>
                </div>
                <div class="right">
                  <div class="check-box-wrap" @click.stop="selectOption(item)">
                    <div class="icon" :class="{active:item.checked}" v-if="voteInfo.isMultiSelect==0"></div>
                    <div class="icon-s" :class="{active:item.checked}" v-if="voteInfo.isMultiSelect==1"></div>
                  </div>
                  <span class="countNum" v-if="showResult">{{item.percentage}}({{item.countNum}}票)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="style3" v-if="voteInfo.styleId==3">
            <div class="title" v-if="showResult">
              <p>投票次数</p>
              <span>共{{voteInfo.voteNum}}票</span>
            </div>
            <div class="options">
              <div class="option" v-for="(item,index) in voteInfo.options" ref="option">
                <div class="image"
                     :style="{backgroundImage:'url('+topicImg(item.imageUrl)+')'}"
                     @click.stop="goOutLine(item)"
                ></div>
                <div class="check-box" @click.stop="selectOption(item)">
                  <div class="icon" :class="{active:item.checked}" v-if="voteInfo.isMultiSelect==0"></div>
                  <div class="icon-s" :class="{active:item.created}" v-if="voteInfo.isMultiSelect==1"></div>
                  <div class="count-num">
                    <p>{{item.optionName}}</p>
                    <span>({{item.code}})</span>
                  </div>
                </div>
                <div class="theme">{{item.theme}}</div>
                <div class="progress-wrap" v-if="showResult">
                  <div class="progress">
                    <div :style="{width:item.percentage}"></div>
                  </div>
                  <div class="total-num">
                    {{item.percentage}}({{item.countNum}}票)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="style4" v-if="voteInfo.styleId==4">
            <div class="title" v-if="showResult">
              <p>投票次数</p>
              <span>共{{voteInfo.voteNum}}票</span>
            </div>
            <div class="options">
              <div class="option" v-for="(item,index) in voteInfo.options" ref="option">
                <div class="wrap">
                  <div class="image"
                       :style="{backgroundImage:'url('+topicImg(item.imageUrl)+')'}"
                       @click.stop="goOutLine(item)"
                  >
                    <div class="title">
                      {{item.code}}
                    </div>
                  </div>
                  <div class="total-num">
                    <p>{{item.optionName}}</p>
                    <span>{{item.countNum}}</span>
                  </div>
                  <div class="confirm-btn" :class="{active:item.checked}" @click.stop="selectOption(item)">
                    投TA一票
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="user-info" v-if="showTelInfo" ref="userInfo">
            <p>姓名</p>
            <input placeholder="请输入您的姓名"
                   :class="{noMatch:!infoMatch.name}"
                   v-model="telInfo.name"
                   @blur="telInfoMatch(true)"
            />
            <span v-if="!infoMatch.name">请填写1-16个字</span>
            <p>手机号码</p>
            <input placeholder="请输入您的手机号码"
                   :class="{noMatch:!infoMatch.tel}"
                   v-model="telInfo.tel"
                   @blur="telInfoMatch(false)"
            />
            <span v-if="!infoMatch.tel">请输入正确的电话号码</span>
          </div>
        </div>
        <transition name="confirm">
          <div class="confirm" v-if="showConfirm" :class="{noHgp:!isHgp}">
            <div class="confirm-select">
              <p>您的选择是：</p>
              <span>{{selectedTip}}</span>
            </div>
            <div class="confirm-btm" @click.stop="submit()">确认投票</div>
          </div>
        </transition>
        <!-- <mt-popup v-model="showAlert" :modal="false">
           <div class="alert">
             <div class="tittle">提示</div>
             <div class="content">{{alertMessage}}</div>
             <button class="alt-button" @click="alertResolve()">确定</button>
           </div>
         </mt-popup>-->
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import voteService from '@/service/vote/vote.service'
  import {Config} from '@/config/config'
  import WeixinService from '@/service/weixin/weixin.service'
  import Util from '@/service/common/utils/util.service'
  import {mapGetters, mapActions} from 'vuex'
  import {MessageBox} from 'mint-ui'
  import Native from '@/service/common/native/native.service'
  export default{
    name: 'vote',
    data(){
      return {
        voteId: 0,
        voteInfo: null,
        selectedOption: [],
        showResult: false,
        openId: null,
        isHgp: false,
        telInfo: {
          name: '',
          tel: ''
        },
        infoMatch: {
          name: true,
          tel: true
        },
        showTelInfo: false,
        showAlert: false,
        alertMessage: '',
        searchStr: '',
        voteItemPositions: []
      }
    },
    async created(){
      this.voteId = this.$route.params.voteId
      this.isHgp = Native.isApp()
      if (WeixinService.isWeixin()) {
        if (!Util.getUrlParam('code')) {
          let urlPrefix = window.location.href.split('#')[0]
          let url = `${urlPrefix}#/vote/${this.voteId}`
          WeixinService.openAuth(url)
          return
        }
        if (Util.getUrlParam('code')) {
          let openId = await WeixinService.getOpenId(false, true).catch(() => {
            let urlPrefix = window.location.href.split('?')[0]
            let url = `${urlPrefix}#/vote/${this.voteId}`
            WeixinService.openAuth(url)
            return
          })
          this.openId = openId
        }
      }
      await this.init()
      this.showTelInfo = this.voteInfo.isNeedLogin === '0' && !WeixinService.isWeixin()
      this.showResult =
        this.voteInfo.isDisplayStatistic === '1' &&
        this.voteInfo.isDisplayStatisticBefore === '1'
    },
    computed: {
      ...mapGetters(['hasAuth']),
      selectedTip(){
        let result = []
        this.selectedOption.forEach(item => {
          result.push(item.code)
        })
        return result.join(',')
      },
      showConfirm(){
        return this.selectedOption.length > 0
      }
    },
    methods: {
      ...mapActions(['getUserToken', 'logout']),
      toGetCode(){
      },
      alertResolve(){
        this.showAlert = false
        this.resolve()
      },
      alert(message){
        this.showAlert = true
        this.alertMessage = message
        return new Promise((resolve, reject) => {
          this.resolve = resolve
        })
      },
      topicImg(topicImg) { // 图片添加前缀
        if (!topicImg) {
          return null
        }
        if (topicImg.indexOf('http') >= 0) {
          return topicImg
        } else {
          return Config.imgPrefix + topicImg
        }
      },
      async getVoteInfo(){
        let data = voteService.getVoteInfo({
          voteId: this.voteId
        })
        return data
      },
      selectOption(option){
        if (this.voteInfo.isMultiSelect === '0') { // 单选
          let cash = option.checked // 缓存当前选项状态
          this.voteInfo.options.forEach(item => {
            item.checked = false
          })
          option.checked = !cash
        } else {
          option.checked = !option.checked
        }
        this.selectedOption = []
        this.voteInfo.options.forEach(item => {
          if (item.checked) {
            this.selectedOption.push(item)
          }
        })
      },
      async init(){
        this.selectedOption = []
        let data = await this.getVoteInfo()
        this.voteInfo = data
        this.$nextTick(() => {
          this.saveVoteItemPosition()
        })
        console.log(this.voteInfo)
      },
      telInfoMatch(nameOrTel){ // true name  false tel
        if (nameOrTel) {
          this.infoMatch.name = this.telInfo.name.match(Util.roles.length16[0])
        } else {
          this.infoMatch.tel = this.telInfo.tel.match(Util.roles.mobile[0])
        }
      },
      async fetchSubmit(params){
        let tokenStr = params.tokenStr
        let name = params.name
        let tel = params.tel
        let openId = params.openId
        let type = params.type
        let submitApi = {participant: {voteOptions: []}}
        tokenStr && (submitApi.participant.tokenStr = tokenStr)
        tokenStr && (submitApi.tokenStr = tokenStr)
        name && (submitApi.participant.name = name)
        tel && (submitApi.participant.phone = tel)
        openId && (submitApi.openId = openId)
        type && (submitApi.type = type)
        this.selectedOption.forEach(item => {
          let result = {optionId: item.optionId}
          submitApi.participant.voteOptions.push(result)
        })
        submitApi.clientId = 'WGW'
        submitApi.participant.clientId = 'WGW'
        submitApi.participant.voteId = this.voteId
        submitApi.participant = JSON.stringify(submitApi.participant)
        let data = await voteService.submitVote(submitApi).catch((e) => {
          alert(e)
        })
        if (data.code === '000000') {
          //  await MessageBox.alert(data.message)
          await this.init()
          this.showResult = true
          // 现改为不管有无连接都跳转，所以注释
          /* if (this.voteInfo.returnUrl) {
           this.$router.push({
           name: 'voteTranslate',
           params: {
           voteId: this.voteId
           }
           })
           //  window.location.href = this.voteInfo.returnUrl
           } else {
           await MessageBox.alert(data.message)
           } */
          this.$router.push({
            name: 'voteTranslate',
            params: {
              voteId: this.voteId
            }
          })
        } else if (data.code === '000021') { // 登录失效
          await MessageBox.alert(data.message)
          await this.logout()
          this.submit()
        } else {
          await MessageBox.alert(data.message)
          this.init()
        }
      },
      async submit(){
        if (WeixinService.isWeixin()) { // 微信环境
          await this.fetchSubmit({type: '1', openId: this.openId})
        } else {
          if (this.voteInfo.isNeedLogin === '1') { // 需要登录
            let userInfo = await this.getUserToken({forceLogin: true})
            if (!userInfo) return
            await this.fetchSubmit({type: '0', tokenStr: userInfo.token})
          } else {
            this.telInfoMatch(true)
            this.telInfoMatch(false)
            if (this.infoMatch.name && this.infoMatch.tel) {
              await this.fetchSubmit({type: '0', tel: this.telInfo.tel, name: this.telInfo.name})
            } else {
              this.$refs.page.scrollTo(this.$refs.userInfo.offsetTop)
            }
          }
        }
      },
      goOutLine(item){ // 跳转外部链接
        if (item.link) {
          window.location.href = item.link
        }
      },
      saveVoteItemPosition(){
        let options = this.$refs.option
        this.voteInfo.options.forEach((item, index) => {
          item.offsetTop = options[index].offsetTop
        })
        console.log(this.voteInfo.options)
      },
      search(){
        let resultIndex = -1
        this.voteInfo.options.forEach((item, index) => {
          if (this.searchStr === item.code) {
            resultIndex = index
          }
        })
        if (resultIndex >= 0) {
          this.$refs.page.scrollTo(this.voteInfo.options[resultIndex].offsetTop)
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>

  .commonSearch {
    background: #efefef;
    margin-bottom: 10px;
    .search-head {
      padding: 6px 10px;
      display: flex;
      .form {
        flex: 1;
        position: relative;
        padding-left: 10px;
        border-radius: 6px;
        background: #ffffff;
        .input {
          height: 100%;
          border: none;
          width: 96%;
          padding-left: 30px;
          //line-height: 100%;
          line-height: 38px;
        }
        .icon-item {
          position: absolute;
          left: 10px;
          top: 0;
          display: flex;
          align-items: center;
          height: 100%;
          .icon {
            font-size: 2rem;
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

  .alert {
    background: url("../../assets/img/draw/03.jpg");
    background-size: cover;
    background-position: center;
    max-width: 270px;
    min-width: 200px;
    border-radius: 5px;
    .tittle {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
    }
    .content {
      padding: 20px;
      border-bottom: 1px solid #ddd;
      min-height: 36px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .alt-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      display: flex;
      height: 40px;
      line-height: 40px;
    }
  }

  .vote-wrap {
    padding-bottom: 60px;
  }

  .title-img {
    height: 160px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .vote-title {
    text-align: center;
    font-size: 16px;
    padding-top: 20px;
    padding-bottom: 13px;
    border-bottom: 1px solid #dbdbdb;
    color: #1a1a1a;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .vote-time {
    padding: 10px;
    div {
      display: flex;
      margin-top: 10px;
      p {
        flex: 1;
      }
    }
  }

  .vote-area {
    .style1 {
      .options {
        padding: 10px;
        border-bottom: 1px solid rgb(219, 219, 219);
        .option-item {
          margin-top: 10px;
          display: flex;
          &.active {
            span {
              background: #0164a6;
              border: 1px solid #0164a6;
            }
            p {
              border: 1px solid #0164a6;
            }
          }
          span {
            height: 40px;
            width: 40px;
            background: rgb(207, 225, 232);
            border: 1px solid rgb(207, 225, 232);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: bold;

          }
          p {
            flex: 1;
            border: 1px solid rgb(207, 225, 232);
            padding-left: 10px;
            display: flex;
            align-items: center;
          }
        }
      }
      .result {
        padding: 10px;
        border-bottom: 1px solid #dbdbdb;
        .title {
          display: flex;
          align-items: center;
          p {
            flex: 1;
          }
        }
        .content {
          margin-top: 10px;
          .content-item {
            height: 30px;
            margin-top: 10px;
            position: relative;
            background: #f5f5f5;
            .progress {
              height: 100%;
              position: absolute;
              background: #cceeff;
              top: 0;
              z-index: 1;
            }
            .item {
              position: relative;
              z-index: 2;
              display: flex;
              height: 100%;
              align-items: center;
              padding-left: 10px;
              span {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .confirm-btn {
        padding: 10px;
        div {
          background: #0164a6;
          font-size: 16px;
          color: white;
          width: 100%;
          height: 40px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .style2 {
      padding: 10px;
      .title {
        display: flex;
        align-items: center;
        p {
          flex: 1;
        }
      }

      .options {
        .option {
          display: flex;
          margin-top: 10px;
          border-bottom: 1px solid #dbdbdb;
          padding: 10px 0;
          .left {
            overflow: hidden;
            flex: 1;
            .content {
              display: flex;
              align-items: center;
              .image {
                width: 100px;
                height: 75px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
              }
              .info {
                flex: 1;
                overflow: hidden;
                div {
                  font-weight: bold;
                  color: #333333;
                  margin-bottom: 4px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                p {
                  margin-bottom: 4px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
            }

            .progress {
              margin-top: 10px;
              height: 6px;
              background: #dbdbdb;
              position: relative;
              div {
                position: absolute;
                background: #0164a6;
                height: 100%;
              }
            }
          }

          .right {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            .check-box-wrap {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .icon {
                width: 16px;
                height: 16px;
                background: url("../../assets/img/vote/Choice9.png");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                &.active {
                  background: url("../../assets/img/vote/Choice10.png");
                  background-position: center;
                  background-size: cover;
                  background-repeat: no-repeat;
                }
              }
              .icon-s {
                width: 16px;
                height: 16px;
                background: url("../../assets/img/vote/Choice8.png");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                &.active {
                  background: url("../../assets/img/vote/Choice7.png");
                  background-position: center;
                  background-size: cover;
                  background-repeat: no-repeat;
                }
              }
            }
            .countNum {

            }
          }
        }
      }
    }

    .style3 {
      .title {
        display: flex;
        align-items: center;
        background: #ffffff;
        padding: 10px;
        p {
          flex: 1;
        }
      }
      background: #efefef;
      .options {
        margin: 10px 6px 6px 6px;
        .option {
          background: #ffffff;
          margin-bottom: 6px;
          padding: 10px;
        }
        .image {
          height: 145px;
          background-position: center;
          background-repeat: no-repeat;
        }
        .check-box {
          display: flex;
          margin-top: 10px;
          .icon {
            width: 16px;
            height: 16px;
            background: url("../../assets/img/vote/Choice9.png");
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            &.active {
              background: url("../../assets/img/vote/Choice10.png");
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
            }
          }
          .icon-s {
            width: 16px;
            height: 16px;
            background: url("../../assets/img/vote/Choice8.png");
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            &.active {
              background: url("../../assets/img/vote/Choice7.png");
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
            }
          }
          .count-num {
            margin-left: 10px;
            display: flex;
            p {
              font-weight: bold;
              margin-right: 4px;
            }
          }
        }
        .theme {
          font-size: 12px;
          margin-top: 6px;
          color: #808080;
        }
        .progress-wrap {
          display: flex;
          margin-top: 10px;
          .total-num {
            margin-left: 20px;
          }
          .progress {
            flex: 1;
            height: 6px;
            top: 6px;
            background: #dbdbdb;
            position: relative;
            div {
              background: #0164a6;
              position: absolute;
              height: 100%;
            }
          }
        }
      }
    }

    .style4 {
      padding: 10px;
      .title {
        display: flex;
        align-items: center;
        p {
          flex: 1;
        }
      }
      .options {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .option {
          width: 50%;
          margin-bottom: 30px;
          &:nth-child(even) {
            .wrap {
              margin-left: 2%;
            }
          }
          &:nth-child(odd) {
            .wrap {
              margin-right: 2%;
            }
          }
          .wrap {
            position: relative;
            border: 1px solid #2589cf;
            border-top-width: 2px;
            border-radius: 3px;
            padding-bottom: 20px;
            .image {
              position: relative;
              width: 100%;
              padding-bottom: 133%;
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              .title {
                /*  &:after {
                    border-right: 25px solid #0164a6;
                    border-left: 25px solid #0164a6;
                    display: block;
                    content: "";
                    width: 0px;
                    height: 0px;
                    border-bottom: 9px solid transparent;
                    position: absolute;
                    bottom: -8px;
                    left: 0px;
                  }*/
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                bottom: 0px;
                right: 10px;
                padding: 5px 0px;
                width: 50px;
                background: #0164a6;
                color: white;
                font-style: inherit;
                background-size: 100% 100%;
              }
            }

            .total-num {
              display: flex;
              padding: 0 10px;
              margin-top: 10px;
              p {
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              span {
                color: #fa6800;
              }
            }
            .confirm-btn {
              width: 80%;
              font-size: 14px;
              color: #ffffff;
              height: 30px;
              position: absolute;
              left: 10%;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 3px;
              background: #2589cf;
              bottom: -15px;
              &.active {
                background: #0164a6;
              }
            }
          }
        }
      }
    }

    .user-info {
      padding: 10px;
      input {
        border: 1px solid #e3e3e3;
        background: #f6f6f6;
        border-radius: 5px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0px 5px;
        margin: 10px 0;
        &.noMatch {
          border: 1px solid red;
        }
      }
      span {
        margin-bottom: 10px;
        display: block;
        color: red;
      }
    }
  }

  .confirm {
    transition: .2s ease-out;
    z-index: 1000;
    &.noHgp {
      bottom: 50px;
    }
    &.confirm-enter,
    &.confirm-leave-active {
      transform: translate3d(0, 100%, 0);
    }
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #333333;
    color: white;
    .confirm-select {
      flex: 1;
      display: flex;
      padding-left: 10px;
      overflow: hidden;
      span {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .confirm-btm {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 80px;
      color: white;
      background: #0164a6;
      font-size: 14px;
    }
  }
</style>
