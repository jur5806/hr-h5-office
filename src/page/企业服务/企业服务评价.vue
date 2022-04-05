<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="企业服务评价">
    </v-header>
    <div class="g-enterprise-bg">
      <!-- <div class="g-bg-top"></div> -->
      <v-scroll class="main-box28 scroll" ref="my_scroller">
        <div class="g-top-blank"></div>
        <div class="g-padinng-20">
          <div class="g-evaluates">
            <h4>请评价我们的服务，促进我们提升服务质量</h4>
            <div class="g-padding-40">
              <v-xingXing-enterprise @getScore="getScore" :type="1"></v-xingXing-enterprise>
              <div class="g-more-score">
                <div class="flex-box g-score-item">
                  <p class="g-score-label">服务态度：</p>
                  <v-xingXing-enterprise :num="score1" :type="2" @getScore="getScore1"></v-xingXing-enterprise>
                </div>
                <div class="flex-box g-score-item">
                  <p class="g-score-label">服务效率：</p>
                  <v-xingXing-enterprise :num="score2" :type="2" @getScore="getScore2"></v-xingXing-enterprise>
                </div>
                <div class="flex-box g-score-item">
                  <p class="g-score-label">服务质量：</p>
                  <v-xingXing-enterprise :num="score3" :type="2" @getScore="getScore3"></v-xingXing-enterprise>
                </div>
              </div>
              <div class="g-textarea">
                <textarea v-model.trim="description" placeholder="本次服务您还满意吗？"></textarea>
              </div>
              <div class="g-img-up">
                <div class="g-imgshow" v-for="(item, index) in fileList" :key="index">
                  <img class="img" :src="item" alt="">
                  <img class="g-delimg" src="../../assets/workorderimg/del.png" alt="" @click.stop="delImg(index)">
                </div>
                <div class="g-up-default">
                  <input type="file" accept="image/*" @change="getImageFile" :capture="$store.state.isIOS?false:'camera'">
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-scroll>
      <div class="g-enterprise-footer">
        <p @click="submit">提交</p>
      </div>

      <div class="g-success-mask flex-box" v-if="isSuccess">
        <img src="../../assets/enterpriseImg/success-icon.png" alt="">
        <p>评价成功</p>
      </div>
    </div>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        score: 0,
        score1: 0,
        score2: 0,
        score3: 0,
        description: '',
        fileList: [],
        isSuccess: false,
      }
    },
    mounted () {

    },
    components: {},

    computed: {},
    methods: {
      getScore (val) {
        this.score = val
        this.score1 = val
        this.score2 = val
        this.score3 = val
      },
      getScore1 (val) {
        this.score1 = val
      },
      getScore2 (val) {
        this.score2 = val
      },
      getScore3 (val) {
        this.score3 = val
      },
      getImageFile (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (this.fileList.length >= 5) {
          mobile.toast('最多上传五张图片')
          return
        }
        if (!files.length) return
        mobile.selectImgFile(e).then(res => {
          if (res.res) {
            this.$dialog.loading.open('正在努力上传中...')
            mobile.uploadOss(e, getData.getSystemOssByUrl).then(res => {
              this.$dialog.loading.close()
              this.fileList.push(res.imgUrl)
            })
          }
        })
      },
      delImg (index) {
        this.fileList.splice(index, 1)
      },
      submit () {
        if (this.score === 0) {
          mobile.toast('请进行评分！')
          return
        }
        this.$dialog.loading.open('正在努力提交中...')
        // commentTotalScore	是	int	总评分
        // commentAttitudeScore	是	int	服务态度评分
        // commentEffectivenessScore	是	int	服务效率评分
        // commentQualityScore	是	int	服务质量评分
        // commentRemarks	否	String	备注
        // commentImgUrl	否	string	评价图片(如果有多张图片则用逗号分隔)
        // commentServiceOrderId	是	long	服务工单id
        getData.companyAddComment(this.score, this.score1, this.score2, this.score3, this.description, this.fileList.join(','), this.$route.query.odId).then(res => {
          this.$dialog.loading.close();
          if (res.data.code === 1) {
            // mobile.toast('评分成功！')
            this.isSuccess = true
            this.$router.go(-1)
          } else {
            mobile.toast(res.data.message)
          }
        }).catch(err => {
          this.$dialog.loading.close();
          console.log(err)
        })
      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-evaluates{
    width: 100%;

    background:rgba(255,255,255,1);
    box-shadow:0px .06rem .2rem 0px rgba(0,14,26,0.08);
    border-radius:.16rem;
    h4{
      font-size:.3rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      text-align: center;
      line-height: 1.19rem;
      border-bottom: 1px solid #DDDDDD;
    }
    .g-textarea{
      textarea{
        display: block;
        width: 100%;
        height: 1.6rem;
        background:rgba(250,250,250,1);
        padding: .2rem .3rem;
        font-size:.28rem;
        font-family:PingFang SC;
        font-weight:400;
        color:#333333;
        line-height: .48rem;
        &::placeholder{
          font-size:.28rem;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(170,170,170,1);
          line-height: .48rem;
        }
      }
    }
    .g-img-up{
      display: flex;
      .g-up-default, .g-imgshow{
        margin-top: .25rem;
        margin-right: .2rem;

      }
      .g-up-default{
        position: relative;
        width: .68rem;
        height: .68rem;
        background: url("../../assets/enterpriseImg/uplaods.png") no-repeat;
        background-size: 100% 100%;
        input{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;

        }
      }
      .g-imgshow{
        position: relative;
        width: 1.2rem;
        height: 1.2rem;
        .img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .g-delimg{
          position: absolute;
          width: .4rem;
          height: .4rem;
          top: -.1rem;
          right: -.1rem;
        }
      }
    }
    .g-more-score{
      padding-top: .37rem;
      padding-left: .5rem;
      padding-bottom: .1rem;
      .g-score-item{
        margin-bottom: .3rem;
      }
      .g-score-label{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#333333;
        line-height:.4rem;
        margin-right: .3rem;
      }
    }
  }

  .g-success-mask{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width:3.01rem;
    height:1.32rem;
    background:rgba(0,0,0,.6);
    border-radius:.1rem;
    justify-content: center;
    img{
      width: .4rem;
      height: .4rem;
      margin-right: .15rem;
    }
    p{
      font-size:.3rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
  }


</style>
