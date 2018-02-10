<template lang="html">
  <zyt-page>
    <div slot="main">
    <div class="add-product-info-box">
        <img :src="imgsUrl(prdInfo)">
        <div class="add-product-specification-box">
           <span class="add-product-specification">{{prdInfo.prdName}}</span>
           <span v-if="!prdInfo.fpName && !prdInfo.spName">规格：统一规格</span>
           <div class="specification-box">
            <div class="add-product-fp-box" v-if="prdInfo.fpName">
            <span>{{prdInfo.fpName}}:</span>
            <span>{{prdInfo.fpValue}}</span>
          </div>
          <div class="add-product-sp-box" v-if="prdInfo.spName">
            <span>{{prdInfo.spName}}:</span>
            <span>{{prdInfo.spValue}}</span>
          </div>
          </div>
        </div>
    </div>
       <textarea placeholder="商品满足你的期待吗？说说它的优点和美中不足的地方吧" v-model="commentDetails"
                class="comment-comment-text-box">
      </textarea>
    <div class="upload-picture-box">
        <div class="upload-picture" v-if="answer"  v-for="(item,index) in answer" @click.stop="openFile(answer,index)" >
          <img-component :img-src="Prefix + item" class="upload-picture-already"></img-component>
          <i class="icon-zyt-minus" @click.stop="deleteFile(index)"></i>
        </div>
        <div class="upload-picture1" v-if="answer.length<6">
          <img src="../../assets/img/add.png" class="upload-photograph">
          <input type="file" @change="upLoadFile($event)" multiple  class="upload-input1"/>
        </div>
      </div>
    <div class="star-evaluate">
      <p>星级评价</p>
      <zyt-star  :bgSize="20"  :isStar="true"  v-model="star" :isShowInput="true" style="color: #ffa902;"></zyt-star>
    </div>
    <div class="comment-submite-box" @click="submit()">
      <div>发布评价</div>
    </div>

  </div>
  </zyt-page>
</template>
<script>
  import { mapActions } from 'Vuex'
  import star from '@/components/score/star.component'
  import {Config} from '@/config/config'
  import getAmendComment from '@/api/comment/commentList.api'
  import PhotoSwipeComponent from '@/components/photoSwipe/photoSwipe.component'
  import Util from '@/service/common/utils/util.service'
  import pic from '@/assets/img/wutu.png'
  import {Indicator} from 'mint-ui'
  import ImgComponent from '@/components/common/img/img.component'
  import PhotoSwiperService from '@/service/photo-swiper/photo-swiper.service.js'
  export default{
    name: 'addComment',
    data () {
      return {
        commentDetails: '', // 用户评价内容
        prdInfo: [],      // 订单信息
        answer: [],       // 上传图片地址
        Prefix: Config.commentImgUrl, // 图片前缀
        star: 5
      }
    },
    components: {
      'zyt-star': star,
      'img-component': ImgComponent,
      'photoSwipe-component': PhotoSwipeComponent
    },
    methods: {
      ...mapActions(['getUserToken']), // 强制获取用户信息
      getOrderInfo(){ // 获取订单详情
        let params = {
          orderId: this.$route.params.orderId // 订单id
        }
        getAmendComment.getOrderInfo(params).then(data => {
          console.info(777777777, data)
          data.data[0].prdInfos.forEach(item => {
            if (item.priceId === this.$route.params.priceId){
              this.prdInfo = item
            }
          })
        })
      },
      async upLoadFile(e, item){ // todo 上传图片
        let userInfo = await this.getUserToken({
          forceLogin: true
        }).catch(e => {
          console.info(e)
        })
        let files = e.target.files
        let name = `user/${userInfo.userId}/commentImg`
        let type = 1 // 1-不限制大小
        let formData = new FormData()
        formData.append('type', type)
        formData.append('name', name)
        formData.append('category', 1)
        for (let i = 0; i < files.length; i++){
          formData.append('file', files[i])
        }
        /* let params = { // todo 上传图片参数
          type: type,
          file: files,
          name: name,
          category: 1 // 1-site目录 0-entsite目录
        } */
        Indicator.open({
          text: '正在上传'
        })
        let data = await getAmendComment.postFile(formData).catch(e => {
          console.log('上传失败', e)
          Indicator.close()
          throw new Error(false)
        })
        if (data.data.code === '000000') { // 上传成功之后才显示图片
          this.answer.push(data.data.data[0])
          console.info(this.answer)
        } else {
          Util.alert({
            message: data.data.mesg
          })
        }
        this.uploadShow = false
        Indicator.close()
      },
      openFile(imgs, index){
        let imgUrl = []
        imgs.forEach(item => {
          imgUrl.push(this.Prefix + item)
        })
        PhotoSwiperService.show(imgUrl, index)
      },
      deleteFile(index){ // 删除图片
        this.answer.splice(index, 1)
      },
      submit(){ // 提交评价
        let params = {   // todo 发布评价的参数
          content: this.commentDetails, // 评价内容
          doorId: this.$route.params.doorId,   // 店铺id
          orderPrdId: this.$route.params.orderPrdId, // 订单下产品id
          star: this.star,  // 评分
          commentImg: JSON.stringify(this.answer)         // 图片
        }
        if (params.content === '') {
          console.log(params.commentImg)
          Util.alert({
            message: '请输入评价内容！'
          })
        } else {
          getAmendComment.getAddComment(params).then(async data => {
            if (data.code === '000000') {
              await Util.alert({
                message: '评价成功！'
              })
              this.$router.back(-2)
             /* this.$router.push({
                name: 'onlineMyOrder',
                params: {
                  status: 3
                }
              }) */
            } else {
              await Util.alert({
                message: data.mesg
              })
              this.$router.back()
            }
          })
        }
      },
      imgsUrl: function (product) { // 图片显示规格
        if (product.prdImg) {
          return Config.imgPrefix + product.prdImg
        } else {
          return pic
        }
      }
    },
    created(){
      this.getOrderInfo()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .add-product-info-box{
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid #ddd;
    img{
      height:70px;
      width: 70px;
    }
    .add-product-specification-box {
      display: -webkit-flex;
      -webkit-flex-direction: column;
      -webkit-justify-content: space-between;
      display: flex;
      flex-direction: column;
      height: 70px;
      padding: 5px 0;
      justify-content: space-between;
      margin:0 5px;
      .add-product-specification{
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
        word-break: break-all;
        width: 100%;
        -webkit-box-orient: vertical;
        display: -webkit-box;
      }
      .specification-box{
        display: flex;
        justify-content: center;
        align-items: center;
        .add-product-fp-box{
          color: #88888d;
          font-size: 12px;
        }
        .add-product-sp-box{
          margin-left: 10px;
          color: #88888d;
          font-size: 12px;
        }
      }

    }
  }
  .comment-comment-text-box {
    width: 100%;
    height: 200px;
    padding: 10px;
    font-size: 13px;
    resize: none;
    border: 0;
    display: block;
  }
  .upload-picture-box{
    display: flex;
    border-bottom:1px solid #ddd;
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    -webkit-flex-wrap: wrap ;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width:100%;
    padding:0 4% 0 0;
    .upload-picture{
      margin:5px;
      height: 60px;
      width: 60px;
      left: 5px;
      border-radius: 3px;
      display: -webkit-flex;
      -webkit-justify-content: center;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #9e9e9e;
      position: relative;
      .upload-picture-already{
        height: 100%;
        width: 100%;
      }
      .upload-input {
        position: absolute;
        opacity: 0;
        height: 60px;
        width: 60px;
      }
      i{
        font-size: 22px;
        position: absolute;
        color: #f8311e;
        border-radius: 9px;
        top: -14px;
        left: 50px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .upload-picture1{
      margin:5px;
      height: 60px;
      width: 60px;
      bottom: 5px;
      left: 5px;
      border:1px dashed #ddd;
      border-radius: 3px;
      display: -webkit-flex;
      -webkit-justify-content: center;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #9e9e9e;
      .upload-photograph{
            pointer-events: none;
            height:15px;
            width: 15px;
          }
      .upload-input1 {
        position: absolute;
        opacity: 0;
        height: 60px;
        width: 60px;
      }
  }
  }
  .star-evaluate {
    padding: 16px;
    border-bottom: 1px solid #ddd;
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .comment-submite-box {
    div {
      width: 92%;
      margin: 4%;
      padding: 10px;
      background-color: #066cc2;
      color: #fff;
      border-radius: 5px;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
