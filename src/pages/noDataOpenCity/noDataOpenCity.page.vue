<template>
  <zyt-page>
    <div slot="main">
      <!--<div class="noData">
        <img src="../../assets/img/empty.png" class="img">
        <p>暂无相关数据</p>
        <img src="../../assets/img/SYin.png" class="water">
        <div class="btnclass" @click="goToBack">切换至示范城市:玉溪市</div>
      </div>-->
      <div class="noData2">
        <img src="../../assets/img/wushuju.png" alt="">
        <p>你所在的城市暂时没有数据，帮你切换到示范城市玉溪市体验完整功能</p>
        <span @click="goToBack">我知道了</span>
        <span @click="callFn" class="lastSp">成为本市代理商</span>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import {mapMutations} from 'vuex'
  import localStorageService from '@/service/common/localStorage/localStorage.service'
  import native from '@/service/common/native/native.service'
  import { MessageBox } from 'mint-ui'
  export default{
    name: 'noDataOpenCity',
    data(){
      return {}
    },
    methods: {
      ...mapMutations(['SelectCityMutation', 'addExclude', 'removeInclude']),
      goToBack(){
        let selectCity = {
          province: '云南省',
          city: '玉溪市',
          country: null
        }
        localStorageService.setStorage('selectCity', selectCity) // 跟新缓存数据
        this.SelectCityMutation(selectCity)
        if (native.isApp()) {
          native.todoNative('common_native', 'switchCity', {showSwitchCity: '2'}).then(() => {
            this.$router.go(-1)
          }).catch(() => {
            this.$router.go(-1)
          })
        } else {
          this.$router.go(-1)
        }
      },
      callFn (option) {
        let options = {
          title: '代理商加盟电话',
          message: '400-169-1615！',
          showCancelButton: false,
          confirmButtonText: '关闭'
        }
        return MessageBox(options)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .noData {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -80px;
    margin-top: -92px;

    .img {
      width: 60px;
    }

    .water {
      width: 130px;
    }

    .btnclass {
      padding: 4px 8px;
      margin-top: 10px;
      color: #2772ad;
      border: solid 1px #2772ad;
      border-radius: 6px;
    }
  }
  .noData2 {
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    margin-top: -260px;
    text-align: center;

    img {
      width: 350px;
    }
    p {
      width: 100%;
      padding: 10px 40px 0px 40px;
    }

    span {
      display: block;
      width: 160px;
      padding: 6px 10px;
      margin-top: 20px;
      color: #2772ad;
      background-color: #e6f3f9;
    }
    .lastSp{
      color: #ffffff;
      background-color: #0164a6;
    }
  }
</style>
