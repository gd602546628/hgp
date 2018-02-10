/**
* Created by guooug on 2017/6/16.
*/
<template>
  <div class="container" :class="{active:active}">
    <div class="main">
      <div>
        <input type="text" maxlength="18" v-model="name">
        <div class="row">
          <button class="col" @click="close()">取消</button>
          <button class="col submit" :disabled="disabled" @click="updateNickName()">确定</button>
        </div>
      </div>
    </div>
    <div class="bg" :style="bgStyle"></div>
  </div>
</template>
<script>
  import {mapActions} from 'Vuex'
  export default {
    props: ['nickName'],
    data(){
      return {
        active: false,
        name: this.nickName
      }
    },
    computed: {
      disabled(){
        let reg = /^\s*[\s\S]{1,18}\s*$/
        return !reg.test(this.name)
      },
      bgStyle(){
        let opacity = 0
        if (this.active) {
          opacity = 0.5
        }
        return {
          opacity: opacity
        }
      }
    },
    methods: {
      ...mapActions(['modifyUserInfo']),
      updateNickName(){
        this.modifyUserInfo({
          nickName: this.name
        })
        this.close()
      },
      open(){
        this.active = true
      },
      close(){
        this.active = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../assets/css/variables-primary";

  .container {
    display: none;
    .main {
      top: 0;
      left: 0;
      z-index: 99;
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .submit {
        border-left: 1px solid map_get($ComBorderColor, dd);
        color: map_get($ComColors, wathet-blue);
        &[disabled] {
          opacity: .5;
        }
      }
      & > div {
        border-radius: 5px;
        background-color: white;
        transition: all .4s cubic-bezier(.55, 0, .1, 1);
        .row {
          padding: 10px;
          // border-top: 1px solid map_get($ComBorderColor, dd);
        }
        input {
          margin: 15px 30px;
          text-align: center;
          height: 30px;
          border: 0px;
          color: map_get($ComColors, wathet-blue);
          border-bottom: 1px solid map_get($ComColors, wathet-blue);
        }
      }
    }
    .bg {
      top: 0;
      left: 0;
      opacity: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 98;
      background-color: black;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
    }
    &.active {
      display: block;
    }
  }

</style>
