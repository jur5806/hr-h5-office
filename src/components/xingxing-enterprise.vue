<template>
  <div>
    <div v-if="type === 1">
      <div class="flex-box g-imgboxs">
        <div class="g-img-item" v-for="(item, index) in 5" :key="index" @click.stop="getScore(index)">
          <img :src="getImgUrl(index)" alt="">
        </div>
      </div>
      <p class="g-desc" :class="score > 3 ? 'c-good' : ''">{{listDesc[score]}}</p>
    </div>
    <div v-else-if="type === 2" class="flex-box">
      <div class="flex-box g-imgboxs42">
        <div class="g-img-item" v-for="(item, index) in 5" :key="index" @click.stop="getScore(index)">
          <img :src="getImgUrl2(index)" alt="">
        </div>
      </div>
      <p class="g-desc42" :class="num > 3 ? 'c-good' : ''">{{listDesc[num]}}</p>
    </div>

  </div>
</template>

<script>
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        imgUrl42: './static/img/enterprise-img/xing-small-default.png',
        imgUrl64: './static/img/enterprise-img/xing-large-default.png',
        imgUrlactive42: './static/img/enterprise-img/xing-small.png',
        imgUrlactive64: './static/img/enterprise-img/xing-large.png',
        imgUrlgrey42: './static/img/enterprise-img/xing-small-grey.png',
        imgUrlgrey64: './static/img/enterprise-img/xing-large-grey.png',
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
      },
      getImgUrl (index) {
        if (this.score >= index + 1 && this.score <= 3) {
          return this.imgUrlgrey64
        } else if (this.score >= index + 1 && this.score > 3) {
          return this.imgUrlactive64
        } else {
          return this.imgUrl64
        }
      },
      getImgUrl2 (index) {
        if (this.num >= index + 1 && this.num <= 3) {
          return this.imgUrlgrey42
        } else if (this.num >= index + 1 && this.num > 3) {
          return this.imgUrlactive42
        } else {
          return this.imgUrl42
        }
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
        width: .6rem;
        height: .6rem;
      }
    }
  }
  .g-desc{
    text-align: center;
    font-size:.3rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#B0B0B0;
    line-height:.44rem;
    height: .44rem;
  }
  .g-imgboxs42{
    margin-bottom: 0;
    .g-img-item{
      margin-right: .24rem;
      &:last-child{
        margin-right: 0;
      }
      img{
        width: .34rem;
        height: .34rem;
      }
    }
  }
  .g-desc42{
    font-size:.26rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#B0B0B0;
    line-height:.4rem;
    margin-left: .44rem;
  }
  .c-good{
    color: #FFB517;
  }

</style>
