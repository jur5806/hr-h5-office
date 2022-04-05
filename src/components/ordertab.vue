<template>
  <div class="flex-box g-btnnav">
    <p style="margin-right: .02rem;" :class="on('roomReservation')?'s-on':''" @click="$router.replace({path:'/roomReservation',query:{phone:$route.query.phone,platform:$route.query.platform,phoneType:$route.query.phoneType,parkToken:$route.query.parkToken,channelId:$route.query.channelId}})">预约选择</p>
    <p :class="on('myReservation')?'s-on':''" @click="$router.replace({path:'/myReservation',query:{phone:$route.query.phone,platform:$route.query.platform,phoneType:$route.query.phoneType,parkToken:$route.query.parkToken,channelId:$route.query.channelId}})">我的预约</p>
    <p v-if="isAdmin" :class="on('appointmentExamine')?'s-on':''" @click="$router.replace({path:'/appointmentExamine',query:{phone:$route.query.phone,platform:$route.query.platform,phoneType:$route.query.phoneType,parkToken:$route.query.parkToken,channelId:$route.query.channelId}})">预约审批</p>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        isAdmin:0,

      }
    },
    created () {
    },
    mounted() {
      let user = JSON.parse(mobile.getSession('user'))
      if(user){
        this.isAdmin = user.userIsAdmin
      }else{
        getData.getUserDetail().then(res =>{
          if(res.data.code === 1){
            this.isAdmin = res.data.data.user.userIsAdmin
            mobile.setSession('user', res.data.data.user)
          }
        })
      }
    },
    computed: {
    },
    methods: {
      on(page){
        return this.$route.path.indexOf(page) !== -1
      }
    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-btnnav{
    @include wh(100%, 1rem);
    justify-content: space-between;
    p{
      background-color: #4a89dc;
      text-align: center;
      line-height: 1rem;
      @include sc(.3rem, #fff);
      flex: 1;
    }
    .s-on{
      position: relative;
      background-color: #8ab7f3;
      &:after{
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

</style>

