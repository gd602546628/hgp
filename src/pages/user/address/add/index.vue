/**
* Created by guooug on 2017/6/16.
*/
<template>
  <zyt-page :hasFooter="true">
    <div slot="main">
      <mt-field label="收货人" type="text" placeholder="请输入收货人姓名" v-model="data.receiverName"></mt-field>
      <mt-field label="联系电话" type="tel" placeholder="请输入联系电话" v-model="data.receiverMobile"></mt-field>

      <div class="split">收货地址</div>
      <div class="row" v-if="inited">
        <div class="col select-tip" >省</div>
        <div class="col" >
          <select v-model="data.provinceId">
            <option value="-1">请选择</option>
            <option v-for="option in provinceList" v-bind:value="option.id">
              {{ option.shortName }}
            </option>
          </select>
        </div>
      </div>
      <div class="row" v-if="inited">
        <div class="col select-tip">市</div>
        <div class="col">
          <select v-model="data.cityId">
            <option value="-1">请选择</option>
            <option v-for="option in cityList" v-bind:value="option.id">
              {{ option.shortName }}
            </option>
          </select>
        </div>
      </div>
      <div class="row country-row" v-if="inited">
        <div class="col select-tip ">县/区</div>
        <div class="col">
          <select v-model="data.countryId">
            <option value="-1">请选择</option>
            <option v-for="option in countryList" v-bind:value="option.id">
              {{ option.shortName }}
            </option>
          </select>
        </div>
      </div>
      <mt-field label="详细地址" type="textarea" placeholder="详细地址" rows="3" v-model="data.detail"></mt-field>
    </div>
    <div slot="footer">
      <button class="common-submit-btn" :disabled="disabled" @click="submit()">
        保存
      </button>
    </div>
  </zyt-page>
</template>
<script>
  import {mapGetters, mapActions} from 'Vuex'
  import getArea from '@/service/getArea/getArea.service'
  import {Codes} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  export default {
    name: 'addAddress',
    data(){
      return {
        provinceList: [],
        cityList: [],
        countryList: [],
        inited: false,
        data: {
          city: '',
          cityId: -1,
          country: '',
          countryId: -1,
          detail: '',
          province: '',
          provinceId: -1,
          receiverMobile: '',
          receiverName: ''
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      disabled(){
        if (!Util.roles.length16[0].test(this.data.receiverName)) {
          return true
        }
        if (!Util.roles.telOrMobile[0].test(this.data.receiverMobile)) {
          return true
        }
        if (!Util.roles.length30[0].test(this.data.detail)) {
          return true
        }
        if (this.data.provinceId === -1 || this.data.cityId === -1 || this.data.countryId === -1) {
          return true
        }
        return false
      }
    },
    watch: {
      'data.provinceId': function (val) {
        if (this.inited) {
          this.data.cityId = -1
          this.getOtherArea(2, val)
        }
      },
      'data.cityId': function (val) {
        if (this.inited) {
          this.data.countryId = -1
          this.getOtherArea(3, val)
        }
      }
    },
    methods: {
      ...mapActions(['addAddress']),
      init(){
        let addressId = this.$route.params.addressId
        addressId = parseInt(addressId)
        // 如果是修改地址
        if (addressId) {
          let address = this.userInfo.addressList.filter(item => {
            return item.addressId === addressId
          })
          if (address.length === 1) {
            let getProvince = this.getProvince()
            let getCity = this.getOtherArea(2, address[0].provinceId)
            let getCountry = this.getOtherArea(3, address[0].cityId)
            Promise.all([getProvince, getCity, getCountry]).then(() => {
              this.data = address[0]
              setTimeout(() => {
                this.inited = true
              }, 100)
            })
          }
        } else {
          this.getProvince()
          this.inited = true
        }
      },
      getProvince(){
        getArea.getFirstArea({}).then(data => {
          this.provinceList = data.data
        })
      },
      async getOtherArea(type, id){
        let data = await getArea.getOtherArea({
          type: type,
          id: id
        })
        if (data.code === Codes.success) {
          if (type === 2) {
            this.cityList = data.data
          } else {
            this.countryList = data.data
          }
        }
      },

      completeData(){
        this.data.province = this.provinceList.filter(item => {
          return item.id + '' === this.data.provinceId + ''
        })[0].name
        this.data.city = this.cityList.filter(item => {
          return item.id + '' === this.data.cityId + ''
        })[0].name
        this.data.country = this.countryList.filter(item => {
          return item.id + '' === this.data.countryId + ''
        })[0].name
        if (this.data.addressId) {
          this.data.id = this.data.addressId
        }
      },
      async submit(){
        this.completeData()
        let result = await this.addAddress(this.data)
        if (result) {
          let msg = this.data.id ? `修改成功，是否返回` : `添加成功，是否返回`
          Util.confirm({
            message: msg
          }).then((data) => {
            if (data === 'confirm') {
              this.$router.back()
            } else {
              this.data.receiverName = ''
              this.data.receiverMobile = ''
            }
          })
        }
      }
    },
    created(){
      this.init()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../../assets/css/variables-primary";

  .split {
    padding: 0 10px;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    background-color: map_get($ComColors, gray-ef);
  }

  button {
    height: 49px;
    &[disabled] {
      opacity: .5;
    }
  }

  .row {
    font-size: 16px;
    margin: 0 10px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    &.country-row {
      border-bottom: 0;
    }
    .col {
      display: flex;
      align-items: center;
      height: 48px;
      select {
        font-size: 16px;
        width: 100%;
        height: 100%;
        border: 0;
      }
    }
    .select-tip {
      max-width: 105px;
    }
  }

  .space-between {
    align-items: center;
    padding: 0 10px;
    &.chose-container {
      background-color: map_get($ComColors, e5);
      > div {
        height: 30px;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
