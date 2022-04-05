<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="场地预约" :serviceGet="true"></v-header>
    <div class="g-section1">
      <div class="search-box">
        <form action @submit.prevent="getList" class="g-form-box">
          <input type="search" ref="searchinput" class="f-font-input" :placeholder="icontext" v-model="name"
                 @keyup.enter="init()" @blur="init">
        </form>
      </div>
    </div>
    <v-scroll class="service-main-box7 scroll" ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite">
      <div class="g-nodata g-nodata1" v-if="isLoading">
        <div class="noarticle g-adaptimg g-loading-icon"><img class="i-magnifier"
                                                              src="http://park.hzqisheng.cn/v3.5/i-loading-magnifier.png"
                                                              alt=""></div>
        <p class="nodatatext g-loading">正在加载</p>
      </div>
      <div class="g-section2" v-else>
        <div class="g-item" v-for="(item,index) in fields" :key="index"
             :class="{'zhi-hui-type':item.appointmentType===2}"
             @click.stop="goDetail(item)">
          <img v-lazy="getImage(item.image)" alt="">
          <div class="g-item-center">
            <div class="g-item-title ellipsis">{{item.name}}</div>
            <div class="g-address ellipsis">{{item.address}}</div>
            <div class="g-money ellipsis"><i class="iconfont icon-gold"></i>
            <template v-if="item.fieldFeeType==1">
            {{item.fee}}{{item.fieldFeeUnit | fieldFeeUnit}}
            </template>
            <template v-if="item.fieldFeeType==2">
              <template>{{item.fee}}元/次 起</template>
            </template>
            <template v-if="item.fieldFeeType==3">
              <template v-if="item.fieldFeeConfigInfo.halfDay">{{item.fieldFeeConfigInfo.halfDayPrice}}元/半天<template v-if="item.fieldFeeConfigInfo.allDay">、</template></template><template v-if="item.fieldFeeConfigInfo.allDay">{{item.fieldFeeConfigInfo.allDayPrice}}元/全天</template>
            </template>
            </div>
          </div>
          <div class="g-item-right">
            <div v-if="item.appointmentType === 2" style="color: #fff;white-space: nowrap;">可容纳{{item.capacity}}余人</div>
            <div v-if="item.appointmentType === 1" style="white-space: nowrap;">可容纳{{item.capacity}}余人</div>
            <button v-if="item.appointmentType === 2" class="g-button g-button-while">在线预约</button>
            <button v-if="item.appointmentType === 1" class="g-button">预约申请</button>
          </div>
          <div class="g-item-type">{{item.type}}</div>
        </div>
      </div>
      <div class="g-field-empty" v-if="isEmpty">
        <img src="http://park.hzqisheng.cn/v3.5/i-field-nothing.png" alt="">
        <div class="g-nothing-world">对不起，暂无可线上预约的场地，您可以尝试联系园区进行线下预约</div>
        <!--<div class="g-nothing-btn">联系园区</div>-->
      </div>
    </v-scroll>
    <v-ordertab></v-ordertab>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data() {
      return {
        key: '',
        icontext: '\ue65f  请输入场地名称',
        state: 0,
        pageIndex: 1,
        totalPage: 1,
        name: '',
        fields: [],
        isEmpty: false,
        isLoading: true,
        userConfirmState:0,
      }
    },
    created() {
      this.checkUserConfirmState()
    },
    mounted() {
    },
    components: {},
    computed: {},
    methods: {
      getList() {
        this.$refs.searchinput.blur()
      },
      checkUserConfirmState(){
        getData.checkUserConfirmState().then(res=>{
          if(res.data.code!=1){
            mobile.toast(res.data.message)
            return
          }
          this.userConfirmState = res.data.data.userConfirmState
        })
      },
      goDetail(item){
        if(!this.userConfirmState){
          mobile.toast('正在加载权限,请稍后...')
          return
        }
        // if(this.userConfirmState!=3&&item.appointmentType==2){
        //   mobile.toast('访客暂不可预约智慧型场地，请选择普通型场地进行预约。')
        //   return
        // }
        this.$router.push({path:'/roomDetail',query:{fieldId:item.id}})
      },
      getImage(val) {
        if (val != null && val != '') {
          return val.split(',')[0]
        } else {
          return null
        }
      },
      init() {
        this.fields = []
        this.pageIndex = 1
        this.totalPage = 1
        this.$refs.my_scroller.reload()
      },
      refresh(done) {
        getData.meetingRoomList(1, 10, this.name).then(res => {
          this.isLoading = false
          if (res.data.code !== 1) {
            done('error')
            return
          }
          this.fields = res.data.data.list
          this.fields.forEach(item=>{
            item.fieldFeeConfigInfo = JSON.parse(item.fieldFeeConfigInfo)
          })
          if (this.fields.length === 0) {
            this.isEmpty = true
          }else{
            this.isEmpty = false
          }
          this.totalPage = res.data.data.total
          this.pageIndex = 2
          done()
        }).catch(error => {
          console.log(error)
          this.isLoading = false
          done('error')
        })
      },
      infinite(done) {
        if (this.pageIndex > this.totalPage) {
          done('end')
          return
        }
        getData.meetingRoomList(this.pageIndex, 10, this.name).then(res => {
          this.isLoading = false
          if (res.data.code !== 1) {
            done('error')
            return
          }
          res.data.data.list.forEach(item=>{
            item.fieldFeeConfigInfo = JSON.parse(item.fieldFeeConfigInfo)
          })
          this.fields = this.fields.concat(res.data.data.list)
          if (this.fields.length === 0) {
            this.isEmpty = true
          }else{
            this.isEmpty = false
          }
          this.totalPage = res.data.data.Pages
          this.pageIndex++
          if (this.pageIndex > this.totalPage) {
            done('end')
          } else {
            done()
          }
        }).catch(error => {
          console.log(error)
          this.isLoading = false
          done('error')
        })
      }
    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .last {
    border-right: none !important;
  }

  .g-section1 {
    .search-box {
      background: #E8E8E8;
      padding: .15rem .18rem;
      height: .9rem;

      input {
        @include wh(100%, .55rem);
        background: $fc;
        text-align: center;
        border-radius: .09rem;
        @include sc(.26rem, #727171);

        &::-webkit-input-placeholder {
          font-family: "iconfont";
          @include sc(.26rem, #a5a5a5);
        }
      }
    }
  }

  .g-btnnav {
    @include wh(100%, 1rem);
    justify-content: space-between;

    p {
      background-color: #4a89dc;
      text-align: center;
      line-height: 1rem;
      @include sc(.3rem, #fff);
      flex: 1;
    }

    .s-on {
      position: relative;

      &:after {
        position: absolute;
        content: '';
        top: 0;
        left: 50%;
        margin-left: -.09rem;
        width: 0;
        height: 0;
        border-left: .17rem solid transparent;
        border-right: .17rem solid transparent;
        border-top: .17rem solid #fff;
      }
    }
  }

  .g-money {
    i {
      color: #3C78E5;
      margin-right: .16rem;
    }
  }

  .g-item.zhi-hui-type {
    background: url("../../assets/images/changdiyuyue_card.png") no-repeat -.3rem -.5rem;
    background-size: 7.47rem 2.91rem;
    border-top-right-radius: .1rem;
    border-bottom-left-radius: .1rem;

    .g-item-title, .g-address, .g-money, .icon-gold, .g-item-right .g-number {
      color: #fff;
    }
  }
</style>
