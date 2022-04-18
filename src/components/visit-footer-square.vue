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
    // padding: .4rem .75rem .6rem;
  }
  .g-footerbtn{
    height:1rem;
    background-color: #3F7DEF;
    text-align: center;
    line-height: 1rem;
    font-size:.3rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
</style>
