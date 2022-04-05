<template>
  <div>
    <div class="g-step-label">
      <p v-for="(item, index) in topList" :key="index"
         :class="{
                'g-centerp': topList.length === 3 && index === 1,
                'g-active': type === index + 1,
                'g-isover': type > index + 1
             }"
      >{{item.label}}</p>
    </div>
    <div class="g-steps">
      <div class="g-step" v-for="(item, index) in steps" :key="index" :style="index === steps - 1 ? {flexBasis: 0 } : {flexBasis:`${percentage}`} ">
        <div class="g-step__cont">
          <div class="g-step__line" v-if="index !== steps - 1" :class="type > index + 1 ? 'g-success-line' : ''">
            <i class="g-step__line-inner"></i>
          </div>
          <div class="g-step__icon" :class="type >= index + 1 ? 'g-success-icon' : ''"></div>
        </div>
      </div>
    </div>

    <div class="g-step-time" style="margin-bottom: 0">
      <p v-for="(item, index) in topList" :key="index"
         :class="{
                'g-centerp': topList.length === 3 && index === 1,
                'g-active': type === index + 1,
             }"
      >{{new Date(item.time).format('yyyy-MM-dd hh:mm:ss')}}</p>
    </div>
  </div>
</template>

<script>
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        steps: 3,
        percentage: '50%',
        type: 1,
        topList: []

      }
    },
    created () {

    },
    mounted () {
      this.init()
    },
    props: ['info'],
    methods: {
      init () {
        if (this.info.osStatus === 4 && !this.info.distribute) {
          this.topList = [
            {
              label: '您的需求已提交',
              time: this.info.osCreateTime
            },
            {
              label: '已完成',
              time: this.info.osFinishTime
            }
          ];
          this.steps = 2
          this.type = 2
          this.percentage = Math.round((1 / (this.steps - 1)) * 10000) / 100 + '%'
        } else {
          this.topList = [
            {
              label: '您的需求已提交',
              time: this.info.osCreateTime
            },
            {
              label: '服务工单已派发',
              time: this.info.osUpdateTime
            },
            {
              label: '已完成',
              time: this.info.osFinishTime
            }
          ];
          this.steps = 3
          this.type = this.info.osStatus === 4 ? 3 : this.info.osStatus
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
      color:rgba(216,216,216,1);
      line-height:.34rem;
    }
    .g-centerp{
      position: absolute;
      left: 50%;
      transform: translateX(-50%); /* 移动元素本身50% */
    }
    .g-active{
      font-size:.28rem;
      color:rgba(102,102,102,1);
      line-height:.4rem;
    }
    .g-isover{
      color: rgba(102,102,102,1);
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
