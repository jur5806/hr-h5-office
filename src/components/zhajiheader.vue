<template>
  <div class="g-zhaji-header" v-if="$store.state.platform !== 'iOS'&&$store.state.platform !== 'Android'">
    <div class="g-title-back flex-box" v-if="!goBack" @click="$route.query.platform?bridges.GoBack():back()">
      <i class="iconfont icon-back1"></i>
    </div>
    <p class="g-title">{{headTitle}}</p>
    <slot name="tit-right"></slot>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  export default {
    data () {
      return {

      }
    },
    created () {
    },
    props: ['headTitle', 'goBack'],
    computed: {

    },

    methods: {
      back () {
        this.$router.go(-1)
      }
    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-zhaji-header{
    position: relative;
    z-index: 2;
  }
</style>
