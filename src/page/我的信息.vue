<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="我的信息">
    </v-header>
    <v-scroll class="scroll main-box28">
      <div class="basic-info">
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              用户名<span class="g-font-danger">*</span>
            </div>
          </div>
          <div class="g-basic-input">
            <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="form.username" placeholder="请输入用户名" maxlength="20" />
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              手机号<span class="g-font-danger">*</span>
            </div>
          </div>
          <div class="g-basic-input">
            <input class="basic-input" v-model.trim="form.phone" placeholder="请输入手机号" maxlength="11" @blur="checkPhone;bridges.scrollToTop()"/>
          </div>
        </div>
        <div class="g-basic-item" @click.stop="showDate">
          <div class="g-basic-label">
            <div class="g-basic-title">
              出生日期：
            </div>
          </div>
          <div class="g-basic-input flex-box" style="justify-content: flex-end">
            <p class="p1">{{form.birthDate.replace('-','/') | date}}</p>
            <i class="iconfont icon-jinru-copy icon"></i>
          </div>
        </div>
        <div class="g-basic-item" @click.stop="show=true">
          <div class="g-basic-label">
            <div class="g-basic-title">
              性别
            </div>
          </div>
          <div class="g-basic-input flex-box" style="justify-content: flex-end">
            <p class="p1">{{visitorsNumberOption[form.sex].label}}</p>
            <i class="iconfont icon-jinru-copy icon"></i>
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              邮箱<span class="g-font-danger">*</span>
            </div>
          </div>
          <div class="g-basic-input">
            <input class="basic-input" v-model.trim="form.email" placeholder="请输入邮箱"  @blur="bridges.scrollToTop()"/>
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              积分
            </div>
          </div>
          <div class="g-basic-input">
            <span class="basic-input" style="line-height: 1.2rem;">{{form.sumPoints}}</span>
          </div>
        </div>
      </div>
    </v-scroll>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="show" position="center" width="6.3rem"
              :close-on-masker="true">
      <div class="g-choose-confirm">
        <div class="g-choose-box" :class="{active:form.sex===item.value}"
             v-for="(item,index) in visitorsNumberOption" @click="visitorsCheck(item,index)">
          {{item.label}}
        </div>
      </div>
    </yd-popup>
    <van-calendar v-model="show1" @confirm="onConfirm" />
    <div class="g-enterprise-footer">
      <p @click.stop="submit">确认修改</p>
    </div>
  </div>
</template>

<script>
  import * as getData from '../service/getData'
  import * as global from '../config/mUtils'
  export default {
    data () {
      return {
        form: {
          username:'',
          name: '',
          sex: 1,
          birthDate: '',
          email: '',
          phone: '',
          userPosition: '',
          sex:0,
        },
        ruler:{
          phone:'',
        },
        show:false,
        show1:false,
        visitorsNumberOption: [
          {label: '男', value: 0}, {label: '女', value: 1}
        ],
      }
    },
    mounted () {
      this.userId = sessionStorage.getItem('userId')
      this.init();
    },
    components: {},

    computed: {},
    methods: {
      checkFrom(){

      },
      showDate(){
        console.log(99999)
        this.show1 = true
      },
      onConfirm(date){
        this.form.birthDate = new Date(date).format('yyyy-MM-dd hh:mm:ss');
        this.show1 = false
      },
      visitorsCheck(row, index) {
        this.form.sex = row.value;
        this.show = false;
      },
      checkPhone() {
        var myReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
        if (!myReg.test(val)) {
          mobile.toast('手机号格式错误')
        }
      },
      requiredCheck(val,name,tip){
        console.log(val);
        
        if(!val){
          this.ruler[name] = tip
        }else{
          this.ruler[name]
        }
      },
      init () {
        getData.userDetail(this.userId).then(res => {
          if (res.data.code === 200) {
            this.form = res.data.data
          }
        }).catch(() => {})
      },
      submit () {
        getData.userInfoEdit(this.form).then(res => {
          if (res.data.code === 200) {
            mobile.toast('修改成功')
            this.$router.go(-1)
          }
        }).catch(() => {})
      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/mixin';
  .basic-info {
    background: #fff;
    // border-radius: .40rem .40rem 0 0;
    position: relative;
    z-index: 100;
    padding: 0 .2rem;
    box-sizing: border-box;
    // border-bottom: 0.28rem solid #f2f3fa;
    border-top: .3rem solid #f2f3fa;

    .g-basic-item {
      position: relative;
      width: 100%;
      height: 1.2rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EAEAEA;

      .g-basic-label {
        display: flex;
        align-items: center;
        .g-basic-icon {
          width: .77rem;
          height: .77rem;
          margin-right: .21rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .g-basic-icon-mini{
          width: .32rem;
          height: .32rem;
          margin-right: .09rem;
        }

        .g-basic-title {
          font-size: .28rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(67, 67, 67, 1);
          line-height: .28rem;
          > p {
            font-size: .28rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(67, 67, 67, 1);
            line-height: .28rem;
          }
          .tips-info {
            font-size: .22rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #999999;
            padding-top: .1rem;
          }
        }

        .g-basic-title-mini{
          font-size: .26rem;
          > p {
            font-size: .26rem;
          }
        }
      }

      .g-basic-img{
        width: .88rem;
        height: .88rem;
        margin-right: .1rem;
        margin-left: 0.2rem;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .g-delimg{
          position: absolute;
          width: .4rem;
          height: .4rem;
          top: -.1rem;
          right: -.1rem;
        }
      }
      .g-basic-input {
        flex: 1;
        /*height: .30rem;*/
        text-align: right;
        height: 100%;
        .p1{
          font-size: .30rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #434343;
          line-height: .30rem;
          margin-top: -.08rem;
        }
        .basic-input {
          width: 100%;
          height: 100%;
          text-align: right;
          font-size: .30rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #434343;
          line-height: .30rem;
          padding: 0 .17rem;
          box-sizing: border-box;

          &::placeholder {
            font-size: .30rem;
            color: rgba(204, 204, 204, 1);
            line-height: .30rem;
          }
        }

        .icon {
          @include sc(.46rem, #999);
          margin-right: .05rem;
        }
      }
    }

    .tips {
      height: .73rem;

      .tips-icon {
        width: .26rem;
        height: .26rem;
        margin-top: .03rem;
        margin-left: .08rem;
        margin-right: .11rem;
        vertical-align: middle;
      }
    }
  }
</style>
