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
    padding: .4rem .75rem .6rem;
  }
  .g-footerbtn{
    height:.88rem;
    background:linear-gradient(-44deg,rgba(44,122,238,1) 0%, rgba(34,164,255,1) 100%);
    // box-shadow:0px 11px 29px 3px rgba(224,233,245,0.5);
    box-shadow:0 .11rem .29rem .03rem rgba(34,164,255,0.5);
    border-radius:.44rem;
    text-align: center;
    line-height: .88rem;
    font-size:.3rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
</style>
