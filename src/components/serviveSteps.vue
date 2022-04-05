<template>
  <div style="padding-top: .46rem">
<!--    <div class="g-step-label">-->
<!--      <p v-for="(item, index) in topList" :key="index"-->
<!--         :class="{-->
<!--                'g-active': type === index + 1,-->
<!--                'g-isover': type > index + 1-->
<!--             }"-->
<!--      >{{item.label}}</p>-->
<!--    </div>-->
    <div class="g-steps">
      <div class="g-step" v-for="(item, index) in topList" :key="index" :style="index === steps - 1 ? {flexBasis: 0 } : {flexBasis:`${percentage}`} ">
        <div class="g-step__cont">
          <div class="g-step__line" v-if="index !== steps - 1" :class="type > index + 1 ? 'g-success-line' : ''">
            <i class="g-step__line-inner"></i>
          </div>
          <div class="g-step__icon" :class="type >= index + 1 ? 'g-success-icon' : ''">
            <span :class="{
                'g-active': type >= index + 1,
             }">{{item.label}}</span>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        steps: 4,
        percentage: '33.33%',
        type: 1,
        topList: [
          { label: '待处理', text: '待处理', value: 1 },
          { label: '处理中', text: '处理中', value: 2 },
          { label: '待确认', text: '待确认', value: 3 },
          { label: '已完成', text: '已完成', value: 4 }
        ]

      }
    },
    created () {

    },
    mounted () {
      this.init()
    },
    props: ['info', 'dsList'],
    methods: {
      init () {
        if (this.info.osStatus === 4 && this.dsList.length === 0) {
          this.topList = [
            { label: '待处理', text: '待处理', value: 1 },
            { label: '已完成', text: '已完成', value: 4 }
          ];
          this.type = 2
          this.steps = 2
          this.percentage = Math.round((1 / (this.steps - 1)) * 10000) / 100 + '%'
        } else {
          this.topList = [
            { label: '待处理', text: '待处理', value: 1 },
            { label: '处理中', text: '处理中', value: 2 },
            { label: '待确认', text: '待确认', value: 3 },
            { label: '已完成', text: '已完成', value: 4 }
          ];
          this.type = this.info.osStatus
          this.steps = 4
          this.percentage = Math.round((1 / (this.steps - 1)) * 10000) / 100 + '%'
        }
      }
    },
    watch: {
      info () {
        this.init()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
  .g-steps{
    display: flex;
    white-space: nowrap;
    .g-step{
      margin-right: 0px;
      display: inline-block;
      // height: .28rem;
      &:first-child{
        .g-step__icon{
          span{
            left: 0;
            transform: translateX(0);
          }
        }
      }
      &:last-child{
        .g-step__icon{
          span{
            left: auto;
            right: 0;
            transform: translateX(0);
          }
        }
      }
    }
    .g-step__cont{
      position: relative;
      width: 100%;
    }
    .g-step__line{
      width: 100%;
      position: absolute;
      border-color: #D8D8D8;
      background-color: #D8D8D8;
      top: .12rem;
    }
    .g-step__line-inner{
      display: block;
      border: 1px solid;
      border-color: inherit;
      transition: .15s ease-out;
      box-sizing: border-box;
      width: 100%;
      height: 0;
    }
    .g-step__icon{
      position: relative;
      z-index: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: .2rem;
      height: .2rem;
      box-sizing: border-box;
      background: #D8D8D8;
      transition: .15s ease-out;
      border-radius: 50%;
      //border: 2px solid;
     // border-color: inherit;
      span{
        position: absolute;
        top: -.5rem;
        left:50%;
        transform: translateX(-50%);
        font-size:.24rem;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#AAAAAA;
        line-height:.34rem;
      }
      .g-active{
        color:#1687FF;
      }
    }
    .g-success-icon{
      width: .28rem;
      height: .28rem;
      border: .04rem solid #fff;
      background-color: #1190FA;
    }
    .g-success-line{
      border-color: #1190FA;
    }

  }
  .g-success{
    .g-step__icon{
      width: .28rem;
      height: .28rem;
      border: .04rem solid #fff;
      background-color: #1190FA;
    }
    .g-step__line-inner{
      border-color: #1190FA;
    }
  }


  .g-step-label{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: .12rem;
    p{
      font-size:.24rem;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:#AAAAAA;
      line-height:.34rem;
    }
    .g-centerp{
      position: absolute;
      left: 50%;
      transform: translateX(-50%); /* 移动元素本身50% */
    }
    .g-active{

      color:#1687FF;

    }
    .g-isover{
      color: #1687FF;
    }

  }
  .g-step-time{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .g-centerp{
      position: absolute;
      left: 50%;
      transform: translateX(-50%); /* 移动元素本身50% */
    }
    p{
      font-size: .24rem;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(17,144,250,1);
      line-height:.34rem;
      opacity: 0;
    }
    .g-active{
      opacity: 1;
    }
  }



</style>
