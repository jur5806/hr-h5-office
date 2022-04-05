<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="人员详情"></v-header>
    <div class="info-box">
      <div class="info-name-box">
        <div class="info-xing">{{changeToPinYin(info.adminName[0]||'n')}}</div>
        <div class="info-name">{{info.adminName|empty}}</div>
      </div>
      <div class="info-box-line">
        <div class="info-line">
          <span class="info-label">部门</span>
          <span class="info-val">{{this.$route.query.depName|empty}}</span>
        </div>
        <div class="info-line">
          <span class="info-label">手机</span>
          <span class="info-val">{{info.adminPhone|empty}}</span>
        </div>
        <div class="info-line">
          <span class="info-label">座机</span>
          <span class="info-val">{{info.adminMachineNo|empty}}</span>
        </div>
        <div class="info-line">
          <span class="info-label">短号</span>
          <span class="info-val">{{info.adminCornet|empty}}</span>
        </div>
        <div class="info-line" style="border:none">
          <span class="info-label">邮箱</span>
          <span class="info-val">{{info.adminEmail|empty}}</span>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <button class="btn" @click="sendMess">短信</button>
      <button class="btn" @click="showCallTips=true">电话</button>
    </div>
    <yd-popup class="g-confirm" v-model="showTips" position="center" width="6.46rem" :close-on-masker="true">
      <div class="tit">提示</div>
      <p class="g-remindcont">进入错误，请退出当前页面！</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="showTips=false">取消</div>
        <div class="btn" @click="$router.replace('/contactList')">确定</div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm" v-model="showCallTips" position="center" width="6.46rem" :close-on-masker="true">
      <div class="tit">提示</div>
      <p class="g-remindcont">是否拨打电话{{info.adminPhone}}</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="callPhone">拨打</div>
        <div class="btn" @click="showCallTips=false">取消</div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
import pinyin from 'chinese-to-pinyin'
import * as getData from './../../service/getData'
import * as mobile from './../../config/mUtils'
export default {
  name: '',
  components: {},
  data () {
    return {
      info: {
        adminPhone: "",
        adminName: "",
        adminMachineNo: null,
        adminCornet: null,
        adminEmail: "",
      },
      showTips: false,
      showCallTips: false,
    }
  },

  mounted() {
    if (this.$route.query.id){
      this.getDetail(this.$route.query.id)
    }else{
      this.showTips = true
    }
  },

  methods: {
    changeToPinYin(name){
      return pinyin(name[0], { firstCharacter: true }).toUpperCase()
    },
    callPhone() {
      window.open(`tel:${this.info.adminPhone}`)
    },
    getDetail(id) {
      getData.parkContractDetail({adminId: id}).then(res=>{
        if(res.data.code === 1){
          this.info = res.data.data
        }
      })
    },
    sendMess() {
      window.open(`sms:${this.info.adminPhone}`)
    }
  }
}

</script>
<style lang='scss' scoped>
.page1{
  background: #F3F4F6;
}
.info-box{
  padding: .3rem;
  .info-name-box{
    background: #FFFFFF;
    border-radius: 0.12rem;
    padding: 1rem .4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .info-xing{
      width: 1.2rem;
      height: 1.2rem;
      text-align: center;
      line-height: 1.2rem;
      background: #e0f1ff;
      border-radius: 50%;
      font-size: 0.5rem;
      font-weight: bold;
      color: #0F8FFF;
    }
    .info-name{
      font-size: 0.4rem;
      font-weight: 500;
      color: #333333;
      margin-top: .25rem;
    } 
  }
}
.info-box-line{
  padding: 0.1rem .3rem;
  background: #FFFFFF;
  border-radius: 0.12rem;
  margin-top: .3rem;
  .info-line{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: .3rem 0;
    border-bottom: 1px solid rgba(155, 155, 155, 0.15);
    .info-label{
      font-size: 0.28rem;
      font-weight: 400;
      color: #333333;
      line-height: 0.4rem;
    }
    .info-val{
      font-size: 0.28rem;
      font-weight: 400;
      color: #666666;
      line-height: 0.4rem;
    }
  }
}
.btn-box{
  position: absolute;
  bottom: 0;
  padding: .3rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .btn{
    width: 45%;
    padding: .2rem 0;
    background: rgba(15, 143, 255, 1);
    font-size: 0.32rem;
    font-weight: 500;
    color: #FFFFFF;
    border-radius: 0.08rem;
  }
}
</style>
