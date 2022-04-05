<template>
  <div class="g-help-box">
    <div class="g-help-title" @click="isShow = !isShow">{{title}}<i class="iconfont icon-jinru-copy" :style="{'transform': isShow&&!isFirst ? 'rotate(90deg)':'rotate(0deg)'}"></i></div>
    <div ref="contentBox" class="g-help-content" v-show="isShow" :style="{opacity: isShow&&!isFirst?'1':'0'}" v-html="content"></div>
    <!--height:isShow?contentHeight+'px':'0',-->
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  export default {
    data () {
      return {
        isFirst: true,
        isShow: true,
        contentHeight: '',
      }
    },
    props: ['title', 'content'],
    mounted () {
      this.contentHeight = this.$refs.contentBox.offsetHeight;
      this.isShow = false;
      this.isFirst = false;
    },
    computed: {
    },
    methods: {

    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-help-box{
    .g-help-title{
      @include fj();
      @include wh(100%, 1rem);
      line-height: 1rem;
      border-bottom: 1px solid #ccc;
      padding: 0 .3rem;
      @include sc(.3rem,#333);
      font-weight: 700;
      .iconfont{
        transition: all .3s;
      }
    }
    .g-help-content{
      padding: 0 .5rem;
      overflow: hidden;
      transition: all .3s;
      border-bottom: 1px solid #ccc;
    }
    .g-detail-active{
      height: 0;
    }
  }
</style>

