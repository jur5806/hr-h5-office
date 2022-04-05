<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="选择服务类型">
    </v-header>
    <v-scroll class="main-box29 scroll" ref="my_scroller">
      <div class="g-top-blank"></div>
      <ul class="g-selcetul">
        <li class="flex-box" v-for="(item ,index) in list" :key="index" @click.stop="comeAdd(item)">
          <div>
            <h4>{{item.orderTypeName}}</h4>
            <img class="img2" src="../../assets/enterpriseImg/to-right.png" alt="">
          </div>
          <img class="img1" :src="item.orderTypeIcon" alt="">
        </li>
      </ul>
    </v-scroll>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        list: [],
        serviceType: null
      }
    },
    mounted () {
      if(this.$route.query.type){
        this.serviceType = Number(this.$route.query.type)
        this.init()
      }else{
        mobile.toast('页面出错，请退出重试')
      }
    },
    components: {},

    computed: {},
    methods: {
      init () {
        if(this.serviceType!=3){
          getData.getOrderTypeList({
            type: this.serviceType
          }).then(res => {
            if (res.data.code === 1) {
              this.list = res.data.data
            }
          })
        }else{
          getData.getWxOderType().then(res =>{
            if(res.data.code === 1){
              this.list = [res.data.data]
            }
          })
        }
      },
      comeAdd(item){
        this.$store.state.orderTypeInfo = item;
        this.$router.push('/addEnterpriseService?orderTypeId=' + item.orderTypeId+ '&type=' + this.$route.query.type)
      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-selcetul{
    padding: 0.3rem .3rem .3rem;
    li{
      width: 100%;
      height: 2.52rem;
      padding: 0 .6rem;
      margin-bottom: .3rem;
      justify-content: space-between;
      background: url("../../assets/enterpriseImg/select-bg.png") no-repeat;
      background-size: 100% 100%;
      &:last-child{
        margin-bottom: 0;
      }
      .img1{
        width: 1.7rem;
        height: 1.7rem;
      }
      .img2{
        @include wh(.4rem, .4rem)
      }
      h4{
        font-size:.32rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        margin-bottom: .24rem;
      }
    }
  }

</style>
