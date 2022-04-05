<template>
  <div class="warp page1">
    <v-header :goBackFork="!isSearch&&!isOver" :goBack="isOver" :headTitle="isSearch?'选择企业':'信息完善'">
      <template slot="back">
        <div class="back" @click="searchShow(false)" v-show="isSearch">
          <i class="iconfont icon-back1"></i>
        </div>
      </template>
    </v-header>
    <v-scroll class="main-box scroll" ref="my_scroller" style="margin-top: .2rem;">
      <div class="g-form-box">
        <div class="g-form-title">请完善您的个人信息</div>
        <div class="g-form-input">
          <div class="g-label">您的姓名</div>
          <div class="g-input">
            <input v-model="name" type="text" placeholder="请输入您的姓名">
            <i class="iconfont icon-quxiao" v-show="!!name" @click.stop="name = ''"></i>
          </div>
        </div>
        <div class="g-form-input">
          <div class="g-label">所在企业</div>
          <div class="g-input" @click.stop="searchShow(true)">
            <input v-model="company" type="text" placeholder="选择你所在的企业" readonly>
            <i class="iconfont i-sanjiao"></i>
          </div>
        </div>
        <button class="g-form-btn" @click="submit">确定</button>
      </div>
      <transition name="slideDown">
        <div v-show="isSearch" class="g-search-main">
          <div class="g-search-input">
            <input type="text" v-model="searchName" placeholder="点击搜索企业" @input="searchStart">
            <i class="iconfont icon-sousuo"></i>
          </div>
          <ul class="g-company-list">
            <li class="g-list-item" v-for="(item,index) in companyList" :key="index" @click.stop="chooseCompany(item.companyName,item.companyId)">{{item.companyName}}</li>
          </ul>
        </div>
      </transition>
      <div class="g-submit-over flex-box" v-if="isOver">
        <div class="g-submit-over-box clearfix">
          <div class="g-over-pic">
            <img class="f-adapt-img" src="../assets/images/in-review.png" alt="">
          </div>
          <p class="g-over-content">认证审核中，请耐心等待！</p>
        </div>
      </div>
    </v-scroll>
  </div>
</template>

<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'

  export default {
    data () {
      return {
        isOver: false,//是否完成信息完善
        isSearch: false,//是否切换成选择企业
        name: '',//姓名
        company: '',//企业
        searchName: '',//搜索企业名称
        companyList: [],
        companyId: '',//选中ID
        flag:''
      }
    },
    mounted () {
      if(this.$route.query.isOver){
        this.isOver = true;
      }
      if (this.$route.query.name) {
        this.name = this.$route.query.name
        this.companyId = this.$route.query.companyId
        this.company = this.$route.query.companyName
      }
      this.flag=mobile.getCookie("flag");
    },
    methods: {
      //提交
      submit () {
        if (mobile.rule.empty(this.name, '请输入您的姓名') && mobile.rule.empty(this.company, '请选择你所在的企业')) {
          getData.completeInfo(this.companyId,this.name).then(res => {
            if (res.data.code !== 1) {
              mobile.toast(res.data.message);
              return
            }
            // if (localStorage.getItem('fullPath')) {
            //   if(this.flag){
            //     this.isOver = true; //前往充值中心
            //   }else{
            //     this.$router.replace({path: localStorage.getItem('fullPath')})
            //   }
            // }else{
              this.isOver = true;
            // }
            
          })
        }
      },
      //开始搜索
      searchStart:_.debounce(function () {
        this.init();
      }, 300, { 'maxWait': 1000 }),
      chooseCompany (name, id) {
        this.company = name;
        this.companyId = id;
        this.isSearch = false;
      },
      searchShow (show) {
        if (show) {
          document.title = '选择企业';
          this.isSearch = true;
          this.init();
        } else {
          document.title = '信息完善';
          this.isSearch = false;
        }
      },
      init () {
        getData.getCompanyIdAndName(this.searchName).then(res => {
          if (res.data.code !== 1) {
            mobile.toast(res.data.message);
            return
          }
          this.companyList = res.data.data.list;
        })
      },
      goUrl () {
        let path = mobile.getSession('paths')
        let querys = JSON.parse(mobile.getSession('tempQuery'))
        if (path) {
          this.$router.replace({path: path, query: querys })
          sessionStorage.clear()
        } else {
          this.$router.replace({path: '/index'})
        }
      },
      goVoucherCenter () {
        this.$router.replace({path: localStorage.getItem('fullPath')}) //前往水电充值页面
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/mixin.scss';
  .main-box{
    position: relative;
  }
  .g-form-box{
    padding-bottom: .46rem;
  }
  .g-form-box,.g-submit-over>.g-submit-over-box{
    margin: auto;
    /* padding-top: .46rem;
    width: 6.9rem;
    border-radius: .12rem;
    box-shadow: 0 0 1rem RGBA(214, 214, 214, 0.8); */
    .g-form-title{
      margin-bottom: .22rem;
      @include sc(.32rem,#333);
      line-height: .4rem;
      font-weight: 700;
      text-align: center;
    }
    .g-form-input{
      margin: 0 auto .3rem;
      width: 5.26rem;
      .g-label{
        @include sc(.28rem,#333);
        line-height: .7rem;
      }
      .g-input{
        @include wh(100%,.58rem);
        border: 1px solid #cccccc;
        @include fj();
        align-items: center;
        border-radius: .04rem;
        padding-right: .13rem;
        input{
          @include wh(calc(100% - .44rem),100%);
          padding-left: .25rem;
          @include sc(.26rem,#333);
          &::placeholder{
            color: #CCCCCC;
          }
        }
        .icon-quxiao{
          @include wh(.44rem,.44rem);
          @include sc(.28rem,#777777);
          line-height: .44rem;
          text-align: center;
        }
        .i-sanjiao{
          position: relative;
          @include wh(.44rem,.44rem);
          &:before{
            content: '';
            @include cl;
            top: .15rem;
            @include wh(0,0);
            border-width: .14rem .11rem;
            border-style: solid;
            border-color: #333333 transparent transparent transparent;
          }
        }
      }
    }
    .g-form-btn{
      display: block;
      margin: .5rem auto;
      @include wh(5.26rem,.7rem);
      border-radius: .35rem;
      background: #3f7def;
      @include sc(.28rem,#fff);
    }
  }
  .g-search-main,.g-submit-over{
    position: absolute;
    top: 0;
    left: 0;
    @include wh(100%,100%);
    background: #fff;
    .g-search-input{
      margin: .3rem auto 0;
      @include wh(6.9rem,.6rem);
      padding: 0 .23rem 0 0;
      @include fj();
      align-items: center;
      border: 1px solid #777777;
      border-radius: .3rem;
      .iconfont{
        display: block;
        @include wh(.44rem,.44rem);
        @include sc(.32rem,#dcdee1);
        text-align: center;
        line-height: .44rem;
      }
      input{
        @include wh(calc(100% - .44rem),100%);
        padding-left: .3rem;
        @include sc(.28rem,#777777);
        &::placeholder{
          color: #ccc;
        }
      }
    }
    .g-company-list{
      margin-top: .09rem;
      padding: 0 .3rem;
      .g-list-item{
        @include wh(100%,.89rem);
        border-bottom: 1px solid #D8DFE4;
        @include sc(.28rem,#777777);
        line-height: .89rem;
      }
    }
  }
  .g-submit-over{
    .g-submit-over-box{
      padding-bottom: 0;
      .g-over-pic{
        margin: .24rem auto;
        @include wh(3.46rem,2.54rem);
      }
      .g-over-content{
        /* margin: .36rem auto; */
        text-align: center;
        /* width: 3.3rem; */
        @include sc(.3rem,#333333);
        line-height: .54rem;
      }
      .g-over-btn{
        display: block;
        margin: .57rem auto .7rem;
        @include wh(3.28rem,.68rem);
        border-radius: .34rem;
        border: .02rem solid #3f7def;
        @include sc(.26rem,#3f7def);
      }
    }
  }
  .back{
    padding: 0.1rem 0.2rem;
    i{
      @include sc(.4rem,#FFFFFF)
    }
  }
</style>
