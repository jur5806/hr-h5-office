<template>
  <div class="g-visit-footer">
    <div class="g-footerbtn" @click.stop="sub">{{title}}</div>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  export default {
    props:['title'],
    data () {
      return {

      }
    },
    created () {

    },
    mounted () {

    },
    computed: {
    },
    methods: {
      sub () {
        this.$emit('submits')
      }
    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-visit-footer{
    padding: .42rem .48rem;
  }
  .g-footerbtn{
    height:.96rem;
    background:rgba(17,144,250,1);
    box-shadow:0px .08rem .16rem 0px rgba(17,144,250,0.5);
    border-radius:.52rem;
    text-align: center;
    line-height: .96rem;
    font-size:.3rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
</style>
