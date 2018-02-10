<template>
  <zyt-page :hasFooter="true" class="appointment" v-show="show">
    <!--  <mt-header title="在线预约" slot="header">
        <mt-button slot="left" icon="back" @click="handleBack"></mt-button>
      </mt-header>-->
    <div slot="main">
      <div v-for="(item,index) in appointData">
        <!--文本-->
        <div class="type-text" v-if="item.addType==1">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <input type="text" class="input-text" placeholder="请输入内容" v-model="item.answer"/>
        </div>

        <!--文本域-->
        <div class="type-textArea" v-if="item.addType==2">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <textarea type="text" class="input-textArea" placeholder="请输入内容" v-model="item.answer"/>
        </div>

        <!--数字-->
        <div class="type-number" v-if="item.addType==3">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <input type="number" class="input-text" placeholder="请输入内容" v-model="item.answer"/>
        </div>

        <!--日期-->
        <div class="type-date" v-if="item.addType==4">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <div class="data-content">
            <div class="data-content-wrap" @click="openDatePicker(item)">
              <span>{{item.year || '年'}}/</span><span>{{item.month || '月'}}/</span><span>{{item.day || '日'}}/</span>
            </div>
            <div class="icon-zyt-arrows-right icon"></div>
          </div>
        </div>

        <!--单选-->
        <div class="type-check" v-if="item.addType==5">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <mt-radio
            v-model="item.answer"
            :options="item.option">
          </mt-radio>
        </div>

        <!--多选-->
        <div class="type-check" v-if="item.addType==6">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <mt-checklist
            v-model="item.answer"
            :options="item.option">
          </mt-checklist>
        </div>

        <!--电话-->
        <div class="telephone" v-if="item.addType==7">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <div class="telephone-wrap">
            <div class="phone-input">
              <input type="number" placeholder="请输入联系电话" v-model="item.answer"/>
            </div>
            <div class="code-wrap">
              <input class="code-input" placeholder="请输入验证码" v-model="item.code"/>
              <button class="btn" :class="{sending:item.sending}" v-on:click.stop="sendingCode(item)">
                {{item.sendingMsg}}
              </button>
            </div>
          </div>
        </div>

        <!--说明-->
        <div class="explain" v-if="item.addType==8">
          {{item.title}}
        </div>

        <!--地址-->
        <div class="address" v-if="item.addType==9">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <div class="area-select" @click="openAreaPicker(item)">
            <div class="area-select-content">
              <span>{{item.province}}</span><span>{{item.city}}</span><span>{{item.country}}</span>
            </div>
            <div class="icon-zyt-arrows-right icon"></div>
          </div>
          <input type="text" class="input-text" placeholder="请输入详细地址" v-model="item.detail"/>
        </div>

        <!--附件-->
        <div class="file" v-if="item.addType==10" v-on:click.stop="openFile($event)">
          <div class="title">
            <span class="isBt" v-if="item.isBt==0">*</span><span class="title-title">{{index + 1}}.{{item.title}}</span>
          </div>
          <div class="file-upload-content" v-if="uploadShow">
            <div class="file-upload-wrap">
              <img src="../../assets/img/upload10.png">
              <div>
                <p class="p1">点击添加文件</p>
                <p class="p2">文件大小限制5M</p>
              </div>
              <input type="file" @change="upLoadFile($event,item)" class="upload-input"/>
            </div>
          </div>
          <div class="delete-file" v-if="!uploadShow">
            <p class="name">{{item.answer[1]}}</p>
            <div class="delete-wrap" v-on:click.stop="deleteFile(item)">
              <p class="icon-zyt-delete icon"></p>
              <p>删除</p>
            </div>
          </div>
        </div>

      </div>

      <mt-popup position="bottom"
                v-model="areaVisible"
                class="area-picker"
      >
        <div class="btn-wrap">
          <p @click="areaPickCancel()">取消</p>
          <p @click="areaPickConfirm()">确定</p>
        </div>
        <mt-picker :slots="areaSlot" @change="onAreaPickChange" value-key="name" :visible-item-count="7"></mt-picker>
      </mt-popup>

      <mt-datetime-picker
        ref="datePicker"
        type="date"
        v-model="dataPicker"
        @confirm="handleDatePicker"
        :startDate="new Date()"
      >
      </mt-datetime-picker>
    </div>
    <div slot="footer">
      <h1 class="footer-title" @click="submitDate()">提交预约</h1>
    </div>
  </zyt-page>
</template>
<script>
  import goodService from '@/service/goodService/goodService.service'
  import getArea from '@/service/getArea/getArea.service'
  import {Indicator} from 'mint-ui'
  import utils from '@/service/common/utils/util.service'
  import ToastService from '@/service/toast/toast.service'
  export default{
    name: 'ServersOrderInfo',
    data(){
      return {
        show: false,
        appointData: [],
        dataPicker: null,
        currentDateItem: null,
        currentAreaItem: null,
        areaVisible: false,
        uploadShow: true,
        areaSlot: [{
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'middle'
        }, {
          divider: true,
          content: '-',
          className: 'middle'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'middle'
        }, {
          divider: true,
          content: '-',
          className: 'middle'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'middle'
        }],
        areaDataCache: []
      }
    },
    methods: {
      async init(){
        this.getAppoint()
        let data = await getArea.getAllArea()
        this.areaDataCache[0] = data.data[0]
        this.areaDataCache[1] = this.areaDataCache[0].nextArea[0]
        this.areaDataCache[2] = this.areaDataCache[1].nextArea[0]
        this.areaSlot[0].values = data.data
        this.areaSlot[2].values = this.areaSlot[0].values[0].nextArea
        this.areaSlot[4].values = this.areaSlot[2].values[0].nextArea
      },
      handleBack(){
        this.$router.go(-1)
      },
      async getAppoint(){
        let data = await goodService.getServiceAppoint({serviceId: parseInt(this.$route.params.id)})
        this.show = true
        data.data.forEach(item => {
          item.answer = ''
          if (parseInt(item.addType) === 6) { // 多选题，answer设为array
            item.answer = []
          } else if (parseInt(item.addType) === 4) { // 日期选项添加三个属性标识所选日期
            item.year = null
            item.month = null
            item.day = null
          } else if (parseInt(item.addType) === 9) { // 地址选项添加三个属性标识所选地址
            item.province = ''
            item.city = ''
            item.country = ''
            item.detail = ''
          } else if (parseInt(item.addType) === 7) { // 手机添加一个标识，标识正在发送验证码
            item.sending = false
            item.time = 60
            item.sendingMsg = '发送验证码'
            item.code = ''
          }
        })
        this.appointData = data.data
        if (this.appointData.length === 0) {
          this.submitDate()
        }
      },
      async submitDate(){
        for (let i = 0; i < this.appointData.length; i++) {
          let item = this.appointData[i]
          if (parseInt(item.addType) === 9) { // 地址项对answer进行处理，并删除多余属性
            if (item.province && item.detail) {
              item.answer = `${item.province} ${item.city} ${item.country}${item.detail}`
            }
          }
          if (parseInt(item.isBt) === 0 && !item.answer) { // 必填项验证
            console.log(item.answer)
            this.showAlert(`<span style="color:red">*</span>号题为必填题<p>请完成第${i + 1}题</p>`)
            return
          }
          if (parseInt(item.addType) === 8) { // 说明项删除answer字段
            delete item.answer
          }
          if (parseInt(item.addType) === 7) { // 电话项，进行验证码验证
            /* TODO： 验证码接口有问题 */
            if (utils.roles.mobile[0].test(item.answer)) { // 手机号验证通过
              let verifyCode = await goodService.verifyCode({ // 验证验证码
                code: item.code,
                funId: this.$route.params.id,
                mobile: item.answer,
                type: 3
              })
              console.log(verifyCode)
            } else {
              this.showAlert('请输入正确的手机号')
            }
          }
        }
        let submitResult = await goodService.submitServiceApply({
          document: this.appointData,
          serviceId: parseInt(this.$route.params.id)
        })
        if (submitResult.code === '000000') {
          ToastService.bottom('预约成功')
          this.$router.replace({name: 'myServiceDetail', params: {id: submitResult.data}})
        } else {
          this.showAlert('预约失败，请稍后再试')
        }
      },
      openDatePicker(item){
        this.currentDateItem = item
        this.$refs.datePicker.open()
      },
      openAreaPicker(item){
        this.currentDateItem = item
        this.areaVisible = true
      },
      areaPickConfirm(){
        this.areaVisible = false
        this.currentDateItem.province = this.areaDataCache[0].name
        this.currentDateItem.city = this.areaDataCache[1].name
        this.currentDateItem.country = this.areaDataCache[2].name
        console.log(this.currentDateItem)
      },
      areaPickCancel(){
        this.areaVisible = false
      },
      handleDatePicker(){
        let date = new Date(this.dataPicker)
        let year = date.getFullYear().toString()
        let month = (date.getMonth() + 1).toString()
        let day = date.getDate().toString()
        month = month.length === 1 ? '0' + month : month
        day = day.length === 1 ? '0' + day : day
        this.currentDateItem.year = year
        this.currentDateItem.month = month
        this.currentDateItem.day = day
        this.currentDateItem.answer = `${year}-${month}-${day}`
      },
      onAreaPickChange(e){
        let cacheProvince = this.areaDataCache[0]
        let cacheCity = this.areaDataCache[1]
        let selectProvince = e.getValues()[0]
        let selectCity = e.getValues()[1]
        let selectCount = e.getValues()[2]
        if (selectProvince && selectCity && selectCount) {
          if (cacheProvince.id !== selectProvince.id) { // 选择省
            this.areaDataCache[0] = selectProvince
            this.areaDataCache[1] = selectProvince.nextArea[0]
            this.areaDataCache[2] = selectProvince.nextArea[0].nextArea[0]
            this.areaSlot[2].values = selectProvince.nextArea
            this.areaSlot[4].values = this.areaSlot[2].values[0].nextArea
          } else if (cacheCity.id !== selectCity.id) { // 选择市
            this.areaDataCache[1] = selectCity
            this.areaDataCache[2] = selectCity.nextArea[0]
            this.areaSlot[4].values = selectCity.nextArea
          } else {
            return
          }
        } else {
          return
        }
      },
      async upLoadFile(e, item){
        let file = e.target.files[0]
        let params = {
          uploadFile: file,
          questionId: null,
          domainAlias: null
        }
        Indicator.open({
          text: '正在上传'
        })
        let data = await goodService.postFile(params).catch(e => {
          console.log('上传失败', e)
          Indicator.close()
          throw new Error(false)
        })
        item.answer = [data.data.url, file.name]
        this.uploadShow = false
        Indicator.close()
        console.log('上传成功')
      },
      openFile(e){
        if (e.target.className.indexOf('upload-input') >= 0) {
          return
        }
        let input = null
        let target = e.target
        try {
          while (target.className.indexOf('file-upload-content') < 0) {
            target = target.parentNode
          }
        } catch (e) {
          return
        }
        input = target.querySelector('.upload-input')
        if (input) {
          input.click()
        }
      },
      deleteFile(item){
        item.answer = []
        this.uploadShow = true
      },
      async sendingCode(item){
        if (item.sending) return
        if (utils.roles.mobile[0].test(item.answer)) { // 号码验证通过
          /* TODO:  验证码接口有问题 */
          let codeData = await goodService.getVerificationCode({
            funId: this.$route.params.id,
            mobile: item.answer,
            type: 3
          })
          console.log(codeData)
          /*  let timer = setInterval(() => {
           item.time--
           item.sendingMsg = item.time + 's'
           if (item.time === 0) {
           clearInterval(timer)
           item.time = 60
           item.sendingMsg = '重发验证码'
           item.sending = false
           }
           }, 1000)
           item.sending = true */
        } else {
          this.showAlert('请输入正确的手机号')
          return
        }
      },
      showAlert(message){
        utils.alert({
          message: message
        })
      }
    },
    created(){
      this.init()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  @import '../../assets/css/variables-primary.scss';

  .appointment {
    .footer-title {
      background-color: map_get($ComColors, wathet-blue);
      height: 49px;
      line-height: 49px;
      text-align: center;
      font-size: 15px;
      color: #ffffff;
      /*      margin-top: 14px; */
    }

    .title {
      background-color: #f1f1f1;
      padding: 5px 10px;
      .isBt {
        color: red;
      }
      .title-title {
        font-size: 16px;
        margin-left: 4px;
      }
    }

    .input-text {
      background: #ffffff;
      border: none;
      height: 44px;
      width: 100%;
      padding-left: 10px;
      font-size: 14px;
    }

    .input-textArea {
      width: 100%;
      background: #ffffff;
      border: none;
      height: 80px;
      padding: 10px 0 0 10px;
    }

    .data-content {
      background: #ffffff;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      .data-content-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        flex: 1;
        span {
          margin-left: 4px;
        }
      }
      .icon {
        font-size: 26px;
      }
    }

    .type-check {
      .mint-radiolist-title {
        display: none;
      }
      .mint-cell {
        background: none;
        border: none;
        .mint-cell-wrapper {
          background: none;
          border: none;
        }
      }
    }

    .explain {
      background-color: #d1d1d1;
      padding: 10px;
      min-height: 30px;
      color: #222;
      font-size: 16px;
      font-weight: 500;
    }

    .address {
      .area-select {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        padding: 0 10px;
        border-bottom: 1px solid #eaeaea;
        .area-select-content {
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          flex: 1;
          span {
            margin-left: 4px;
          }
        }
        .icon {
          font-size: 26px;
        }
      }
    }

    .area-picker {
      width: 100%;
      .picker-slot {
        text-align: center;
      }
      .btn-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eaeaea;
        p {
          color: #26a2ff;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
        }
      }
    }

    .file {
      .file-upload-content {
        padding: 10px;
        .file-upload-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #eaeaea;
          height: 70px;
          position: relative;
          div {
            margin-left: 10px;
            .p1 {
              color: #26a2ff;
              font-size: 16px;
            }
          }
        }
      }
      .upload-input {
        position: absolute;
        height: 70px;
        width: 300px;
        opacity: 0;
      }
      .delete-file {
        display: flex;
        .name {
          flex: 1;
          display: flex;
          align-items: center;
          margin-left: 10px;
          font-size: 16px;
        }
        .delete-wrap {
          display: flex;
          align-items: center;
          margin-right: 10px;
          font-size: 16px;
          color: red;
          .icon {
            font-size: 30px;
            color: red;
            margin-right: 10px;
          }
        }
      }
    }

    .telephone-wrap {
      padding: 10px 20px;
      .phone-input {
        input {
          height: 46px;
          border: 1px solid #e2e2e2;
          border-radius: 6px;
          width: 100%;
          box-sizing: border-box;
          padding-left: 10px;
        }
      }
      .code-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        input {
          flex: 1;
          height: 46px;
          border: 1px solid #e2e2e2;
          border-radius: 6px;
          padding-left: 10px;
        }
        button {
          margin-left: 10px;
          height: 46px;
          background: #26a2ff;
          &.sending {
            background-color: rgb(204, 204, 204);
          }
        }
      }
    }
  }
</style>
