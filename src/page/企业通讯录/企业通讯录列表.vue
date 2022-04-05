<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="企业通讯录"></v-header>
    <div class="search-box">
      <div class="search-inp">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="输入姓名关键字搜索企业人员" v-model="name" @keyup.enter="init">
      </div>
      <button class="btn-search" @click="init">搜索</button>
    </div>
    <div class="contract-box" v-if="tableList!=0">
      <v-scroll class="scroll" style="overflow-y: auto;height: 100%;">
        <div v-for="(people, index) in tableList" :key="index" class="item-box">
          <div class="item-xing">{{changeToPinYin(people.userName||'n')}}</div>
          <div class="item-name">
            <div class="item-name-1">{{people.userName}}</div>
            <div>{{people.userDuty|empty}}</div>
          </div>
          <div class="item-icon" @click="adminPhone=people.userMobile,showCallTips=true"></div>
        </div>
        <div style="text-align: center;padding-bottom: 10px">- 加载完毕 -</div>
      </v-scroll>
    </div>
    <div class="no-data" v-if="tableList==0">
      <img src="http://park.hzqisheng.cn/v3.5/nocompany.png" alt="">
      暂无数据
    </div>
    <yd-popup class="g-confirm" v-model="showCallTips" position="center" width="6.46rem" :close-on-masker="true">
      <div class="tit">提示</div>
      <p class="g-remindcont">是否拨打电话{{adminPhone}}</p>
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
      name: '',
      showCallTips: false,
      tableList: [],
      adminPhone: ''
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    changeToPinYin(name){
      return pinyin(name[0], { firstCharacter: true }).toUpperCase()
    },
    init(){
      this.tableList = []
      this.$dialog.loading.open('正在努力获取中...')
      getData.companyContractList({name: this.name, companyId: mobile.getStore('userCompanyId')}).then((res) =>{
        this.$dialog.loading.close()
        if(res.data.code === 1 ){
          this.tableList = res.data.data
        }else{
          mobile.toast(res.data.message)
        }
      }).catch(e=>{
        mobile.toast(e)
        this.$dialog.loading.close()
      })
    },
    callPhone() {
      window.open(`tel:${this.adminPhone}`)
    }
  },
  beforeDestroy() {
    this.$dialog.loading.close()
  },
}

</script>
<style lang='scss' scoped>
.warp{
  background:rgba(238, 240, 244, 1);
}
.search-box{
  background: #4F7BE6;
  padding: .3rem .25rem;
  display: flex;
  align-items: center;
  i{
    color: rgb(196, 196, 196);
    margin-left: .2rem;
    margin-right: .1rem;
    position: relative;
    bottom: -.04rem;
  }
  .search-inp{
    padding: .1rem 0;
    flex: 1;
    background: #f7f7f7;
    border-radius: 0.08rem;
    margin-right: .3rem;
    input{
      width: 85%;
      height: .4rem;
      font-size: .22rem;
    }
  }
  .btn-search{
    font-size: 0.3rem;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 0.42rem;
  }
}
.contract-box{
  padding: .3rem;
  background:rgba(238, 240, 244, 1);
  flex: 1;
  overflow: auto;
  .item-box{
    background: #FFFFFF;
    padding: .3rem;
    border-radius: 0.12rem;
    margin-bottom: .25rem;
    display: flex;
    align-items: center;
    .item-name{
      flex: 1;
    }
    .item-icon{
      width: .6rem;
      height: .6rem;
      background: url('./../../assets/images/phone.png') no-repeat;
      background-size: 100%;
    }
    .item-name{
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      line-height: 0.42rem;
      padding-left: .3rem;
    }
    .item-name-1{
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      line-height: .5rem;
    }
  }
  .item-label{
    font-size: 0.3rem;
    font-weight: 500;
    color: #2D363C;
    padding: .15rem 0;
    display: flex;
    align-items: center;
    &::before{
      content: '';
      display: inline-block;
      width: 0.08rem;
      height: 0.4rem;
      background: #0F8FFF;
      margin-right: .15rem;
    }
  }
}
.item-xing{
  width: 0.92rem;
  height: 0.92rem;
  text-align: center;
  line-height: .92rem;
  background: #e0f1ff;
  border-radius: 50%;

  font-size: 0.4rem;
  font-weight: 500;
  color: #0F8FFF;
}
.no-data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: .3rem;
  font-weight: 500;
  img{
    width: 4rem;
  }
}
</style>
