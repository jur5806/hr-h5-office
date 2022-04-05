<template>
  <div>
    <div v-if="type === 1">
      <div class="flex-box g-imgboxs">
        <div class="g-img-item" v-for="(item, index) in 5" :key="index" @click.stop="getScore(index)">
          <img :src="score < index + 1 ? imgUrl64 : imgUrlactive64" alt="">
        </div>
      </div>
      <p class="g-desc">{{listDesc[score]}}</p>
    </div>
    <div v-else-if="type === 2" class="flex-box">
      <div class="flex-box g-imgboxs42">
        <div class="g-img-item" v-for="(item, index) in 5" :key="index" @click.stop="getScore(index)">
          <img :src="num < index + 1 ? imgUrl42 : imgUrlactive42" alt="">
        </div>
      </div>
      <p class="g-desc42">{{listDesc[num]}}</p>
    </div>

  </div>
</template>

<script>
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        imgUrl42: './static/img/work-img/xing-copy42.png',
        imgUrl64: './static/img/work-img/xing-copy64.png',
        imgUrlactive42: './static/img/work-img/xing-copy42-active.png',
        imgUrlactive64: './static/img/work-img/xing-copy64-active.png',
        listDesc: ['', '非常差', '差', '一般', '好', '非常好'],
        score: 0
      }
    },
    created () {
    },
    mounted () {
      if (this.type === 1) {
        this.$emit('getScore', this.score)
      }
    },
    props: ['type', 'num'],
    methods: {
      getScore (index) {
        this.score = index + 1
        this.$emit('getScore', index + 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
  .g-imgboxs{
    margin-bottom: .24rem;
    justify-content: center;
    .g-img-item{
      margin-right: .46rem;
      &:last-child{
        margin-right: 0;
      }
      img{
        width: .64rem;
        height: .6rem;
      }
    }
  }
  .g-desc{
    text-align: center;
    font-size:.32rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:.44rem;
    height: .44rem;
  }
  .g-imgboxs42{
    margin-bottom: 0;
    .g-img-item{
      margin-right: .28rem;
      &:last-child{
        margin-right: 0;
      }
      img{
        width: .42rem;
        height: .4rem;
      }
    }
  }
  .g-desc42{
    font-size:.28rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:.4rem;
    margin-left: .44rem;
  }

</style>
